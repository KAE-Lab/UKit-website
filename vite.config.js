import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Un site statique de quelques pages : chacune est une entree, sinon Vite ne construit que l'accueil.
// 404.html a la racine de dist/ est servie par Cloudflare Pages pour toute adresse inconnue ; sans
// elle, Pages prend le site pour une application a page unique et rend l'accueil partout.
const page = (nom) => fileURLToPath(new URL(`./${nom}.html`, import.meta.url))

// La revision du site, dans le cartouche de l'accueil : le commit construit et la date du build. Une
// trace dit une verite ; hors d'un depot Git, elle le dit aussi.
function revision() {
    const jour = new Date().toISOString().slice(0, 10).split('-').reverse().join('.')
    try {
        const commit = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
        return `${commit} · ${jour}`
    } catch {
        return `hors dépôt · ${jour}`
    }
}
process.env.VITE_REVISION ??= revision()

export default defineConfig({
    plugins: [tailwindcss()],
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
