import { test, expect } from "@playwright/test";
import { getAuthToken, getRandomBookingId, writeResponseToFile } from "../../helpers/helperFunctions";
import bookingData from '../../data/booking.json';

// Types for better type safety
interface BookingDates {
    checkin: string;
    checkout: string;
}

interface Booking {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
    additionalneeds?: string;
}

interface BookingResponse {
    bookingid: number;
    booking: Booking;
}

// Constants
const BASE_URL = 'https://restful-booker.herokuapp.com';
const ENDPOINTS = {
    booking: '/booking',
    auth: '/auth'
} as const;

// Test context to share state between tests
type TestContext = {
    token: string;
    bookingId: number;
    testBooking: Booking;
};

test.describe('Booking API Tests', () => {
    const context: TestContext = {
        token: '',
        bookingId: 0,
        testBooking: { ...bookingData }
    };

    // Common headers
    const commonHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    test.beforeEach(async ({ request }) => {
        context.token = await getAuthToken({ request }, BASE_URL);
        context.testBooking = { ...bookingData }; // Reset booking data before each test
    });

    test('Get all bookings and verify response format', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${ENDPOINTS.booking}`);
        const bookings = await response.json();

        expect(response.status()).toBe(200);
        expect(Array.isArray(bookings)).toBeTruthy();

        console.log(`Total bookings found: ${bookings.length}`);
        writeResponseToFile(bookings);
    });

    test('Get a specific booking by ID and verify response structure', async ({ request }) => {
        const randomId = getRandomBookingId();
        const response = await request.get(`${BASE_URL}${ENDPOINTS.booking}/${randomId}`);

        if (response.status() === 200) {
            const booking: Booking = await response.json();
            expect(booking).toHaveProperty('firstname');
            expect(booking).toHaveProperty('lastname');
            expect(booking).toHaveProperty('bookingdates');
            console.log(`Successfully retrieved booking ${randomId}`);
        } else {
            console.log(`Booking ${randomId} not found`);
        }
    });

    test('Create a new booking and verify details', async ({ request }) => {
        const response = await request.post(`${BASE_URL}${ENDPOINTS.booking}`, {
            headers: {
                ...commonHeaders,
                'Accept': '*/*'  // Override Accept header for POST request
            },
            data: context.testBooking
        });

        expect(response.status()).toBe(200);

        const createdBooking: BookingResponse = await response.json();
        context.bookingId = createdBooking.bookingid;

        // Verify all booking details
        const expectedBooking = context.testBooking;
        const actualBooking = createdBooking.booking;

        expect(actualBooking).toEqual(expectedBooking);
        console.log(`Created booking with ID: ${context.bookingId}`);
    });

    test('Update booking details and verify changes', async ({ request }) => {
        // Prepare updated booking data
        const updatedData: Partial<Booking> = {
            firstname: "James",
            lastname: "Brown"
        };
        Object.assign(context.testBooking, updatedData);

        const response = await request.put(
            `${BASE_URL}${ENDPOINTS.booking}/${context.bookingId}`,
            {
                headers: {
                    ...commonHeaders,
                    'Cookie': `token=${context.token}`
                },
                data: context.testBooking
            }
        );

        expect(response.status()).toBe(200);

        const updatedBooking: Booking = await response.json();
        expect(updatedBooking.firstname).toBe(updatedData.firstname);
        expect(updatedBooking.lastname).toBe(updatedData.lastname);
        console.log(`Successfully updated booking ${context.bookingId}`);
    });

    test('Delete booking and verify removal', async ({ request }) => {
        const response = await request.delete(
            `${BASE_URL}${ENDPOINTS.booking}/${context.bookingId}`,
            {
                headers: {
                    ...commonHeaders,
                    'Cookie': `token=${context.token}`
                }
            }
        );

        expect(response.status()).toBe(201);
        expect(await response.text()).toBe("Created");

        // Verify booking is deleted by attempting to fetch it
        const verifyResponse = await request.get(
            `${BASE_URL}${ENDPOINTS.booking}/${context.bookingId}`
        );
        expect(verifyResponse.status()).toBe(404);

        console.log(`Successfully deleted booking ${context.bookingId}`);
    });
});


