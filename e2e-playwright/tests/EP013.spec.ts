import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { LoginPage } from "../page/LoginPage";
import { PagesEditor } from "../page/PagesEditor";
import { URL } from "../../shared/config";


test("EP013 Check new page are created", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const pagesEditor = new PagesEditor(page);

    // Chek if user is logged in
    await loginPage.open();
    await loginPage.login();

    // Navigate to Pages Editor and Create a new Page
    await pagesEditor.open();
    await pagesEditor.createTestPage("Prueba Creacion Pagina")


    // Verify if the new page exists
    const nuevapagina = await page.goto(`${URL}/prueba-creacion-pagina`, { waitUntil: "load" });
    expect(nuevapagina?.status).not.toEqual(404);
    await takeScreenshot(page);
});
