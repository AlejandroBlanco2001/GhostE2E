import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { DashboardPage } from "../page/DashboardPage";
import { MembersPage } from "../page/MembersPage";
import { faker } from "@faker-js/faker";

test("EP005 Given the dashboard is accessed, When I create a member, Then the activity log should contain a 'Created manually' action", async ({
    page,
}) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const membersPage = new MembersPage(page);

    // Given: User is logged in and the dashboard is accessed
    await loginPage.open();
    await loginPage.login();

    // Navigate to members page and take a screenshot
    await membersPage.open();
    await takeScreenshot(page);

    // When: I create a member
    const fakeValues = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        notes: faker.lorem.sentence(),
    }
    await membersPage.createMember(fakeValues.name, fakeValues.email, fakeValues.notes);

    // Then: Navigate back to the dashboard and verify the activity log contains "Created manually"
    await dashboardPage.open();
    await takeScreenshot(page);

    const bodyText = await page.innerText("body");
    expect(bodyText).toContain("Created manually");
});
