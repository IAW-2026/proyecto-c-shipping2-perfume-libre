export interface OpcionEnvio {
  operador: string;
  tipo_servicio: string;
  precio: number;
  demora_dias: number;
}
const MOCKED_OPCIONES_ENVIO_DB: OpcionEnvio[] = [
  {
    operador: "Andreani",
    tipo_servicio: "COMUN",
    precio: 2500,
    demora_dias: 3,
  },
  {
    operador: "Correo Argentino",
    tipo_servicio: "COMUN",
    precio: 1200,
    demora_dias: 10,
  },
  {
    operador: "OCA",
    tipo_servicio: "COMUN",
    precio: 4000,
    demora_dias: 3,
  },
];

export async function cotizarEnvio(
  codigoPostal: string,
  direccionEntrega: string
): Promise<OpcionEnvio[]> {

  // Por ahora no implementado
  //por ser mockeado de datos

  return MOCKED_OPCIONES_ENVIO_DB;
}