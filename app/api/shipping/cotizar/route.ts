import { NextResponse } from "next/server";
import { cotizarEnvio } from "@/lib/ordenes";

export async function POST(req: Request) {
try {
 const body = await req.json();

 const {codigo_postal,direccion_entrega,
    } = body;

if (
      !codigo_postal ||
      !direccion_entrega
    ) {
      return NextResponse.json(
        {
          error: "Falta ingresar mas datos",
        },
        { status: 400 }
      );
    }


const opciones = await cotizarEnvio(codigo_postal,direccion_entrega);
return NextResponse.json({opciones});
}

 catch (error) {
    console.error("Error obteniendo cotizaciones mocks:", error);
    return NextResponse.json(
      { estado: "error", mensaje: "Error interno del servidor" },
      { status: 500 }
    );
  }}