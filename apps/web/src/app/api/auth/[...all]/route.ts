/**
 * ⚠ ANYTHING PLATFORM — DO NOT REWRITE THIS FILE ⚠
 *
 * Shipped v2 better-auth catch-all. `toNextJsHandler(auth)` wires up every
 * better-auth endpoint (/sign-up/email, /sign-in/email, /get-session, ...).
 * Do not hand-roll your own routes for these paths; it will conflict with
 * this handler and break signup/signin/session lookup.
 */
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

export async function GET(request: NextRequest, context: any) {
  if (!process.env.DATABASE_URL) {
    const pathname = request.nextUrl.pathname;
    if (pathname.includes('/api/auth/session') || pathname.includes('/api/auth/get-session')) {
      const cookieHeader = request.headers.get('cookie') || '';
      if (
        cookieHeader.includes('better-auth.session_token=mock-session-token') ||
        cookieHeader.includes('better-auth_session_token=mock-session-token')
      ) {
        return NextResponse.json({
          user: {
            id: 'demo-user-id',
            email: 'demo@khelai.com',
            name: 'Demo User',
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          session: {
            id: 'demo-session-id',
            userId: 'demo-user-id',
            token: 'mock-session-token',
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        });
      }
      return NextResponse.json(null);
    }
  }
  return handler.GET(request);
}

export async function POST(request: NextRequest, context: any) {
  if (!process.env.DATABASE_URL) {
    const pathname = request.nextUrl.pathname;
    if (pathname.includes('/api/auth/sign-in/email') || pathname.includes('/api/auth/sign-up/email')) {
      const res = NextResponse.json({
        user: {
          id: 'demo-user-id',
          email: 'demo@khelai.com',
          name: 'Demo User',
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        session: {
          id: 'demo-session-id',
          userId: 'demo-user-id',
          token: 'mock-session-token',
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      });
      res.headers.append(
        'Set-Cookie',
        'better-auth.session_token=mock-session-token; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000'
      );
      res.headers.append(
        'Set-Cookie',
        'better-auth_session_token=mock-session-token; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000'
      );
      return res;
    }
    if (pathname.includes('/api/auth/sign-out')) {
      const res = NextResponse.json({ success: true });
      res.headers.append(
        'Set-Cookie',
        'better-auth.session_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
      );
      res.headers.append(
        'Set-Cookie',
        'better-auth_session_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
      );
      return res;
    }
  }
  return handler.POST(request);
}
