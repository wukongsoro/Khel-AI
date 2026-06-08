import sql from '@/app/api/utils/sql';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const messages = await sql`
      SELECT * FROM game_messages WHERE game_id = ${id}
      ORDER BY created_at ASC
    `;
    return Response.json({ messages });
  } catch (err) {
    console.error('GET /api/games/[id]/messages error', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { role, content } = await request.json();
    const [message] = await sql`
      INSERT INTO game_messages (game_id, role, content)
      VALUES (${id}, ${role}, ${content})
      RETURNING *
    `;
    return Response.json({ message });
  } catch (err) {
    console.error('POST /api/games/[id]/messages error', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
