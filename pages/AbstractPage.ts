import { Page } from '@playwright/test';

export class AbstractPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    async goto(url: string) {
        await this.page.goto(url);
        await this.waitForPageLoad();
    }
}