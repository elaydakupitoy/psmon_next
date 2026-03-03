import sql, { ConnectionPool } from "mssql";

let pool: ConnectionPool | null = null;

const config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_HOST!,
  database: process.env.DB_NAME!,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Reusable singleton connection
export async function getConnection() {
  try {
    if (pool) {
      // Already connected
      return pool;
    }

    pool = await sql.connect(config);
    console.log("Connected to MSSQL");
    return pool;
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
}
