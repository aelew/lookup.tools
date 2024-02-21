import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { TOOLS } from '@/lib/resources/tools';
import SubdomainFinderForm from '../../(results)/(domain)/subdomain/form';

export function generateMetadata() {
  const tool = TOOLS.find((tool) => tool.slug === 'subdomain');
  if (!tool) notFound();
  return {
    title: tool.name,
    description: tool.description
  } satisfies Metadata;
}

export default function SubdomainFinderPage() {
  return <SubdomainFinderForm />;
}
