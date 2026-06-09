import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    user: session.user,
    session: session.session,
  });
}
