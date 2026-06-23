import process from "node:process";
import postgres from "postgres";
import mysql from "mysql2/promise";

const args = new Set(process.argv.slice(2));
const write = args.has("--write");
const truncate = args.has("--truncate");

const sourceUrl =
  process.env.SOURCE_DATABASE_URL ||
  process.env.DATABASE_URL;
const targetUrl = process.env.MYSQL_DATABASE_URL;

if (!sourceUrl) {
  throw new Error("Set SOURCE_DATABASE_URL or DATABASE_URL for the Postgres source.");
}

if (!targetUrl) {
  throw new Error("Set MYSQL_DATABASE_URL for the MySQL target, for example mysql://user:pass@host:3306/database.");
}

const pg = postgres(sourceUrl, { ssl: "require", max: 1 });
const my = await mysql.createConnection(targetUrl);

function quoteId(value) {
  return `\`${String(value).replaceAll("`", "``")}\``;
}

function mysqlColumnType(column) {
  const dataType = String(column.data_type ?? "").toLowerCase();
  const udtName = String(column.udt_name ?? "").toLowerCase();

  if (dataType === "array" || udtName.startsWith("_")) return "JSON";
  if (dataType === "json" || dataType === "jsonb") return "JSON";
  if (dataType === "uuid") return "CHAR(36)";
  if (dataType === "boolean") return "BOOLEAN";
  if (dataType === "smallint") return "SMALLINT";
  if (dataType === "integer") return "INT";
  if (dataType === "bigint") return "BIGINT";
  if (dataType === "real") return "FLOAT";
  if (dataType === "double precision") return "DOUBLE";
  if (dataType === "numeric" || dataType === "decimal") {
    const precision = Number(column.numeric_precision);
    const scale = Number(column.numeric_scale);
    return Number.isFinite(precision) && precision > 0
      ? `DECIMAL(${precision},${Number.isFinite(scale) ? scale : 0})`
      : "DECIMAL(20,6)";
  }
  if (dataType === "date") return "DATE";
  if (dataType.includes("timestamp")) return "DATETIME(3)";
  if (dataType === "time without time zone" || dataType === "time with time zone") return "TIME";
  if (dataType === "character varying" || dataType === "varchar") {
    const length = Number(column.character_maximum_length);
    return Number.isFinite(length) && length > 0 ? `VARCHAR(${Math.min(length, 16383)})` : "TEXT";
  }
  if (dataType === "character" || dataType === "char") {
    const length = Number(column.character_maximum_length);
    return Number.isFinite(length) && length > 0 ? `CHAR(${Math.min(length, 255)})` : "CHAR(1)";
  }
  if (dataType === "text") return "LONGTEXT";
  if (dataType === "bytea") return "LONGBLOB";

  return "LONGTEXT";
}

function normalizeValue(value) {
  if (value === undefined) return null;
  if (value instanceof Date) return value;
  if (Array.isArray(value) || (value && typeof value === "object")) return JSON.stringify(value);
  return value;
}

async function getTables() {
  return pg`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_type = 'BASE TABLE'
    order by table_name
  `;
}

async function getColumns(tableName) {
  return pg`
    select column_name, data_type, udt_name, is_nullable, column_default,
           character_maximum_length, numeric_precision, numeric_scale,
           ordinal_position
    from information_schema.columns
    where table_schema = 'public'
      and table_name = ${tableName}
    order by ordinal_position
  `;
}

async function getPrimaryKeyColumns(tableName) {
  const rows = await pg`
    select kcu.column_name
    from information_schema.table_constraints tc
    join information_schema.key_column_usage kcu
      on tc.constraint_name = kcu.constraint_name
     and tc.table_schema = kcu.table_schema
     and tc.table_name = kcu.table_name
    where tc.table_schema = 'public'
      and tc.table_name = ${tableName}
      and tc.constraint_type = 'PRIMARY KEY'
    order by kcu.ordinal_position
  `;

  return rows.map((row) => String(row.column_name));
}

async function ensureTable(tableName, columns, primaryKeys) {
  const columnSql = columns.map((column) => {
    const name = quoteId(column.column_name);
    const type = mysqlColumnType(column);
    const nullable = column.is_nullable === "NO" ? "NOT NULL" : "NULL";
    return `${name} ${type} ${nullable}`;
  });
  const primarySql = primaryKeys.length
    ? [`, PRIMARY KEY (${primaryKeys.map(quoteId).join(", ")})`]
    : [];

  await my.execute(
    `CREATE TABLE IF NOT EXISTS ${quoteId(tableName)} (${columnSql.join(", ")}${primarySql.join("")}) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  );
}

async function copyRows(tableName, columns, primaryKeys) {
  const rows = await pg.unsafe(`select * from "${tableName.replaceAll('"', '""')}"`);
  if (rows.length === 0) return 0;

  const columnNames = columns.map((column) => String(column.column_name));
  const placeholders = columnNames.map(() => "?").join(", ");
  const insertColumns = columnNames.map(quoteId).join(", ");
  const updates = primaryKeys.length
    ? columnNames
        .filter((columnName) => !primaryKeys.includes(columnName))
        .map((columnName) => `${quoteId(columnName)} = VALUES(${quoteId(columnName)})`)
        .join(", ")
    : "";
  const sql = `INSERT INTO ${quoteId(tableName)} (${insertColumns}) VALUES (${placeholders})${
    updates ? ` ON DUPLICATE KEY UPDATE ${updates}` : ""
  }`;

  for (const row of rows) {
    await my.execute(
      sql,
      columnNames.map((columnName) => normalizeValue(row[columnName])),
    );
  }

  return rows.length;
}

try {
  const tables = await getTables();

  console.log(`Found ${tables.length} public table(s) in Postgres.`);
  if (!write) {
    console.log("Dry run only. Re-run with --write to create/copy into MySQL.");
  }

  for (const table of tables) {
    const tableName = String(table.table_name);
    const columns = await getColumns(tableName);
    const primaryKeys = await getPrimaryKeyColumns(tableName);
    const [{ count }] = await pg.unsafe(`select count(*)::int as count from "${tableName.replaceAll('"', '""')}"`);

    console.log(`${tableName}: ${count} row(s), ${columns.length} column(s)`);
    if (!write) continue;

    await ensureTable(tableName, columns, primaryKeys);
    if (truncate) {
      await my.execute(`DELETE FROM ${quoteId(tableName)}`);
    }
    const copied = await copyRows(tableName, columns, primaryKeys);
    console.log(`  copied ${copied} row(s)`);
  }

  console.log(write ? "Copy finished." : "Dry run finished.");
} finally {
  await pg.end({ timeout: 5 }).catch(() => {});
  await my.end().catch(() => {});
}
