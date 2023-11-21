module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended',
  ],
  overrides: [
    // Prevents errors due to .eslintrc.js not being included in the TS project.
    // See also: https://typescript-eslint.io/linting/troubleshooting/#i-get-errors-telling-me-eslint-was-configured-to-run--however-that-tsconfig-does-not--none-of-those-tsconfigs-include-this-file
    {
      files: ['.eslintrc.js', '.metro.config.js'],
      parserOptions: {project: null},
      rules: {
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {fixStyle: 'inline-type-imports'},
    ],
    '@typescript-eslint/no-import-type-side-effects': 'warn',
    '@typescript-eslint/no-unnecessary-condition': [
      'warn',
      {allowConstantLoopConditions: true},
    ],
    '@typescript-eslint/no-unused-vars': ['warn', {varsIgnorePattern: '^_'}],
    eqeqeq: ['error', 'always', {null: 'ignore'}],
    'import/no-duplicates': ['warn', {'prefer-inline': true}],
    'import/order': [
      2,
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
      },
    ],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
