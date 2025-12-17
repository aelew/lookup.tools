//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss'
  ],
  importOrder: ['<THIRD_PARTY_MODULES>', '', '^@/', '^[../]', '^[./]'],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  trailingComma: 'none',
  singleQuote: true
};

export default config;
