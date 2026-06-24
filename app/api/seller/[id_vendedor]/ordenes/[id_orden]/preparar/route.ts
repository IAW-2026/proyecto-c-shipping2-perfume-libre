import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id_vendedor: string;
      id_orden: string;
    }>;
  }
) {
  const { id_vendedor, id_orden } = await params;
  const body = await req.json();
  const { trackingId } = body;

  try {

    // Obtener datos del envIO
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
          mensaje: "Envio no encontrado",
        },
        { status: 404 }
      );
    }
    const envio = envioResult.rows[0];

    if (envio.estado_actual !== "CREADO") {
      return NextResponse.json(
    {
      estado: "error",
      mensaje:
        "Solo pueden enviarse a preparación los envios recientemente CREADOs",
    },
    { status: 400 }
  );
}

    // Llamada a Seller
    const sellerResponse = await fetch(
      `${process.env.SELLER_URL}/api/seller/${envio.id_vendedor}/ordenes/${envio.id_orden}/preparar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_orden: envio.id_orden,
          trackingId,
        }),
      }
    );

    const sellerData =
      await sellerResponse.json();

    if (
      sellerData.estado !==
      "EN_PREPARACION"
    ) {
      return NextResponse.json(
        {
          estado: "error",
          mensaje:
            "Se rechazo la preparacion",
        },
        { status: 400 }
      );
    }

    // Actualizar tabla Envio
    await db.query(
      `
      UPDATE "Envio"
      SET "estado_actual" = $1
      WHERE "trackingId" = $2
      `,
      [
        "PREPARANDO",
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
        "PREPARANDO",
        new Date(),
      ]
    );

    // Actualizar PreparacionPedido
    await db.query(
      `
      UPDATE "PreparacionPedido"
      SET "tipo_estado_preparacion" = $1
      WHERE "id_orden" = $2
      `,
      ["EN_PREPARACION", id_orden]
    );

    return NextResponse.json({
      estado: "success",
      trackingId,
      nuevo_estado:
        "PREPARANDO",
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