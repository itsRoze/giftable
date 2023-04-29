import { getAuth, withClerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';

// Set the paths that don't require the user to be signed in
const publicPaths = ['/', '/about', '/sign-in*', '/sign-up*'];

const isPublic = (path: string) => {
  return publicPaths.find((x) =>
    path.match(new RegExp(`^${x}$`.replace('*$', '($|/)')))
  );
};

export default withClerkMiddleware((request: NextRequest) => {
  const { userId } = getAuth(request);
  const pathname = request.nextUrl.pathname;

  if (isPublic(pathname)) {
    if (userId && (pathname === '/sign-in' || pathname === '/sign-up')) {
      const appUrl = new URL('/app', request.url);
      return NextResponse.redirect(appUrl);
    }
    return NextResponse.next();
  }

  // if the user is not signed in redirect them to the sign in page.
  if (!userId) {
    // redirect the users to /pages/sign-in/[[...index]].ts

    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/image|_next/static|favicon.ico|images).*)',
  ],
};
