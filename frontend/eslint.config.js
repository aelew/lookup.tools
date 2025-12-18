//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config';
import queryPlugin from '@tanstack/eslint-plugin-query';

export default [
  ...tanstackConfig,
  ...queryPlugin.configs['flat/recommended'],
  {
    rules: {
      'sort-imports': 'off',
      'import/order': 'off',
      'import/consistent-type-specifier-style': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off'
    }
  }
];
