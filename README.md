<p align="center">
  <img src="public/logo.png" alt="UKit" width="240" />
</p>

<p align="center"><strong>Le site de UKit — <a href="https://ukit-bordeaux.fr">ukit-bordeaux.fr</a></strong></p>

> La vitrine de l'application, sa page de téléchargement, et la page d'engagement du chantier campus.
> L'application elle-même vit dans [KAE-Lab/UKit](https://github.com/KAE-Lab/UKit).

## Ce que le site est

Trois pages statiques, et rien derrière : pas de serveur, pas de base, pas de compte. Ce qu'il dit
de l'application est ce que le [README de UKit](https://github.com/KAE-Lab/UKit#readme) dit, en
moins de mots.

| Page | Adresse | Ce qu'elle fait |
|---|---|---|
| L'accueil | `/` | présenter l'application : un aperçu animé par onglets, les fonctionnalités, le téléchargement |
| Télécharger | `/download.html` | rediriger vers le store du téléphone qui l'ouvre ; sur un ordinateur, montrer les deux badges |
| Engagement | `/engagement.html` | ce qu'on demande, ce qu'on en fait et ce qu'on ne fera jamais, quand quelqu'un prête un accès à son portail pour que UKit s'adapte à son campus ([docs/adaptation-campus.md](https://github.com/KAE-Lab/UKit/blob/main/docs/adaptation-campus.md), côté équipe) |

La page d'engagement est **citée par le formulaire de retours** de l'application : son adresse ne
change pas sans changer le formulaire.

## Structure

```text
index.html           l'accueil
download.html        la page de téléchargement
engagement.html      la page d'engagement du chantier campus
src/
  fond.js            le fond commun : la feuille de style et les particules — seule chose qu'une page secondaire charge
  main.js            l'accueil : modales, onglets de démonstration, bascule hero / fonctionnalités, geste tactile, échelle adaptative
  style.css          Tailwind 4 et les quelques règles maison (tokens de couleur, animations, scroll-snap)
public/              logo, icône, badges des stores, captures et vidéos de démonstration, image Open Graph
vite.config.js       trois entrées, une par page
eslint.config.js     les règles recommandées, et c'est tout
.env.production      VITE_SITE_URL, l'adresse publique — versionnée, ce n'est pas un secret
```

La pile : [Vite](https://vite.dev) 7, [Tailwind CSS](https://tailwindcss.com) 4 par son greffon Vite,
[tsParticles](https://particles.js.org) pour le fond. Pas de framework : trois pages ne le justifient
pas.

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

- **Le style n'est pas en chantier.** La refonte visuelle du site est prévue avec celle de
  l'application (la version 6.2 de UKit, « le mouvement ») ; d'ici là, une page nouvelle prend le
  vocabulaire des pages existantes, sans en inventer.
- **La politique de confidentialité** est celle de l'application :
  [PRIVACY.md](https://github.com/KAE-Lab/UKit/blob/main/PRIVACY.md).

## Licence

Apache 2.0, comme l'application. Le site est un fork de [kb-dev/UKit](https://github.com/kb-dev/UKit)
pour son origine ; il est maintenu par [KAE Lab](https://github.com/KAE-Lab).
