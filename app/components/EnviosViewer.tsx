"use client";

import { useState } from "react";
import styles from "./EnviosViewer.module.css";

export interface Envio {
  trackingId: string;
  id_orden: string;
  id_comprador: string;
  id_vendedor: string;
  estado_actual?: string | null;
  fecha_entrega?: string | null;
  direccion_entrega: string;
  operador: string;
  precio: number;
  tipo_servicio: string;
  demora_dias: number;
  [key: string]: unknown;
}

type EnviosViewerProps = {
  envios: Envio[];
};

export default function EnviosViewer({ envios }: EnviosViewerProps) {
  const sortedEnvios = [...envios].sort((a, b) =>
    b.trackingId.localeCompare(a.trackingId)
  );

  const [selected, setSelected] = useState(0);
  const currentEnvio = sortedEnvios[selected];

  return (
    <div className={styles.root}>
      <div className={styles.sidebar}>
        <h2 className={styles.title}>Historial de envios:</h2>
       <div className={styles.list}>
  {sortedEnvios.map((envio, index) => (
    <button
      key={envio.trackingId}
      className={`${styles.listItem} ${
        selected === index ? styles.activeItem : ""
      }`}
      onClick={() => setSelected(index)}
    >
      {envio.trackingId}
    </button>
  ))}
</div>
      </div>
      <div className={styles.details}>
        <h2 className={styles.title}>Envío:</h2>
        {currentEnvio ? (
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.label}>Tracking ID:</span>
              <span>{currentEnvio.trackingId}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>ID Orden:</span>
              <span>{currentEnvio.id_orden}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Comprador:</span>
              <span>{currentEnvio.id_comprador}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Vendedor:</span>
              <span>{currentEnvio.id_vendedor}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Estado:</span>
              <span>{currentEnvio.estado_actual}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Fecha de entrega:</span>
              <span>
                {currentEnvio.fecha_entrega
                  ? new Date(currentEnvio.fecha_entrega).toLocaleString("es-AR", {
                      timeZone: "UTC",
                    })
                  : "Pendiente"}
              </span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Dirección:</span>
              <span>{currentEnvio.direccion_entrega}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Operador:</span>
              <span>{currentEnvio.operador}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Precio:</span>
              <span>${currentEnvio.precio}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Tipo de servicio:</span>
              <span>{currentEnvio.tipo_servicio}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Demora:</span>
              <span>{currentEnvio.demora_dias} días</span>
            </div>
          </div>
        ) : (
          <p>No hay envios disponibles.</p>
        )}
      </div>
    </div>
  );
}
