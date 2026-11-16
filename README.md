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
| L'accueil | `/` | présenter l'application : l'ouverture (slogan, stores) et cinq fiches autour d'un téléphone épinglé, chaque capture annotée ; puis l'appli en chiffres, son histoire en frise, et le téléchargement |
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
  style.css            l'Épure : polices, tokens, cadre, sections de l'accueil, pages de lecture — chaque page la charge
  main.js              l'accueil : le kit, la frise, et le sommaire qui marque la section lue
  accueil/
    kit.js             le téléphone épinglé et ses annotations ; les repères numérotés sur téléphone
    histoire.js        la frise à l'échelle vraie, son détail de 2026 et la date du jour
public/
  epure/               le logo en verre, copié du kit de l'application
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

## Le style : l'Épure, en appui

Le site présente l'application ; l'Épure, l'identité de UKit née pour les slides de Disrupt Campus
([docs/identite.md](https://github.com/KAE-Lab/UKit/blob/main/docs/identite.md)), en est l'appui, pas
le sujet. Ce qu'il en garde :

- **le sombre, Geist et Geist Mono, les deux tons** : l'essentiel en encre, les mots de liaison en
  estompe ;
- **les annotations fines** sur les captures : une ligne de rappel, un nœud sur l'élément, une
  étiquette en chasse fixe. Elles pointent ce qui est vraiment à l'écran : leurs ancres sont relevées
  sur l'arbre d'écran de l'application au moment de la capture, au bout d'une ligne de texte pour que
  le rappel coure dans la partie vide de la rangée ;
- **les stations sur un filet** pour les chiffres, la **frise à l'échelle** pour l'histoire (avec le
  détail agrandi de 2026 et la date du visiteur), le **cartouche** pour le téléchargement.

Sur ordinateur, le téléphone reste épinglé pendant que les fiches défilent ; sous 1024 px, chaque fiche
porte son écran, des repères numérotés et leur liste, et la frise devient verticale. Les mesures
suivent l'unité `--u`, un pixel d'une surface de 1920 mis à l'échelle de l'écran. Le mouvement
respecte `prefers-reduced-motion`. **Sombre seulement**, comme l'Épure, qui n'existe pas encore en
clair.

**Les captures se refont sur le banc Android** de l'application (`tools/appareil/banc.sh`, AVD `ukit`,
thème sombre), barre d'état rognée, avec l'arbre d'écran (`android layout --flat`) pour placer les
annotations. Rien de personnel : ni compte universitaire connecté, ni visage identifiable ; les noms
des enseignants du planning sont caviardés, et l'annotation le dit. La Scolarité n'est pas reproduite,
puisqu'elle affiche un dossier.

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
