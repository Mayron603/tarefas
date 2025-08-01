
'use server';

import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isProtectedRoute = pathname === '/';

  if (isAuthPage) {
    if (session) {
      // If the user is logged in, redirect from auth pages to home
      return NextResponse.redirect(new URL('/', request.url));
    }
    // If not logged in, allow access to auth pages
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    if (!session) {
      // If not logged in, redirect from protected pages to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // If logged in, allow access to protected pages
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register'],
};
