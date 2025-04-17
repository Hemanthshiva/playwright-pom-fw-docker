import { Page } from '@playwright/test';
import { AbstractPage } from './AbstractPage';

export class CartPage extends AbstractPage {
    constructor(page: Page) {
        super(page);
    }

    async proceedToCheckout() {
        await this.page.click('.cart-detailed-actions .btn-primary');
        await this.waitForPageLoad();
    }
}