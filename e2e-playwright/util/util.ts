import { chromium, Page, TestInfo } from "@playwright/test";
import { VERSION, VISUAL_REGRESSION_TESTING } from '../../shared/config';
import { startGhost } from "../../shared/runner.ts";
import { LoginPage } from "../page/LoginPage";

let counter = 0;
let baseDir = `./screenshots/playwright/`
export async function takeScreenshot(page: Page, testInfo: TestInfo, step: string) {
    if (VISUAL_REGRESSION_TESTING) {
        await page.waitForTimeout(1000);
        if (testInfo.title !== '__ignore__') {
            let stepNumber = String(counter++).padStart(3, '0');
            await page.screenshot({ path: `${baseDir}${VERSION}/${testInfo.title}/${stepNumber}_${step}.png`, fullPage: true });
        } else {
            await page.screenshot({ path: `${baseDir}${VERSION}/${testInfo.title}/${step}.png`, fullPage: true });
        }
    } else {
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `${baseDir}NON_VRT/${testInfo.title}/${step}.png`, fullPage: true });
    }
}

export async function VRTBeforeAll() {
    if (VISUAL_REGRESSION_TESTING) {
        await startGhostAndSetup();
    }
}

export async function startGhostAndSetup() {
    await startGhost();
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const login = new LoginPage(page);
    await login.open();
    await login.setup();
    await browser.close();
}