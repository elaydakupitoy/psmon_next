import { NextResponse } from "next/server";
import sql from "mssql";
import { getConnection } from "@/lib/mssql";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await context.params;
  const id = Number(rawId);

  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT TOP 1 * FROM sensors_enrolled WHERE id = @id");

    if (result.recordset.length > 0) {
      return NextResponse.json(result.recordset[0]);
    }

    return NextResponse.json({ kind: "not_found" }, { status: 404 });
  } catch (err: any) {
    console.error("error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
