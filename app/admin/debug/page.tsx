"use client";
import Sidebar from "@/app/components/Sidebar";
import styles from "../Admin.module.css";
import debugStyles from "./Debug.module.css";

export default function DebugPage() {
const direccionEntrega ="Calle Falsa 123";
const codigoPostal = "8000";
async function cotizarEnvio() {
  const response = await fetch(
    "/api/shipping/cotizar",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo_postal: codigoPostal,
        direccion_entrega: direccionEntrega,
      }),
    }
  );

  const data = await response.json();

  console.log("Cotizaciones:", data);

  if (response.ok) {
    alert(
      `Se encontraron ${data.opciones.length} opciones.`
    );
  } else {
    alert(data.error);
  }
}
  async function crearEnvio() {
  const response = await fetch(
    "/api/shipping/ordenes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuarioId: "302",
        id_orden: "ORD-999",
        id_pedido: "PED-999",
        id_comprador: "101",
        id_vendedor: "201",
        direccion_entrega: direccionEntrega,
        items: [
          {
            id_producto: "PROD-1",
            cantidad: 1,
          },
        ],
        servicio_elegido: {
          operador: "Andreani",
          tipo_servicio: "COMUN",
          precio: 3500,
          demora_dias: 3,
        },
      }),
    }
  );

  const data = await response.json();

  console.log(data);

  if (response.ok) {
    alert(`Tracking generado ${data.trackingId}`);
  } else {
    alert(data.mensaje);
  }
}
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <main className={styles.adminContainer}>
        <h1 className={styles.adminTitle}>Debug</h1>
        <div className={debugStyles.buttonContainer}>
          <button className={debugStyles.button} onClick={cotizarEnvio}>
            Cotizar envio
          </button>
          <button className={debugStyles.button} onClick={crearEnvio}>
            Crear envio
          </button>
          <button className={debugStyles.button}>Boton 3</button>
          <button className={debugStyles.button}>Boton 4</button>
        </div>
      </main>
    </div>
  );
}
