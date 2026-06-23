import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "Missing Neon database connection string. Set DATABASE_URL or NEON_DATABASE_URL."
    );
  }
  return databaseUrl;
}
let _sql;
function isNeonDatabaseUrl(databaseUrl) {
  try {
    const hostname = new URL(databaseUrl).hostname;
    return hostname.endsWith(".neon.tech") || hostname.endsWith(".neon.database.azure.com");
  } catch {
    return false;
  }
}
function getNeonSql() {
  if (!_sql) {
    const databaseUrl = getDatabaseUrl();
    _sql = isNeonDatabaseUrl(databaseUrl) ? neon(databaseUrl) : postgres(databaseUrl, {
      max: 1,
      ssl: "require"
    });
  }
  return _sql;
}
export {
  getNeonSql
};
