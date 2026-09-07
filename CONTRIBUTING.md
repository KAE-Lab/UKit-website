# Contribuer au site de UKit

Les conventions sont celles de l'application ([KAE-Lab/UKit](https://github.com/KAE-Lab/UKit/blob/main/CONTRIBUTING.md)),
réduites à ce qui a un sens pour un site de trois pages.

## Workflow

1. Une branche par changement : `type/description-courte`.
2. Des commits au format **Conventional Commits**, vérifiés à l'écriture par un hook `commit-msg`
   (commitlint) : `feat`, `fix`, `refactor`, `style`, `docs`, `chore`. En français, sans emoji.
3. `npm run lint` et `npm run build` verts.
4. Une Pull Request — ou un push sur `main` par le propriétaire, qui **publie** le site.

## Définition de « terminé » pour une page

Une page n'est terminée que lorsque tout ceci est vrai :

1. **Relue dans un navigateur, sur mobile et sur bureau**, depuis `npm run preview` — pas seulement
   dans l'éditeur. Le header et le footer sont ceux des autres pages.
2. **Aucune erreur dans la console du navigateur.** Une page secondaire charge `src/fond.js`, pas
   `src/main.js` : le second attend les éléments de l'accueil.
3. **Aucun lien mort**, et aucun lien vers un dépôt qui n'est pas `KAE-Lab/UKit` — le site en a
   porté vers un fork pendant des mois sans que rien ne le signale.
4. **Les balises Open Graph** sont présentes (`og:title`, `og:description`, `og:url`, `og:image`),
   avec `%VITE_SITE_URL%` pour l'adresse.
5. **Aucune valeur de style inventée** : les classes Tailwind et les tokens de `src/style.css`
   suffisent. La refonte visuelle est un chantier à part, avec celle de l'application.
6. **Le README et le CHANGELOG sont à jour** dans le même commit — une page nouvelle a sa ligne
   dans le tableau des pages et dans la structure.

## Principes de code

- Du JavaScript sans framework, en modules ES ; ce qui est partagé entre les pages vit dans
  `src/fond.js`, ce qui est propre à l'accueil dans `src/main.js`.
- Une fonction qui touche un élément du DOM vérifie qu'il existe : la même feuille de script peut
  vivre sur plusieurs pages.
- Des commentaires sobres, orientés « pourquoi ». Aucun emoji dans le code, les commentaires ou
  les commits.
