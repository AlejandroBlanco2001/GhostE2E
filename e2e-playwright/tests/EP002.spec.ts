import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { Urls } from "../../shared/config";
import { DashboardPage } from "../page/DashboardPage";


test("Check post table shows 1 result when no posts are created", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Log in and verify
    await loginPage.open();
    await loginPage.login();
    expect(await loginPage.userIsLoggedIn()).toBeTruthy();

    // Navigate to dashboard and take screenshot
    await page.goto(Urls.dashboard, { waitUntil: "networkidle" });
    await takeScreenshot(page);

    // Verify post table content
    const postTable = await dashboardPage.getPostTable();
    await expect(postTable).toBeVisible({ timeout: 5000 });

    expect(await dashboardPage.getNumberOfPostRowsNumber() === 1)
});
