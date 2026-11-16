import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'

// Un site statique de quelques pages : chacune est une entree, sinon Vite ne construit que l'accueil.
// 404.html a la racine de dist/ est servie par Cloudflare Pages pour toute adresse inconnue ; sans
// elle, Pages prend le site pour une application a page unique et rend l'accueil partout.
const page = (nom) => fileURLToPath(new URL(`./${nom}.html`, import.meta.url))

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: page('index'),
                download: page('download'),
                engagement: page('engagement'),
                mentionsLegales: page('mentions-legales'),
                confidentialite: page('confidentialite'),
                introuvable: page('404'),
            },
        },
    },
})
