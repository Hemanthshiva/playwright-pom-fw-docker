import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Guest Checkout Flow', () => {
    test('should complete checkout as guest user', async ({ page }) => {
        const homePage = new HomePage(page);
        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        // Generate test data
        const testData = {
            user: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email()
            },
            address: {
                address: faker.location.streetAddress(),
                city: faker.location.city(),
                state: 'Alabama',
                postcode: faker.location.zipCode('#####')
            }
        };

        // Navigate to homepage
        await test.step('Navigate to homepage', async () => {
            await homePage.goto('/');
        });

        // Add product to cart
        await test.step('Add product to cart', async () => {
            await homePage.selectRandomProduct();
            await productPage.addToCart();
            await productPage.proceedToCheckout();
        });

        // Navigate to checkout
        await test.step('Proceed to checkout', async () => {
            await cartPage.proceedToCheckout();
        });

        // Complete checkout process
        await test.step('Complete checkout process', async () => {
            // Fill personal information
            await checkoutPage.fillPersonalInformation(testData.user);

            // Fill shipping address
            await checkoutPage.fillAddress(testData.address);

            // Select shipping method
            await checkoutPage.selectShippingMethod();

            // Select payment method
            await checkoutPage.selectPaymentMethod();
        });

        // Verify order confirmation
        await test.step('Verify order confirmation', async () => {
            const orderReference = await checkoutPage.getOrderConfirmation();
            expect(orderReference, 'Order reference should be generated').toBeTruthy();
        });
    });
});