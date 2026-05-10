const tseslint = require('@typescript-eslint/eslint-plugin');
const jest = require('eslint-plugin-jest');

const globals = {
  Atomics: 'readonly',
  Buffer: 'readonly',
  SharedArrayBuffer: 'readonly',
  __dirname: 'readonly',
  clearTimeout: 'readonly',
  console: 'readonly',
  exports: 'writable',
  module: 'readonly',
  process: 'readonly',
  require: 'readonly',
  setTimeout: 'readonly'
};

module.exports = [
  {
    ignores: ['lib/**', 'coverage/**', 'node_modules/**']
  },
  ...tseslint.configs['flat/recommended'],
  {
    files: ['src/**/*.ts', '__tests__/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2019,
      sourceType: 'module',
      globals
    }
  },
  {
    files: ['__tests__/**/*.ts'],
    ...jest.configs['flat/recommended'],
    settings: {
      jest: {
        version: 30
      }
    }
  }
];
