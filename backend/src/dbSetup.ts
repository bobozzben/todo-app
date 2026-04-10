import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Client } from 'pg';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL ?? '';
if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set in the environment.');
}

function getDatabaseName(url: string): string {
  const parsed = new URL(url);
  const dbName = parsed.pathname?.startsWith('/') ? parsed.pathname.slice(1) : parsed.pathname;
  if (!dbName) {
    throw new Error('DATABASE_URL must include a database name.');
  }
  return dbName;
}

function buildAdminConnectionString(url: string): string {
  const parsed = new URL(url);
  parsed.searchParams.delete('schema');
  parsed.pathname = '/postgres';
  return parsed.toString();
}

export async function ensureDatabaseSetup(): Promise<void> {
  await ensureDatabaseExists();
  await ensureTablesExist();
}

async function ensureDatabaseExists(): Promise<void> {
  const dbName = getDatabaseName(databaseUrl);
  if (['postgres', 'template1'].includes(dbName.toLowerCase())) {
    return;
  }

  const adminConnectionString = buildAdminConnectionString(databaseUrl);
  const adminClient = new Client({ connectionString: adminConnectionString });

  try {
    await adminClient.connect();
    const result = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (result.rowCount === 0) {
      console.log(`Database \"${dbName}\" does not exist. Creating...`);
      await adminClient.query(`CREATE DATABASE \"${dbName}\"`);
      console.log(`Database \"${dbName}\" created successfully.`);
    }
  } finally {
    await adminClient.end();
  }
}

async function ensureTablesExist(): Promise<void> {
  const prisma = new PrismaClient();

  const createUserTableSql = `
    CREATE TABLE IF NOT EXISTS \"User\" (
      \"id\" SERIAL PRIMARY KEY,
      \"email\" TEXT NOT NULL UNIQUE,
      \"name\" TEXT NOT NULL,
      \"password\" TEXT NOT NULL,
      \"phone\" TEXT,
      \"address\" TEXT,
      \"company\" TEXT,
      \"position\" TEXT,
      \"notes\" TEXT,
      \"createdAt\" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      \"updatedAt\" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  const createTaskTableSql = `
    CREATE TABLE IF NOT EXISTS \"Task\" (
      \"id\" SERIAL PRIMARY KEY,
      \"title\" TEXT NOT NULL,
      \"description\" TEXT,
      \"completed\" BOOLEAN NOT NULL DEFAULT false,
      \"userId\" INTEGER NOT NULL,
      \"createdAt\" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      \"updatedAt\" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT \"Task_userId_fkey\" FOREIGN KEY (\"userId\") REFERENCES \"User\"(\"id\") ON DELETE CASCADE
    );
  `;

  try {
    await prisma.$executeRawUnsafe(createUserTableSql);
    await prisma.$executeRawUnsafe(createTaskTableSql);
  } finally {
    await prisma.$disconnect();
  }
}
