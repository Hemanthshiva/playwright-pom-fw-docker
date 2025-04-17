import { expect, Page } from '@playwright/test';
import { AbstractPage } from './AbstractPage';

export class CheckoutPage extends AbstractPage {
    constructor(page: Page) {
        super(page);
    }

    async fillPersonalInformation(userData: {
        firstName: string;
        lastName: string;
        email: string;
    }) {
        await this.page.locator('#field-firstname').fill(userData.firstName);
        await this.page.locator('#field-lastname').fill(userData.lastName);
        await this.page.locator('#checkout-guest-form #field-email').fill(userData.email);
        await this.page.locator('input[name="optin"]').check();
        await this.page.locator('input[name="psgdpr"]').check();
        await this.page.locator('input[name="newsletter"]').check();
        await this.page.click('button[name="continue"]');
        await this.waitForPageLoad();
    }

    async fillAddress(address: {
        address: string;
        city: string;
        state: string;
        postcode: string;
    }) {
        // Check if delivery address section needs to be filled
        const deliveryAddressExists = await this.page.getByRole('link', { name: 'add new address' }).isVisible();

        if (!deliveryAddressExists) {
            await this.page.locator('#field-address1').fill(address.address);
            await this.page.locator('#field-city').fill(address.city);
            await this.page.locator('#field-id_state').selectOption({ label: address.state });
            await this.page.locator('#field-postcode').fill(address.postcode);
        }

        await this.page.click('button[name="confirm-addresses"]');
        await this.waitForPageLoad();
    }

    async selectShippingMethod() {
        await this.page.click('button[name="confirmDeliveryOption"]');
        await this.waitForPageLoad();
    }

    async selectPaymentMethod() {
        await this.page.click('#payment-option-1');
        await this.page.locator('input[name="conditions_to_approve[terms-and-conditions]"]').check();
        await this.page.click('#payment-confirmation button');
        await this.waitForPageLoad();
    }

    async verifyOrderConfirmation() {
        const orderDetails = await this.page.textContent('#content-hook_order_confirmation');
        expect(orderDetails?.includes('Your order is confirmed')).toBeTruthy();
    }

    async getOrderConfirmation() {
        return await this.page.textContent('#order-reference-value') || null;
    }
}