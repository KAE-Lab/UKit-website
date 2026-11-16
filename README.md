<p align="center">
  <img src="public/epure/logo-verre.svg" alt="UKit" width="240" />
</p>

<p align="center"><strong>Le site de UKit — <a href="https://ukit-bordeaux.fr">ukit-bordeaux.fr</a></strong></p>

> La vitrine de l'application, sa page de téléchargement, et la page d'engagement du chantier campus.
> L'application elle-même vit dans [KAE-Lab/UKit](https://github.com/KAE-Lab/UKit).

## Ce que le site est

Quelques pages statiques, et rien derrière : pas de serveur, pas de base, pas de compte, pas de
cookie ni de mesure d'audience. Ce qu'il dit de l'application est ce que le
[README de UKit](https://github.com/KAE-Lab/UKit#readme) dit, en moins de mots.

| Page | Adresse | Ce qu'elle fait |
|---|---|---|
| L'accueil | `/` | présenter l'application : l'ouverture de l'Épure (le logo en verre, Fig. 01, trois faits), quatre captures, le téléchargement |
| Télécharger | `/download.html` | rediriger vers le store du téléphone qui l'ouvre ; sur un ordinateur, montrer les deux badges et le QR code |
| Engagement | `/engagement.html` | ce qu'on demande, ce qu'on en fait et ce qu'on ne fera jamais, quand quelqu'un prête un accès à son portail pour que UKit s'adapte à son campus ([docs/adaptation-campus.md](https://github.com/KAE-Lab/UKit/blob/main/docs/adaptation-campus.md), côté équipe) |
| Page introuvable | `/404.html` | servie par Cloudflare Pages pour toute adresse inconnue |

La page d'engagement est **citée par le formulaire de retours** de l'application : son adresse ne
change pas sans changer le formulaire.

## Structure

```text
index.html             l'accueil
download.html          la page de téléchargement
engagement.html        la page d'engagement du chantier campus
404.html               la page introuvable
src/
  style.css            l'Épure : polices, tokens, cadre, planche, horizon, pages de lecture — chaque page la charge
  main.js              l'accueil : la fiche typographique du slogan, qui dit la taille rendue
public/
  epure/               le logo en verre et Fig. 01, copiés du kit de l'application
  captures/            quatre captures de l'application 6.3, thème sombre, banc Android (1080 × 2400 réduites à 720)
  polices/             Geist et Geist Mono en woff2, réduites au latin
  licences/            les licences des polices (OFL) et des icônes (ISC)
  …                    icône, logo PNG du README, badges des stores, QR code, image Open Graph
vite.config.js         une entrée par page
eslint.config.js       les règles recommandées, et c'est tout
.env.production        VITE_SITE_URL, l'adresse publique — versionnée, ce n'est pas un secret
```

La pile : [Vite](https://vite.dev) 7 et [Tailwind CSS](https://tailwindcss.com) 4 par son greffon
Vite, pour sa remise à zéro et ses tokens. Pas de framework : quelques pages ne le justifient pas.

## Le style : l'Épure

Le site porte l'Épure, l'identité de UKit née pour les slides de Disrupt Campus : ses règles, sa palette
et ses mesures sont dans [docs/identite.md](https://github.com/KAE-Lab/UKit/blob/main/docs/identite.md),
et le kit qui la produit dans `tools/epure/` du dépôt de l'application. Ce qui en découle ici :

- **Sur ordinateur, l'ouverture de l'accueil est la slide 1, à l'échelle de l'écran.** Chaque élément
  y est placé en coordonnées de la slide (`--x`, `--y` en pixels d'une surface de 1920), multipliées
  par l'unité `--u`, qui vaut `100cqw / 1920`. Les traces (cotes, angles, lignes de pied) sont le SVG
  de la slide, tel quel. Sous 1024 px, les mêmes éléments se recomposent en colonne et les traces
  fines disparaissent.
- **Une trace dit une vérité** : les cotes portent les mesures du logo, et la fiche du slogan
  (`geist 560 · 66 / 72`) est réécrite par `main.js` avec la taille réellement rendue.
- **Sombre seulement**, comme l'Épure, qui n'existe pas encore en clair.
- **Les captures se refont sur le banc Android** de l'application (`tools/appareil/banc.sh`, AVD
  `ukit`, thème sombre, barre d'état en mode démo), sans visage identifiable ni donnée personnelle :
  ni compte universitaire connecté, ni nom d'enseignant.

## Développement

Prérequis : Node.js 22 (`.nvmrc` ; 20.19 minimum) et npm.

```bash
npm install
npm run dev          # http://localhost:5173/
npm run lint         # ESLint
npm run build        # dist/, les trois pages
npm run preview      # servir dist/ comme en production
```

`VITE_SITE_URL` sert aux balises Open Graph (`%VITE_SITE_URL%` dans le HTML). `.env.example` donne
la valeur de développement ; `.env.production` porte l'adresse publique et **est versionné** : c'est
une adresse, pas un secret.

## Déploiement

**Un push sur `main` publie le site**, par **Cloudflare Pages** branché sur ce dépôt : commande
`npm run build`, dossier `dist`, Node lu dans `.nvmrc`. La branche de production se règle dans le
projet Pages (*Settings → Builds & deployments*) : c'est elle qu'il a fallu repasser de `master` à
`main` le 2026-09-07, après le renommage — sans ça, Cloudflare garde le dernier déploiement en
silence. Les pages se servent aussi sans leur extension (`/engagement` et `/engagement.html` sont la
même page). Avant de pousser : `npm run lint` et `npm run build` verts, et la page relue dans le
navigateur — la définition de « terminé » est dans [CONTRIBUTING.md](CONTRIBUTING.md).

## Ce qui n'est pas ici

- **La politique de confidentialité de l'application** reste dans son dépôt :
  [PRIVACY.md](https://github.com/KAE-Lab/UKit/blob/main/PRIVACY.md).
- **Un thème clair** : l'Épure n'en a pas encore.

## Licence

Apache 2.0, comme l'application. Le site est un fork de [kb-dev/UKit](https://github.com/kb-dev/UKit)
pour son origine ; il est maintenu par [KAE Lab](https://github.com/KAE-Lab).
