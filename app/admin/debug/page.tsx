"use client";
import Sidebar from "@/app/components/Sidebar";
import styles from "../Admin.module.css";
import debugStyles from "./Debug.module.css";
import { useState } from "react";

export default function DebugPage() {
const direccionEntrega ="Calle Falsa 123";
const codigoPostal = "8000";
const [trackingId, setTrackingId] =useState<string | null>(null);
const [idOrden, setIdOrden] =useState<string | null>(null);

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
  setTrackingId(data.trackingId);
  setIdOrden("ORD-999");

  alert(
    `Tracking generado: ${data.trackingId}`
  );
} else {
    alert(data.mensaje);
  }
}
async function prepararPedido() {

  if (!idOrden || !trackingId) {
    alert(
      "Primero debe crear un envío"
    );
    return;
  }

  const response = await fetch(
    `/api/seller/201/ordenes/${idOrden}/preparar`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trackingId,
      }),
    }
  );

  const data = await response.json();

  console.log(data);

  if (response.ok) {
    alert(
      `Pedido ${idOrden} en preparación`
    );
  } else {
    alert(data.mensaje);
  }
}
async function retirarPedido() {

  if (!idOrden) {
    alert(
      "Primero debe crear y preparar un envío"
    );
    return;
  }

  const response = await fetch(
    `/api/shipping/ordenes/${idOrden}/retirado`,
    {
      method: "POST",
    }
  );

  const data = await response.json();

  console.log(data);

  if (response.ok) {
    alert(
      `Pedido ${idOrden} retirado`
    );
  } else {
    alert(data.mensaje);
  }
}
async function entregarPedido() {
console.log(
  "ENTRO A /api/debug/entregar"
);
  if (!idOrden) {
    alert(
      "Primero debe retirar el pedido"
    );
    return;
  }
console.log("idOrden =", idOrden);
  const response = await fetch(
    `/api/debug/entregar/${idOrden}`,
    {
      method: "POST",
    }
  );

  const data = await response.json();

  console.log(data);

  if (response.ok) {
    alert(
      `Pedido ${idOrden} entregado`
    );
  } else {
    alert(data.mensaje);
  }
}
async function notificarBuyer() {

  if (!trackingId) {
    alert(
      "Primero debe crear un envío"
    );
    return;
  }

  const response = await fetch(
    "/api/notificaciones",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        trackingId,
        fecha_entrega:
          new Date().toISOString(),
        estado: "ENTREGADO",
      }),
    }
  );

  const data = await response.json();

  console.log(data);

  if (response.ok) {
    alert(
      "Buyer fue notificado correctamente"
    );
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
          <button className={debugStyles.button} onClick={prepararPedido}>
            Preparar pedido
          </button>
          <button className={debugStyles.button} onClick={retirarPedido}>
            Retirar pedido
          </button>
          <button className={debugStyles.button} onClick={entregarPedido}>
            Entregar pedido
          </button>
          <button className={debugStyles.button} onClick={notificarBuyer}>
            Notificar buyer
          </button>
        </div>
      </main>
    </div>
  );
}
