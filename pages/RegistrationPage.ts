import { Page } from '@playwright/test';
import { AbstractPage } from './AbstractPage';
import { UserData } from '../types/user';

export class RegistrationPage extends AbstractPage {
    constructor(page: Page) {
        super(page);
    }

    private generateRandomBirthday(): string {
        const today = new Date();
        const minAge = 16;
        const maxAge = 60;

        // Calculate date ranges
        const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
        const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());

        // Generate random timestamp between min and max dates
        const randomTimestamp = minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
        const randomDate = new Date(randomTimestamp);

        // Format date as MM/DD/YYYY
        const month = (randomDate.getMonth() + 1).toString().padStart(2, '0');
        const day = randomDate.getDate().toString().padStart(2, '0');
        const year = randomDate.getFullYear();

        return `${month}/${day}/${year}`;
    }

    async registerUser(userData: UserData): Promise<void> {
        await this.page.locator('#field-id_gender-1').first().click();
        await this.page.locator('#field-firstname').fill(userData.firstName || '');
        await this.page.locator('#field-lastname').fill(userData.lastName || '');
        await this.page.locator('#field-email').fill(userData.email);
        await this.page.locator('#field-password').fill(userData.password);
        await this.page.locator('#field-birthday').fill(this.generateRandomBirthday());
        await this.page.locator('input[name="optin"]').check();
        await this.page.locator('input[name="psgdpr"]').check();
        await this.page.locator('input[name="newsletter"]').check();
        await this.page.click('button.form-control-submit');
        await this.waitForPageLoad();
    }
}