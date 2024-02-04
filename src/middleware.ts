import { NextResponse, type NextRequest } from 'next/server';
import { getClientIp } from 'request-ip';

export default async function middleware(req: NextRequest) {
  const headers: Record<string, string> = {};
  for (const [key, value] of req.headers.entries()) {
    headers[key] = value;
  }
  const ipAddress = getClientIp({ headers });
  if (ipAddress) {
    req.headers.set('x-client-ip', ipAddress);
  }
  return NextResponse.next({ headers: req.headers });
}
