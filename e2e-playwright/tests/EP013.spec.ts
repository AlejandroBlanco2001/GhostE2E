import { test, expect } from "@playwright/test";
import { takeScreenshot } from "../util/util";
import { PagesEditor } from "../page/PagesEditor";
import { URL } from "../../shared/config";
import { LoginPage } from "../page/LoginPage";


test("EP013 Check new page are created", async ({
    page
}, testInfo) => {
    const loginPage = new LoginPage(page, testInfo);
    const pagesEditor = new PagesEditor(page, testInfo);

    // Chek if user is logged in
    await loginPage.open();
    await loginPage.login();

    // Navigate to Pages Editor and Create a new Page
    await pagesEditor.open();
    await pagesEditor.createTestPage("Prueba Creacion Pagina")
    await takeScreenshot(page, testInfo, "Page Created");

    // Verify if the new page exists
    const nuevapagina = await page.goto(`${URL}/prueba-creacion-pagina`, { waitUntil: "load" });
    await page.setViewportSize({ width: 1920, height: 1080 });
    await takeScreenshot(page, testInfo, "Access Page Created");
    expect(nuevapagina?.status).not.toEqual(404);
});
