import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { TOOLS } from '@/lib/resources/tools';
import DNSLookupForm from '../../(results)/(domain)/dns/form';

export function generateMetadata() {
  const tool = TOOLS.find((tool) => tool.slug === 'dns');
  if (!tool) notFound();
  return {
    title: tool.name,
    description: tool.description
  } satisfies Metadata;
}

export default function DNSLookupPage() {
  return <DNSLookupForm />;
}
