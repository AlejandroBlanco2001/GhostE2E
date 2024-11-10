import { KrakenWorld } from "./support";
import { AfterStep, After, Before } from '@cucumber/cucumber';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { WebClient } from './WebClient'
import type { Page } from 'puppeteer-core/lib/cjs/puppeteer/common/Page';
import { startGhost } from '../../../shared/runner';
import { CI } from "../../../shared/config";

Before(async function (this: KrakenWorld) {
  await startGhost();
  let cs = ''
  let ce = ''
  console.log('='.repeat(80), '\n', 'Running scenario: ' + cs + this.scenario.name + ce);
  this.deviceClient = new WebClient('chrome', {}, this.userId);
  this.driver = await this.deviceClient.startKrakenForUserId(this.userId);
  this.testId = this.userId;
  let browser = await this.driver.getPuppeteer();
  let pages = await browser.pages();
  this.browser = browser;
  if (pages.length > 0) {
    this.page = pages.pop() as Page;
  } else {
    throw new Error('No pages found');
  }
  this.page.setDefaultTimeout(10000);
})

AfterStep(async function (this: KrakenWorld, { gherkinDocument }: ITestCaseHookParameter) {
  if (CI) {
    // Wait for the page to be ready
    await this.page.waitForTimeout(1000);
  }
})
After(async function (this: KrakenWorld, params: ITestCaseHookParameter) {
  await this.deviceClient.stopKrakenForUserId(this.userId);
});
