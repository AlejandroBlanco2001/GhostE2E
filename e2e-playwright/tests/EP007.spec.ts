import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { MembersPage } from "../page/MembersPage";
import { faker } from "@faker-js/faker";

test("Create member with same name", async ({
    page,
}) => {
    const loginPage = new LoginPage(page);
    const membersPage = new MembersPage(page);

    // Given: I have logged in and create a member
    await loginPage.open();
    await loginPage.login();
    await membersPage.open();

    const fakeValues = {
        name: faker.person.firstName(),
        email_1: faker.internet.email(),
        email_2: faker.internet.email(),
        notes: faker.lorem.sentence(),
    }
    // Create first member
    await membersPage.createMember(fakeValues.name, fakeValues.email_1, fakeValues.notes);

    // Validate the member is created
    await membersPage.open();
    await expect(membersPage.containsName(fakeValues.name)).toHaveCount(1);

    // When: I Create a second member with the same name as the first member
    await membersPage.createMember(fakeValues.name, fakeValues.email_2, fakeValues.notes);

    // Then: The member is created successfully
    await membersPage.open();
    await expect(membersPage.containsEmail(fakeValues.email_1)).toHaveCount(1);
    await expect(membersPage.containsEmail(fakeValues.email_2)).toHaveCount(1);
});
