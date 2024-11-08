import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { DEFAULT_POST_NAME } from "../../shared/config";
import { DashboardPage } from "../page/DashboardPage";
import { CreatePostPage } from "../page/CreatePostPage";


test("Given 1 post exists, When I create a new post, Then the post table should show 2 results", async ({
    page,
}) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const createPostPage = new CreatePostPage(page);

    // Given: User is logged in, and 1 post already exists
    await loginPage.open();
    await loginPage.login();

    // Navigate to the dashboard and verify it initially shows 1 post
    await dashboardPage.open();
    await takeScreenshot(page);

    const postTable = await dashboardPage.getPostTable();
    await expect(postTable).toBeVisible({ timeout: 5000 });
    
    const dashboardPageInnerTextInitial = await page.innerText("body");
    expect(dashboardPageInnerTextInitial).toContain(DEFAULT_POST_NAME);

    // When: I create a new post
    await createPostPage.open();
    const postCreatedName = await createPostPage.fillForm();
    await createPostPage.publishPost();

    // Then: Navigate to the dashboard and verify the post table shows 2 posts
    await dashboardPage.open();
    await takeScreenshot(page);

    const updatedPostTable = await dashboardPage.getPostTable();
    await expect(updatedPostTable).toBeVisible({ timeout: 5000 });

    const dashboardPageInnerText = await page.innerText("body");

    expect(dashboardPageInnerText).toContain(DEFAULT_POST_NAME);
    expect(dashboardPageInnerText).toContain(postCreatedName);
});
