
import { NextResponse } from 'next/server';
import * as jose from 'jose'

export async function middleware(req) {
    const token = req.cookies.get('token')?.value
    if (token &&(req.nextUrl.pathname === "/api/login" || req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/api/register" || req.nextUrl.pathname === "/register")){
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (req.nextUrl.pathname === "/api/register"
        || req.nextUrl.pathname === "/api/login"
        || req.nextUrl.pathname === "/login"
        ||req.nextUrl.pathname === "/register"
        ||req.nextUrl.pathname === "/429"
        ||req.nextUrl.pathname === "/500"
        ||req.nextUrl.pathname.startsWith("/activate/")
        ||req.nextUrl.pathname.startsWith("/api/activate/")) {
        return NextResponse.next()
    }
    if (!token) {
        console.log('No token found, redirecting to login');
        return NextResponse.redirect(new URL('/login', req.url))
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRETKEY)
        const decoded = await jose.jwtVerify(token, secret); // Replace process.env.JWT_SECRET! with your actual JWT secret
        if (!decoded) {
            console.log('Invalid token, redirecting to login');
            return NextResponse.redirect(new URL('/login', req.url))
        }
    } catch (error) {
        console.log('Error verifying token:', error);
        return NextResponse.redirect(new URL("/login", req.headers.host))
    }
    return NextResponse.next()
};



export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
