"use client";

export default function SimularCompra() {
  async function crearEnvio() {
    const datos = {
      usuarioId: "user_demo",
      id_orden: "ORD-999",
      id_comprador: "101",
      id_vendedor: "201",
      direccion_entrega: "Av. Siempre Viva 123",
      items: [
        {
          id_producto: "P001",
          nombre: "Perfume",
        },
      ],
      servicio_elegido: {
        operador: "Andreani",
        tipo_servicio: "COMUN",
        precio: 2500,
        demora_dias: 3,
      },
    };

    console.log("Buyer a Shipping");
    console.log(datos);
  }

  return (
    <button onClick={crearEnvio}>
      Simular compra
    </button>
  );
}