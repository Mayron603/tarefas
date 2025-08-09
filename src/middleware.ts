'use server';

import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
const protectedRoot = '/';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // If the user is logged in
  if (session) {
    // And tries to access a public route (like /login), redirect to the main page
    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } 
  // If the user is not logged in
  else {
    // And tries to access a protected route, redirect to login
    if (!isPublicRoute) {
       return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
