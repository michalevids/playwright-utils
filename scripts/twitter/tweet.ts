// https://www.tiktok.com/@gnublet/video/7195849224968244523

import { Page } from "playwright";
import { getAuthenticatedPage, saveState } from "./login";
import { r } from "../utils";
import { goHome } from "./behaviors/go-home";

async function postTweet(page: Page, text: string) {
  await goHome(page);

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
  await page.waitForTimeout(r(1000, 2500));

  await simulateRandomBehaviour(page);
}

async function simulateRandomBehaviour(page: Page) {
  // simulate scrolling
  const times = r(2, 5);
  for (let i = 0; i < times; i++) {
    await page.mouse.wheel(0, r(100, 500));
    await page.waitForTimeout(r(1000, 2500));
  }
}

export async function tweet(text: string) {
  const { page, close } = await getAuthenticatedPage();

  console.log("Posting tweet...");
  await postTweet(page, text);
  await saveState(page);
  await close();

  console.log("Done!");
}
