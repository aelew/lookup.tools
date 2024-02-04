import { NextResponse, type NextRequest } from 'next/server';

export default async function middleware(req: NextRequest) {
  const headers: Record<string, string> = {};
  for (const [key, value] of req.headers.entries()) {
    headers[key] = value;
  }
  const ipAddress =
    req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for');
  if (ipAddress) {
    req.headers.set('x-client-ip', ipAddress);
  }
  return NextResponse.next({ headers: req.headers });
}
