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

    const preparacionResult = await db.query(
      `
      SELECT *
      FROM "PreparacionPedido"
      WHERE "id_orden" = $1
      `,
      [id_orden]
    );

    if (preparacionResult.rows.length === 0) {
      return NextResponse.json(
        {
          estado: "error",
          mensaje: "Pedido no encontrado",
        },
        { status: 404 }
      );
    }

    const trackingId =
      preparacionResult.rows[0].trackingId;

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

    if (envio.estado_actual !== "RETIRADO") {
      return NextResponse.json(
        {
          estado: "error",
          mensaje:
            "Solo pueden marcarse como NO_ENTREGADO los envíos RETIRADOS",
        },
        { status: 400 }
      );
    }

    const fechaIntento = new Date();

    // Actualizar envío
    await db.query(
      `
      UPDATE "Envio"
      SET "estado_actual" = $1
      WHERE "trackingId" = $2
      `,
      [
        "NO_ENTREGADO",
        trackingId,
      ]
    );

    // Registrar nuevo estado
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
        trackingId,
        envio.usuarioId,
        "NO_ENTREGADO",
        fechaIntento,
      ]
    );

    return NextResponse.json({
      estado: "success",
      id_orden,
      trackingId,
      nuevo_estado:
        "NO_ENTREGADO",
      fecha:
        fechaIntento.toISOString(),
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