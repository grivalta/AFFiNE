import { test } from '@affine-test/kit/playwright';
import { openHomePage } from '@affine-test/kit/utils/load-page';
import {
  clickNewPageButton,
  clickPageMoreActions,
  createLinkedPage,
  getBlockSuiteEditorTitle,
  getPageByTitle,
  waitForEditorLoad,
  waitForEmptyEditor,
} from '@affine-test/kit/utils/page-logic';
import { expect } from '@playwright/test';

test('Show favorite items in sidebar', async ({ page, workspace }) => {
  await openHomePage(page);
  await waitForEditorLoad(page);
  await clickNewPageButton(page);
  await getBlockSuiteEditorTitle(page).click();
  await getBlockSuiteEditorTitle(page).fill('this is a new page to favorite');
  const newPageId = page.url().split('/').reverse()[0];
  await page.getByTestId('all-pages').click();
  const cell = getPageByTitle(page, 'this is a new page to favorite');
  await expect(cell).toBeVisible();
  await cell.click();
  await clickPageMoreActions(page);

  const favoriteBtn = page.getByTestId('editor-option-menu-favorite');
  await favoriteBtn.click();
  const favoriteListItemInSidebar = page.getByTestId(
    'favourite-page-' + newPageId
  );
  expect(await favoriteListItemInSidebar.textContent()).toBe(
    'this is a new page to favorite'
  );
  const currentWorkspace = await workspace.current();

  expect(currentWorkspace.meta.flavour).toContain('local');
});

test('Show favorite reference in sidebar', async ({ page, workspace }) => {
  await openHomePage(page);
  await waitForEditorLoad(page);
  await clickNewPageButton(page);
  await getBlockSuiteEditorTitle(page).click();
  await getBlockSuiteEditorTitle(page).fill('this is a new page to favorite');

  // goes to main content
  await page.keyboard.press('Enter', { delay: 50 });

  await createLinkedPage(page, 'Another page');

  const newPageId = page.url().split('/').reverse()[0];

  await clickPageMoreActions(page);

  const favoriteBtn = page.getByTestId('editor-option-menu-favorite');
  await favoriteBtn.click();

  const favItemTestId = 'favourite-page-' + newPageId;

  const favoriteListItemInSidebar = page.getByTestId(favItemTestId);
  expect(await favoriteListItemInSidebar.textContent()).toBe(
    'this is a new page to favorite'
  );

  const collapseButton = favoriteListItemInSidebar.locator(
    '[data-testid="fav-collapsed-button"]'
  );

  await expect(collapseButton).toBeVisible();
  await collapseButton.click();
  await expect(
    page.locator('[data-type="reference-page"] >> text=Another page')
  ).toBeVisible();
  const currentWorkspace = await workspace.current();

  expect(currentWorkspace.meta.flavour).toContain('local');
});

test("Deleted page's reference will not be shown in sidebar", async ({
  page,
  workspace,
}) => {
  await openHomePage(page);
  await waitForEditorLoad(page);
  await clickNewPageButton(page);
  await getBlockSuiteEditorTitle(page).click();
  await getBlockSuiteEditorTitle(page).fill('this is a new page to favorite');

  const newPageId = page.url().split('/').reverse()[0];

  // goes to main content
  await page.keyboard.press('Enter', { delay: 50 });

  await createLinkedPage(page, 'Another page');

  await clickPageMoreActions(page);

  const favoriteBtn = page.getByTestId('editor-option-menu-favorite');
  await favoriteBtn.click();

  // goto "Another page"
  await page.locator('.affine-reference-title').click();

  await expect(
    page.locator('.doc-title-container:has-text("Another page")')
  ).toBeVisible();

  // delete the page
  await clickPageMoreActions(page);

  const deleteBtn = page.getByTestId('editor-option-menu-delete');
  await deleteBtn.click();

  // confirm delete
  await page.locator('button >> text=Delete').click();

  const favItemTestId = 'favourite-page-' + newPageId;

  const favoriteListItemInSidebar = page.getByTestId(favItemTestId);
  expect(await favoriteListItemInSidebar.textContent()).toBe(
    'this is a new page to favorite'
  );

  const collapseButton = favoriteListItemInSidebar.locator(
    '[data-testid="fav-collapsed-button"]'
  );

  expect(collapseButton).toHaveAttribute('data-disabled', 'true');
  const currentWorkspace = await workspace.current();

  expect(currentWorkspace.meta.flavour).toContain('local');
});

test('Add new favorite page via sidebar', async ({ page }) => {
  await openHomePage(page);
  await waitForEditorLoad(page);
  await clickNewPageButton(page);
  await page.getByTestId('slider-bar-add-favorite-button').first().click();
  await waitForEmptyEditor(page);

  // enter random page title
  await getBlockSuiteEditorTitle(page).fill('this is a new fav page');
  // check if the page title is shown in the favorite list
  const favItem = page.locator(
    '[data-type=favourite-list-item] >> text=this is a new fav page'
  );
  await expect(favItem).toBeVisible();
});
