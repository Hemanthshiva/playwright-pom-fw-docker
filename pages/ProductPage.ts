import { Locator, Page } from '@playwright/test';
import { AbstractPage } from './AbstractPage';

export class ProductPage extends AbstractPage {

    readonly proceedToCheckoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.proceedToCheckoutButton = page.getByRole('link', { name: 'PROCEED TO CHECKOUT' });
    }
    
    async addToCart() {
        await this.page.click('.add-to-cart');
        await this.waitForPageLoad();
    }

    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click();
        await this.waitForPageLoad();
    }
}