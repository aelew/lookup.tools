import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function duration(seconds: number) {
  const days = Math.floor(seconds / SECONDS_IN_DAY);
  seconds -= days * SECONDS_IN_DAY;

  const hours = Math.floor(seconds / SECONDS_IN_HOUR);
  seconds -= hours * SECONDS_IN_HOUR;

  const minutes = Math.floor(seconds / SECONDS_IN_MINUTE);
  seconds -= minutes * SECONDS_IN_MINUTE;

  const parts: string[] = [];
  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (seconds > 0 || !parts.length) {
    parts.push(`${seconds}s`);
  }

  return parts.join(' ');
}
