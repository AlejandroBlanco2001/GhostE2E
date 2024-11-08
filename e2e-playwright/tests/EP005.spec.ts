import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { DashboardPage } from "../page/DashboardPage";
import { CreatePostPage } from "../page/CreatePostPage";

test("Given the dashboard is accessed, When I create a post, Then the activity log should contain a 'Created manually' action", async ({
    page,
}) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const createPostPage = new CreatePostPage(page);

    // Given: User is logged in and the dashboard is accessed
    await loginPage.open();
    await loginPage.login();

    // Navigate to the dashboard and take a screenshot
    await dashboardPage.open();
    await takeScreenshot(page);

    // When: I create a new post
    await createPostPage.open();
    await createPostPage.fillForm();
    await createPostPage.publishPost();

    // Then: Navigate back to the dashboard and verify the activity log contains "Created manually"
    await dashboardPage.open();
    await takeScreenshot(page);

    const bodyText = await page.innerText("body");
    expect(bodyText).toContain("Created manually");
});
