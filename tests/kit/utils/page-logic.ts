import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function waitForEditorLoad(page: Page) {
  await page.waitForSelector('v-line', {
    timeout: 20000,
  });
}

export async function waitForAllPagesLoad(page: Page) {
  // if filters tag is rendered, we believe all_pages is ready
  await page.waitForSelector('[data-testid="create-first-filter"]', {
    timeout: 1000,
  });
}

export async function clickNewPageButton(page: Page) {
  //FiXME: when the page is in edgeless mode, clickNewPageButton will create a new edgeless page
  const edgelessPage = page.locator('edgeless-editor');
  if (await edgelessPage.isVisible()) {
    await page.getByTestId('switch-page-mode-button').click({
      delay: 100,
    });
  }
  // fixme(himself65): if too fast, the page will crash
  await page.getByTestId('sidebar-new-page-button').click({
    delay: 100,
  });
  await expect(page.locator('.doc-title-container-empty')).toBeVisible();
  await waitForEmptyEditor(page);
}

export async function waitForEmptyEditor(page: Page) {
  await expect(page.locator('.doc-title-container-empty')).toBeVisible();
}

export function getBlockSuiteEditorTitle(page: Page) {
  return page.locator('doc-title .inline-editor').nth(0);
}

export async function type(page: Page, content: string, delay = 50) {
  await page.keyboard.type(content, { delay });
}

export const createLinkedPage = async (page: Page, pageName?: string) => {
  await page.keyboard.type('@', { delay: 50 });
  const linkedPagePopover = page.locator('.linked-doc-popover');
  await expect(linkedPagePopover).toBeVisible();
  if (pageName) {
    await type(page, pageName);
  } else {
    pageName = 'Untitled';
  }

  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Enter', { delay: 50 });
};

export async function clickPageMoreActions(page: Page) {
  return page
    .getByTestId('header')
    .getByTestId('header-dropDownButton')
    .click();
}

export const getPageOperationButton = (page: Page, id: string) => {
  return getPageItem(page, id).getByTestId('page-list-operation-button');
};

export const getPageItem = (page: Page, id: string) => {
  return page.locator(`[data-page-id="${id}"][data-testid="page-list-item"]`);
};

export const getPageByTitle = (page: Page, title: string) => {
  return page.getByTestId('page-list-item').getByText(title);
};

export const dragTo = async (page: Page, locator: Locator, target: Locator) => {
  await locator.hover();
  await page.mouse.down();
  await page.waitForTimeout(1000);
  const targetElement = await target.boundingBox();
  if (!targetElement) {
    throw new Error('target element not found');
  }
  await page.mouse.move(targetElement.x, targetElement.y);
  await target.hover();
  await page.mouse.up();
};
