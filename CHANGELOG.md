# Changelog

Les évolutions notables du site. Le format s'inspire de
[Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) ; le site n'a pas de numéro de version,
un push sur `main` le publie — les entrées sont datées.

## [Non publié]

### Ajouté

- **Les mentions légales** (`/mentions-legales.html`) et **la page Confidentialité**
  (`/confidentialite.html`), 2026-11-16 : l'association KAE Lab comme éditeur (RNA, SIREN, siège), le
  directeur de la publication, l'hébergeur, les licences et les marques ; ce que le site fait de tes
  données, et le renvoi vers la politique de l'application.
- **Une page introuvable** (`/404.html`), 2026-11-16 : sans elle, Cloudflare Pages rendait l'accueil à
  toute adresse inconnue.

- **La page d'engagement du chantier campus** (`/engagement.html`), 2026-09-07 : ce qu'on demande,
  ce qu'on en fait et ce qu'on ne fera jamais quand quelqu'un prête un accès à son portail pour que
  UKit s'adapte à son campus. Citée par le formulaire de retours de l'application ; sa méthode côté
  équipe est dans le dépôt de l'application (`docs/adaptation-campus.md`).
- **Le socle documentaire et l'outillage** du dépôt, au niveau de celui de l'application : README,
  CONTRIBUTING, ce CHANGELOG, `.nvmrc` et `engines`, `.env.example`, ESLint, commitlint par un hook,
  et une vérification (lint et build) à chaque poussée.

### Modifié

- **Le site prend le style de l'application**, 2026-11-16 : le vocabulaire du premier écran de son
  accueil (fond sombre et sa lueur, vraies cartes de l'appli, titre en deux tons, bouton plein) dans
  une composition propre au site, avec les couleurs du thème sombre, les icônes et la police de
  l'application. L'accueil vend l'appli onglet par onglet : le Planning, le Campus (restos U,
  bibliothèques, salles libres), la Scolarité, puis les atouts, les quatre établissements et les
  stores, sur cinq captures de l'application 6.3 en thème sombre. Les pages de lecture prennent la
  même forme. L'image Open Graph est refaite ; le badge App Store est la version française
  officielle ; le texte tutoie partout, comme l'application.

- **Le fond est extrait dans `src/fond.js`** (feuille de style et particules) : une page secondaire
  ne charge plus `main.js`, qui attend les éléments de l'accueil et échouait sur la page de
  téléchargement — l'erreur était silencieuse, et interrompait le module à mi-chemin.
- **Les liens pointent le bon dépôt** : `KAE-Lab/UKit` au lieu d'un fork, et `main` au lieu de
  `master` pour la politique de confidentialité. Le bouton de téléchargement de l'accueil ouvre les
  vrais stores, au lieu d'un APK de fork et d'un identifiant App Store factice.

### Retiré

- 2026-11-16 : Tailwind et les particules (`tailwindcss`, `@tailwindcss/vite`, `@tsparticles/engine`,
  `@tsparticles/slim`), les modales de l'accueil, tout le JavaScript de l'accueil (`src/main.js`,
  `src/fond.js`), et les sept vidéos et la capture de l'ancienne interface (36 Mo).

- Quatre dépendances jamais importées (`three`, `tsparticles`, `@tsparticles/shape-rounded-rect`,
  `postcss`/`autoprefixer` sans configuration), et les restes du gabarit Vite (`counter.js`, les
  deux SVG).
