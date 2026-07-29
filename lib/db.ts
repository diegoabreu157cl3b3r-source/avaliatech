import mysql, { type Pool } from "mysql2/promise";

const requiredEnv = ["DB_HOST", "DB_USER", "DB_NAME"] as const;
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${key}`);
  }
}

declare global {
  // eslint-disable-next-line no-var
  var mysqlPool: Pool | undefined;
}

export const db =
  global.mysqlPool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    namedPlaceholders: true,
    timezone: "Z"
  });

if (process.env.NODE_ENV !== "production") {
  global.mysqlPool = db;
}

export async function query<T>(sql: string, params: Record<string, unknown> | unknown[] = []) {
  const [rows] = await db.execute(sql, params);
  return rows as T;
}
