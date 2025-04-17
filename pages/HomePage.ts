import { Page } from '@playwright/test';
import { AbstractPage } from './AbstractPage';

export class HomePage extends AbstractPage {
    constructor(page: Page) {
        super(page);
    }

    async navigateToSignIn() {
        await this.page.click('.user-info span.hidden-sm-down');
    }

    async navigateToRegistration() {
        await this.navigateToSignIn();
        await this.page.click('a[data-link-action="display-register-form"]');
    }

    async selectRandomProduct() {
        const products = await this.page.locator('.product-title a').all();
        const randomIndex = Math.floor(Math.random() * products.length);
        await products[randomIndex].click();
    }
}