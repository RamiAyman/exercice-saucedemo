# Test Technique QA - SauceDemo

## Description
Ce projet contient des tests automatisés de bout en bout (E2E) réalisés avec **Playwright**.

## Scénarios testés
1. **Achat complet** : Connexion, ajout au panier et validation du paiement.
2. **Gestion des erreurs** : Tentative de connexion avec un utilisateur bloqué.

## Installation
1. `npm install`
2. `npx playwright install`

## Lancement des tests
- Pour lancer les tests : `npx playwright test`
- Pour voir le rapport : `npx playwright show-report`