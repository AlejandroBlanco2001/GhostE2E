import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { MembersPage } from "../page/MembersPage";
import { faker } from "@faker-js/faker";

test("EP008 Create member without name", async ({
    page,
}) => {
    const loginPage = new LoginPage(page);
    const membersPage = new MembersPage(page);

    // Given: I have logged
    await loginPage.open();
    await loginPage.login();
    await membersPage.open();

    const fakeValues = {
        email: faker.internet.email(),
        notes: faker.lorem.sentence(),
    }
    // When: I create a memeber with no name
    await membersPage.createMember('', fakeValues.email, fakeValues.notes);

    // Then: The member is created successfully
    await membersPage.open();
    // Member has email as name
    await expect(membersPage.containsName(fakeValues.email)).toHaveCount(1);
});
