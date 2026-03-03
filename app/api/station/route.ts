import { NextResponse } from "next/server";
import { getConnection } from "@/lib/mssql";

export async function GET() {
  try {
    const pool = await getConnection();
  const result = await pool.request().query(
  `
   SELECT 'One' as StationName, 1 as Total FROM STATIONS
   UNION 
   SELECT 'Two' as StationName, 2   as Total FROM STATIONS
   UNION 
   SELECT 'Three' as StationName, 3 as Total  FROM STATIONS
   UNION 
   SELECT 'Four' as StationName, 4 as Total  FROM STATIONS
   UNION 
   SELECT 'Five' as StationName, 5 as Total  FROM STATIONS
   UNION 
   SELECT 'Six' as StationName, 6 as Total  FROM STATIONS
   UNION 
   SELECT 'Seven' as StationName, 7  as Total FROM STATIONS
   UNION 
   SELECT 'Eight' as StationName, 8  as Total FROM STATIONS
   UNION 
   SELECT 'Nine' as StationName, 9 as Total  FROM STATIONS
   UNION 
   SELECT 'Ten' as StationName, 10 as Total  FROM STATIONS
   UNION 
   SELECT 'Eleven' as StationName, 11 as Total  FROM STATIONS
   UNION 
   SELECT 'Twelve' as StationName, 12 as Total  FROM STATIONS
   UNION 
   SELECT 'Thirteen' as StationName, 13 as Total  FROM STATIONS
   UNION 
   SELECT 'Fourteen' as StationName, 14 as Total  FROM STATIONS
   UNION 
   SELECT 'Fifteen' as StationName, 15 as Total  FROM STATIONS`
);

    return NextResponse.json(result.recordset);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}