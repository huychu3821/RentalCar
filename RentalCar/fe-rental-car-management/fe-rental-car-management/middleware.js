import * as jose from 'jose';
import { NextResponse } from 'next/server';

const privatePaths = ['/api', '/owner', '/customer'];
const authPaths = ['/auth/login-register'];

async function createCryptoKey(secretBase64) {
    const secretString = atob(secretBase64);
    const keyData = new TextEncoder().encode(secretString);
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify'],
    );

    return cryptoKey;
}

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const sessionToken = request.cookies.get('sessionToken')?.value;

    const secretBase64 = process.env.NEXT_PUBLIC_JWT_SECRET;
    const cryptoKey = await createCryptoKey(secretBase64);

    if (privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken) {
        return NextResponse.redirect(new URL('/auth/login-register', request.url));
    }

    let decoded;
    let sub;

    if (sessionToken) {
        try {
            decoded = await jose.jwtVerify(sessionToken, cryptoKey);
            sub = decoded.payload.sub.split(', ');

            // Kiểm tra hạn của token
            const now = Math.floor(Date.now() / 1000);
            if (decoded.payload.exp && decoded.payload.exp < now) {
                // Token đã hết hạn, xoá token khỏi cookies và redirect đến trang login
                const response = NextResponse.redirect(
                    new URL('/auth/login-register', request.url),
                );
                response.cookies.set('sessionToken', '', { maxAge: -1 });
                return response;
            }
        } catch (error) {
            // Token không hợp lệ, xoá token khỏi cookies và redirect đến trang login
            const response = NextResponse.redirect(new URL('/auth/login-register', request.url));
            response.cookies.set('sessionToken', '', { maxAge: -1 });
            return response;
        }
    }

    if (
        (authPaths.some((path) => pathname.startsWith(path)) && sessionToken) ||
        (pathname === '/' && sessionToken)
    ) {
        if (sub[2] === '[CUSTOMER]') {
            return NextResponse.redirect(new URL('/customer', request.url));
        }
        if (sub[2] === '[OWNER]') {
            return NextResponse.redirect(new URL('/owner', request.url));
        }
    }

    if (privatePaths.some((path) => pathname.startsWith(path)) && sessionToken) {
        if (request.nextUrl.pathname.startsWith('/owner')) {
            if (sub[2] === '[CUSTOMER]') {
                return NextResponse.redirect(new URL('/customer', request.url));
            }
        } else if (request.nextUrl.pathname.startsWith('/customer')) {
            if (sub[2] === '[OWNER]') {
                return NextResponse.redirect(new URL('/owner', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/api',
        '/owner',
        '/customer',
        '/auth/login-register',
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    ],
};
