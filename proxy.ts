import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session';

const GUEST_ONLY_PAGES = new Set(['/', '/login', '/register']);
const PROTECTED_PAGES = ['/chat'];
const PROTECTED_API = ['/api/rooms', '/api/account'];

const startsWithAny = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Reject cross-site state-changing API calls (defence in depth on top of SameSite cookies).
  if (pathname.startsWith('/api/') && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
    if (origin && host && new URL(origin).host !== host) {
      return NextResponse.json({ error: 'Cross-site request blocked.' }, { status: 403 });
    }
  }

  // A misconfigured server (e.g. no JWT_SECRETKEY) treats everyone as logged out;
  // the API then reports the setup problem clearly instead of the proxy crashing.
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value).catch((error) => {
    console.error('[proxy]', (error as Error).message);
    return null;
  });

  if (session && GUEST_ONLY_PAGES.has(pathname)) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  if (!session) {
    if (startsWithAny(pathname, PROTECTED_API)) {
      return NextResponse.json({ error: 'Please log in to continue.' }, { status: 401 });
    }
    if (startsWithAny(pathname, PROTECTED_PAGES)) {
      const login = new URL('/login', request.url);
      login.searchParams.set('next', pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/chat/:path*', '/api/:path*'],
};
