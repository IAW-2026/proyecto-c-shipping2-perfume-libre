import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      "id-orden": string;
    }>;
  }
) {
  const { "id-orden": id_orden } = await params;

  try {

    // Buscar preparación asociada a la orden
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

    const preparacion =
      preparacionResult.rows[0];

    // Validar estado actual
    if (
      preparacion.tipo_estado_preparacion !==
      "EN_PREPARACION"
    ) {
      return NextResponse.json(
        {
          estado: "error",
          mensaje:
            "El pedido no está en preparacin",
        },
        { status: 400 }
      );
    }

    const trackingId =
      preparacion.trackingId;

    const fechaRetiro =
      new Date();

    // Actualizar PreparacionPedido
    await db.query(
      `
      UPDATE "PreparacionPedido"
      SET "tipo_estado_preparacion" = $1
      WHERE "id_orden" = $2
      `,
      [
        "LISTO_PARA_RETIRO",
        id_orden,
      ]
    );

    // Obtener usuario del envio
    const envioResult = await db.query(
      `
      SELECT *
      FROM "Envio"
      WHERE "trackingId" = $1
      `,
      [trackingId]
    );

    const envio =
      envioResult.rows[0];

    // Actualizar Envio
    await db.query(
      `
      UPDATE "Envio"
      SET "estado_actual" = $1
      WHERE "trackingId" = $2
      `,
      [
        "RETIRADO",
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
        "RETIRADO",
        fechaRetiro,
      ]
    );

    return NextResponse.json({
      id_orden,
      trackingId,
      fecha_retiro:
        fechaRetiro.toISOString(),
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