import { Locator, Page, expect } from "@playwright/test";
import { SiteConfig, Urls } from "../../shared/config";
import { takeScreenshot } from "../util/util";
import { faker } from '@faker-js/faker';

export class CreatePostPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.goto(Urls["post/new"], { waitUntil: 'networkidle' });
    }

    async fillForm(): Promise<string> {
        // Fill in the title
        const postTitle = await this.getPostTitleTextArea();
        const postName = faker.lorem.sentence();

        await expect(postTitle).toBeVisible({ timeout: 5000 }); // Wait for the title field to be visible
        await postTitle.fill(postName);

        // This accesibilty hack is to press the Enter key to move to the next field (the post editor), this doesnt have any test-id
        await postTitle.press('Enter');

        await this.page.keyboard.type(faker.lorem.paragraph());
                
        // Take a screenshot after filling the form
        await takeScreenshot(this.page);

        return postName
    }

    async getPostTitleTextArea(): Promise<Locator> {
        return this.page.locator(".gh-editor-title-container textarea");
    }

    async getEditor(): Promise<Locator> {
        return this.page.locator("[data-kg='editor']");
    }

    async getEditorParagraph(): Promise<Locator> {
        return this.page.locator("[data-kg='editor']").locator("p").nth(1);
    }

    async getPublishButton(): Promise<Locator> {
        // get all tags buttons
        const buttons = await this.page.getByRole("button").all(); 
        for (const button of buttons) {
            if (await button.getAttribute("data-test-button") === "publish-flow") {
                return button;
            }
        }

        throw new Error("Publish button not found");
    }

    async continuePublishButton(): Promise<Locator> {
        return this.page.locator("[data-test-button='continue']");
    }

    async publishRightNowButton(): Promise<Locator> {
        return this.page.locator("[data-test-button='confirm-publish']");
    }

    async publishPost(): Promise<void> {
        const publishButton = await this.getPublishButton();
        await expect(publishButton).toBeVisible({ timeout: 5000 });
        await publishButton.click();
        
        const continueButton = await this.continuePublishButton();
        await expect(continueButton).toBeVisible({ timeout: 5000 });
        await continueButton.click();
        
        const finalPublishButton = await this.publishRightNowButton();
        await expect(finalPublishButton).toBeVisible({ timeout: 5000 });
    
        // Alternative direct click with JavaScript if regular click fails
        await finalPublishButton.evaluate((el: any) => el.click());

        await this.page.waitForTimeout(2000)

        await this.page.keyboard.press('Escape')
    }        
}
