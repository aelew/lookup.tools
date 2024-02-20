import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { DomainHeader } from './_components/domain-header';
import { DomainTabs } from './_components/domain-tabs';

export default function DomainToolLayout({ children }: PropsWithChildren) {
  const slug = headers().get('x-pathname')?.split('/')[1];
  if (!slug) {
    notFound();
  }
  return (
    <>
      <DomainHeader />
      <DomainTabs>{children}</DomainTabs>
    </>
  );
}
