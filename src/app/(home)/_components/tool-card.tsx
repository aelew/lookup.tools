import Link from 'next/link';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import type { Tool } from '@/lib/resources/tools';

export function ToolCard({ icon: Icon, name, slug, description }: Tool) {
  return (
    <Link href={`/${slug}`} className="contents">
      <Card className="relative max-w-[22rem] rounded-xl shadow-lg transition-color-transform hover:bg-accent/75 active:scale-[0.98]">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon className="mr-2 size-5" />
            {name}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
