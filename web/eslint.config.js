export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
        },
    },
    {
        files: [
            'src/**/*Context.tsx',
            'src/**/*Provider.tsx',
            'src/**/context/**/*.{ts,tsx}',
            'src/**/providers/**/*.{ts,tsx}',
        ],
        rules: {
            'react-refresh/only-export-components': 'off',
        },
    },
])
