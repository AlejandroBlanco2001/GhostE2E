import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { Urls } from "../../shared/config";
import { DashboardPage } from "../page/DashboardPage";
import { CreateMemberPage } from "../page/CreateMemberPage";

test("Given no members exist, When I create a member, Then the dashboard should show 1 member", async ({
    page,
}) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const createMemberPage = new CreateMemberPage(page);

    // Given: No members exist, and the user is logged in
    await loginPage.open();
    await loginPage.login();
    expect(await loginPage.userIsLoggedIn()).toBeTruthy();

    // Navigate to the dashboard and verify it shows 0 members initially
    await page.goto(Urls.dashboard, { waitUntil: "networkidle" });
    await takeScreenshot(page);

    const dashboard = await dashboardPage.getDashboard();
    await expect(dashboard).toBeVisible({ timeout: 5000 });
    const initialDashboardText = await dashboard.innerText();
    expect(initialDashboardText).toContain("0");

    // When: I create a member
    await createMemberPage.open();
    await createMemberPage.fillForm();

    // Then: Navigate to the dashboard and verify it shows 1 member
    await dashboardPage.open();
    await takeScreenshot(page);

    const updatedDashboard = await dashboardPage.getDashboard();
    await expect(updatedDashboard).toBeVisible({ timeout: 5000 });
    const updatedDashboardText = await updatedDashboard.innerText();
    expect(updatedDashboardText).toContain("1");
});
