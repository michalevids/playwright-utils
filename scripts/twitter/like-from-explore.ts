/**
 * Goes Home
 * Clicks on Explore
 * Types the given text in the search bar
 * Likes a random number of posts
 */

import { Page } from "playwright-core";
import { goExplore } from "./behaviors/go-explore";
import { getAuthenticatedPage, saveState } from "./login";
import { waitSecs } from "./behaviors/wait-secs";
import { r } from "../utils";
import { scrollDown } from "./behaviors/scroll-down";

export async function likeFromExplore(query: string) {
  const { page, close } = await getAuthenticatedPage();

  await goExplore(page);
  await executeSearch(page, query);
  await likePosts(page);
  await waitSecs(page);
  await scrollDown(page);
  await saveState(page);
  await close();
  console.log("Done!");
}

async function executeSearch(page: Page, query: string) {
  console.log("Searching for", query);
  const searchInput = page.locator("input[aria-label='Search query']");

  await searchInput.waitFor();
  await waitSecs(page);

  await searchInput.click();
  await searchInput.fill(query);
  await page.waitForTimeout(250);
  await searchInput.press("Enter");
}

async function likePosts(page: Page) {
  const postsToLike = r(5, 10);
  console.log(`Liking ${postsToLike} posts...`);
  let likedPosts = 0;
  while (likedPosts < postsToLike) {
    const likeButtons = page.locator("button[aria-label$='Like']");
    const list = await likeButtons.all();
    console.log(`Found ${list.length} posts to like...`);
    for (const button of list) {
      if (likedPosts >= postsToLike) {
        break;
      }
      try {
        await button.click({ timeout: 1000 });
        likedPosts++;
        console.log(`Liked ${likedPosts}/${postsToLike} posts`);
        await page.waitForTimeout(r(600, 900));
      } catch (e) {
        // ignore if not found
      }
    }

    if (list.length < postsToLike - likedPosts) {
      console.log("Scrolling down to find more posts...");
      await scrollDown(page);
    }
  }
}
