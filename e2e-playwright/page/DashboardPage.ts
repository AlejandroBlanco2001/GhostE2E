import { Locator, Page, TestInfo } from "@playwright/test";
import { Urls } from "../../shared/config";
import { takeScreenshot } from "../util/util";

export class DashboardPage {
  readonly page: Page;
  readonly testInfo: TestInfo;

  constructor(
    page: Page,
    testInfo: TestInfo = { title: "__ignore__" } as TestInfo
  ) {
    this.page = page;
    this.testInfo = testInfo;
  }

  async open() {
    await this.page.goto(Urls.dashboard, { waitUntil: "networkidle" });

    try {
      const skipOnboarding = await this.page.locator("#ob-skip").first();

      if (skipOnboarding) {
        await skipOnboarding.click();
      }
    } catch (e) {
      console.log("Onboarding not found");
    }
  }

  async getDashboard(): Promise<Locator> {
    return await this.page.locator("[data-test-dashboard='attribution']");
  }

  async getDashboardMembersValue(): Promise<Locator> {
    return await this.page.locator('[class="gh-dashboard-metric-value"]');
  }

  async getPostTable(): Promise<Locator> {
    return await this.page.locator(".gh-dashboard-recents-mentions");
  }

  async getPostTableRowsContainer(table: Locator): Promise<Locator[]> {
    return await table.locator(".gh-dashboard-list-body").all();
  }

  async getPostTableRowsItems(): Promise<Locator[]> {
    return await this.page
      .locator(".ember-view gh-dashboard-list-item permalink")
      .all();
  }

  async getNumberOfPostRowsNumber(): Promise<number> {
    return (await this.getPostTableRowsItems()).length;
  }

  async getActionGraphContainer(): Promise<Locator> {
    return await this.page.locator(".gh-dashboard-box");
  }

  async getActionsItemsRows(): Promise<Locator[]> {
    return await this.page
      .locator(".gh-dashboard-list-item-sub gh-dashboard-list-item-sub-source")
      .all();
  }

  async getNumberOfActionsItemRows(): Promise<number> {
    return (await this.getActionsItemsRows()).length;
  }
}
