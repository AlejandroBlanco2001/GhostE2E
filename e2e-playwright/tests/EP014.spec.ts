import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { PagesEditor } from "../page/PagesEditor";
import { URL } from "../../shared/config";


test("Check new page is visible in Pages Editor", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const pagesEditor = new PagesEditor(page);

    // Chek if user is logged in
    await loginPage.open();
    await loginPage.login();
    
    // Navigate to Pages Editor and Create a new Page
    await pagesEditor.open();
    await takeScreenshot(page);
    let newPageName = "Prueba Vista Editor"
    await pagesEditor.createTestPage(newPageName);

    // Verify if the new page is visible on Editor
    const resultado = await pagesEditor.getCreatedPages();
    expect(resultado).toContain(newPageName);
    await takeScreenshot(page);

});