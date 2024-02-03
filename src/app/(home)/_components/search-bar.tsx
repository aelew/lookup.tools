'use client';

import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';

export function SearchBar() {
  const [debouncedValue, setDebouncedValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  useEffect(() => {
    if (debouncedValue.trim() === '') {
      router.replace('/');
    } else {
      router.replace(`/?q=${encodeURIComponent(debouncedValue)}`);
    }
  }, [router, debouncedValue]);

  return (
    <div className="relative mx-auto flex max-w-sm items-center">
      <SearchIcon className="absolute ml-4 size-4 text-muted-foreground" />
      <Input
        className="h-auto rounded-full py-3 pl-10 pr-4 shadow-lg focus-visible:ring-0"
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search tools..."
        autoFocus
      />
    </div>
  );
}
