import { Locator, Page, TestInfo } from '@playwright/test';
import { Urls } from "../../shared/config";
import { takeScreenshot } from '../util/util';

const listUrl = Urls.membersList;
const createUrl = Urls.membersCreate;

export class MembersPage {
    readonly page: Page;
    readonly testInfo: TestInfo;
    readonly newMember: Locator;
    readonly name: Locator;
    readonly email: Locator;
    readonly notes: Locator;
    readonly save: Locator;
    readonly saved: Locator;
    readonly retry: Locator;
    readonly invalidEmail: Locator;

    constructor(page: Page, testInfo: TestInfo = { title: '__ignore__' } as TestInfo) {
        this.page = page;
        this.testInfo = testInfo;
        this.newMember = page.locator('a:has-text("New Member")');
        this.name = page.locator('input[id="member-name"]');
        this.email = page.locator('input[id="member-email"]');
        this.notes = page.locator('textarea[id="member-note"]');
        this.save = page.locator('button:has-text("Save")');
        this.saved = page.locator('button:has-text("Saved")');
        this.retry = page.locator('button:has-text("Retry")');
        this.invalidEmail = page.locator('p[class="response"] >> text="Invalid Email."');
    }

    async open() {
        if (!listUrl.includes(this.page.url())) {
            await this.page.goto(listUrl, { waitUntil: 'networkidle' });
        }
    }

    async openMember(email: string) {
        await this.open()
        // await takeScreenshot(this.page);
        await this.containsEmail(email).click();
    }

    containsName(name: string): Locator {
        return this.page.locator('h3', { hasText: name })
    }

    containsEmail(email: string): Locator {
        return this.page.locator('p', { hasText: email })
    }

    async createMember(name: string, email: string, notes: string) {
        await this.open();
        await takeScreenshot(this.page, this.testInfo, 'Members Page');
        await this.newMember.click();

        await this.name.fill(name);
        await this.email.fill(email);
        await this.notes.fill(notes);
        await takeScreenshot(this.page, this.testInfo, 'Create Member');

        await this.save.click();
        await this.page.waitForLoadState('networkidle');
    }

    async editMember(email: string, name: string, newEmail: string, notes: string) {
        await this.openMember(email);

        await this.name.fill(name);
        await this.email.fill(newEmail);
        await this.notes.fill(notes);
        await takeScreenshot(this.page, this.testInfo, 'Edit Member');

        await this.save.click();
        await this.page.waitForLoadState('networkidle');
    }

    async creationStatus(): Promise<boolean> {
        if (await this.retry.count() == 1) {
            return false;
        }
        return true;
    }
}