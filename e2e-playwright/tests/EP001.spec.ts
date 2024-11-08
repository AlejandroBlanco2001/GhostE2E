import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { Urls } from "../../shared/config";
import { DashboardPage } from "../page/DashboardPage";

test("Given no members are created, When I view the dashboard, Then it should show 0 results", async ({
    page,
}) => {
    // Given: No members are created, and the user is logged in
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.open();
    await loginPage.login();
    expect(await loginPage.userIsLoggedIn()).toBeTruthy();

    // When: I navigate to the dashboard
    await page.goto(Urls.dashboard, { waitUntil: "networkidle" });
    await takeScreenshot(page);

    // Then: The dashboard should be visible and show 0 results
    const dashboard = await dashboardPage.getDashboard();
    await expect(dashboard).toBeVisible({ timeout: 5000 }); // explicit wait

    const dashboardText = await dashboard.innerText();
    expect(dashboardText).toContain("0");
});
