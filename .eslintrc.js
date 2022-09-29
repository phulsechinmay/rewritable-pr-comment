// THIS FILE IS MANAGED BY AN AUTOMATED WORKFLOW

// Required packages:
// 'eslint-config-prettier'
// 'eslint-plugin-deprecation'
// 'eslint-plugin-import'
// 'eslint-plugin-jest'
// 'eslint-plugin-unused-imports'
// 'eslint'
// 'prettier-plugin-packagejson'
// 'prettier'

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['import', 'prettier'],
  extends: ['plugin:prettier/recommended', 'eslint:recommended'],
  root: true,
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': ['error', { before: false, after: true }],
    'no-multi-spaces': ['error', { ignoreEOLComments: false }],
    'array-bracket-newline': ['error', 'consistent'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'object-curly-newline': ['error', { multiline: true, consistent: true }],
    'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
    'keyword-spacing': ['error'],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'space-before-blocks': 'error',
    curly: ['error', 'multi-line', 'consistent'],
    'no-bitwise': ['error'],
    'no-trailing-spaces': ['error'],
    'no-duplicate-imports': ['error'],
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    'import/order': 'error',
    'prettier/prettier': 'error',
    'max-classes-per-file': ['error', 3],
    /** no console and debugger in CDK  */
    'no-console': 'error',
    'no-debugger': 'error',
    'no-underscore-dangle': 'off',
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
  },
};
