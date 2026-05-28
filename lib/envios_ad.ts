import { db } from "./db";

export async function getAllEnvios() {
   const result = await db.query(
    `
    SELECT *
    FROM "Envio"
    ORDER BY "trackingId"
    `
  );

  return result.rows.map((row: { fecha_entrega: { toISOString: () => any; }; }) => ({
    ...row,
    fecha_entrega: row.fecha_entrega ? row.fecha_entrega.toISOString() : null,
  }));
}
export async function getEstadosEnvio(trackingId: string) {
  const result = await db.query(
    `
    SELECT *
    FROM "EstadoEnvio"
    WHERE "trackingId" = $1
    ORDER BY id ASC
    `,
    [trackingId]
  );

  return result.rows;
}
