import { aliasKeys } from './aliases';

export type ModifierFn = (input: string) => unknown;

const nonExistentSignatures = [
  'NOT FOUND',
  'No Data Found',
  'No match for',
  'This domain name has not been registered.',
  'Domain not found',
  'The queried object does not exist',
  'El dominio no se encuentra registrado',
  'is available for registration',
  'is free',
  'Invalid domain name',
  'Domain Not Found',
  'Object does not exist',
  'domain name not known',
  'No matching record.',
  'No information was found matching that query.',
  'not found...',
  'syntax error in specified domain name',
  'NO MATCH',
  'No entries found',
  'not found',
  'The domain has not been registered',
  'The domain you requested is not known'
];

/**
 * Filters out commented lines and converts every line to a
 * JS object key–value pair with multiple values made into an array.
 *
 * @param {[key: string]: string | string[]} data – the raw WHOIS response data
 */
export const parseWhois = (data: string): Record<string, string | string[]> => {
  let currentKey = '';
  let previousKey = '';
  return data
    .split(/\r?\n/)
    .map((line) => {
      if (line.endsWith(':')) {
        currentKey = line.replace(':', '').trim();
        // Skip this line because it's a key
        return '';
      } else {
        let keyValue = '';
        if (currentKey) {
          if (line.includes(':') && !line.includes('http')) {
            keyValue = line;
          } else {
            keyValue = `${currentKey}: ${line}`;
          }
          previousKey = currentKey;
          // Reset currentKey after using
          currentKey = '';
        } else {
          if (
            (line.startsWith(' ') &&
              line.trim() !== '' &&
              !line.includes(':')) ||
            (previousKey.includes('erver') &&
              line.startsWith('	') &&
              line.includes('.'))
          ) {
            keyValue = `${previousKey}: ${line}`;
          } else {
            // Use line as is if it doesn't belong to any key
            keyValue = line;
          }
        }
        return keyValue;
      }
    })
    .filter((line) => line.length > 0 && !['#', '%', '>'].includes(line[0]!))
    .map((line) => line.split(/:(\s+)/))
    .map(([key, ...values]) => ({
      key: (key as string | undefined)!.trim(), // Type assertion to ensure key is always a string
      value: values.slice(1).join(':').trim()
    }))
    .reduce<Record<string, string | string[]>>((previous, { key, value }) => {
      const previousValue = previous[key];
      return {
        ...previous,
        [key]: previousValue
          ? [
              ...(previousValue instanceof Array
                ? previousValue
                : [previousValue]),
              value
            ]
          : value
      };
    }, {});
};

/**
 * Tries to find an alias and a modifier by the key.
 * Provies a default modifier function that returns the argument if no modifier found.
 *
 * @param {string} key – the key that'll be used to find the alias
 */
const findAliasByKey = (key: string): { to: string; modifier: ModifierFn } => ({
  to: key,
  modifier: (a) => a, // these will be overridden by the spreading if an actual modifier is found
  ...(aliasKeys.find(({ from }) => from.includes(key.toLowerCase())) ?? {})
});

export type OneOrMultiple<T> = T | T[];

export interface WhoisResult {
  exists: boolean;

  domain?: OneOrMultiple<string>;
  expiration?: OneOrMultiple<Date>;
  created?: OneOrMultiple<Date>;
  updated?: OneOrMultiple<Date>;
  status?: OneOrMultiple<string>;
  registrar?: OneOrMultiple<string>;
  registrarIanaId?: OneOrMultiple<string>;
  registrarAbuseContactEmail?: OneOrMultiple<string>;
  registrarAbuseContactPhone?: OneOrMultiple<string>;
  nameservers?: OneOrMultiple<string>;
  dnssec?: OneOrMultiple<string>;
  registryDomainId?: OneOrMultiple<string>;
  registrarWhoisServer?: OneOrMultiple<string>;
  registrarUrl?: OneOrMultiple<string>;
  registryRegistrantId?: OneOrMultiple<string>;
  registrantName?: OneOrMultiple<string>;
  registrantOrganization?: OneOrMultiple<string>;
  registrantStreet?: OneOrMultiple<string>;
  registrantCity?: OneOrMultiple<string>;
  registrantStateProvince?: OneOrMultiple<string>;
  registrantPostalCode?: OneOrMultiple<string>;
  registrantCountry?: OneOrMultiple<string>;
  registrantPhone?: OneOrMultiple<string>;
  registrantPhoneExt?: OneOrMultiple<string>;
  registrantFax?: OneOrMultiple<string>;
  registrantFaxExt?: OneOrMultiple<string>;
  registrantEmail?: OneOrMultiple<string>;
  registryAdminId?: OneOrMultiple<string>;
  adminName?: OneOrMultiple<string>;
  adminOrganization?: OneOrMultiple<string>;
  adminStreet?: OneOrMultiple<string>;
  adminCity?: OneOrMultiple<string>;
  adminStateProvince?: OneOrMultiple<string>;
  adminPostalCode?: OneOrMultiple<string>;
  adminCountry?: OneOrMultiple<string>;
  adminPhone?: OneOrMultiple<string>;
  adminPhoneExt?: OneOrMultiple<string>;
  adminFax?: OneOrMultiple<string>;
  adminFaxExt?: OneOrMultiple<string>;
  adminEmail?: OneOrMultiple<string>;
  registryTechId?: OneOrMultiple<string>;
  techName?: OneOrMultiple<string>;
  techOrganization?: OneOrMultiple<string>;
  techStreet?: OneOrMultiple<string>;
  techCity?: OneOrMultiple<string>;
  techStateProvince?: OneOrMultiple<string>;
  techPostalCode?: OneOrMultiple<string>;
  techCountry?: OneOrMultiple<string>;
  techPhone?: OneOrMultiple<string>;
  techPhoneExt?: OneOrMultiple<string>;
  techFax?: OneOrMultiple<string>;
  techFaxExt?: OneOrMultiple<string>;
  techEmail?: OneOrMultiple<string>;
  registrySecurityId?: OneOrMultiple<string>;
  securityName?: OneOrMultiple<string>;
  securityOrganization?: OneOrMultiple<string>;
  securityStreet?: OneOrMultiple<string>;
  securityCity?: OneOrMultiple<string>;
  securityStateProvince?: OneOrMultiple<string>;
  securityPostalCode?: OneOrMultiple<string>;
  securityCountry?: OneOrMultiple<string>;
  securityPhone?: OneOrMultiple<string>;
  securityEmail?: OneOrMultiple<string>;
  billingName?: OneOrMultiple<string>;
  billingOrganization?: OneOrMultiple<string>;
  billingStreet?: OneOrMultiple<string>;
  billingCity?: OneOrMultiple<string>;
  billingStateProvince?: OneOrMultiple<string>;
  billingPostalCode?: OneOrMultiple<string>;
  billingCountry?: OneOrMultiple<string>;
  billingPhone?: OneOrMultiple<string>;
  billingEmail?: OneOrMultiple<string>;

  /** this is a string | string[] */
  [key: string]: unknown; // 😔 https://github.com/microsoft/TypeScript/issues/17867
}

/**
 * Parses given raw WHOIS data to JS object form
 *
 * @param {string} data – raw WHOIS data to parse from
 */
const WhoisParser = (data: string): WhoisResult => ({
  exists:
    nonExistentSignatures.findIndex((sign) =>
      new RegExp(sign, 'i').test(data)
    ) === -1,
  ...Object.fromEntries(
    Object.entries(parseWhois(data))
      .map(([key, value]) => ({ value, alias: findAliasByKey(key) }))
      .map<[string, unknown]>(({ value, alias }) => [
        alias.to,
        value instanceof Array
          ? value.map(alias.modifier)
          : alias.modifier(value)
      ])
  )
});

export default WhoisParser;
