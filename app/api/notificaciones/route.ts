import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      trackingId,
      fecha_entrega,
      estado,
    } = body;

    if (
      !trackingId ||
      !fecha_entrega ||
      !estado
    ) {
      return NextResponse.json(
        {
          estado: "error",
          mensaje: "Faltan datos",
        },
        { status: 400 }
      );
    }

    const envioResult = await db.query(
      `
      SELECT *
      FROM "Envio"
      WHERE "trackingId" = $1
      `,
      [trackingId]
    );

    if (envioResult.rows.length === 0) {
      return NextResponse.json(
        {
          estado: "error",
          mensaje: "Envío no encontrado",
        },
        { status: 404 }
      );
    }

    const envio = envioResult.rows[0];

    if (
      envio.estado_actual !==
      "ENTREGADO"
    ) {
      return NextResponse.json(
        {
          estado: "error",
          mensaje:
            "El envío aún no fue entregado",
        },
        { status: 400 }
      );
    }
    return NextResponse.json({
      estado: "success",
      mensaje:
        "Notificación enviada correctamente",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        estado: "error",
        mensaje:
          "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}