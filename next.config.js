/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
const { env } = await import('./src/env.js');

/** @type {import("next").NextConfig} */
const config = {
  output: env.VERCEL === '1' ? undefined : 'standalone',
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'a.impactradius-go.com' },
      { protocol: 'https', hostname: 'flagsapi.com' }
    ]
  }
};

export default config;
