import mysql from "mysql2/promise";
import { Client } from "pg";

// Run with the application in maintenance mode; source is read-only.
const tables = ["usuarios", "disciplinas", "assuntos", "questoes", "provas", "atividades", "recuperacao_senha", "verificacoes_email"];
if (!process.env.MYSQL_SOURCE_URL || !process.env.DATABASE_URL) {
  throw new Error("Configure MYSQL_SOURCE_URL e DATABASE_URL antes de migrar.");
}
const source = await mysql.createConnection({ uri: process.env.MYSQL_SOURCE_URL, timezone: "Z" });
const target = new Client({ connectionString: process.env.DATABASE_URL, options: "-c timezone=UTC" });
const quote = (name) => '"' + name.replaceAll('"', '""') + '"';
try {
  await target.connect();
  await source.query("SET time_zone = '+00:00'");
  await source.query("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ");
  await source.query("START TRANSACTION WITH CONSISTENT SNAPSHOT, READ ONLY");
  await target.query("BEGIN");
  await target.query(`LOCK TABLE ${tables.map(quote).join(", ")} IN ACCESS EXCLUSIVE MODE`);
  for (const table of tables) {
    const { rows } = await target.query(`SELECT 1 FROM ${quote(table)} LIMIT 1`);
    if (rows.length) throw new Error(`Destino deve estar vazio: ${table}. Nenhum dado foi substituído.`);
  }
  for (const table of tables) {
    const [columns] = await source.query("SELECT COLUMN_NAME AS name, DATA_TYPE AS type FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? ORDER BY ORDINAL_POSITION", [table]);
    if (!columns.length) throw new Error(`Tabela de origem ausente: ${table}. Atualize o MySQL com as migrations históricas antes de migrar.`);
    const { rows: targetColumns } = await target.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1", [table]);
    const allowed = new Set(targetColumns.map((column) => column.column_name));
    if (columns.some((column) => !allowed.has(column.name))) throw new Error(`Colunas não reconhecidas em ${table}. Revise o schema antes de migrar.`);
    let lastId = 0;
    let copied = 0;
    while (true) {
      const [rows] = await source.query(`SELECT * FROM \`${table}\` WHERE id > ? ORDER BY id LIMIT 250`, [lastId]);
      if (!rows.length) break;
      const values = [];
      const tuples = rows.map((row) => '(' + columns.map((column) => {
        let value = row[column.name];
        if (table === "recuperacao_senha" && column.name === "usado") value = Boolean(value);
        if (column.type === "date" && value instanceof Date) value = value.toISOString().slice(0, 10);
        values.push(value);
        return '$' + values.length;
      }).join(', ') + ')');
      await target.query(`INSERT INTO ${quote(table)} (${columns.map((column) => quote(column.name)).join(', ')}) VALUES ${tuples.join(', ')}`, values);
      lastId = rows.at(-1).id;
      copied += rows.length;
    }
    const [counts] = await source.query(`SELECT COUNT(*) AS total FROM \`${table}\``);
    const { rows: countsTarget } = await target.query(`SELECT COUNT(*) AS total FROM ${quote(table)}`);
    if (Number(counts[0].total) !== copied || Number(countsTarget[0].total) !== copied) throw new Error(`Contagem divergente em ${table}.`);
    await target.query(`SELECT setval(pg_get_serial_sequence($1, 'id'), COALESCE((SELECT MAX(id) FROM ${quote(table)}), 1), EXISTS (SELECT 1 FROM ${quote(table)}))`, [table]);
    console.log(`${table}: ${copied} registros conferidos.`);
  }
  await source.rollback();
  await target.query("COMMIT");
  console.log("Migração concluída. Dados de origem preservados.");
} catch (error) {
  await target.query("ROLLBACK").catch(() => {});
  await source.rollback().catch(() => {});
  // Do not print connection objects or credentials on failure.
  console.error("Migração cancelada:", error instanceof Error ? error.message : "erro desconhecido");
  process.exitCode = 1;
} finally {
  await source.end();
  await target.end();
}
