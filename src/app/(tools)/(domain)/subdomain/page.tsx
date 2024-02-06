import { notFound } from 'next/navigation';

import { TOOLS } from '@/lib/resources/tools';
import { ToolLayout } from '../../_components/tool-layout';
import { SubdomainFinderForm } from './form';

export default function SubdomainFinderPage() {
  const tool = TOOLS.find((t) => t.slug === 'subdomain');
  if (!tool) {
    notFound();
  }
  return (
    <ToolLayout {...tool}>
      <SubdomainFinderForm />
    </ToolLayout>
  );
}
