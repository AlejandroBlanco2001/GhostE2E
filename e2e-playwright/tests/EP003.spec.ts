import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { Urls } from "../../shared/config";
import { DashboardPage } from "../page/DashboardPage";
import { CreateMemberPage } from "../page/CreateMemberPage";

test("Check that when creating a member the dashboard shows 1 member", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const createMemberPage = new CreateMemberPage(page);

    // Log in and verify
    await loginPage.open();
    await loginPage.login();
    expect(await loginPage.userIsLoggedIn()).toBeTruthy();

    // Navigate to dashboard and take screenshot
    await page.goto(Urls.dashboard, { waitUntil: "networkidle" });
    await takeScreenshot(page);

    // Verify dashboard content
    const dashboard = await dashboardPage.getDashboard();
    await expect(dashboard).toBeVisible({ timeout: 5000 });

    const dashboardText = await dashboard.innerText();
    expect(dashboardText).toContain("0");

    // Create a member
    await createMemberPage.open();
    await createMemberPage.fillForm();

    // Navigate to dashboard and take screenshot
    await dashboardPage.open();
    await takeScreenshot(page);

    // Verify dashboard content
    const updatedDashboard = await dashboardPage.getDashboard();
    await expect(updatedDashboard).toBeVisible({ timeout: 5000 });

    const updatedDashboardText = await updatedDashboard.innerText();
    expect(updatedDashboardText).toContain("1");
});
