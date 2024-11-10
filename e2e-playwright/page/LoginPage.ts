import { Page } from "@playwright/test";
import { SiteConfig, Urls } from "../../shared/config";
import { takeScreenshot } from "../util/util";

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async open() {
        await this.page.goto(Urls.setup, { waitUntil: 'networkidle' });
    }

    // This function is called to setup the blog (Only once)
    async setup() {
        await this.page.waitForLoadState('networkidle');

        await this.page.waitForSelector('input[id="blog-title"]');
        await this.page.fill('input[id="blog-title"]', SiteConfig.siteTitle);

        await this.page.fill('input[id="name"]', SiteConfig.name);
        await this.page.fill('input[id="email"]', SiteConfig.email);
        await this.page.fill('input[id="password"]', SiteConfig.password);
        await this.page.click('button[type="submit"]');

        await this.page.waitForLoadState('networkidle');
        console.log('Setup done');
        await takeScreenshot(this.page);

        // check if there is <a href="#" class="gh-onboarding-skip" id="ob-skip">Skip onboarding</a>
        if (await this.page.isVisible('a.gh-onboarding-skip')) {
            await this.page.click('a.gh-onboarding-skip');
            await this.page.waitForLoadState('networkidle');
        }
    }

    async login() {
        let curr_url = await this.page.url();
        if (curr_url.includes('setup')) {
            await this.setup();
        } else if (curr_url.includes('signin')) {
            await this.page.waitForSelector('input[type="email"]');
            await this.page.fill('input[type="email"]', SiteConfig.email);
            await this.page.fill('input[type="password"]', SiteConfig.password);
            await this.page.click('button[type="submit"]');
            await this.page.waitForLoadState('networkidle');
        } else if (curr_url.includes('dashboard')) {
            console.log('Already logged in');
            return;
        } else {
            throw new Error('Unknown page');
        }
    }

    async userIsLoggedIn(): Promise<boolean> {
        await this.page.goto(Urls.dashboard, { waitUntil: 'networkidle' });
        return this.page.url().includes('dashboard');
    }
}