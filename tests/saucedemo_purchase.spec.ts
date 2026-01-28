import { test, expect } from '@playwright/test';

test.describe('Suite de tests E2E - Swag Labs', () => {

  test.beforeEach(async ({ page }) => {
    // On part de la page d'accueil avant chaque test
    await page.goto('/');
  });

  test('TC-01 : Achat complet d\'un article (Happy Path)', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.click('[data-test="login-button"]');

    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');

    await page.locator('[data-test="firstName"]').fill('Ayman');
    await page.locator('[data-test="lastName"]').fill('Rami');
    await page.locator('[data-test="postalCode"]').fill('75000');
    await page.click('[data-test="continue"]');
    await page.click('[data-test="finish"]');

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('TC-02 : Erreur de connexion avec utilisateur bloqué', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.click('[data-test="login-button"]');

    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Sorry, this user has been locked out.');
  });
});