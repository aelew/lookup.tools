import { clsx, type ClassValue } from 'clsx';
import { parseDomain as _parseDomain, ParseResultType } from 'parse-domain';
import { twMerge } from 'tailwind-merge';

export function assertFulfilled<T>(
  item: PromiseSettledResult<T>
): item is PromiseFulfilledResult<T> {
  return item.status === 'fulfilled';
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function parseDomain(hostname: string) {
  const result = _parseDomain(decodeURIComponent(hostname));
  return result.type === ParseResultType.Listed
    ? `${result.domain}.${result.topLevelDomains.join('.')}`
    : null;
}
