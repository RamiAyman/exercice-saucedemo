import { test, expect } from '@playwright/test';

test.describe('Suite de tests E2E - Swag Labs', () => {
// Isolation du contexte : On garantit que chaque test démarre sur une page propre
  test.beforeEach(async ({ page }) => {
    // On part de la page d'accueil avant chaque test
    await page.goto('/');
  });

  test('TC-01 : Achat complet d\'un article (Happy Path)', async ({ page }) => {
    // Utilisation de locators basés sur data-test pour la robustesse face aux changements d'UI
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.click('[data-test="login-button"]');

    // Enchaînement des actions métier critiques
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');

    // Simulation d'une saisie utilisateur réelle
    await page.locator('[data-test="firstName"]').fill('Ayman');
    await page.locator('[data-test="lastName"]').fill('Rami');
    await page.locator('[data-test="postalCode"]').fill('75000');
    await page.click('[data-test="continue"]');
    await page.click('[data-test="finish"]');

    // Assertion finale sur le succès de la transaction
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

  test('TC-02 : Erreur de connexion avec utilisateur bloqué', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.click('[data-test="login-button"]');

    // Validation de la gestion des erreurs et de la sécurité périmétrique
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Sorry, this user has been locked out.');
  });

  test('TC-03 : Vérifier le tri par prix décroissant (High to Low)', async ({ page }) => {
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.click('[data-test="login-button"]');

  // Sélection du filtre
  await page.selectOption('.product_sort_container', 'hilo');

  // Vérification du premier et dernier prix
  const prices = await page.locator('.inventory_item_price').allInnerTexts();
  // On convertit les strings "$29.99" en nombres pour une comparaison mathématique fiable
  const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
  // Logique de validation algorithmique : le premier doit être >= au dernier
  expect(numericPrices[0]).toBeGreaterThanOrEqual(numericPrices[numericPrices.length - 1]);
});

test('TC-04 : Ajouter puis supprimer un article du panier', async ({ page }) => {
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.click('[data-test="login-button"]');

  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  await page.click('[data-test="remove-sauce-labs-backpack"]');
  await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
});
test('TC-05 : Vérifier la robustesse face aux délais (Performance Glitch)', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('performance_glitch_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.click('[data-test="login-button"]');

    // On vérifie que les produits finissent par s'afficher malgré la lenteur
    // Gestion proactive de la latence réseau (Sonde de santé infra)
    const inventoryList = page.locator('.inventory_list');

    // On augmente le timeout à 10s pour valider la résilience du script
    await expect(inventoryList).toBeVisible({ timeout: 10000 }); // On attend jusqu'à 10s
    
    await expect(page).toHaveURL(/inventory.html/);
  });
});