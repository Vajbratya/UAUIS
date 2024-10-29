import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

neonConfig.fetchConnectionCache = true;

if (!process.env.VITE_DATABASE_URL) {
  throw new Error('Database URL not found in environment variables');
}

const sql = neon(process.env.VITE_DATABASE_URL);
export const db = drizzle(sql);

// Schema definitions will go here
export const schema = {
  users: {
    id: 'serial',
    email: 'text',
    name: 'text',
    createdAt: 'timestamp',
  },
  reports: {
    id: 'serial',
    userId: 'integer',
    content: 'text',
    status: 'text',
    createdAt: 'timestamp',
    updatedAt: 'timestamp',
  },
};
