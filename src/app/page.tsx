import { SearchIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function HomePage() {
  return (
    <section className="space-y-4 pt-12">
      <h1 className="mx-auto max-w-5xl text-center text-4xl font-semibold tracking-tighter md:text-7xl">
        a
      </h1>
      <h2 className="mx-auto max-w-2xl text-center font-medium tracking-tight text-muted-foreground">
        Text
      </h2>
      <Card className="mx-auto max-w-sm p-2">
        <div className="flex items-center gap-2">
          <Input placeholder="What would you like to lookup?" />
          <Button>
            <SearchIcon className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </Card>
    </section>
  );
}
