import { Urls, SiteConfig } from '../../../shared/config';
import type { Page } from 'puppeteer-core/lib/cjs/puppeteer/common/Page';

async function firstLogin(page: Page) {
  // Setup ghost for the first time, and log in.
  let element;
  await page.waitForSelector('input[id="blog-title"]');
  element = await page.$('input[id="blog-title"]')
  await element?.type(SiteConfig.siteTitle);
  element = await page.$('input[id="name"]')
  await element?.type('Ghost Testing');
  element = await page.$('input[id="email"]')
  await element?.type(SiteConfig.email);
  element = await page.$('input[id="password"]')
  await element?.type(SiteConfig.password);
  element = await page.$('button[type="submit"]')
  element?.click()
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('Ghost site setup complete');

  page.goto(Urls.dashboard);

  // Skip onboarding
  const skipOnboarding = await page.$('#ob-skip');

  if(skipOnboarding) {
    await skipOnboarding.click();
  }
}

async function normalLogin(page: Page) {
  // let element;
  // element = await page.$('input[type="email"]');
  // await element?.type(SiteConfig.email);
  // element = await page.$('input[type="password"]');
  // await element?.type(SiteConfig.password);
  // element = await page.$('button[type="submit"]');
  // return element?.click();

  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', SiteConfig.email);
  await page.type('input[type="password"]', SiteConfig.password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Skip onboarding
  const skipOnboarding = await page.$('#ob-skip');

  if(skipOnboarding) {
    await skipOnboarding.click();
  }
}

export async function Login(page: Page) {
  let loginId = 'login'
  let SetupId = 'blog-title'
  await page.goto(Urls.signin);
  let watchdog = [
    page.waitForSelector("#" + loginId),
    page.waitForSelector("#" + SetupId),
  ]
  let relement = await Promise.race(watchdog)
  let idProp = await relement!.getProperty('id')
  let id = await idProp.jsonValue()
  if (id === SetupId) {
    return firstLogin(page);
  } else if (id === loginId) {
    return normalLogin(page);
  } else {
    throw new Error('Already logged in');
  }
}
