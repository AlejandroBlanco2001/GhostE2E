import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { PagesEditor } from "../page/PagesEditor";
import { Urls, URL } from "../../shared/config";


test("EP016 Create new page and edit it", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const pagesEditor = new PagesEditor(page);

    // Chek if user is logged in
    await loginPage.open();
    await loginPage.login();

    // Navigate to Pages Editor and Create a new Page
    await pagesEditor.open();
    let newPageName = "Prueba edicion contenido";
    await pagesEditor.createTestPage(newPageName);

    // Screenshot the inicial state of the new page
    await page.goto(`${URL}/prueba-edicion-contenido`, { waitUntil: "load" });
    await takeScreenshot(page);

    // Add new section
    await page.goto(Urls.listPage, { waitUntil: "load" });
    await page.waitForTimeout(500);
    await pagesEditor.editPage(newPageName);
    let newTitle = "Este título se creó editando la página";
    let newParagraph = "Este parrafo se creó editando la página";
    let lastParagraph = page.locator(".kg-prose").first();
    await lastParagraph.click();
    await page.keyboard.press("Control+ArrowDown");
    await page.keyboard.press("Enter");
    await page.keyboard.type("## " + newTitle);
    await page.keyboard.press("Enter");
    await page.keyboard.type(newParagraph);
    await page.click("text='Update'");
    await page.waitForTimeout(1000)


    // verify if new page contains the new section 
    await page.goto(`${URL}/prueba-edicion-contenido/`, { waitUntil: "load" });
    await takeScreenshot(page);
    let container = page.locator('.gh-content');
    let contenidos = await container.allInnerTexts();

    let titleExists = false;
    let paragraphExists = false;
    for (let i = 0; i < contenidos.length; i++) {
        if (contenidos[i] == newTitle) { titleExists = true };
        if (contenidos[i] == newParagraph) { paragraphExists = true };
    }
    expect(titleExists).toBeTruthy;
    expect(paragraphExists).toBeTruthy;

});