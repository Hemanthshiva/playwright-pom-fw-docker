import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { HomePage } from '../../pages/HomePage';
import { RegistrationPage } from '../../pages/RegistrationPage';
import * as fs from 'fs';
import * as path from 'path';
import { UserData } from '../../types/user';

interface UserDataFile {
    registeredUsers: UserData[];
}

test.describe('User Registration', () => {
    const userDataPath = path.join(process.cwd(), 'data', 'userData.json');

    test('should register a new user successfully', async ({ page }) => {
        // Check if userData.json exists and has registered users
        if (fs.existsSync(userDataPath)) {
            const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8')) as UserDataFile;
            if (userData.registeredUsers && userData.registeredUsers.length > 0) {
                test.skip();
                return;
            }
        }

        const homePage = new HomePage(page);
        const registrationPage = new RegistrationPage(page);

        // Generate test data
        const userData: UserData = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password() + 'Aa1!'  // Ensure password meets complexity requirements
        };

        // Navigate to registration page
        await homePage.goto('/');
        await homePage.navigateToRegistration();

        // Register new user
        await registrationPage.registerUser(userData);

        // Verify registration was successful
        await expect(page.locator('.account')).toContainText(userData.firstName + ' ' + userData.lastName);

        // Verify registration success
        await expect(page.locator('.account')).toContainText(userData.firstName + ' ' + userData.lastName);

        // Create data directory if it doesn't exist
        const dataDir = path.dirname(userDataPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Initialize or read existing data
        let existingData: UserDataFile = { registeredUsers: [] };
        if (fs.existsSync(userDataPath)) {
            existingData = JSON.parse(fs.readFileSync(userDataPath, 'utf8')) as UserDataFile;
        }

        // Save user data
        existingData.registeredUsers.push(userData);
        fs.writeFileSync(userDataPath, JSON.stringify(existingData, null, 2));
    });
});