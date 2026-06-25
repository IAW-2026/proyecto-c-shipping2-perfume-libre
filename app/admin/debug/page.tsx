"use client";
import Sidebar from "@/app/components/Sidebar";
import styles from "../Admin.module.css";
import debugStyles from "./Debug.module.css";
import enviosStyles from "@/app/components/EnviosViewer.module.css";
import { useState } from "react";

export default function DebugPage() {
const direccionEntrega ="Calle Falsa 123";
const codigoPostal = "8000";
const [direccionPrueba, setDireccionPrueba] = useState("Calle Falsa 123");
const [codigoPostalPrueba, setCodigoPostalPrueba] = useState("8000");
const [cotizaciones, setCotizaciones] = useState<any[]>([]);
const [trackingId, setTrackingId] =useState<string | null>(null);
const [idOrden, setIdOrden] =useState<string | null>(null);
const [created, setCreated] = useState(false);
const [prepared, setPrepared] = useState(false);
const [retired, setRetired] = useState(false);
const [delivered, setDelivered] = useState(false);
const [canceled, setCanceled] = useState(false);
const [notEntregado, setNotEntregado] = useState(false);

const canCreate = !created && !canceled;
const canPrepare = created && !prepared && !canceled && !delivered && !notEntregado;
const canRetire = created && prepared && !retired && !canceled && !delivered && !notEntregado;
const canDeliver = created && retired && !delivered && !canceled && !notEntregado;
const canNoEntregar = created && retired && !notEntregado && !delivered && !canceled;
const canNotifyBuyer = created && !notEntregado && !delivered && !canceled;
const canCancel = created && !canceled;
const canDelete = !!trackingId;

async function cotizarEnvio() {
  if (!direccionPrueba.trim() || !codigoPostalPrueba.trim()) {
    alert("Ingrese dirección y código postal para cotizar.");
    return;
  }

  const response = await fetch(
    "/api/shipping/cotizar",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo_postal: codigoPostalPrueba,
        direccion_entrega: direccionPrueba,
      }),
    }
  );

  const data = await response.json();

  console.log("Cotizaciones:", data);

  if (response.ok) {
    setCotizaciones(data.opciones || []);
    alert(
      `Se encontraron ${data.opciones.length} opciones.`
    );
  } else {
    setCotizaciones([]);
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
  setCreated(true);
  setPrepared(false);
  setRetired(false);
  setDelivered(false);
  setCanceled(false);
  setNotEntregado(false);

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
    setPrepared(true);
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
    setRetired(true);
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
    setDelivered(true);
    setNotEntregado(false);
    alert(
      `Pedido ${idOrden} entregado`
    );
  } else {
    alert(data.mensaje);
  }
}
async function noEntregadoPedido() {
  if (!idOrden) {
    alert("Primero debe existir un pedido");
    return;
  }

  const response = await fetch(
    `/api/debug/no-entregado/${idOrden}`,
    {
      method: "POST",
    }
  );

  const data = await response.json();

  if (response.ok) {
    setNotEntregado(true);
    alert(
      `Pedido ${idOrden} marcado como NO_ENTREGADO`
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
async function cancelarEnvio() {
  if (!idOrden) {
    alert(
      "Primero debe crear un envío"
    );
    return;
  }

  const response = await fetch(
    `/api/debug/cancelar/${idOrden}`,
    {
      method: "POST",
    }
  );

  const data = await response.json();

  if (response.ok) {
    setCanceled(true);
    alert(
      `Pedido ${idOrden} cancelado`
    );
  } else {
    alert(data.mensaje);
  }
}
async function eliminarEnvio() {

  if (!trackingId) {
    alert(
      "No hay envío para eliminar"
    );
    return;
  }

  const response = await fetch(
    `/api/debug/envios/${trackingId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  console.log(data);

  if (response.ok) {
    alert(
      `Envío ${trackingId} eliminado`
    );
    setCanceled(false);
    setNotEntregado(false);

    setTrackingId(null);
    setIdOrden(null);
    setCreated(false);
    setPrepared(false);
    setRetired(false);
    setDelivered(false);
  } else {
    alert(data.mensaje);
  }
}
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <main className={styles.adminContainer}>
        <h1 className={styles.adminTitle}>Debug</h1>
        <div className={debugStyles.inputCard}>
          <h2>Prueba de cotización</h2>
          <div className={debugStyles.inputGrid}>
            <label className={debugStyles.inputLabel}>
              Dirección de entrega
              <input
                className={debugStyles.inputField}
                value={direccionPrueba}
                onChange={(event) => setDireccionPrueba(event.target.value)}
                placeholder="Calle Falsa 123"
              />
            </label>
            <label className={debugStyles.inputLabel}>
              Código postal
              <input
                className={debugStyles.inputField}
                value={codigoPostalPrueba}
                onChange={(event) => setCodigoPostalPrueba(event.target.value)}
                placeholder="8000"
              />
            </label>
          </div>
          <button className={`${debugStyles.button} ${enviosStyles.listItem} ${debugStyles.cotizarButton}`} onClick={cotizarEnvio}>
            Cotizar envio
          </button>
          <p className={debugStyles.inputHelp}>
            Estos valores se usan solo para cotizar. El envío se crea con los siguientes valores fijos:
            dirección de entrega Calle Falsa 123,
            código postal 8000,
            usuarioId 302,
            id_orden ORD-999,
            id_pedido PED-999,
            id_comprador 101,
            id_vendedor 201.
          </p>
          {cotizaciones.length > 0 ? (
            <div className={debugStyles.quoteResult}>
              <strong>Opciones encontradas:</strong> {cotizaciones.length}
              <ul>
                {cotizaciones.map((opcion, index) => (
                  <li key={index}>
                    {opcion.operador || opcion.tipo_servicio || JSON.stringify(opcion)} - {opcion.precio ? `$${opcion.precio}` : "sin precio"}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div className={debugStyles.trackingInfo}>
          <div className={debugStyles.trackingHeader}>
            <span className={debugStyles.trackingLabel}>Tracking ID actual:</span>
            <span className={debugStyles.trackingValue}>{trackingId || "Vacío"}</span>
          </div>
          <div className={debugStyles.trackingSteps}>
            <div className={`${debugStyles.step} ${created ? debugStyles.stepActive : ""}`}>
              <span className={debugStyles.stepIcon}>✓</span>
              Creado
            </div>
            <div className={`${debugStyles.step} ${prepared ? debugStyles.stepActive : ""}`}>
              <span className={debugStyles.stepIcon}>✓</span>
              Preparado
            </div>
            <div className={`${debugStyles.step} ${retired ? debugStyles.stepActive : ""}`}>
              <span className={debugStyles.stepIcon}>✓</span>
              Retirado
            </div>
            <div className={`${debugStyles.step} ${delivered ? debugStyles.stepActive : ""}`}>
              <span className={debugStyles.stepIcon}>✓</span>
              Entregado
            </div>
            <div className={`${debugStyles.step} ${notEntregado ? debugStyles.stepActive : ""}`}>
              <span className={debugStyles.stepIcon}>X</span>
              No entregado
            </div>
            <div className={`${debugStyles.step} ${canceled ? debugStyles.stepActive : ""}`}>
              <span className={debugStyles.stepIcon}>X</span>
              Cancelado
            </div>
          </div>
        </div>
        <div className={debugStyles.buttonContainer}>
          <button
            className={`${debugStyles.button} ${enviosStyles.listItem}`}
            onClick={crearEnvio}
            disabled={!canCreate}
          >
            Crear envio
          </button>
          <button className={`${debugStyles.button} ${enviosStyles.listItem}`} onClick={prepararPedido} disabled={!canPrepare}>
            Preparar pedido
          </button>
          <button className={`${debugStyles.button} ${enviosStyles.listItem}`} onClick={retirarPedido} disabled={!canRetire}>
            Retirar pedido
          </button>
          <button className={`${debugStyles.button} ${enviosStyles.listItem}`} onClick={entregarPedido} disabled={!canDeliver}>
            Entregar pedido
          </button>
          <button className={debugStyles.button} onClick={noEntregadoPedido} disabled={!canNoEntregar}>
            No entregar pedido
          </button>
          <button className={`${debugStyles.button} ${enviosStyles.listItem}`} onClick={notificarBuyer} disabled={!canNotifyBuyer}>
            Notificar buyer
          </button>
          <button className={`${debugStyles.button} ${enviosStyles.listItem}`} onClick={cancelarEnvio} disabled={!canCancel}>
            Cancelar envío
          </button>
          <button
            className={`${debugStyles.button} ${enviosStyles.listItem}`}
            onClick={eliminarEnvio}
            disabled={!canDelete}>
            Eliminar envío
          </button>
        </div>
      </main>
    </div>
  );
}
