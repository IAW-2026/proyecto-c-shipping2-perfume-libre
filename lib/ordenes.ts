/* Opciones de envio devueltas por cotizacion */
export interface OpcionEnvio {
  operador: string;
  tipo_servicio: string;
  precio: number;
  demora_dias: number;
}
/* Funcion para cotizar opciones de envio */
export async function cotizarEnvio(
  codigoPostal: string,
  direccionEntrega: string
): Promise<OpcionEnvio[]> {

  const cp = Number(codigoPostal);
  // calculo basico para simular distancia
  //suponemos q nos basamos en nuestra localizacion (Bahia blanca)
  const factorDistancia =
    Math.abs(cp - 8000) / 1000;
   return[
    {
      operador: "Andreani",
      tipo_servicio: "COMUN",
      precio: Math.round(
        2000 + factorDistancia * 300
      ),
      demora_dias: Math.max(
        2,
        Math.round(3 + factorDistancia)
      ),
    },
        {
      operador: "Andreani",
      tipo_servicio: "EXPRESS",
      precio: Math.round(
        2500 + factorDistancia * 400
      ),
      demora_dias: Math.max(
        2,
        Math.round(3 + factorDistancia)
      ),
    },
    {
      operador: "Correo Argentino",
      tipo_servicio: "COMUN",
      precio: Math.round(
        1800 + factorDistancia * 250
      ),
      demora_dias: Math.max(
        4,
        Math.round(5 + factorDistancia)
      ),
    },
    {
      operador: "OCASA",
      tipo_servicio: "COMUN",
      precio: Math.round(
        2000 + factorDistancia * 350
      ),
      demora_dias: Math.max(
        2,
        Math.round(2 + factorDistancia)
      ),
    },
        {
      operador: "OCASA",
      tipo_servicio: "EXPRESS",
      precio: Math.round(
        3000 + factorDistancia * 350
      ),
      demora_dias: Math.max(
        2,
        Math.round(4 + factorDistancia)
      ),
    },
  ];
}