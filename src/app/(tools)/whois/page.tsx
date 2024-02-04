import { notFound } from 'next/navigation';

import { TOOLS } from '@/lib/resources/tools';
import { ToolLayout } from '../_components/tool-layout';
import { WHOISLookupForm } from './form';

export default function WHOISLookupPage() {
  const tool = TOOLS.find((t) => t.slug === 'whois');
  if (!tool) {
    notFound();
  }
  return (
    <ToolLayout {...tool}>
      <WHOISLookupForm />
    </ToolLayout>
  );
}
