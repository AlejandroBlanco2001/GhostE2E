import test, { expect } from "@playwright/test";
import { LoginPage } from "../page/LoginPage";
import { TagPage } from "../page/TagPage";
import { takeScreenshot } from "../util/util";


/*
    Test Case: EP020 - Tag description should be less than 500 characters
*/
test("EP020 - Verify tag description limit", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const tagPage = new TagPage(page);

    // Given: User is logged in
    await loginPage.open();
    await loginPage.login();
    // And Navigate to create tag page
    await tagPage.open();

    // When: I fill the tag description with more than 500 characters
    await tagPage.fillTagDescription('a'.repeat(501));
    // And I save the tag
    await tagPage.saveTag();
    await takeScreenshot(page);
    // Then It should show an error
    const error = await tagPage.getSaveFailure();
    expect(await error.isVisible()).toBeTruthy();
    expect(await error.innerText()).toBe('Retry');
});