import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

type SqlQueryFunction = NeonQueryFunction<false, false> & {
  query: NeonQueryFunction<false, false>;
};

const NullishQueryFunction = (() => {
  throw new Error(
    'No database connection string was provided to `neon()`. Perhaps process.env.DATABASE_URL has not been set'
  );
}) as any as SqlQueryFunction;

NullishQueryFunction.transaction = (() => {
  throw new Error(
    'No database connection string was provided to `neon()`. Perhaps process.env.DATABASE_URL has not been set'
  );
}) as any as NeonQueryFunction<false, false>['transaction'];
NullishQueryFunction.query = NullishQueryFunction;

// Mock database file helper in the .next build output directory
const getMockDbPath = () => {
  const dir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, 'khel_ai_mock_db.json');
};

const readMockDb = () => {
  const dbPath = getMockDbPath();
  if (!fs.existsSync(dbPath)) {
    return { games: [], game_messages: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } catch (e) {
    return { games: [], game_messages: [] };
  }
};

const writeMockDb = (data: any) => {
  const dbPath = getMockDbPath();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};

// Simple SQL query parser and executor
const mockQuery = (queryStr: string, values: any[] = []): any => {
  const db = readMockDb();

  // 1. SELECT * FROM games WHERE user_id = ...
  if (queryStr.includes('SELECT * FROM games WHERE user_id')) {
    const userId = values[0] || 'demo-user-id';
    const userGames = db.games.filter((g: any) => g.user_id === userId);
    userGames.sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    return userGames;
  }

  // 2. INSERT INTO games
  if (queryStr.includes('INSERT INTO games')) {
    const userId = values[0];
    const title = values[1];
    const prompt = values[2];
    const gameCode = values[3] || '';
    const description = values[4] || '';
    const newGame = {
      id: Math.random().toString(36).substring(2, 15),
      user_id: userId,
      title: title || 'Untitled Game',
      prompt: prompt || '',
      game_code: gameCode,
      description: description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.games.push(newGame);
    writeMockDb(db);
    return [newGame];
  }

  // 3. SELECT * FROM games WHERE id = ...
  if (queryStr.includes('SELECT * FROM games WHERE id =')) {
    const id = values[0];
    const game = db.games.find((g: any) => g.id === id);
    return game ? [game] : [];
  }

  // 4. UPDATE games SET ...
  if (queryStr.includes('UPDATE games SET')) {
    const id = values[values.length - 2];
    const userId = values[values.length - 1];
    const gameIndex = db.games.findIndex((g: any) => g.id === id && g.user_id === userId);
    if (gameIndex === -1) return [];

    const game = db.games[gameIndex];
    const setPart = queryStr.split('SET')[1].split('WHERE')[0];
    const assignments = setPart.split(',');
    assignments.forEach(assign => {
      const parts = assign.trim().split('=');
      const fieldName = parts[0].trim();
      const placeholder = parts[1]?.trim() || '';
      if (placeholder.startsWith('$')) {
        const index = parseInt(placeholder.substring(1)) - 1;
        game[fieldName] = values[index];
      }
    });
    game.updated_at = new Date().toISOString();
    db.games[gameIndex] = game;
    writeMockDb(db);
    return [game];
  }

  // 5. DELETE FROM games WHERE id = ...
  if (queryStr.includes('DELETE FROM games WHERE id =')) {
    const id = values[0];
    const userId = values[1];
    db.games = db.games.filter((g: any) => !(g.id === id && g.user_id === userId));
    writeMockDb(db);
    return [];
  }

  // 6. SELECT * FROM game_messages WHERE game_id = ...
  if (queryStr.includes('SELECT * FROM game_messages WHERE game_id =')) {
    const gameId = values[0];
    const msgs = db.game_messages.filter((m: any) => m.game_id === gameId);
    msgs.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return msgs;
  }

  // 7. INSERT INTO game_messages
  if (queryStr.includes('INSERT INTO game_messages')) {
    const gameId = values[0];
    const role = values[1];
    const content = values[2];
    const newMsg = {
      id: Math.random().toString(36).substring(2, 15),
      game_id: gameId,
      role: role,
      content: content,
      created_at: new Date().toISOString(),
    };
    db.game_messages.push(newMsg);
    writeMockDb(db);
    return [newMsg];
  }

  return [];
};

const mockSqlExecutor = (strings: any, ...values: any[]) => {
  if (Array.isArray(strings)) {
    let queryStr = '';
    strings.forEach((str, i) => {
      queryStr += str + (i < values.length ? `$${i + 1}` : '');
    });
    return mockQuery(queryStr, values);
  } else {
    return mockQuery(strings, values);
  }
};

const sql = (
  process.env.DATABASE_URL
    ? neon(process.env.DATABASE_URL)
    : mockSqlExecutor
) as any as SqlQueryFunction;

sql.query = sql;
sql.transaction = (callback: any) => callback(sql);

export default sql;
