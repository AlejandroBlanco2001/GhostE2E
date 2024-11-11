import test, { expect } from "@playwright/test";
import { LoginPage } from "../page/LoginPage";
import { TagPage } from "../page/TagPage";
import { takeScreenshot } from "../util/util";


/*
    Test Case: EP019 - Verify tag slug should be less than 191 characters
*/
test("EP019 - Verify tag slug limit", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const tagPage = new TagPage(page);
    
    // Given: User is logged in
    await loginPage.open();
    await loginPage.login();
    // And Navigate to create tag page
    await tagPage.open();
    // When: I fill the tag slug with more than 191 characters
    await tagPage.fillTagSlug('a'.repeat(192));
    // And I save the tag
    await tagPage.saveTag();
    await takeScreenshot(page);
    // Then It should show an error
    const error = await tagPage.getSaveFailure();
    expect(await error.isVisible()).toBeTruthy();
    expect(await error.innerText()).toBe('Retry');
});