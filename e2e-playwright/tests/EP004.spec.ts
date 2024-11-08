import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { Urls } from "../../shared/config";
import { DashboardPage } from "../page/DashboardPage";
import { CreatePostPage } from "../page/CreatePostPage";

test("Check that when creating a post the table shows 2 results", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const createPostPage = new CreatePostPage(page);

    // Log in and verify
    await loginPage.open();
    await loginPage.login();

    // Navigate to dashboard and take screenshot
    await page.goto(Urls.dashboard, { waitUntil: "networkidle" });
    await takeScreenshot(page);

    // Verify post table content
    const postTable = await dashboardPage.getPostTable();
    await expect(postTable).toBeVisible({ timeout: 5000 });

    expect(await dashboardPage.getNumberOfPostRowsNumber() === 1)
    
    // Create a post
    await createPostPage.open();
    await createPostPage.fillForm();
    await createPostPage.publishPost();

    // Navigate to dashboard and take screenshot
    await dashboardPage.open();
    await takeScreenshot(page);

    // Verify post table content
    const updatedPostTable = await dashboardPage.getPostTable();
    await expect(updatedPostTable).toBeVisible({ timeout: 5000 });

    expect(await dashboardPage.getNumberOfPostRowsNumber() === 2)
})
