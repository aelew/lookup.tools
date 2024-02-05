'use client';

import { formatDate } from '@/lib/format';

interface DateProps {
  dateTime?: string | null;
}

export function Date({ dateTime }: DateProps) {
  if (!dateTime) {
    return null;
  }
  return <time dateTime={dateTime}>{formatDate(dateTime)}</time>;
}
