// @ts-check
/** @type {import('eslint').ESLint.ConfigData} */
const eslintConfig = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  plugins: ['simple-import-sort', 'unused-imports'],
  extends: ['@antfu/eslint-config'],
  ignorePatterns: [
    '**/__tests__/*.test.ts',
    '**/dist/**',
    '**/node_modules/**',
    '**/.graphclient/**',
    '**/.mesh/**',
    '**/generated/**',
    '**/typechain/**',
    '**/coverage/**',
    '**/exports/**',
  ],
  rules: {
    'simple-import-sort/exports': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': 'warn',
    'no-unused-vars': 'warn',
    'no-template-curly-in-string': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
  },
}

module.exports = eslintConfig