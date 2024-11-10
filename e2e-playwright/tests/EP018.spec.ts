import test, { expect } from "@playwright/test";
import { LoginPage } from "../page/LoginPage";
import { TagPage } from "../page/TagPage";
import { takeScreenshot } from "../util/util";



/*
    Test Case: EP018 - Verify create new Tag
*/
test("EP018 - Verify create new @Tag", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const tagPage = new TagPage(page);


    // Given: User is logged in
    await loginPage.open();
    await loginPage.login();
    // And Navigate to the tag page
    await tagPage.open();
    // When I fill the tag name
    await tagPage.fillTagName('Test Tag');

    async function getSaveTagResponse() {
        const responsePromise = await page.waitForResponse(async (response) => {
            if (!response.url().includes('tags')) return false;
            return response.status() === 201 || response.status() === 200;
        });
        return responsePromise.json();
    }
    // And I save the tag
    await tagPage.saveTag();
    const response = await getSaveTagResponse();
    await takeScreenshot(page);
    // Then It should create the tag and return the name
    expect(response.tags[0].name).toBe('Test Tag');
});