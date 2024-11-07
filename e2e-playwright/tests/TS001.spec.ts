/*
TEST functioning
*/

import { test, expect } from '@playwright/test';
import { takeScreenshot } from '../util/util';
import { LoginPage } from '../page/LoginPage';
import { Urls } from '../../shared/config';

test('See if setup correctly', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login();
    expect(await loginPage.userIsLoggedIn()).toBeTruthy();

    await page.goto(Urls.dashboard, { waitUntil: 'networkidle' });
    await takeScreenshot(page);

    await expect(page.getByRole('heading', { name: 'Let’s get started!' })).toBeVisible();
});