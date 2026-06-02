/* Opciones de envio devueltas por cotizacion */
export interface OpcionEnvio {
  operador: string;
  tipo_servicio: string;
  precio: number;
  demora_dias: number;
}
/*Base de datos Mockeada para opciones de envio*/
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
/* Funcion para cotizar opciones de envio */
export async function cotizarEnvio(
  codigoPostal: string,
  direccionEntrega: string
): Promise<OpcionEnvio[]> {

  // Por ahora no implementado
  //por ser mockeado de datos

  return MOCKED_OPCIONES_ENVIO_DB;
}