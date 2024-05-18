// https://www.tiktok.com/@gnublet/video/7195849224968244523

import { Page } from "playwright";
import { getAuthenticatedPage } from "./login";

async function postTweet(page: Page, text: string) {
  // open twitter
  await page.goto("https://x.com/home");

  // click away the cookie banner
  await page.click("//span[contains(text(), 'Refuse non-essential cookies')]");

  // click tweet
  await page.click("a[href='/compose/post']");

  // type tweet
  await page.fill(
    "//div[@data-viewportview='true']//div[@class='DraftEditor-editorContainer']/div[@role='textbox']",
    text
  );

  // click post
  await page.click("//span[contains(text(), 'Post')]");

  // wait for tweet
  await page.waitForURL("https://x.com/home");

  // simulate scrolling
  await page.waitForTimeout(r(1000, 2500));

  await page.mouse.wheel(0, r(100, 500));
  await page.waitForTimeout(r(1000, 2500));
  await page.mouse.wheel(0, r(100, 500));

  await page.close();
}

function r(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function tweet(text: string) {
  const { page, close } = await getAuthenticatedPage();

  console.log("Posting tweet...");
  await postTweet(page, text);
  await close();

  console.log("Done!");
}
