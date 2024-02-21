import { type Metadata } from 'next';
import { notFound } from 'next/navigation';

import { TOOLS } from '@/lib/resources/tools';
import EmailLookupForm from '../../(results)/email/form';

export function generateMetadata() {
  const tool = TOOLS.find((tool) => tool.slug === 'email');
  if (!tool) notFound();
  return {
    title: tool.name,
    description: tool.description
  } satisfies Metadata;
}

export default function EmailLookupPage() {
  return <EmailLookupForm />;
}
