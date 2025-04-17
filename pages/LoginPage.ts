import { Page } from '@playwright/test';
import { AbstractPage } from './AbstractPage';

export class LoginPage extends AbstractPage {
    constructor(page: Page) {
        super(page);
    }

    async login(email: string, password: string) {
        await this.page.locator('#field-email').fill(email);
        await this.page.locator('#field-password').fill(password);
        await this.page.click('#submit-login');
        await this.waitForPageLoad();
    }
}