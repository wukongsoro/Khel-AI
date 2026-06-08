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
    const [game] = await sql`
      SELECT * FROM games WHERE id = ${id} AND user_id = ${session.user.id}
    `;
    if (!game) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json({ game });
  } catch (err) {
    console.error('GET /api/games/[id] error', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { title, game_code, prompt } = body;

    const setClauses: string[] = [];
    const values: unknown[] = [];

    if (title !== undefined) {
      values.push(title);
      setClauses.push(`title = $${values.length}`);
    }
    if (game_code !== undefined) {
      values.push(game_code);
      setClauses.push(`game_code = $${values.length}`);
    }
    if (prompt !== undefined) {
      values.push(prompt);
      setClauses.push(`prompt = $${values.length}`);
    }

    setClauses.push(`updated_at = NOW()`);

    if (setClauses.length === 1) {
      return Response.json({ error: 'Nothing to update' }, { status: 400 });
    }

    values.push(id);
    values.push(session.user.id);
    const query = `UPDATE games SET ${setClauses.join(', ')} WHERE id = $${values.length - 1} AND user_id = $${values.length} RETURNING *`;
    const result = await sql(query, values);
    return Response.json({ game: result[0] });
  } catch (err) {
    console.error('PATCH /api/games/[id] error', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await sql`DELETE FROM games WHERE id = ${id} AND user_id = ${session.user.id}`;
    return Response.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/games/[id] error', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
