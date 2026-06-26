import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
      if (!req.headers.get("content-type")?.includes("application/json")) {
        return NextResponse.json(
                {
                estado: "error",
                mensaje:
                    "Content-Type invalido",
                },
                { status: 415 }
        );
    }
            const body = await req.json();
            const {id_orden,id_pedido,id_comprador,id_vendedor,
                    direccion_entrega,items,servicio_elegido,usuarioId} = body;
            if (!id_orden || !id_pedido || !id_comprador || !id_vendedor || !direccion_entrega || !items || !servicio_elegido) {
                return NextResponse.json(
                    { estado: "error", mensaje: "Falta ingresar mas datos" },
                    { status: 400 }
                );
            }
            const ultimoEnvio = await db.query(
            `SELECT "trackingId"
            FROM "Envio"
            ORDER BY CAST(
                REPLACE("trackingId",'TRK-','')
                AS INTEGER
            ) DESC
            LIMIT 1
            `);
            const ultimoNumero =
                ultimoEnvio.rows.length > 0
                    ? Number(
                        ultimoEnvio.rows[0].trackingId.replace(
                        "TRK-",
                        ""))
                    : 1000;

            const trackingId =`TRK-${ultimoNumero + 1}`;
            await db.query(
                `INSERT INTO "Envio" (
                "trackingId",
                "usuarioId",
                "id_orden",
                "id_comprador",
                "id_vendedor",
                "estado_actual",
                "direccion_entrega",
                "operador",
                "precio",
                "tipo_servicio",
                "demora_dias"
            )
            VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
            )
            `,[
                trackingId,
                usuarioId,
                id_orden,
                id_comprador,
                id_vendedor,
                "CREADO",
                direccion_entrega,
                servicio_elegido.operador,
                servicio_elegido.precio,
                servicio_elegido.tipo_servicio,
                servicio_elegido.demora_dias,
            ]
            );
            await db.query(
                `
                INSERT INTO "EstadoEnvio" (
                    "trackingId",
                    "usuarioId",
                    "tipo_estado",
                    "fecha"
                    )
                    VALUES ($1,$2,$3,$4)
                `,
                [
                    trackingId,
                    usuarioId,
                    "CREADO",
                    new Date(),
                ]
            );
           await db.query(
                `
                INSERT INTO "PreparacionPedido"
                  (
                    "trackingId",
                    "id_orden",
                    "id_pedido",
                    "tipo_estado_preparacion"
                )
                VALUES ($1,$2,$3,$4)
                `,
                [
                    
                    trackingId,
                    id_orden,
                    id_pedido,
                    "PENDIENTE",
                ]
                );

            return NextResponse.json(
                {
                    estado: "success",
                    trackingId,
                },
                { status: 201 }
                );
    }
    catch (error) {
    console.error("Error", error);
    return NextResponse.json(
      { estado: "error", mensaje: "Error interno del servidor" },
      { status: 500 }
    );
    }    
}