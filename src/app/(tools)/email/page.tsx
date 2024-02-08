import { notFound } from 'next/navigation';

import { TOOLS } from '@/lib/resources/tools';
import { ToolLayout } from '../_components/tool-layout';
import { EmailLookupForm } from './form';

export default function EmailLookupPage() {
  const tool = TOOLS.find((t) => t.slug === 'email');
  if (!tool) {
    notFound();
  }
  return (
    <ToolLayout {...tool}>
      <EmailLookupForm />
    </ToolLayout>
  );
}
