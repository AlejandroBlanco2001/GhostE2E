import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { Urls } from "../../shared/config";

test("Verify setup is correctly configured", async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Open login page and log in
    await loginPage.open();
    await loginPage.login();
    await expect(loginPage.userIsLoggedIn()).resolves.toBeTruthy();

    // Navigate to the dashboard and wait for it to fully load
    await page.goto(Urls.dashboard, { waitUntil: "networkidle" });
    await takeScreenshot(page);

    // Locate and verify the navbar is visible
    const navbar = page.locator("[data-test-nav-menu='main']");
    await expect(navbar).toBeVisible({ timeout: 5000 }); // Explicit wait with timeout for reliability
});
