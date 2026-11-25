# Changelog

Les évolutions notables du site. Le format s'inspire de
[Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) ; le site n'a pas de numéro de version,
un push sur `main` le publie — les entrées sont datées. Une section par publication, à la date de la
poussée sur `main` ; ce qui attend sur une branche va sous un `[Non publié]` en tête, ouvert à ce
moment-là.

## 2026-11-25

### Ajouté

- **Les règles de la communauté** (`/communaute`), pour la 7.0 de l'application : ce qui se publie
  (signalements d'une liste fermée, votes, retours), ce qui est interdit, comment la communauté se
  corrige et comment la modération travaille (attestation de l'appareil, plafonds, réputation, retrait,
  blocage d'une clé, sans valeurs chiffrées), comment signaler un abus et contester une décision, ce
  que l'association fait et ne fait pas, et le renvoi au règlement sur les services numériques et à la
  politique de confidentialité. L'application l'ouvre depuis le rappel des règles.
- **La page « Mets à jour UKit pour nous écrire »** (`/mets-a-jour`) : le formulaire de retour de
  l'application devient natif à la 7.0, et les versions d'avant ouvriront cette page à la bascule, quand
  la 7.0 sera sur les deux stores. Les deux stores, et « écrire quand même » vers l'ancien formulaire.
  Hors de l'index des moteurs ; aucune page ne la cite encore.

## 2026-11-18

La refonte, publiée par la poussée de `88517e9`.

### Ajouté

- **Les mentions légales** (`/mentions-legales.html`) et **la page Confidentialité**
  (`/confidentialite.html`), 2026-11-16 : l'association KAE Lab comme éditeur (RNA, SIREN, siège), le
  directeur de la publication, l'hébergeur, les licences et les marques ; ce que le site fait de tes
  données, et le renvoi vers la politique de l'application.
- **Une page introuvable** (`/404.html`), 2026-11-16 : sans elle, Cloudflare Pages rendait l'accueil à
  toute adresse inconnue.

### Modifié

- **Des iPhone réalistes, et un code QR discret**, 2026-11-18 : les téléphones deviennent des
  iPhone 13 Pro de face, à leurs cotes réelles (cadre d'acier, bordure, encoche, boutons), et leurs
  écrans sont pris au format de l'iPhone, avec la barre d'état d'iOS et la barre d'accueil
  (`tools/ecrans.py`). Le code QR, qui faisait une tache blanche sur le fond sombre, se replie sous
  une rangée et n'apparaît qu'au clic, jamais sur un écran tactile.
- **Le site prend le style de l'application**, 2026-11-16 et 17, et non celui de l'Épure, l'identité
  des supports de communication, essayée le 16 (`568ef74`) et quittée le soir même : une personne qui passe du site
  à l'application ne doit pas changer d'univers. Le vocabulaire du premier écran de son
  accueil (fond sombre et sa lueur, vraies cartes de l'appli, titre en deux tons, bouton plein) dans
  une composition propre au site, avec les couleurs du thème sombre, les icônes Lucide neutres et la
  police de l'application. L'accueil devient une fiche produit, au ton impersonnel : un module par
  onglet (Planning, Campus, Scolarité), chacun avec sa teinte d'onglet, ses trois signaux sur une
  carte et son détail en groupe des Réglages, relevés sur l'application 6.3.1 au banc Android, puis
  la fiche technique (prix, plateformes, langues, établissements, code) et les
  stores, sur cinq captures de l'application 6.3 en thème sombre. Les pages de lecture prennent la
  même forme. L'image Open Graph est refaite ; le badge App Store est la version française
  officielle.

### Retiré

- 2026-11-16 : Tailwind et les particules (`tailwindcss`, `@tailwindcss/vite`, `@tsparticles/engine`,
  `@tsparticles/slim`), les modales de l'accueil, tout le JavaScript de l'accueil (`src/main.js`,
  `src/fond.js`), et les sept vidéos et la capture de l'ancienne interface (36 Mo).

## 2026-09-07

### Ajouté

- **La page d'engagement du chantier campus** (`/engagement.html`) : ce qu'on demande, ce qu'on en
  fait et ce qu'on ne fera jamais quand quelqu'un prête un accès à son portail pour que UKit s'adapte
  à son campus. Citée par le formulaire de retours de l'application ; sa méthode côté équipe est dans
  le dépôt de l'application (`docs/adaptation-campus.md`).
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
