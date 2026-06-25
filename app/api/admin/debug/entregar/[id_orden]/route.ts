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
    console.log("id_orden recibido:", id_orden);
    // Buscar preparacion y tracking asociado
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

    // Obtener envío
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
            "Solo pueden entregarse envíos RETIRADOS",
        },
        { status: 400 }
      );
    }

    const fechaEntrega = new Date();

    // Actualizar envío
    await db.query(
      `
      UPDATE "Envio"
      SET
        "estado_actual" = $1,
        "fecha_entrega" = $2
      WHERE "trackingId" = $3
      `,
      [
        "ENTREGADO",
        fechaEntrega,
        trackingId,
      ]
    );

    // Registrar estado
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
        "ENTREGADO",
        fechaEntrega,
      ]
    );

    return NextResponse.json({
      estado: "success",
      id_orden,
      trackingId,
      fecha_entrega:
        fechaEntrega.toISOString(),
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