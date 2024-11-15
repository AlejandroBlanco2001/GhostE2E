import { Page, Locator, TestInfo } from "@playwright/test";
import { Urls } from "../../shared/config";
import { faker } from '@faker-js/faker';
import { promises } from "fs";
import { text } from "stream/consumers";
import { takeScreenshot } from "../util/util";

export class PagesEditor {
    readonly page: Page;
    readonly testInfo: TestInfo;

    constructor(page: Page, testInfo: TestInfo = { title: '__ignore__' } as TestInfo) {
        this.page = page;
        this.testInfo = testInfo;
    }

    async open() {
        await this.page.goto(Urls.listPage, { waitUntil: "load" });
        await takeScreenshot(this.page, this.testInfo, "Post List");
    }

    async getCreatedPages(): Promise<string> {

        let container = this.page.locator("h3");
        let elementos = await container.count();
        let CreatedPages = "{pages: ";

        for (let i = 0; i < elementos; i++) {
            let elemento = container.nth(i);
            CreatedPages += await elemento.innerText();
            if (i < elementos - 1) {
                CreatedPages += ", "
            }
        }

        CreatedPages += "}"

        return CreatedPages;
    }

    async createTestPage(name) {
        await this.page.click("text='New page'");

        // fill the first textarea with the name
        let title = this.page.locator('.gh-editor-title');
        await title.click();
        await title.fill(name);

        let content1 = this.page.locator('.kg-prose');
        let content2 = this.page.locator('.koenig-editor__editor.__mobiledoc-editor');

        if (await content1.count() > 0) {
            await this.page.fill('.kg-prose', faker.lorem.paragraph());
        } else if (await content2.count() > 0) {
            await content2.fill(faker.lorem.paragraph());
        } else {
            console.log('Neither content1 nor content2 exists on the page.');
        }

        await takeScreenshot(this.page, this.testInfo, "Page Created");

        await this.page.click("text='Publish'");

        let btnOld = this.page.locator('.gh-publishmenu-button');
        if (await btnOld.count() > 0) {
            await btnOld.click();
        } else {
            await this.page.click(".gh-publish-cta");
            await this.page.click('.gh-publish-cta', { position: { x: 5, y: 5 } });
            await this.page.click(".close");
        }
    }

    async editPage(name) {

        let pages = await this.page.locator('h3');
        let pagesCount = await pages.count();
        let pagecontainer;

        for (let i = 0; i < pagesCount; i++) {
            let pageMenu = pages.nth(i);
            if (await pageMenu.innerText() == name) {
                pagecontainer = pageMenu.locator("..").locator("..");
                break;
            }
        }

        let editButton = pagecontainer.locator("svg");
        await editButton.click();
        await takeScreenshot(this.page, this.testInfo, "Edit Page");
    }

    async getPageStatus(name): Promise<string> {

        let pages = await this.page.locator('h3');
        let pagesCount = await pages.count();
        let pagecontainer;

        for (let i = 0; i < pagesCount; i++) {
            let pageMenu = pages.nth(i);
            if (await pageMenu.innerText() == name) {
                pagecontainer = pageMenu.locator("..").locator("..");
                break;
            }
        }

        let statusContainer = pagecontainer.locator(".gh-content-entry-status");

        let status = statusContainer.innerText();
        return status;

    }

}