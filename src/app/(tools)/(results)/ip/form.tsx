'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CornerDownLeftIcon, LoaderIcon } from 'lucide-react';
import { usePlausible } from 'next-plausible';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';
import type { Events } from '@/types';
import { ipSchema } from '../../schema';

interface IPLookupFormProps {
  showCurrentIPButton?: boolean;
}

export function IPLookupForm({ showCurrentIPButton }: IPLookupFormProps) {
  const { data: ip } = api.client.ip.useQuery();

  const [loading, setLoading] = useState(false);
  const plausible = usePlausible<Events>();
  const router = useRouter();

  const form = useForm<z.infer<typeof ipSchema>>({
    resolver: zodResolver(ipSchema),
    defaultValues: { ip: '' }
  });

  const onSubmit = (values: z.infer<typeof ipSchema>) => {
    plausible('Lookup', { props: { tool: 'ip' } });
    router.push(`/ip/${values.ip}`);
    setLoading(true);
  };

  return (
    <Form {...form}>
      <form
        className="relative mx-auto w-full sm:max-w-sm"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="ip"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    className="h-auto rounded-full py-3 pl-4 pr-16 shadow-lg focus-visible:ring-0"
                    clearHandler={() => form.setValue('ip', '')}
                    placeholder="IP address (e.g.: 1.1.1.1)"
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
      {showCurrentIPButton && (
        <Button
          onClick={() => form.setValue('ip', ip?.data ?? '')}
          className="self-center"
          variant="secondary"
        >
          Use my IP address
        </Button>
      )}
    </Form>
  );
}
