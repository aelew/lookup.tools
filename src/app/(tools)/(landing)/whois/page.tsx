import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { TOOLS } from '@/lib/resources/tools';
import WhoisLookupForm from '../../(results)/(domain)/whois/form';

export function generateMetadata() {
  const tool = TOOLS.find((tool) => tool.slug === 'whois');
  if (!tool) notFound();
  return {
    title: tool.name,
    description: tool.description
  } satisfies Metadata;
}

export default function WhoisLookupPage() {
  return <WhoisLookupForm />;
}
