import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { PagesEditor } from "../page/PagesEditor";
import { URL } from "../../shared/config";


test("EP015 Check new page is visible in edition mode", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const pagesEditor = new PagesEditor(page);

    // Chek if user is logged in
    await loginPage.open();
    await loginPage.login();

    // Navigate to Pages Editor and Create a new Page
    await pagesEditor.open();
    let newPageName = "Prueba modo edicion";
    await pagesEditor.createTestPage(newPageName);

    // Select edit option for the new Page
    await pagesEditor.editPage(newPageName);


    // Verify if new page opens in edit mode
    await takeScreenshot(page);
    let activeUrl = await page.url();
    let expectedUrl = `${URL}/ghost/#/editor/page/`;
    expect(activeUrl).toContain(expectedUrl);


});