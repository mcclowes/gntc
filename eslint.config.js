// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';
import react from 'eslint-plugin-react';

import js from '@eslint/js';

export default [js.configs.recommended, react.configs.flat.recommended, {
  files: ['src/**/*.js', 'src/**/*.jsx'],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    globals: {
      console: 'readonly',
      process: 'readonly',
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-spacing': 'error',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'eol-last': ['error', 'always'],
    'react/react-in-jsx-scope': 'off',
    'react/no-unescaped-entities': 'off',
  },
}, {
  files: ['src/**/*.spec.js', 'src/__tests__/**/*.js'],
  languageOptions: {
    globals: {
      describe: 'readonly',
      it: 'readonly',
      expect: 'readonly',
      beforeEach: 'readonly',
      afterEach: 'readonly',
      jest: 'readonly',
    },
  },
}, {
  ignores: ['lib/', 'node_modules/', 'coverage/'],
}, ...storybook.configs["flat/recommended"]];
