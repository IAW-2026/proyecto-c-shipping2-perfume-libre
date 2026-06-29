import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      trackingId: string;
    }>;
  }
) {
  try {
    const { trackingId } =
      await params;

    await db.query(
      `
      DELETE FROM "PreparacionPedido"
      WHERE "trackingId" = $1
      `,
      [trackingId]
    );

    await db.query(
      `
      DELETE FROM "EstadoEnvio"
      WHERE "trackingId" = $1
      `,
      [trackingId]
    );

    const result = await db.query(
      `
      DELETE FROM "Envio"
      WHERE "trackingId" = $1
      RETURNING *
      `,
      [trackingId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          estado: "error",
          mensaje:
            "Envío no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      estado: "success",
      trackingId,
      mensaje:
        "Envío eliminado correctamente",
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