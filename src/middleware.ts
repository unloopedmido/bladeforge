import { type NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const hostname = req.nextUrl.hostname;

  // Check if the environment is development (localhost)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return NextResponse.next();
  }

  // If not localhost and request is not HTTPS, redirect to HTTPS
  if (req.nextUrl.protocol !== 'https:') {
    const httpsUrl = new URL(req.url);
    httpsUrl.protocol = 'https:';
    return NextResponse.redirect(httpsUrl);
  }

  return NextResponse.next();
}
