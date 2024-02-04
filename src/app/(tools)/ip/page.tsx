import { notFound } from 'next/navigation';

import { TOOLS } from '@/lib/resources/tools';
import { ToolLayout } from '../_components/tool-layout';
import { IPLookupForm } from './form';

export default function IPLookupPage() {
  const tool = TOOLS.find((t) => t.slug === 'ip');
  if (!tool) {
    notFound();
  }
  return (
    <ToolLayout {...tool}>
      <IPLookupForm />
    </ToolLayout>
  );
}
