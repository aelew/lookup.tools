import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { TOOLS } from '@/lib/resources/tools';
import { IPLookupForm } from '../../(results)/ip/form';

export function generateMetadata() {
  const tool = TOOLS.find((tool) => tool.slug === 'ip');
  if (!tool) notFound();
  return {
    title: tool.name,
    description: tool.description
  } satisfies Metadata;
}

export default function IPLookupPage() {
  return <IPLookupForm showCurrentIPButton />;
}
