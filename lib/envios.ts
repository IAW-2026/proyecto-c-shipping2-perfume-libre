import { db } from "./db";

export async function getEnvios() {
  const result = await db.query('SELECT * FROM "Envio" ORDER BY "trackingId"');

  return result.rows.map((row: { fecha_entrega: { toISOString: () => any; }; }) => ({
    ...row,
    fecha_entrega: row.fecha_entrega ? row.fecha_entrega.toISOString() : null,
  }));
}
