import { Suspense } from 'react';

import { GoogleIcon } from '@/components/icons/google';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EmailCardProps } from '@/types/tools/email';
import { GoogleAccountTable } from './data';
import { LoadingGoogleAccountTable } from './loading';

export function GoogleCard({ email }: EmailCardProps) {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <GoogleIcon className="size-6" />
          <CardTitle className="text-2xl">Google account</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<LoadingGoogleAccountTable />}>
          <GoogleAccountTable email={email} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
