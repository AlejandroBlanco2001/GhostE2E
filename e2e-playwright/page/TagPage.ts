import { Locator, Page } from "@playwright/test";
import { Urls } from "../../shared/config";
import { VERSION } from "../../shared/config";

export class TagPage{
    readonly page: Page;

    // elements
    readonly ButtonSave: Locator;
    readonly ButtonSaveFailure: Locator;

    constructor(page: Page) {
        this.page = page;
        this.ButtonSave = VERSION === "4.5" ? page.locator("span:has-text('Save')") : page.locator('[data-test-button="save"]');
        this.ButtonSaveFailure = VERSION === "4.5" ? page.locator("span:has-text('Retry')") : page.locator('[data-test-button="save"]');
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
        await this.ButtonSave.click();
    }

    async getSaveFailure() {
        return this.ButtonSaveFailure;
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
