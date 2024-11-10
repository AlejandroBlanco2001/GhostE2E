import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { MembersPage } from "../page/MembersPage";
import { faker } from "@faker-js/faker";

test("EP009 Create member with invalid email", async ({
    page,
}) => {
    const loginPage = new LoginPage(page);
    const membersPage = new MembersPage(page);

    // Given: I have logged in
    await loginPage.open();
    await loginPage.login();
    await membersPage.open();

    const fakeValues = {
        name: faker.person.firstName(),
        email: 'invalid-email',
        notes: faker.lorem.sentence(),
    }
    // When: I create a memeber with invalid email
    await membersPage.createMember(fakeValues.name, fakeValues.email, fakeValues.notes);

    // Then: The member is not created
    expect(await membersPage.creationStatus()).toBeFalsy();
});
