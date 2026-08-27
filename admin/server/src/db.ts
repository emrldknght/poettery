import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';

// База будет лежать в admin/server/admin.db
const sqlite = new Database(path.join(__dirname, '..', 'admin.db'));
export const db = drizzle(sqlite, { schema });