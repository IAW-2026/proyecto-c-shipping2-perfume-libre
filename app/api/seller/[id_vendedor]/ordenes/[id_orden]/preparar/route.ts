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
) {console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA");

  try {
    const { id_vendedor, id_orden } = await params;
  const body = await req.json();
  const { trackingId } = body;
console.log("BBBBBBBBBBBBBBBBBBBBB");
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
        "Solo pueden enviarse a preparacion los envios recientemente CREADOs",
    },
    { status: 400 }
  );
}
console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCC");
const sellerResponse = await fetch(
  `${process.env.SELLER_URL}/api/seller/${id_vendedor}/ordenes/${id_orden}/preparar`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id_orden,
      trackingId,
    }),
  }
);
if (!sellerResponse.ok) {
  return NextResponse.json(
    {
      estado: "error",
      mensaje: "Seller rechazo la preparación",
    },
    { status: 502 }
  );
}
console.log("DDDDDDDDDDDDDDDDDDDDD");
const sellerData = await sellerResponse.json();
if (sellerData.estado !== "EN_PREPARACION") {
  return NextResponse.json(
    {
      estado: "error",
      mensaje: "Seller no aceptó preparar el pedido",
    },
    { status: 400 }
  );
}
console.log("EEEEEEEEEEEEEEEEEEE");
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
console.log("FFFFFFFFFFFFFFFFFFFFFFFFF");
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
console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGG");
    // Actualizar PreparacionPedido
    await db.query(
      `
      UPDATE "PreparacionPedido"
      SET "tipo_estado_preparacion" = $1
      WHERE "id_orden" = $2
      `,
      ["EN_PREPARACION", id_orden]
    );
    console.log("HHHHHHHHHHHHHHHHHHHHHHHH");

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
      mensaje: "Error interno",
    },
    { status: 500 }
  );
  }
}