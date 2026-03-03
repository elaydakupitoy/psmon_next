import { NextResponse } from "next/server";
import sql from "mssql";
import { getConnection } from "@/lib/mssql";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id?.trim()) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("id", sql.VarChar(100), id.trim())
      .query(`
        SELECT AVG(CAST(t.VALUE1 AS FLOAT)) AS mean_value1,
               MAX(timextamp) as timextamp
        FROM (
          SELECT TOP 10 VALUE1, timextamp
          FROM logtable
          WHERE SENSOR_ID = @id
          ORDER BY timextamp DESC
        ) AS t
      `);

    return NextResponse.json({
      sensor_id: id,
      mean_value1: result.recordset[0]?.mean_value1 ?? null,
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}