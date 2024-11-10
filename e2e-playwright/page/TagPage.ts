import { Page } from "@playwright/test";
import { Urls } from "../../shared/config";


export class TagPage{
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.goto(Urls["tag/new"], { waitUntil: "networkidle" });
    }

    async openInternalTags  () {
        await this.page.goto(Urls["tag/internal-list"], { waitUntil: "networkidle" });
    }

    async fillTagName(name: string) {
        const tagName = await this.page.locator('input[name="name"]');
        await tagName.fill(name);
    }

    async saveTag() {
        await this.page.locator('[data-test-button="save"]').click();
    }

    async getSaveFailure() {
        return await this.page.locator('[data-test-task-button-state="failure"]');
    }

    async fillTagDescription(description: string) {
        const tagDescription = this.page.locator('textarea[name="description"]');
        await tagDescription.fill(description);
    }

    async fillTagSlug(slug: string) {
        const tagSlug = this.page.locator('input[name="slug"]');
        await tagSlug.fill(slug);
    }

    async getInternalTagsList() {
        const internalTag = this.page.locator('[href="#/tags/hash-internal-tag/"]');
        return internalTag;
    }
}
