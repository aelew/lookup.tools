//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config';
import queryPlugin from '@tanstack/eslint-plugin-query';
import { globalIgnores } from 'eslint/config';

export default [
  ...tanstackConfig,
  ...queryPlugin.configs['flat/recommended'],
  globalIgnores(['.output/', '.tanstack/', '.wrangler/', '.dist/']),
  {
    rules: {
      'sort-imports': 'off',
      'import/order': 'off',
      'import/consistent-type-specifier-style': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off'
    }
  }
];
