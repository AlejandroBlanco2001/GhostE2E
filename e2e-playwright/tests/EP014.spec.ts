import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { PagesEditor } from "../page/PagesEditor";
import { URL } from "../../shared/config";


test("EP014 Check new page is visible in Pages Editor", async ({
    page
}, testInfo) => {
    const loginPage = new LoginPage(page, testInfo);
    const pagesEditor = new PagesEditor(page, testInfo);

    // Check if user is logged in
    await loginPage.open();
    await loginPage.login();

    // Navigate to Pages Editor and Create a new Page
    await pagesEditor.open();
    let newPageName = "Prueba Vista Editor"
    await pagesEditor.createTestPage(newPageName);
    await takeScreenshot(page, testInfo, "Page Created");

    // Verify if the new page is visible on Editor
    const resultado = await pagesEditor.getCreatedPages();
    await takeScreenshot(page, testInfo, "Access Page Created");
    expect(resultado).toContain(newPageName);
});