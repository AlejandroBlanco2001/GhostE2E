import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { faker } from "@faker-js/faker";
import { CreatePagePage } from "../page/CreatePagePage";
import { PageListPage } from "../page/PageListPage";

test("Given no page created, When I create a page, Then the page list should be updated with the new Page", async ({
    page,
}) => {
    const loginPage = new LoginPage(page);
    const createPagePage = new CreatePagePage(page);
    const pageListPage = new PageListPage(page);

    // Given: No members exist, and the user is logged in
    await loginPage.open();
    await loginPage.login();
    expect(await loginPage.userIsLoggedIn()).toBeTruthy();

    // And Navigate to the page 
    await createPagePage.open();
    await takeScreenshot(page);
    
    // When: I create a Page
    const fakeValues = {
        name: faker.lorem.sentence(),
        paragraph: faker.lorem.paragraph(),
    }
    
    await createPagePage.fillForm(fakeValues.name, fakeValues.paragraph);
    await createPagePage.publishPost();

    // Then: Navigate to the ListPage page and verify it shows 1 page
    await pageListPage.open();
    await takeScreenshot(page);

    expect(await page.innerText("body")).toContain(fakeValues.name);
});
