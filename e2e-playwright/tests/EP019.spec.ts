import test, { expect } from "@playwright/test";
import { LoginPage } from "../page/LoginPage";
import { takeScreenshot } from "../util/util";
import { TagPage } from "../page/TagPage";


/*
    Test Case: EP019 - Verify tag should have a name
*/
test("EP019 - Verify update @Tag", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const tagPage = new TagPage(page);
    
    // Given: User is logged in
    await loginPage.open();
    await loginPage.login();
    // And Navigate to the tag page
    await tagPage.open();
    // When I save the tag without filling the name
    await tagPage.saveTag();
    await takeScreenshot(page);
    const error = await tagPage.getSaveFailure();
    // Then It should show an error
    expect(await error.isVisible()).toBeTruthy();
    expect(await error.innerText()).toBe('Retry');
});