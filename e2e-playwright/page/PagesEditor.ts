import { Page, Locator } from "@playwright/test";
import { Urls } from "../../shared/config";
import { faker } from '@faker-js/faker';

export class PagesEditor{
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.goto(Urls.listPage, { waitUntil: "load" });
    }

    async getCreatedPages(): Promise<string> {

        let container = this.page.locator("h3");
        let elementos = await container.count();
        let CreatedPages = "{pages: ";

        for(let i=0;i<elementos;i++){
            let elemento = container.nth(i);
            CreatedPages += await elemento.innerText();
            if (i< elementos-1){
                CreatedPages += ", "
            }
        }

        CreatedPages += "}"
        
        return CreatedPages;
    }

    async createTestPage(name) {
        await this.page.click("text='New page'");
        await this.page.fill("[placeholder='Page title']",name);
        await this.page.fill(".kg-prose", faker.lorem.paragraph());
        await this.page.click("text='Publish'");
        await this.page.click(".gh-publish-cta");
        await this.page.click('.gh-publish-cta',{position:{x:5,y:5}});
        await this.page.click(".close");
    }

    async editPage(name){
        
        let pages = await this.page.locator('h3');
        let pagesCount = await pages.count();
        let pagecontainer;

        for(let i=0;i<pagesCount;i++){
            let pageMenu = pages.nth(i);
            if(await pageMenu.innerText()==name){
                pagecontainer = pageMenu.locator("..").locator("..");
                break;
            }
        }
        
        let editButton = pagecontainer.locator("svg");
        await editButton.click();
        
    }

    async getPageStatus(name): Promise<string> {
        
        let pages = await this.page.locator('h3');
        let pagesCount = await pages.count();
        let pagecontainer;

        for(let i=0;i<pagesCount;i++){
            let pageMenu = pages.nth(i);
            if(await pageMenu.innerText()==name){
                pagecontainer = pageMenu.locator("..").locator("..");
                break;
            }
        }
        
        let statusContainer = pagecontainer.locator(".gh-content-entry-status");

        let status = statusContainer.innerText();
        return status;
        
    }

}