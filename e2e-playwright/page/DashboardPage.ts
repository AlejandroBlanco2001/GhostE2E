import { Locator, Page } from "@playwright/test";
import { SiteConfig, Urls } from "../../shared/config";
import { takeScreenshot } from "../util/util";

export class DashboardPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.goto(Urls.dashboard, { waitUntil: 'networkidle' });
    }

    async getDashboard(): Promise<Locator>{
        return await this.page.locator("[data-test-dashboard='attribution']");
    }

    async getPostTable(): Promise<Locator>{
        return await this.page.locator(".gh-dashboard-recents-mentions");
    }

    async getPostTableRowsContainer(table: Locator): Promise<Locator[]>{
        return await table.locator(".gh-dashboard-list-body").all()
    }

    async getPostTableRowsItems(): Promise<Locator[]> {
        return await this.page.locator(".ember-view gh-dashboard-list-item permalink").all()
    }

    async getNumberOfPostRowsNumber(): Promise<number> {
        return (await this.getPostTableRowsItems()).length
    }

    async getActionGraphContainer(): Promise<Locator> {
        return await this.page.locator(".gh-dashboard-box")
    }

    async getActionsItemsRows(): Promise<Locator[]> {
        return await this.page.locator(".gh-dashboard-list-item-sub gh-dashboard-list-item-sub-source").all()
    }

    async getNumberOfActionsItemRows(): Promise<number> {
        return (await this.getActionsItemsRows()).length
    }
}