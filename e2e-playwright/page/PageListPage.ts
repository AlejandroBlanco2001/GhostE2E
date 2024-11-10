import { Page } from "@playwright/test";
import { URL } from "../../shared/config";

export class PageListPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        const listPage = `${URL}/ghost/#/pages`;
        await this.page.goto(listPage, { waitUntil: 'networkidle' });
    }

    async getPageTableRows() {
        return this.page.locator(".gh-posts-list-item-group").all();
    }
}
