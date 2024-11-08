import { Locator, Page } from "@playwright/test";
import { SiteConfig, Urls } from "../../shared/config";
import { takeScreenshot } from "../util/util";
import { faker } from '@faker-js/faker';

export class CreateMemberPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.goto(Urls["member/new"], { waitUntil: 'networkidle' });
    }

    async fillForm(): Promise<void> {
        const memberName = await this.getMemberNameInput();

        await memberName.fill(faker.person.fullName());

        const memberEmail = await this.getMemberEmailInput();

        await memberEmail.fill(faker.internet.email());

        await takeScreenshot(this.page);

        const saveButton = await this.getSaveButton();

        await saveButton.click();

        await this.page.waitForTimeout(2000);
    }

    async getMemberNameInput(): Promise<Locator> {
        return await this.page.locator("#member-name");
    }

    async getMemberEmailInput(): Promise<Locator> {
        return await this.page.locator("#member-email");
    }

    async getSaveButton(): Promise<Locator> {
        return await this.page.locator("[data-test-task-button-state='idle']");
    }
}