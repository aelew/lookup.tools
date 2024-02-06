'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CornerDownLeftIcon, LoaderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { domainSchema } from '../../schema';

export function SubdomainFinderForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof domainSchema>>({
    resolver: zodResolver(domainSchema),
    defaultValues: { domain: '' }
  });

  const onSubmit = (values: z.infer<typeof domainSchema>) => {
    router.push(`/subdomain/${values.domain}`);
    setLoading(true);
  };

  return (
    <Form {...form}>
      <form
        className="relative mx-auto w-full sm:max-w-sm"
        onSubmit={form.handleSubmit(onSubmit)}
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
                  <button className="absolute right-0 mr-4" disabled={loading}>
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
  );
}
