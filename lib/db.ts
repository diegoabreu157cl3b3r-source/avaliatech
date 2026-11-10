import { Pool, types, type PoolClient } from "pg";

export type DbValue = string | number | boolean | Date | Buffer | null | undefined;
type DbParams = Record<string, DbValue>;
export interface MutationResult {
  insertId: number;
  affectedRows: number;
}

declare global {
  // eslint-disable-next-line no-var
  var postgresPool: Pool | undefined;
}

// Preserve the numeric API contract for COUNT (int8 in PostgreSQL).
types.setTypeParser(20, (value) => {
  const number = Number(value);
  if (!Number.isSafeInteger(number)) throw new RangeError("Inteiro fora do limite seguro.");
  return number;
});
types.setTypeParser(1082, (value) => new Date(`${value}T00:00:00.000Z`));

const pool = global.postgresPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  options: "-c timezone=UTC",
});

pool.on("error", (error) => console.error("Erro na conexão PostgreSQL:", error));
if (process.env.NODE_ENV !== "production") global.postgresPool = pool;

function configuredPool() {
  if (!process.env.DATABASE_URL) {
    for (const key of ["DB_HOST", "DB_USER", "DB_NAME"] as const) {
      if (!process.env[key]) throw new Error(`Variável de ambiente obrigatória ausente: DATABASE_URL ou ${key}`);
    }
  }
  return pool;
}

// Bind named parameters through pg; skip SQL strings, identifiers, comments and casts.
export function bindParams(sql: string, params: DbParams = {}) {
  const values: DbValue[] = [];
  const positions = new Map<string, number>();
  const text = sql.replace(
    /'(?:''|[^'])*'|"(?:""|[^"])*"|--[^\n]*|\/\*[\s\S]*?\*\/|\$([a-zA-Z_][a-zA-Z_0-9]*)?\$[\s\S]*?\$\1\$|::[a-zA-Z_][a-zA-Z_0-9]*|:([a-zA-Z_][a-zA-Z_0-9]*)/g,
    (token, _tag: string | undefined, name: string | undefined) => {
      if (!name) return token;
      if (!Object.prototype.hasOwnProperty.call(params, name)) {
        throw new Error(`Parâmetro SQL ausente: ${name}`);
      }
      if (!positions.has(name)) {
        values.push(params[name]);
        positions.set(name, values.length);
      }
      return `$${positions.get(name)}`;
    }
  );
  return { text, values };
}

async function execute<T extends MutationResult = MutationResult>(
  target: Pool | PoolClient, sql: string, params: DbParams = {}
): Promise<[T]> {
  const result = await target.query(bindParams(sql, params));
  return [{ insertId: Number(result.rows[0]?.id ?? 0), affectedRows: result.rowCount ?? 0 } as T];
}

export const db = {
  execute: <T extends MutationResult = MutationResult>(sql: string, params?: DbParams) =>
    execute<T>(configuredPool(), sql, params),
  async getConnection() {
    const client = await configuredPool().connect();
    return {
      execute: <T extends MutationResult = MutationResult>(sql: string, params?: DbParams) =>
        execute<T>(client, sql, params),
      beginTransaction: () => client.query("BEGIN"),
      commit: () => client.query("COMMIT"),
      rollback: () => client.query("ROLLBACK"),
      release: () => client.release(),
    };
  },
};

export async function query<T>(sql: string, params: DbParams = {}): Promise<T> {
  const result = await configuredPool().query(bindParams(sql, params));
  return result.rows as T;
}
