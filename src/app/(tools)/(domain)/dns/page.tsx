import { notFound } from 'next/navigation';

import { TOOLS } from '@/lib/resources/tools';
import { ToolLayout } from '../../_components/tool-layout';
import { DNSLookupForm } from './form';

export default function DNSLookupPage() {
  const tool = TOOLS.find((t) => t.slug === 'dns');
  if (!tool) {
    notFound();
  }
  return (
    <ToolLayout {...tool}>
      <DNSLookupForm />
    </ToolLayout>
  );
}
