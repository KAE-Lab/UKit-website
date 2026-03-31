import { defineConfig } from 'vite'
import tailwincss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        tailwincss(),
    ],
    build: {
        rollupOptions: {
            input: {
                main:     resolve(__dirname, 'index.html'),
                download: resolve(__dirname, 'download.html'),
            },
        },
    },
})