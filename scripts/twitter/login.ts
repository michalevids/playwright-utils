// https://www.tiktok.com/@gnublet/video/7195849224968244523

import "dotenv/config";

import { chromium, devices, Page } from "playwright";

export async function doLogin(page: Page) {
  const user = process.env.TWITTER_USERNAME;
  const password = process.env.TWITTER_PASSWORD;
  if (!user || !password) {
    throw new Error(
      "You need to set the TWITTER_USER and TWITTER_PASSWORD env variables"
    );
  }

  await page.goto("https://twitter.com/i/flow/login");

  // type username
  const userInput = '//input[@autocomplete="username"]';
  await page.fill(userInput, user);

  // click next
  await page.click("//span[contains(text(), 'Next')]");

  // type password
  const passwordInput = '//input[@autocomplete="current-password"]';
  await page.fill(passwordInput, password);

  // click login
  await page.click("//span[contains(text(), 'Log in')]");

  // wait for login
  await page.waitForURL("https://x.com/home");
}

const authFile = "playwright/.auth/twitter.json";
export async function getUnauthenticatedPage() {
  const browser = await chromium.launch({
    timeout: 60000,
    headless: false,
    slowMo: 1000,
  });
  const context = await browser.newContext({
    ...devices["Desktop Chrome"],
  });
  const page = await context.newPage();

  return {
    page,
    close: async () => {
      await page.close();
      await browser.close();
    },
  };
}

export async function getAuthenticatedPage() {
  const browser = await chromium.launch({
    timeout: 60000,
    headless: false,
    slowMo: 1000,
  });
  const context = await browser.newContext({
    ...devices["Desktop Chrome"],
    storageState: authFile,
  });
  const page = await context.newPage();

  return {
    page,
    close: async () => {
      await page.close();
      await browser.close();
    },
  };
}

export async function login() {
  const { page, close } = await getUnauthenticatedPage();

  console.log("Logging in...");
  await doLogin(page);

  console.log("Saving auth...");
  await page.context().storageState({ path: authFile });

  await close();

  console.log("Done!");
}
