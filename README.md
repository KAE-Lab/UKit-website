<p align="center">
  <img src="public/logo-ukit.svg" alt="UKit" width="240" />
</p>

<p align="center"><strong>Le site de UKit — <a href="https://ukit-bordeaux.fr">ukit-bordeaux.fr</a></strong></p>

> La vitrine de l'application, sa page de téléchargement, la page d'engagement du chantier campus,
> et les pages légales. L'application elle-même vit dans [KAE-Lab/UKit](https://github.com/KAE-Lab/UKit).

## Ce que le site est

Quelques pages statiques, et rien derrière : pas de serveur, pas de base, pas de compte, pas de
cookie ni de mesure d'audience, pas de script sauf la redirection de la page de téléchargement.
Ce qu'il dit de l'application est ce que le [README de UKit](https://github.com/KAE-Lab/UKit#readme)
dit, en moins de mots.

| Page | Adresse | Ce qu'elle fait |
|---|---|---|
| L'accueil | `/` | la fiche produit de l'application : l'ouverture (titre, bouton, un téléphone et deux cartes de l'appli), un module par onglet (Planning, Campus, Scolarité) avec ses points forts et sa fiche, la fiche technique, les stores |
| Télécharger | `/download.html` | rediriger vers le store du téléphone qui l'ouvre ; sur un ordinateur, montrer les deux badges et le QR code |
| Engagement | `/engagement.html` | ce qu'on demande, ce qu'on en fait et ce qu'on ne fera jamais, quand quelqu'un prête un accès à son portail pour que UKit s'adapte à son campus ([docs/adaptation-campus.md](https://github.com/KAE-Lab/UKit/blob/main/docs/adaptation-campus.md), côté équipe) |
| Mentions légales | `/mentions-legales.html` | l'éditeur (l'association KAE Lab), le directeur de la publication, l'hébergeur, les licences et les marques (loi n° 2004-575, art. 1-1) |
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
  style.css            toute la mise en forme, chaque page la charge
public/
  captures/            cinq captures de l'application 6.3, thème sombre, banc Android (1080 × 2290 sans barre d'état, réduites à 720)
  licences/            la licence des icônes Lucide (ISC), liée depuis les mentions légales
  …                    logo, icône, logo PNG historique, badges des stores, QR code, image Open Graph
vite.config.js         une entrée par page
eslint.config.js       les règles recommandées, et c'est tout
.env.production        VITE_SITE_URL, l'adresse publique — versionnée, ce n'est pas un secret
```

La pile : [Vite](https://vite.dev) 7, et du CSS écrit à la main. Pas de framework : quelques pages ne
le justifient pas.

## Le style : celui de l'application

Le site parle la langue de l'application sans recopier un de ses écrans. Il part du **premier écran de
son accueil**
([`VitrineDAccueil.tsx`](https://github.com/KAE-Lab/UKit/blob/main/src/features/Onboarding/components/VitrineDAccueil.tsx)) :
le fond sombre et sa lueur aux couleurs de l'accent, de vraies cartes de l'appli, le titre en deux
tons, le bouton plein. Mais la composition est la sienne : un téléphone légèrement tourné, d'où
sortent deux cartes de l'onglet Campus.

- **Les valeurs viennent du thème sombre de l'application**
  ([`palettes.ts`](https://github.com/KAE-Lab/UKit/blob/main/src/shared/theme/palettes.ts),
  [`tokens.ts`](https://github.com/KAE-Lab/UKit/blob/main/src/shared/theme/tokens.ts)) : fond
  `#0B0B12`, carte `#15151E`, textes `#FFFFFF` / `#BCBCCB` / `#8A8A98`, filet `#2A2A37`, accent
  `#6381F8` à `#5974DF`, rayon de 16. Chaque module prend la teinte de l'en-tête de son onglet
  (`fondDOnglet`), en lueur derrière son titre.
- **Une hiérarchie de fiche produit** : le nom du module en grand titre, comme un onglet de
  l'application ; une phrase factuelle ; trois points forts en valeur lisible d'abord ; puis une
  fiche clé / valeur pour le détail, et une fiche technique générale en fin de page.
- **Les icônes sont celles de l'application, et comme elle les emploie** : Lucide, tirées de son
  paquet (`lucide-react-native` 1.61.0), au trait de 1,75, neutres. Pas de carré de couleur : la
  deuxième passe de 7-J l'a retiré de l'application, jugé « prototype ».
- **Le ton est impersonnel**, celui d'une fiche produit : ni tutoiement, ni formule publicitaire.
  La page d'engagement, qui s'adresse à un volontaire et que le formulaire cite, garde le sien.
- **La police est celle du système**, comme dans l'application : aucune police à télécharger.
- **Les cartes de l'ouverture** sont écrites en HTML avec les données d'exemple de l'application
  ([`exemples.ts`](https://github.com/KAE-Lab/UKit/blob/main/src/features/Onboarding/components/exemples.ts)).
- **Chaque fonction annoncée existe** dans l'application 6.3 : elle se vérifie dans sa documentation
  (`docs/features/`) et son CHANGELOG avant d'entrer sur le site.
- **Sombre seulement.** Le mouvement respecte `prefers-reduced-motion`.

**Les captures se refont sur le banc Android** de l'application (`tools/appareil/banc.sh`, AVD `ukit`,
thème sombre), barre d'état rognée. Rien de personnel : ni compte universitaire connecté, ni visage
identifiable ; les noms des enseignants du planning sont caviardés.

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
- **Un thème clair** : l'écran d'accueil que le site reprend est sombre.

## Licence

Apache 2.0, comme l'application. Le site est un fork de [kb-dev/UKit](https://github.com/kb-dev/UKit)
pour son origine ; il est maintenu par [KAE Lab](https://github.com/KAE-Lab).
