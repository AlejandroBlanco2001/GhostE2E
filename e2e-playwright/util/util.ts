import { chromium, Page, TestInfo } from "@playwright/test";
import { startGhost } from "../../shared/runner";
import { LoginPage } from "../page/LoginPage";

let baseDir = `./screenshots/playwright/`
export async function takeScreenshot(page: Page) {
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${baseDir}${Date.now()}.png` });
}

export async function startGhostAndSetup() {
    await startGhost();
    console.log('Starting browser');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const login = new LoginPage(page);
    await login.open();
    await login.setup();
    await browser.close();
}