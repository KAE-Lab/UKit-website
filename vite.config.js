import { defineConfig } from 'vite'
import tailwincss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        tailwincss(),
    ],
})