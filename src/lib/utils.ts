import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getDomain } from 'tldts';

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
  const decodedHostname = decodeURIComponent(hostname);
  return getDomain(decodedHostname);
}
