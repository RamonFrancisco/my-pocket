import database from "infra/database";
import { NextResponse } from "next/server";

export async function GET() {
  const updatedAt = new Date().toISOString();

  const dbVersion = await database.query("SHOW server_version;");
  const dbVersionResult = dbVersion.rows[0].server_version;

  const dbMaxConnections = await database.query("SHOW max_connections;");
  const dbMaxConnectionsResult = dbMaxConnections.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const dbOpenedConnectios = await database.query({
    text: "SELECT count(*)::int from pg_stat_activity WHERE datname = $1",
    values: [databaseName],
  });
  const dbOpenedConnectiosResult = dbOpenedConnectios.rows[0].count;

  return NextResponse.json(
    {
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: dbVersionResult,
          max_connections: parseInt(dbMaxConnectionsResult),
          opened_connections: dbOpenedConnectiosResult,
        },
      },
    },
    { status: 200 },
  );
}
