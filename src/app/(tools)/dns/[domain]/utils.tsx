import { sections } from './constants';

export function formatWhoisKey(key: string) {
  switch (key) {
    case 'text':
      return 'Information';
    case 'Name Server':
      return 'Name Servers';
    case 'Created Date':
      return 'Creation Date';
    case 'Updated Date':
      return 'Last Updated';
    default:
      return key.replace('>>> ', '');
  }
}

export function formatWhoisValue(key: string, value: string) {
  if (Array.isArray(value)) {
    if (value.length) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (value[0]!.includes('https://icann.org/epp#')) {
        return value.map((v, idx) => {
          v = (v as string).split(' ')[0];
          return <p key={idx}>{v}</p>;
        });
      }
      return value.map((v, idx) => {
        if (key === 'Name Server') {
          v = (v as string).toLowerCase();
        }
        return <p key={idx}>{v}</p>;
      });
    }
    return <p>(empty)</p>;
  }
  return (
    <p>
      {value === ''
        ? '(empty)'
        : value.replace(' <<<', '').replaceAll('   ', '').trim()}
    </p>
  );
}

export function formatWhoisTableName(name: string) {
  return sections[name];
}
