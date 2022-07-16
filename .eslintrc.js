module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@babel/eslint-parser',
  ignorePatterns: ['**/env/*.ts'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      alias: {
        map: [
          ['modules', './src/modules'],
          ['static', './src/static'],
          ['components', './src/components'],
          ['models', './src/models'],
          ['api', './src/api'],
          ['utils', './src/utils'],
        ],
        extensions: ['.ts', '.tsx', '.png', '.css', '.svg', '.json'],
      },
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: [
        ['babel-preset-react-app', false],
        // eslint-disable-next-line no-nested-ternary
        process.env.NODE_ENV === 'production'
          ? 'babel-preset-react-app/prod'
          : process.env.NODE_ENV === 'test'
          ? 'babel-preset-react-app/test'
          : 'babel-preset-react-app/dev',
      ],
    },
  },
  plugins: ['react', 'prettier', 'react-hooks', '@typescript-eslint'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-var': 'error',
    semi: 'error',
    'space-in-parens': 'error',
    'no-multiple-empty-lines': 'error',
    'prefer-const': 'error',
    'no-use-before-define': 'error',
    'linebreak-style': 0,
    'react/forbid-prop-types': 0,
    'import/prefer-default-export': 0,
    'no-restricted-globals': 0,
    'react/function-component-definition': [
      1,
      { namedComponents: 'arrow-function' },
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
    'import/extensions': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'react/button-has-type': 0,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 0,
    'no-void': 0,
    '@typescript-eslint/no-unnecessary-type-constraint': 0,
    'no-shadow': 0,
    'lines-between-class-members': 0,
    'default-param-last': 0,
    'no-param-reassign': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    '@typescript-eslint/no-inferrable-types': 0,
    'class-methods-use-this': 0,
    'max-classes-per-file': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'react/require-default-props': 0,
    'no-plusplus': 0,
    'import/order': 0,
  },
};
