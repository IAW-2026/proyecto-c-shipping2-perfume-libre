import { db } from "@/lib/db";
/*endpoint para verificar que se esta conectado a la bd */
export async function GET() {
  const result = await db.query("SELECT NOW()");

  return Response.json(result.rows);
}