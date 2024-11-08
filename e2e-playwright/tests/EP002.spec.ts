import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { Urls } from "../../shared/config";
import { DashboardPage } from "../page/DashboardPage";

test("Given no posts are created, When I view the post table on the dashboard, Then it should show 1 result", async ({
    page,
}) => {
    // Given: No posts are created, and the user is logged in
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.open();
    await loginPage.login();
    expect(await loginPage.userIsLoggedIn()).toBeTruthy();

    // When: I navigate to the dashboard
    await page.goto(Urls.dashboard, { waitUntil: "networkidle" });
    await takeScreenshot(page);

    // Then: The post table should be visible and show 1 result
    const postTable = await dashboardPage.getPostTable();
    await expect(postTable).toBeVisible({ timeout: 5000 });

    const numberOfRows = await dashboardPage.getNumberOfPostRowsNumber();
    expect(numberOfRows).toBe(1);
});
