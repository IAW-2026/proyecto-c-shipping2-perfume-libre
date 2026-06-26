import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id_orden: string;
    }>;
  }
) {
  try {
    const { id_orden } = await params;

    const envioResult = await db.query(
      `
      SELECT *
      FROM "Envio"
      WHERE "id_orden" = $1
      `,
      [id_orden]
    );

    if (envioResult.rows.length === 0) {
      return NextResponse.json(
        {
          estado: "error",
          mensaje: "Envio no encontrado",
        },
        { status: 404 }
      );
    }

    const envio = envioResult.rows[0];

    if (envio.estado_actual === "CANCELADO") {
      return NextResponse.json(
        {
          estado: "error",
          mensaje: "El envio ya está cancelado",
        },
        { status: 400 }
      );
    }

    await db.query(
      `
      UPDATE "Envio"
      SET "estado_actual" = $1
      WHERE "id_orden" = $2
      `,
      [
        "CANCELADO",
        id_orden,
      ]
    );

    await db.query(
      `
      INSERT INTO "EstadoEnvio"
      (
        "trackingId",
        "usuarioId",
        "tipo_estado",
        "fecha"
      )
      VALUES ($1,$2,$3,$4)
      `,
      [
        envio.trackingId,
        envio.usuarioId,
        "CANCELADO",
        new Date(),
      ]
    );
    return NextResponse.json({
      estado: "success",
      id_orden,
      trackingId: envio.trackingId,
      nuevo_estado: "CANCELADO",
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