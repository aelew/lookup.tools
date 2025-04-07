import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { TOOLS } from '@/lib/resources/tools';
import { IPLookupForm } from '../../(results)/ip/form';

export function generateMetadata() {
  const tool = TOOLS.find((tool) => tool.slug === 'ip');
  if (!tool) {
    notFound();
  }

  return {
    title: tool.name,
    description: tool.description
  } satisfies Metadata;
}

export default async function IPLookupPage() {
  const headerList = await headers();

  return (
    <IPLookupForm
      clientIpAddress={
        headerList.get('cf-connecting-ip') ?? headerList.get('x-forwarded-for')
      }
    />
  );
}
