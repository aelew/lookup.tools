import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface ToolCardProps {
  icon: LucideIcon;
  name: string;
  slug: string;
  description: string;
}

export function ToolCard({
  icon: Icon,
  name,
  slug,
  description
}: ToolCardProps) {
  return (
    <Link href={`/${slug}`}>
      <Card className="relative rounded-xl shadow-lg transition-all hover:bg-accent/75 active:scale-[0.98]">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Icon className="mr-2 size-5" />
            {name}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>asdsas</CardContent>
      </Card>
    </Link>
  );
}
