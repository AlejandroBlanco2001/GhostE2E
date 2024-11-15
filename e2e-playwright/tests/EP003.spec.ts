import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { DashboardPage } from "../page/DashboardPage";
import { MembersPage } from "../page/MembersPage";
import { faker } from "@faker-js/faker";

test("EP003 Given no members exist, When I create a member, Then the dashboard should show 1 member", async ({
    page,
}, testInfo) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const membersPage = new MembersPage(page);

    // Given: No members exist, and the user is logged in
    await loginPage.open();
    await loginPage.login();
    expect(await loginPage.userIsLoggedIn()).toBeTruthy();

    // Navigate to the dashboard and verify it shows 0 members initially
    await dashboardPage.open();

    const dashboard = await dashboardPage.getDashboard();
    await expect(dashboard).toBeVisible({ timeout: 5000 });
    const initialDashboardText = await dashboard.innerText();
    expect(initialDashboardText).toContain("0");

    // When: I create a member
    await membersPage.open();
    const fakeValues = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        notes: faker.lorem.sentence(),
    }
    await membersPage.createMember(fakeValues.name, fakeValues.email, fakeValues.notes);

    // Then: Navigate to the dashboard and verify it shows 1 member
    await dashboardPage.open();

    const updatedDashboard = await dashboardPage.getDashboard();
    await expect(updatedDashboard).toBeVisible({ timeout: 5000 });
    const updatedDashboardText = await updatedDashboard.innerText();
    expect(updatedDashboardText).toContain("1");
});
