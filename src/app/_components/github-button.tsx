import { SiGithub } from '@icons-pack/react-simple-icons';
import ky from 'ky';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const getCachedStargazersCount = unstable_cache(
  async () => {
    const data = await ky
      .get('https://api.github.com/repos/aelew/lookup.tools')
      .json<{ stargazers_count: number }>();
    return data.stargazers_count;
  },
  ['stargazers_count'],
  { revalidate: 60 * 15 }
);

export async function GitHubButton() {
  const stargazersCount = await getCachedStargazersCount();
  return (
    <Link
      className="flex items-center gap-2 transition-opacity hover:opacity-80"
      href="https://github.com/aelew/lookup.tools"
      target="_blank"
    >
      <Button
        className="w-8 gap-2 px-0 hover:bg-primary active:scale-100 sm:w-auto sm:px-3"
        size="sm"
      >
        <SiGithub className="size-4" />
        <span className="hidden sm:inline">GitHub</span>
      </Button>
      <Button
        className="relative after:absolute after:right-[2.1rem] after:border-8 after:border-transparent after:border-r-primary hover:bg-primary active:scale-100"
        size="sm"
      >
        {stargazersCount}
      </Button>
    </Link>
  );
}
