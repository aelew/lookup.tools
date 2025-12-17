//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  ...tanstackConfig,
  {
    rules: {
      'sort-imports': 'off',
      'import/order': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off'
    }
  }
];
