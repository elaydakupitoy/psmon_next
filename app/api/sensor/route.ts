import { NextResponse } from "next/server";
import { getConnection } from "@/lib/mssql";
import sql from "mssql";

export async function GET() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT TOP 10 * FROM STATIONS");

    return NextResponse.json(result.recordset);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Accept POST payloads from IoT devices/clients in the form:
// { PS_ID, SENSOR_ID, VALUE1, VALUE2, VALUE3 }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { PS_ID, SENSOR_ID, VALUE1, VALUE2, VALUE3 } = body as {
      PS_ID: string;
      SENSOR_ID: string;
      VALUE1: number;
      VALUE2?: number;
      VALUE3?: number;
    };

    if (!PS_ID || !SENSOR_ID || typeof VALUE1 !== "number") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const pool = await getConnection();

    // Adjust `SENSOR_DATA` and column names to match your schema.
    const tableName = "logtable";

    const query = `INSERT INTO ${tableName} (PS_ID, SENSOR_ID, VALUE1, VALUE2, VALUE3, timextamp)
                   VALUES (@PS_ID, @SENSOR_ID, @VALUE1, @VALUE2, @VALUE3, GETDATE())`;

    await pool
      .request()
      .input("PS_ID", sql.VarChar(100), PS_ID)
      .input("SENSOR_ID", sql.VarChar(100), SENSOR_ID)
      .input("VALUE1", sql.Decimal(18, 4), VALUE1)
      .input("VALUE2", sql.Decimal(18, 4), VALUE2 ?? 0)
      .input("VALUE3", sql.Decimal(18, 4), VALUE3 ?? 0)
      .query(query);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
