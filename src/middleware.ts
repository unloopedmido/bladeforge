import { type NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const hostname = req.nextUrl.hostname;

  // Check if the environment is development (localhost)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return NextResponse.next();
  }

  // If not localhost and request is not HTTPS, redirect to HTTPS
  if (req.nextUrl.protocol !== 'https:') {
    return new Response('Redirecting...', {
      status: 301,
      headers: {
        Location: `https://${hostname}${req.nextUrl.pathname}`,
      },
    });
  }

  return NextResponse.next();
}
