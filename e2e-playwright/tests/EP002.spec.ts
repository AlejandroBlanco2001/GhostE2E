import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { DEFAULT_POST_NAME } from "../../shared/config";
import { DashboardPage } from "../page/DashboardPage";

test("Given no posts are created, When I view the post table on the dashboard, Then it should show the default post", async ({
    page,
}) => {
    // Given: No posts are created, and the user is logged in
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.open();
    await loginPage.login();
    expect(await loginPage.userIsLoggedIn()).toBeTruthy();

    // When: I navigate to the dashboard
    await dashboardPage.open();
    await takeScreenshot(page);

    // Then: The post table should be visible and show 1 result
    const postTable = await dashboardPage.getPostTable();
    await expect(postTable).toBeVisible({ timeout: 5000 });

    const postTableInnerText = await postTable.innerText();

    // Wait for the seconds for waiting the post to be rendered 
    await page.waitForTimeout(2000);

    expect(postTableInnerText).toContain(DEFAULT_POST_NAME);
});
