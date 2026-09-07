// ESLint, au minimum utile pour un site de trois pages : les regles recommandees, les globales du
// navigateur pour src/, celles de Node pour les fichiers de configuration.
import js from '@eslint/js'
import globals from 'globals'

export default [
    { ignores: ['dist/**', 'node_modules/**'] },
    js.configs.recommended,
    {
        files: ['src/**/*.js'],
        languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: globals.browser },
    },
    {
        files: ['*.config.js', '*.config.mjs'],
        languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: globals.node },
    },
]
