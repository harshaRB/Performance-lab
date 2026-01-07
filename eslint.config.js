import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';

export default [
    { ignores: ['dist', 'node_modules', 'android', '*.config.*'] },
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { jsx: true }
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                fetch: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                URL: 'readonly',
                HTMLElement: 'readonly',
                CustomEvent: 'readonly',
                navigator: 'readonly',
                self: 'readonly',
                Worker: 'readonly',
                postMessage: 'readonly',
                onmessage: 'writable',
                Blob: 'readonly',
                confirm: 'readonly',
                alert: 'readonly',
                requestAnimationFrame: 'readonly',
                cancelAnimationFrame: 'readonly',
                indexedDB: 'readonly',
            }
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh
        },
        rules: {
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            'no-console': 'off',
        },
        settings: {
            react: { version: 'detect' }
        }
    }
];
