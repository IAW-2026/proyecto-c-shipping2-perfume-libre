import { db } from "./db";
/*envioss asociados a un usuario */
export async function getEnvios( usuarioId: string) {
   const result = await db.query(
    `
    SELECT *
    FROM "Envio"
    WHERE "usuarioId" = $1
    ORDER BY CAST(
      REPLACE("trackingId", 'TRK-', '')
      AS INTEGER
    ) DESC
    `,
    [usuarioId]
  );

  return result.rows.map((row: { fecha_entrega: { toISOString: () => any; }; }) => ({
    ...row,
    fecha_entrega: row.fecha_entrega ? row.fecha_entrega.toISOString() : null,
  }));
}
/* historial de estados de un envio */
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
