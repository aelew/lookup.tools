import { NextResponse } from 'next/server';

export function middleware(req: Request) {
  const url = new URL(req.url);
  const headers = new Headers(req.headers);
  headers.set('x-pathname', url.pathname);
  return NextResponse.next({ request: { headers } });
}
