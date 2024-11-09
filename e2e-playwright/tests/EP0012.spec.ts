import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { MembersPage } from "../page/MembersPage";
import { faker } from "@faker-js/faker";

test("Edit member with invalid email", async ({
    page,
}) => {
    const loginPage = new LoginPage(page);
    const membersPage = new MembersPage(page);

    // Given: I have logged in and created a member
    await loginPage.open();
    await loginPage.login();
    await membersPage.open();

    const fakeValues = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        notes: faker.lorem.sentence(),
    }
    await membersPage.createMember(fakeValues.name, fakeValues.email, fakeValues.notes);

    await membersPage.open();

    // Validate creation
    await expect(membersPage.containsName(fakeValues.name)).toHaveCount(1);
    await expect(membersPage.containsEmail(fakeValues.email)).toHaveCount(1);

    // When: I edit the member with an invalid email
    await membersPage.editMember(fakeValues.email, fakeValues.name, 'invalidemail', fakeValues.notes);

    // Then: The member is not updated
    expect(await membersPage.creationStatus()).toBeFalsy();
});
