import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import devServer from '@hono/vite-dev-server';
import Database from 'better-sqlite3';
import fs from 'fs';

// Initialize local SQLite database for preview environment mock of D1
const dbDir = path.resolve(__dirname, '.data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}
const dbPath = path.resolve(dbDir, 'local_d1.sqlite');
const sqlite = new Database(dbPath);

// Initialize tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS scanned_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT,
    calories INTEGER,
    health_score INTEGER,
    description TEXT,
    image_b64 TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Mock D1 Database API for local development
const mockD1Database = {
  prepare: (query: string) => {
    return {
      bind: (...params: any[]) => {
        return {
          all: async () => {
            try {
              const stmt = sqlite.prepare(query);
              const results = stmt.all(...params);
              return { results, success: true };
            } catch (error: any) {
              console.error('D1 Mock Error (all):', error);
              throw error;
            }
          },
          run: async () => {
            try {
              const stmt = sqlite.prepare(query);
              const result = stmt.run(...params);
              return { success: true, results: result };
            } catch (error: any) {
              console.error('D1 Mock Error (run):', error);
              throw error;
            }
          }
        };
      },
      all: async () => {
        try {
          const stmt = sqlite.prepare(query);
          const results = stmt.all();
          return { results, success: true };
        } catch (error: any) {
          console.error('D1 Mock Error (all):', error);
          throw error;
        }
      },
      run: async () => {
            try {
              const stmt = sqlite.prepare(query);
              const result = stmt.run();
              return { success: true, results: result };
            } catch (error: any) {
              console.error('D1 Mock Error (run):', error);
              throw error;
            }
      }
    };
  }
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        devServer({
          entry: 'server/index.ts',
          exclude: [
            /^@.+$/,
            /.*\.(ts|tsx|vue)($|\?)/,
            /.*\.(s?css|less)($|\?)/,
            /^\/favicon\.ico$/,
            /.*\.(svg|png)($|\?)/,
            /^\/(src|components|hooks|lib)\/.*/,
          ],
          injectClientScript: false,
          env: {
            DB: mockD1Database
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
