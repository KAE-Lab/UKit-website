# Contribuer au site de UKit

Les conventions sont celles de l'application ([KAE-Lab/UKit](https://github.com/KAE-Lab/UKit/blob/main/CONTRIBUTING.md)),
réduites à ce qui a un sens pour un site de quelques pages.

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
2. **Aucune erreur dans la console du navigateur**, et aucune requête vers un autre domaine : la
   page Confidentialité promet qu'une visite n'en contacte aucun.
3. **Aucun lien mort**, et aucun lien vers un dépôt qui n'est pas `KAE-Lab/UKit` — le site en a
   porté vers un fork pendant des mois sans que rien ne le signale.
4. **Les balises Open Graph** sont présentes (`og:title`, `og:description`, `og:url`, `og:image`),
   avec `%VITE_SITE_URL%` pour l'adresse.
5. **Aucune valeur de style inventée** : les variables de `src/style.css` sont celles du thème
   sombre de l'application ; une valeur nouvelle se prend dans
   [`palettes.ts`](https://github.com/KAE-Lab/UKit/blob/main/src/shared/theme/palettes.ts) ou
   [`tokens.ts`](https://github.com/KAE-Lab/UKit/blob/main/src/shared/theme/tokens.ts).
6. **Le README et le CHANGELOG sont à jour** dans le même commit — une page nouvelle a sa ligne
   dans le tableau des pages et dans la structure.

## Principes de code

- Pas de JavaScript, sauf la redirection de la page de téléchargement : le site est du HTML et du
  CSS. Un script ajouté se justifie par un besoin que le CSS ne couvre pas.
- Une fonction qui touche un élément du DOM vérifie qu'il existe : la même feuille de script peut
  vivre sur plusieurs pages.
- Des commentaires sobres, orientés « pourquoi ». Aucun emoji dans le code, les commentaires ou
  les commits.
