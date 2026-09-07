import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Un site statique de trois pages : chacune est une entree, sinon Vite ne construit que l'accueil.
const page = (nom) => fileURLToPath(new URL(`./${nom}.html`, import.meta.url))

export default defineConfig({
    plugins: [tailwindcss()],
    build: {
        rollupOptions: {
            input: {
                main: page('index'),
                download: page('download'),
                engagement: page('engagement'),
            },
        },
    },
})
