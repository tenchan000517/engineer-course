import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 本番環境のみ /reference/ へのアクセスをブロック
  if (process.env.NODE_ENV === 'production' && request.nextUrl.pathname.startsWith('/reference')) {
    return NextResponse.redirect(new URL('/404', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/reference/:path*',
};
