# Changelog

Les évolutions notables du site. Le format s'inspire de
[Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) ; le site n'a pas de numéro de version,
un push sur `main` le publie — les entrées sont datées.

## [Non publié]

### Ajouté

- **La page d'engagement du chantier campus** (`/engagement.html`), 2026-09-07 : ce qu'on demande,
  ce qu'on en fait et ce qu'on ne fera jamais quand quelqu'un prête un accès à son portail pour que
  UKit s'adapte à son campus. Citée par le formulaire de retours de l'application ; sa méthode côté
  équipe est dans le dépôt de l'application (`docs/adaptation-campus.md`).
- **Le socle documentaire et l'outillage** du dépôt, au niveau de celui de l'application : README,
  CONTRIBUTING, ce CHANGELOG, `.nvmrc` et `engines`, `.env.example`, ESLint, commitlint par un hook,
  et une vérification (lint et build) à chaque poussée.

### Modifié

- **Le fond est extrait dans `src/fond.js`** (feuille de style et particules) : une page secondaire
  ne charge plus `main.js`, qui attend les éléments de l'accueil et échouait sur la page de
  téléchargement — l'erreur était silencieuse, et interrompait le module à mi-chemin.
- **Les liens pointent le bon dépôt** : `KAE-Lab/UKit` au lieu d'un fork, et `main` au lieu de
  `master` pour la politique de confidentialité. Le bouton de téléchargement de l'accueil ouvre les
  vrais stores, au lieu d'un APK de fork et d'un identifiant App Store factice.

### Retiré

- Quatre dépendances jamais importées (`three`, `tsparticles`, `@tsparticles/shape-rounded-rect`,
  `postcss`/`autoprefixer` sans configuration), et les restes du gabarit Vite (`counter.js`, les
  deux SVG).
