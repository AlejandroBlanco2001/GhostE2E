import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { PagesEditor } from "../page/PagesEditor";
import { Urls, URL } from "../../shared/config";


test("EP017 Unpublish Page", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const pagesEditor = new PagesEditor(page);

    // Chek if user is logged in
    await loginPage.open();
    await loginPage.login();

    // Navigate to Pages Editor and Create a new Page
    await pagesEditor.open();
    let newPageName = "Pagina retornar borrador";
    await pagesEditor.createTestPage(newPageName);

    // Open the new Page in editor mode
    await pagesEditor.open();
    await pagesEditor.editPage(newPageName);

    // Unpublish
    await page.click("text='Unpublish'");
    await page.click(".gh-revert-to-draft");
    await page.waitForTimeout(1000);


    //Verify if the page is identified as draft
    await pagesEditor.open();
    await page.waitForTimeout(1000);
    let pageStatus = await pagesEditor.getPageStatus(newPageName);
    expect(pageStatus).toEqual("Draft");
    await takeScreenshot(page);
});