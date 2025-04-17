import { test, expect } from '@playwright/test';
import user from "../../data/user.json";
import { Root } from '../../data/bookModel/Root';
import { Author } from '../../data/bookModel/Author';
import { Editor } from '../../data/bookModel/Editor';
import { jsonToXml, readCsvFile, readXmlFile, writeCsvFile } from '../../helpers/helperFunctions';

const baseURL = 'https://reqres.in/api';

// Define interfaces for type safety
interface CsvRecord {
    name: string;
    age: string | number;
    Gender: string;
    City: string;
    Country: string;
    Phone: string;
}

test.describe('API Tests', () => {
    test.describe('User Management API', () => {
        test('should get user details from GET endpoint', async ({ request }) => {
            // Arrange
            const expectedStatus = 200;
            const endpoint = `${baseURL}/users?page=1`;

            // Act
            const response = await request.get(endpoint);
            const responseBody = await response.json();

            // Assert
            expect(response.status(), 'Response status should be 200').toBe(expectedStatus);
            expect(responseBody.data, 'Response should contain data array').toBeInstanceOf(Array);
            expect(responseBody.page, 'Response should include page number').toBeDefined();
        });

        test('should create a user and validate response', async ({ request }) => {
            // Arrange
            const expectedStatus = 201;
            const endpoint = `${baseURL}/users`;

            // Act
            const response = await request.post(endpoint, {
                data: user,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const responseBody = await response.json();

            // Assert
            expect(response.status(), 'Response status should be 201').toBe(expectedStatus);
            expect(responseBody.name, 'Response should contain correct name').toBe(user.name);
            expect(responseBody.id, 'Response should contain an ID').toBeDefined();
            expect(responseBody.createdAt, 'Response should contain creation timestamp').toBeDefined();
        });
    });

    test.describe('Data Serialization Tests', () => {
        test('should properly serialize and deserialize book object', async () => {
            // Arrange
            const book1: Root = {
                isbn: '123-32423-123',
                title: 'New title',
                category: ['Fiction'],
                author: {
                    firstname: 'AuthFirst',
                    lastname: 'AuthLast'
                } as Author,
                editor: {
                    firstname: 'EdiFirst',
                    lastname: 'EdiLast'
                } as Editor
            };

            // Act
            const serializedBook = JSON.stringify(book1);
            const deserializedBook = JSON.parse(serializedBook) as Root;

            // Assert
            expect(deserializedBook.isbn).toBe(book1.isbn);
            expect(deserializedBook.title).toBe(book1.title);
            expect(deserializedBook.category).toEqual(book1.category);
            expect(deserializedBook.author).toEqual(book1.author);
            expect(deserializedBook.editor).toEqual(book1.editor);
        });

        test('should read and convert XML file', async () => {
            // Act
            const xmlData = await readXmlFile('/../data/trnfRequest.xml');
            const xmlDoc = jsonToXml(xmlData);

            // Assert
            expect(xmlData).toBeDefined();
            expect(xmlDoc).toBeDefined();
            expect(typeof xmlDoc).toBe('string');
        });
    });

    test.describe('CSV File Operations', () => {
        const testData: CsvRecord[] = [
            { name: 'John Doe', age: 30, Gender: 'Male', City: 'New York', Country: 'USA', Phone: '1234567890' },
            { name: 'Jane Doe', age: 25, Gender: 'Female', City: 'Los Angeles', Country: 'USA', Phone: '0987654321' },
        ];
        const csvFilePath = './data/output.csv';

        test('should write and read CSV file successfully', async () => {
            // Act
            await writeCsvFile(testData, csvFilePath);
            const readData = await readCsvFile(csvFilePath) as CsvRecord[];

            // Assert
            expect(readData).toBeDefined();
            expect(readData.length).toBe(testData.length);
            expect(readData[0]).toHaveProperty('name');
            expect(readData[0]).toHaveProperty('age');
            expect(readData[0]).toHaveProperty('Gender');
            expect(readData[0]).toHaveProperty('City');
            expect(readData[0]).toHaveProperty('Country');
            expect(readData[0]).toHaveProperty('Phone');
        });

        test('should verify CSV file content integrity', async () => {
            // Act
            const readData = await readCsvFile(csvFilePath) as CsvRecord[];

            // Assert
            readData.forEach((record, index) => {
                const testRecord = testData[index];
                expect(record.name).toBe(testRecord.name);
                expect(Number(record.age)).toBe(Number(testRecord.age));
                expect(record.Gender).toBe(testRecord.Gender);
                expect(record.City).toBe(testRecord.City);
                expect(record.Country).toBe(testRecord.Country);
                expect(record.Phone).toBe(testRecord.Phone);
            });
        });
    });
});