import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { Urls } from "../../shared/config";
import { DashboardPage } from "../page/DashboardPage";
import { CreateMemberPage } from "../page/CreateMemberPage";
import { CreatePostPage } from "../page/CreatePostPage";

test("Check dashboard shows 0 results when no members are created", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Log in and verify
    await loginPage.open();
    await loginPage.login();
    expect(await loginPage.userIsLoggedIn()).toBeTruthy();

    // Navigate to dashboard and take screenshot
    await page.goto(Urls.dashboard, { waitUntil: "networkidle" });
    await takeScreenshot(page);

    // Verify dashboard content
    const dashboard = await dashboardPage.getDashboard();
    await expect(dashboard).toBeVisible({ timeout: 5000 }); // explicit wait

    const dashboardText = await dashboard.innerText();
    expect(dashboardText).toContain("0");
});

test("Check post table shows 1 result when no posts are created", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Log in and verify
    await loginPage.open();
    await loginPage.login();
    expect(await loginPage.userIsLoggedIn()).toBeTruthy();

    // Navigate to dashboard and take screenshot
    await page.goto(Urls.dashboard, { waitUntil: "networkidle" });
    await takeScreenshot(page);

    // Verify post table content
    const postTable = await dashboardPage.getPostTable();
    await expect(postTable).toBeVisible({ timeout: 5000 });

    expect(await dashboardPage.getNumberOfPostRowsNumber() === 1)
});

test("Check that when creating a member the dashboard shows 1 member", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const createMemberPage = new CreateMemberPage(page);

    // Log in and verify
    await loginPage.open();
    await loginPage.login();
    expect(await loginPage.userIsLoggedIn()).toBeTruthy();

    // Navigate to dashboard and take screenshot
    await page.goto(Urls.dashboard, { waitUntil: "networkidle" });
    await takeScreenshot(page);

    // Verify dashboard content
    const dashboard = await dashboardPage.getDashboard();
    await expect(dashboard).toBeVisible({ timeout: 5000 });

    const dashboardText = await dashboard.innerText();
    expect(dashboardText).toContain("0");

    // Create a member
    await createMemberPage.open();
    await createMemberPage.fillForm();

    // Navigate to dashboard and take screenshot
    await dashboardPage.open();
    await takeScreenshot(page);

    // Verify dashboard content
    const updatedDashboard = await dashboardPage.getDashboard();
    await expect(updatedDashboard).toBeVisible({ timeout: 5000 });

    const updatedDashboardText = await updatedDashboard.innerText();
    expect(updatedDashboardText).toContain("1");
});

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

test("Check that when creating a post the activity contains a Created Manually action", async ({page}) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const createPostPage = new CreatePostPage(page);

    // Log in and verify
    await loginPage.open();
    await loginPage.login();

    // Navigate to dashboard and take screenshot
    await page.goto(Urls.dashboard, { waitUntil: "networkidle" });
    await takeScreenshot(page);

    // Create a post
    await createPostPage.open();
    await createPostPage.fillForm();
    await createPostPage.publishPost();

    // Navigate to dashboard and take screenshot
    await dashboardPage.open();
    await takeScreenshot(page);

    // There is no way to detect the Action Box on an unique way therefore just cheking that the text "Created Manualy exists"
    expect(await page.innerText("body")).toContain("Created manually")
})
