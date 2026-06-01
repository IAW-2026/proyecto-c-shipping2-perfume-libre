import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ trackingId: string }> }
) {
    try {
    const { trackingId } = await params;

    const result = await db.query(
      `
      SELECT "estado_actual"
      FROM "Envio"
      WHERE "trackingId" = $1
      `,
      [trackingId]
    );

    return NextResponse.json({
      trackingId,
      estado_actual: result.rows[0].estado_actual,
    });
    }
    catch (error) {
    console.error("Error obteniendo estado interno:", error);
    return NextResponse.json(
      { estado: "error", mensaje: "Error interno del servidor" },
      { status: 500 }
    );
    }
}