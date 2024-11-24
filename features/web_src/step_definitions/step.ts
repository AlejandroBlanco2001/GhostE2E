import { Given, When, Then } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';
import { Login } from './login';
import type { Page } from 'puppeteer-core/lib/cjs/puppeteer/common/Page';
import { Cookie, KrakenWorld } from '../support/support';
import { ElementHandle } from 'puppeteer-core/lib/cjs/puppeteer/common/JSHandle';
import { Urls, VERSION, VISUAL_REGRESSION_TESTING } from '../../../shared/config';
const isCI = process.env.CI || false;
const defaultTiemout = isCI ? 15000 : 5000;

let numberOfMembers = 0;

type ValueGeneratorCollection = {
  [key: string]: () => string
}

if (VISUAL_REGRESSION_TESTING) {
  faker.seed(1);
}

const ValueGenerators: ValueGeneratorCollection = {
  "|FAKE_NAME|": faker.person.firstName,
  "|FAKE_EMAIL|": faker.internet.email,
  "|FAKE_PARAGRAPH|": () => faker.lorem.paragraph(1),
  "|FAKE_LABEL|": faker.word.verb,
  "|FAKE_TITLE|": faker.commerce.productName,
  "|FAKE_CONTENT|": faker.commerce.productDescription,
  "|FAKE_TAG_NAME|": faker.lorem.word,
  "|FAKE_TAG_INTERNAL_NAME|": () => "#" + faker.lorem.word(),
} as const;

const SavedGeneratedValues: Record<string, string> = {};

type SelectorsCollection = Record<string, string>

const Selectors: SelectorsCollection = {
  // Dashboard menu
  "dashborad/menu/member": 'a[href="#/members/"]',
  "dashborad/menu/post": 'a[href="#/posts/"]',
  "dashborad/menu/page": 'a[href="#/pages/"]',

  ///////////////////////////////////MEMBERS///////////////////////////////////
  "member/list/new": 'a[href="#/members/new/"]',
  "member/list/name": "//h3[contains(., '{}')]",
  "member/list/email": "//p[contains(., '{}')]",
  "member/list/fill/search": "input[placeholder='Search members...']",
  // Edit fill
  "member/edit/fill/name": 'input[id="member-name"]',
  "member/edit/fill/email": 'input[id="member-email"]',
  "member/edit/fill/notes": 'textarea[id="member-note"]',
  "member/edit/fill/label": "input[type='search']",
  // Edit list
  // Member Actions
  "member/action/save": "//button/span[contains(., 'Save')]",
  "member/action/retry save": "//span[normalize-space()='Retry']",
  "member/action/actions": "//button[./span/span[contains(., 'Actions')]]",
  "member/action/actions/delete": "//button/span[contains(., 'Delete member')]",
  "member/action/actions/modal/delete": "//div[@class='modal-footer']/button/span[contains(., 'Delete member')]",
  "member/action/list actions": "//button[./span/span[contains(., 'Actions')]]",
  "member/action/list actions/delete": "//button[./span[contains(., 'Delete selected members')]]",
  "member/action/list actions/delete confirm": "//button[./span[contains(., 'Download backup')]]",
  "member/action/list actions/delete confirm close": "//button[./span[contains(., 'Close')]]",
  "member/action/list actions/remove label": "//button/span[contains(., 'Remove label')]",
  "member/action/list actions/remove label select": "//select[./option[contains(., '{}')]]",
  "member/action/list actions/remove label select option": "//option[contains(., '{}')]",
  "member/action/list actions/remove label confirm": "//button/span[normalize-space()='Remove Label']",
  "member/action/list actions/remove label confirm close": "button[class='gh-btn gh-btn-black']",
  "member/see/save-retry": "//button[contains(., 'Retry')]",
  ///////////////////////////////////POSTS///////////////////////////////////
  "post/list/new": 'a[href="#/editor/post/"]',
  "post/action/save": "//button[@data-test-button='publish-flow']",
  "post/action/review": "//button[@data-test-button='continue']",
  "post/action/final publish": "//button[@data-test-button='confirm-publish']",
  ///////////////////////////////////PAGES///////////////////////////////////
  "page/list/new": 'a[href="#/editor/page/"]',
  "pages/new page": "//a//span[text()='New page']",
  "tag/action/save": "//button/span[contains(., 'Save')]",
  "tag/action/saved": "//button/span[contains(., 'Saved')]",
  "tag/action/retry save": "//button/span[contains(., 'Retry')]",
} as const

function GetSelector(selector: string): string {
  let res = Selectors[selector];
  if (!res) {
    throw new Error(`Couldn't find selector for key ${selector}`)
  }
  return res;
}

async function getElement(page: Page, selector: string, value?: string, hidden: boolean = false, visible: boolean = false): Promise<ElementHandle> {
  let isxpath = selector.startsWith("/");
  let result;
  if (value) {
    value = ValueTransform(value);
    selector = selector.replace(/\{\}/g, value);
  }
  if (true) {
    let props: Record<string, any> = {};
    if (hidden) {
      props.hidden = true;
    }
    if (visible) {
      props.visible = true;
    }
    props.timeout = defaultTiemout;
    if (isxpath) {
      result = await page.waitForXPath(selector, props);
    } else {
      result = await page.waitForSelector(selector, props);
    }
  }
  if (result == null) {
    console.log('===============Selector not Found ==================')
    console.log(`Selector: ${selector}`)
    console.log(`Value: ${value}`)
    throw new Error(`Element ${selector} not found`);
  }
  return result;
}

async function FillElement(page: Page, selector: string, value: string, clear?: boolean, focus?: boolean): Promise<void> {
  let element = await getElement(page, selector, value);
  value = ValueTransform(value)
  if (focus) {
    await element.focus();
  }
  if (clear) {
    // @ts-ignore
    await element.evaluate((el) => { el.value = '' })
  }
  return element.type(value);
}

async function ClickElement(page: Page, selector: string, value?: string): Promise<void> {
  if (isCI) {
    await page.waitForTimeout(200);
  }
  let element = await getElement(page, selector, value, false, true);
  return element.click();
}

function ValueTransform(value: string): string {
  if (value.startsWith('|')) {
    let generated_value = SavedGeneratedValues[value];
    if (generated_value) {
      value = generated_value;
    } else {
      let generator = ValueGenerators[value.replace(/\d+$/, "")]
      if (!generator) {
        throw new Error(`No value generator for ${value}`);
      }
      generated_value = generator();
      SavedGeneratedValues[value] = generated_value;
    }
  }
  return value
}

const Navigators: Record<string, Function> = {
  // TODO: Refactor this two (member and post) into one function
  post: async (page: Page) => {
    if (!page.url().includes(Urls["post/list"])) {
      await NavigateTo(page, "dashboard");
      let p = page.waitForNavigation({ waitUntil: 'networkidle0' });
      ClickElement(page, GetSelector("dashborad/menu/post"));
      await p;
    }
  },
  pages: async (page: Page) => {
    if (!page.url().includes(Urls.listPage)) {
      await NavigateTo(page, "dashboard");
      let p = page.waitForNavigation({ waitUntil: 'networkidle0' });
      ClickElement(page, GetSelector("dashborad/menu/page"));
      await p;
    }
  },
  "create page": async (page: Page) => {
    if (page.url().includes(Urls.listPage)) {
      await ClickElement(page, GetSelector("page/list/new"));
    } else {
      throw new Error("Not on page list page");
    }
  },
  "create post": async (page: Page) => {
    if (page.url().includes(Urls["post/list"])) {
      await ClickElement(page, GetSelector("post/list/new"));
    } else {
      throw new Error("Not on posts list page");
    }
  },
  "edit post": async (page: Page, title: string) => {
    if (page.url().includes(Urls["post/list"])) {
      await ClickElement(page, GetSelector("post/list/title"), title);
    } else {
      throw new Error("Not on posts list page");
    }
  },
  member: async (page: Page) => {
    if (!page.url().includes(Urls.membersList)) {
      await NavigateTo(page, "dashboard");
      let p = page.waitForNavigation({ waitUntil: 'networkidle0' });
      ClickElement(page, GetSelector("dashborad/menu/member"));
      await p;
    }
  },
  "create member": async (page: Page) => {
    if (page.url().includes(Urls.membersList)) {
      await ClickElement(page, GetSelector("member/list/new"));
    } else {
      throw new Error("Not on members list page");
    }
  },
  "edit member": async (page: Page, email: string) => {
    if (page.url().includes(Urls.membersList)) {
      await ClickElement(page, GetSelector("member/list/email"), email);
    } else {
      throw new Error("Not on members list page");
    }
  },
  dashboard: async (page: Page) => {
    let url = page.url();
    if (url.includes(Urls.dashboard)) {
      return;
    } else {
      await page.goto(Urls.dashboard, { waitUntil: 'networkidle0' });
    }
  },
  "create tag": async (page: Page) => {
    await page.goto(Urls["tag/new"], { waitUntil: 'networkidle0' });
  },
  "internal tags": async (page: Page) => {
    await page.goto(Urls["tag/internal-list"], { waitUntil: 'networkidle0' });
  }
} as const

async function NavigateTo(page: Page, name: string, additional?: string) {
  let target = Navigators[name];
  if (!target) {
    throw new Error(`Unknown section name: ${name}`);
  } else {
    return target(page, additional);
  }
}

Given('I login', async function (this: KrakenWorld,) {
  return await Login(this.page);
});

When('I go back', async function (this: KrakenWorld,) {
  return this.driver.back();
})

When(/I (?:navigate|go) to the "(.*?)" functionality(?:$|.*?"(.*?)")/, async function (this: KrakenWorld, name: string, additional?: string) {
  await NavigateTo(this.page, name, additional);
});

When(/I (fill|set) the ("(.*)?") ("(.*)?") to ("(.*)?")/, async function (this: KrakenWorld, verb: string, scope: string, selectorName: string, value: string) {
  let special = ['label', 'search']
  let key = scope.replace(' ', '/') + '/fill/' + selectorName;
  let selector = GetSelector(key)
  let focus = special.includes(selectorName);
  // Wait for the query to be in the url
  let p = FillElement(this.page, selector, value, verb === 'set', focus);
  if (focus) {
    // Wait for the typing to be done, and then press enter
    await p;
    await this.page.keyboard.press('Enter');
  }
  if (scope === 'post' || selectorName === 'title') {
    // Last post title
    this.cookie.posts.last.title = ValueTransform(value);
  }
  await p;
});

When('I create the post with title {string} and paragraph {string}', async function (this: KrakenWorld, string: string, string2: string) {
  // Get the only textarea
  const textarea = await this.page.$('textarea');

  if (!textarea) {
    throw new Error('No textarea found');
  }

  // Fill the title
  await textarea?.type(string);

  // Press the enter key to go to the next field
  await this.page.keyboard.press('Enter');

  // Fill the text inside the current cursor area
  await this.page.keyboard.type(string2);

  await this.page.waitForTimeout(1000);
});

async function findButtonForce(page: Page, expectedText: string) {
  const allButtons = await page.$$('button');

  for (const currentButton of allButtons) {
    const buttonText = await currentButton.$('span');
    if (buttonText) {
      let text = await page.evaluate(element => element.innerText, buttonText);
      text = text.trim();

      if (text === expectedText) {
        return currentButton;
      }
    }
  }

  throw new Error(`Couldn't find the button with text ${expectedText}`);
}

async function newPublishEntry(page: Page, entryType: "post" | "page") {
  const publishButton = await findButtonForce(page, "Publish");

  publishButton.click();

  await page.waitForTimeout(1000);

  const continueButton = await findButtonForce(
    page,
    "Continue, final review →"
  );

  continueButton.click();

  await page.waitForTimeout(1000);

  const finalPublishButton = await findButtonForce(
    page,
    `Publish ${entryType}, right now`
  );

  finalPublishButton.click();

  await page.waitForTimeout(1000);

  const closeAlertButton = await findButtonForce(page, "Close");

  closeAlertButton.click();
  //se sustituye el scape por un click en el botón de cerrado para evitar errores
  //await page.keyboard.press("Escape");
}

async function oldPublishEntry(page: Page, entryType: "post" | "page") {
  //  return this.page.locator(".gh-publishmenu");
  const publishMenu = await page.$(".gh-publishmenu");

  if (!publishMenu) {
    throw new Error("Publish menu not found");
  }

  await publishMenu.click();

  await page.waitForTimeout(1000);

  const publishButton = await findButtonForce(page, "Publish");

  publishButton.click();
}

When("I save the {string}", async function (this: KrakenWorld, string: string) {
  if (VERSION === "5.96.0") {
    newPublishEntry(this.page, string as "post" | "page");
  } else {
    oldPublishEntry(this.page, string as "post" | "page");
  }
})

When("I should see the {string} in that order sorted in the current page", async function (this: KrakenWorld, words: string) {
  const rows = await this.page.$$('.gh-posts-list-item');
  const items = words.split(',');

  items.forEach(async (row, index) => {
    const currentRow = rows[index];

    if (!currentRow) {
      throw new Error(`Expected ${row} but got nothing`);
    }

    const text = await this.page.evaluate(element => element.innerText.trim(), currentRow);

    if (!text.includes(row.trim())) {
      throw new Error(`Expected "${row}" but got "${text}"`);
    }
  })
})

When("I should see the number of members in the dashboard", async function (this: KrakenWorld) {
  const innerText = await this.page.evaluate(() => document.body.innerText);

  if (!innerText) {
    throw new Error(`There is no text in the current page`);
  }

  if (!innerText.includes(numberOfMembers.toString())) {
    throw new Error(`The number of members is not correct`);
  }
});

When("I record the number of members currently", async function (this: KrakenWorld) {
  // Wait for the <th> elements to be available
  await this.page.waitForSelector('th');

  // Grab all <th> elements on the page
  const ths = await this.page.$$('th');

  // Loop through each <th> element
  for (let th of ths) {
    // Get the inner text of the <th> element
    const thText = await this.page.evaluate(element => element.innerText.trim(), th);

    // Check if the <th> text contains 'Members'
    if (thText.includes('MEMBERS')) {
      // Extract the number from the first part of the text (assuming it's the first word)
      const thTextSplitted = thText.split(' ')[0];
      const numberOfMembers = parseInt(thTextSplitted, 10);

      // Return the number (you could save it in a context or do something with it)
      return numberOfMembers;
    }
  }

  // If no element with 'Members' was found, throw an error
  throw new Error('No members found');
});


When('I {string} the {string}', async function (this: KrakenWorld, action: string, scope: string) {
  let selector = GetSelector(scope + '/action/' + action)
  if (typeof selector === 'string') {
    await ClickElement(this.page, selector);
  } else if (typeof selector === 'function') {
  }
});

When('I delete the {string}', async function (this: KrakenWorld, scope: string) {
  if (scope === 'member') {
    // Press the action button first
    await ClickElement(this.page, GetSelector("member/action/actions"));
    // Press the delete button now
    await ClickElement(this.page, GetSelector("member/action/actions/delete"));
    let p = this.page.waitForNavigation({ waitUntil: 'networkidle0' });
    // Press enter to confirm the dialog
    this.page.keyboard.press('Enter');
    await p;
  } else if (scope === 'multiple members') {
    let p = this.page.waitForNavigation({ waitUntil: 'networkidle0' });
    // TODO: Fix this timeout
    await this.page.waitForTimeout(1000);
    await ClickElement(this.page, GetSelector("member/action/list actions"));
    await ClickElement(this.page, GetSelector("member/action/list actions/delete"));
    await ClickElement(this.page, GetSelector("member/action/list actions/delete confirm"));
    await ClickElement(this.page, GetSelector("member/action/list actions/delete confirm close"));
    await p;
  } else {
    throw new Error(`The given scope: ${scope} is not supported`);
  }
});

When('I create a new page called {string}', async function (this: KrakenWorld, name: string) {

  await ClickElement(this.page, GetSelector("pages/new page"));
  await FillElement(this.page, "//textarea[@placeholder='Page title']", name, true, true);
  await FillElement(this.page, "//div[@class='kg-prose']", faker.lorem.paragraph(2), true, true);
  await ClickElement(this.page, "//button//span[text()='Publish']");
  await ClickElement(this.page, "//div[@class='gh-publish-cta']");
  await ClickElement(this.page, "//button[@data-test-button='confirm-publish']");
  await this.page.waitForTimeout(1000);
  await ClickElement(this.page, "//button[@class='close']");


});

When('I open {string} page to edit', async function (this: KrakenWorld, name: string) {

  await this.page.waitForTimeout(500);
  let selector = "//h3[text()='" + name + "']";
  await ClickElement(this.page, selector);
  await this.page.waitForTimeout(1000);

});

Then('I should see the {string} in the current page', async function (this: KrakenWorld, string: string) {
  const innerText = await this.page.evaluate(() => document.body.innerText);

  if (!innerText) {
    throw new Error(`There is no text in the current page`);
  }

  await this.page.waitForTimeout(1000);

  if (!innerText.includes(string)) {
    throw new Error(`The text ${string} is not in the current page`);
  }
});

//    I should   "see"  the "member"  "email" "|FAKE_EMAIL|1" in the "list"
Then('I should {string} the {string} {string} {string} in the {string}', async function (this: KrakenWorld, verb: string, scope: string, selector_key: string, value: string, view: string) {
  let hidden = verb === 'not see';
  // Find the actual selector
  let key = scope + '/' + view + '/' + selector_key;
  let selector = GetSelector(key);
  let element: ElementHandle

  // Find the element, if using "not see" then return on error from getElement this is good because
  // we are already waiting
  try {
    element = await getElement(this.page, selector, value, hidden);
    value = ValueTransform(value);
  } catch (e) {
    if (hidden) {
      return;
    }
    throw e;
  }

  // Get the element text and compare with value
  let text = await element.evaluate(element => element.textContent);
  if (text === null) {
    throw new Error(`Element ${selector} text content is null`);
  }
  if (!(value === text || value === text.trim())) {
    throw new Error(`Expected ${value} but got ${text.trim()}`);
  }
})

Then('I should see member saving failed', async function (this: KrakenWorld,) {
  let selector = GetSelector("member/see/save-retry");
  let element = await getElement(this.page, selector);
  if (element === null) throw new Error(`Couldn't find element with selector ${selector}`);
})

Then('page {string} should exists', async function (this: KrakenWorld, name: string) {

  let url = Urls.main + "/" + name + "/";
  let response = await this.page.goto(url, { waitUntil: 'networkidle0' });

  if (!response.ok()) {
    throw new Error(`La página ${url} no existe. Estado: ${response.status()}`);
  }

})

Then('I should find a {string} element with {string} text', async function (this: KrakenWorld, element: string, text: string) {

  let elemSelected = "";
  let selector = ""

  if (element == "title") {
    elemSelected = "h3";
    selector = "//" + elemSelected + "[text()='" + text + "']";
  } else if (element == "button") {
    elemSelected = "button";
    selector = "//button//span[text()='" + text + "']";
  };

  let elementExists = await this.page.waitForXPath(selector, { timeout: 1000 })
    .then(() => true)
    .catch(() => false);

  if (!elementExists) {
    throw new Error(`El elemento descrito con selector: ${selector}no se encuentra en la página`);
  }

})

When('I enter tag name {string}', async function (this: KrakenWorld, name: string) {
  await FillElement(this.page, 'input[name="name"]', name, true);
});

When('I save the tag', async function (this: KrakenWorld) {
  await ClickElement(this.page, GetSelector("tag/action/save"));
});

When('I enter tag {string} with {int} characters', async function (this: KrakenWorld, field: string, numberOfCharacters: number) {
  var name = faker.string.alpha({ length: numberOfCharacters });
  if (field === 'slug') {
    await FillElement(this.page, 'input[name="slug"]', name, true);
  }
  if (field === 'description') {
    await FillElement(this.page, 'textarea[name="description"]', name, true);
  }
});

Then('I should see tag saving {string}', async function (this: KrakenWorld, status: string) {
  if (status.includes('success')) {
    let saveButton = await getElement(this.page, GetSelector("tag/action/saved"));
    let text = await saveButton.evaluate(element => element.textContent);
    if (!text?.includes('Saved')) {
      throw new Error(`Element ${saveButton} text content is null`);
    }
  }
  if (status === 'error') {
    let saveButton = await getElement(this.page, GetSelector("tag/action/retry save"));
    let text = await saveButton.evaluate(element => element.textContent);
    if (!text?.includes('Retry')) {
      throw new Error(`Element ${saveButton} text content is null`);
    }
  }
});

Then('I should see the tag {string} saved', async function (this: KrakenWorld, internalTagName: string) {
  const internalTag = await getElement(this.page, `[href="#/tags/hash-${internalTagName}/"]`);
  if (internalTag === null) throw new Error(`Couldn't find element with selector ${internalTag}`);
  if ((internalTag === null)) {
    throw new Error(`Element ${internalTag} is null`);
  }
});