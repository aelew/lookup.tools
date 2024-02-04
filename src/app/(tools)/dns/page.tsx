'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CornerDownLeftIcon, LoaderIcon } from 'lucide-react';
import { notFound, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { GlobeIcon } from '@/components/icons/globe';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TOOLS } from '@/lib/resources/tools';
import { ToolLayout } from '../_components/tool-layout';
import { dnsSchema } from '../schema';

export default function DNSLookupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const tool = TOOLS.find((t) => t.slug === 'dns');
  if (!tool) {
    notFound();
  }

  const form = useForm<z.infer<typeof dnsSchema>>({
    resolver: zodResolver(dnsSchema),
    defaultValues: { domain: '' }
  });

  const onSubmit = (values: z.infer<typeof dnsSchema>) => {
    router.push(`/dns/${values.domain}`);
    setLoading(true);
  };

  return (
    <ToolLayout {...tool}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative mx-auto max-w-sm"
        >
          <FormField
            name="domain"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center">
                    <Input
                      className="h-auto rounded-full py-3 pl-4 pr-16 shadow-lg focus-visible:ring-0"
                      clearHandler={() => form.setValue('domain', '')}
                      placeholder="Domain name (e.g.: google.com)"
                      deleteButtonClassName="right-9"
                      autoFocus
                      {...field}
                    />
                    <button
                      className="absolute right-0 mr-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <LoaderIcon className="size-4 animate-spin text-muted-foreground transition-colors hover:text-muted-foreground/60" />
                      ) : (
                        <CornerDownLeftIcon className="size-4 text-muted-foreground transition-colors hover:text-muted-foreground/60" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </ToolLayout>
  );
}
