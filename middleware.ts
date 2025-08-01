import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

const protectedRoutes = ['/']; // Add other routes that need protection

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  
  // If the user is not logged in and tries to access a protected route, redirect to login
  if (!session && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If the user is logged in and tries to access login/register, redirect to home
  if (session && (pathname === '/login' || pathname === '/register')) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};