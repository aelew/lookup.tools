import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24;

dayjs.extend(localizedFormat);

export function formatDuration(seconds: number) {
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

export function formatDate(date?: Date | string | number | null) {
  return date ? dayjs(new Date(date)).format('LL LTS') : null;
}
