import sql from '@/app/api/utils/sql';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const games = await sql`
      SELECT * FROM games WHERE user_id = ${session.user.id}
      ORDER BY updated_at DESC
    `;
    return Response.json({ games });
  } catch (err) {
    console.error('GET /api/games error', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { title, prompt } = body;

    const [game] = await sql`
      INSERT INTO games (user_id, title, prompt, game_code, description)
      VALUES (${session.user.id}, ${title || 'Untitled Game'}, ${prompt || ''}, ${''}, ${prompt || ''})
      RETURNING *
    `;
    return Response.json({ game });
  } catch (err) {
    console.error('POST /api/games error', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
