import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { Urls } from "../../shared/config";
import { DashboardPage } from "../page/DashboardPage";
import { CreateMemberPage } from "../page/CreateMemberPage";
import { CreatePostPage } from "../page/CreatePostPage";

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
