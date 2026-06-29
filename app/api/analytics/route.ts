import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  // const apiKey = request.headers.get("api_key");
  // if (apiKey !== process.env.SHIPPING_API_KEY) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const query = `
      SELECT estado_actual, COUNT(*) as count 
      FROM "Envio" 
      GROUP BY estado_actual
    `;
    const result = await db.query(query);

    const states = result.rows;
    const distribution: Record<string, number> = {};
    let total = 0;
    states.forEach((row: any) => {
      distribution[row.estado_actual] = parseInt(row.count, 10);
      total += parseInt(row.count, 10);
    });

    // Calcular demora promedio de los entregados
    const queryDemora = `
      SELECT AVG(demora_dias) as avg_demora 
      FROM "Envio" 
      WHERE estado_actual = 'ENTREGADO'
    `;
    const demoraResult = await db.query(queryDemora);
    const avgDemora = demoraResult.rows[0]?.avg_demora ? parseFloat(demoraResult.rows[0].avg_demora).toFixed(1) : 0;

    return NextResponse.json({
      totalEnvios: total,
      distribution,
      averageDemoraDias: avgDemora
    });
  } catch (error) {
    console.error("Error en analytics API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
