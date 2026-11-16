<p align="center">
  <img src="public/epure/logo-verre.svg" alt="UKit" width="240" />
</p>

<p align="center"><strong>Le site de UKit — <a href="https://ukit-bordeaux.fr">ukit-bordeaux.fr</a></strong></p>

> La vitrine de l'application, sa page de téléchargement, la page d'engagement du chantier campus,
> et les pages légales. L'application elle-même vit dans [KAE-Lab/UKit](https://github.com/KAE-Lab/UKit).

## Ce que le site est

Quelques pages statiques, et rien derrière : pas de serveur, pas de base, pas de compte, pas de
cookie ni de mesure d'audience. Ce qu'il dit de l'application est ce que le
[README de UKit](https://github.com/KAE-Lab/UKit#readme) dit, en moins de mots.

| Page | Adresse | Ce qu'elle fait |
|---|---|---|
| L'accueil | `/` | présenter l'application, en six sections lettrées comme les vues d'un plan : A l'ouverture (le logo qui se construit, sa nomenclature), B Fig. 01 (le U en écho, construit par le défilement), C le kit (cinq fiches et leurs captures annotées), D les mesures, E l'histoire (la frise à l'échelle), F le cartouche (télécharger) |
| Télécharger | `/download.html` | rediriger vers le store du téléphone qui l'ouvre ; sur un ordinateur, montrer les deux badges et le QR code |
| Engagement | `/engagement.html` | ce qu'on demande, ce qu'on en fait et ce qu'on ne fera jamais, quand quelqu'un prête un accès à son portail pour que UKit s'adapte à son campus ([docs/adaptation-campus.md](https://github.com/KAE-Lab/UKit/blob/main/docs/adaptation-campus.md), côté équipe) |
| Mentions légales | `/mentions-legales.html` | l'éditeur, l'hébergeur, les licences du code, des polices et des icônes, les marques des stores (loi n° 2004-575, art. 1-1) |
| Confidentialité | `/confidentialite.html` | ce que le site fait de tes données (rien qu'il garde), l'hébergeur, les liens sortants ; renvoie à `PRIVACY.md` pour l'application |
| Page introuvable | `/404.html` | servie par Cloudflare Pages pour toute adresse inconnue |

La page d'engagement est **citée par le formulaire de retours** de l'application : son adresse ne
change pas sans changer le formulaire.

## Structure

```text
index.html             l'accueil
download.html          la page de téléchargement
engagement.html        la page d'engagement du chantier campus
mentions-legales.html  les mentions légales
confidentialite.html   la confidentialité du site
404.html               la page introuvable
src/
  style.css            l'Épure : polices, tokens, cadre, règle, sections de l'accueil, pages de lecture — chaque page la charge
  instruments.js       la tête de toutes les pages : mesures de la fenêtre, règle graduée, sommaire, calque des traces
  page.js              les pages secondaires : les instruments, rien d'autre
  main.js              l'accueil : les instruments, puis ses quatre modules
  accueil/
    ouverture.js       le contour du verre, et la nomenclature qui allume les traces du logo
    echo.js            Fig. 01 : quarante copies du U, extrudées par le défilement, réglées par le pointeur
    kit.js             la scène épinglée du kit et ses annotations ; les repères numérotés sur téléphone
    histoire.js        la frise à l'échelle vraie, son détail de 2026 et la date du jour
public/
  epure/               le logo en verre et Fig. 01, copiés du kit de l'application
  captures/            quatre captures de l'application 6.3, thème sombre, banc Android (1080 × 2290 sans barre d'état, réduites à 720)
  polices/             Geist et Geist Mono en woff2, réduites au latin
  licences/            les licences des polices (OFL) et des icônes (ISC), liées depuis les mentions légales
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

- **Le site prolonge les slides, il ne les recopie pas.** Il en garde le vocabulaire (cadre, deux
  tons, traces à 65 %, stations sur un filet, figures légendées) et le pousse là où une slide ne va
  pas : le logo se construit au chargement, Fig. 01 se règle au pointeur et s'extrude au défilement,
  le kit est une fiche technique épinglée, l'histoire une frise à l'échelle avec son détail.
- **Une trace dit une vérité, même quand elle bouge.** Les cotes portent les mesures du logo ; la
  tête affiche la taille réelle de la fenêtre et la position de lecture ; la règle de droite gradue
  la page en pixels ; la lecture de Fig. 01 donne le décalage et l'angle de l'image affichée ; la
  frise place chaque date à l'échelle et finit au jour du visiteur ; le cartouche porte le commit du
  build. Les annotations du kit sont relevées sur l'arbre d'écran de l'application au moment de la
  capture.
- **Le calque des traces s'éteint** (bouton de la tête, ou la touche T) : le décor disparaît, le
  contenu reste. Le réglage se garde dans le navigateur.
- **Les mesures suivent l'unité `--u`**, un pixel d'une surface de 1920 (la largeur des slides) mis à
  l'échelle par `100cqw / 1920`. Sous 1024 px, les sections se recomposent en colonne : la scène du
  kit laisse place à des repères numérotés, la frise devient verticale.
- **Le mouvement est orchestré, et respecte `prefers-reduced-motion`** : en mouvement réduit, la page
  s'affiche construite, Fig. 01 a ses quarante copies et la frise est tracée.
- **Sombre seulement**, comme l'Épure, qui n'existe pas encore en clair.
- **Les captures se refont sur le banc Android** de l'application (`tools/appareil/banc.sh`, AVD
  `ukit`, thème sombre), barre d'état rognée, avec l'arbre d'écran (`android layout --flat`) pour
  placer les annotations. Rien de personnel : ni compte universitaire connecté, ni visage
  identifiable ; les noms des enseignants du planning sont caviardés, et l'annotation le dit. La
  Scolarité n'est pas reproduite, puisqu'elle affiche un dossier.

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
  [PRIVACY.md](https://github.com/KAE-Lab/UKit/blob/main/PRIVACY.md). La page Confidentialité du site
  y renvoie plutôt que de la recopier.
- **Un thème clair** : l'Épure n'en a pas encore.

## Licence

Apache 2.0, comme l'application. Le site est un fork de [kb-dev/UKit](https://github.com/kb-dev/UKit)
pour son origine ; il est maintenu par [KAE Lab](https://github.com/KAE-Lab).
