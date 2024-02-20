import { UsersIcon } from 'lucide-react';
import { Suspense } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EmailCardProps } from '@/types/tools/email';
import { RegisteredWebsites } from './data';
import { LoadingRegisteredWebsites } from './loading';

export async function AccountsCard({ email }: EmailCardProps) {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <UsersIcon className="size-6" />
          <CardTitle className="text-2xl">Registered accounts</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<LoadingRegisteredWebsites />}>
          <RegisteredWebsites email={email} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
