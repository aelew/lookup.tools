'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CornerDownLeftIcon, LoaderIcon } from 'lucide-react';
import { usePlausible } from 'next-plausible';
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
import type { Events } from '@/types';
import { emailSchema, ipSchema } from '../schema';

export function EmailLookupForm() {
  const [loading, setLoading] = useState(false);
  const plausible = usePlausible<Events>();
  const router = useRouter();

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = (values: z.infer<typeof emailSchema>) => {
    plausible('Lookup', { props: { tool: 'email' } });
    router.push(`/email/${values.email}`);
    setLoading(true);
  };

  return (
    <Form {...form}>
      <form
        className="relative mx-auto w-full sm:max-w-sm"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    className="h-auto rounded-full py-3 pl-4 pr-16 shadow-lg focus-visible:ring-0"
                    clearHandler={() => form.setValue('email', '')}
                    placeholder="Email address (e.g.: example@gmail.com)"
                    deleteButtonClassName="right-9"
                    data-1p-ignore="true"
                    autoComplete="false"
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
