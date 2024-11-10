import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { MembersPage } from "../page/MembersPage";
import { faker } from "@faker-js/faker";

test("EP006 Create member", async ({
    page,
}) => {
    const loginPage = new LoginPage(page);
    const membersPage = new MembersPage(page);

    // Given: I have logged in
    await loginPage.open();
    await loginPage.login();
    await membersPage.open();


    // When: I create a member
    const fakeValues = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        notes: faker.lorem.sentence(),
    }
    await membersPage.createMember(fakeValues.name, fakeValues.email, fakeValues.notes);

    // Then: Navigate back to the membersPage and verify the member is created
    await membersPage.open();
    await page.waitForLoadState('networkidle');
    await takeScreenshot(page);
    await expect(membersPage.containsName(fakeValues.name)).toHaveCount(1);
});
