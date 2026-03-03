import { NextRequest, NextResponse } from "next/server";
import sql, { config as SQLConfig } from "mssql";

const dbConfig: SQLConfig = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  server: process.env.DB_HOST as string,
  database: process.env.DB_NAME as string,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const selectedDate = searchParams.get("date");

  if (!selectedDate) {
    return NextResponse.json(
      { error: "Date is required" },
      { status: 400 }
    );
  }

  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool
      .request()
      .input("SelectedDate", sql.Date, selectedDate)
      .execute("TimeBucketReading_30Min");

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error("DB ERROR:", error);
    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}