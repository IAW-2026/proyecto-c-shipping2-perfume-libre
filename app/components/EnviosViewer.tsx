"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./EnviosViewer.module.css";
import Link from "next/link";
/*Info de un envio*/
export interface Envio {
  trackingId: string;
  usuarioId: string;
  showUsuarioId?: boolean;
  id_orden: string;
  id_comprador: string;
  id_vendedor: string;
  estado_actual: string;
  fecha_entrega?: string | null;
  direccion_entrega: string;
  operador: string;
  precio: number;
  tipo_servicio: string;
  demora_dias: number;
}

type EnviosViewerProps = {
  envios: Envio[];  showUsuarioId?: boolean;  onSelectedChange?: (envio: Envio | null) => void;
};
//Estados para filtrar un envio
const ESTADOS = [
  "TODOS",
  "CREADO",
  "PREPARANDO",
  "RETIRADO",
  "ENTREGADO",
  "NO_ENTREGADO",
  "CANCELADO",
];

export default function EnviosViewer({ envios,  showUsuarioId = false, onSelectedChange }: EnviosViewerProps) {
  const [currentEnvios, setCurrentEnvios] = useState(envios);
  const [nuevosCount, setNuevosCount] = useState(0);
  const vistos = useRef(new Set(envios.map((e) => e.trackingId)));
  const [selected, setSelected] = useState(0);
  const [estadoFiltro, setEstadoFiltro] = useState("TODOS");

  const filteredEnvios = useMemo(() => {
    if (estadoFiltro === "TODOS") {
      return currentEnvios;
    }

    return currentEnvios.filter(
      (envio) => envio.estado_actual === estadoFiltro
    );
  }, [currentEnvios, estadoFiltro]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/envios");
        if (!response.ok) {
          return;
        }

        const nuevosEnvios: Envio[] = await response.json();
        const nuevos = nuevosEnvios.filter(
          (e) => !vistos.current.has(e.trackingId)
        );

        if (nuevos.length > 0) {
          nuevos.forEach((envio) => vistos.current.add(envio.trackingId));
          setCurrentEnvios((prev) => {
            const merged = [...nuevos, ...prev];
            const unique = Array.from(
              new Map(merged.map((envio) => [envio.trackingId, envio])).values()
            );
            return unique;
          });
          setNuevosCount((prevCount) => prevCount + nuevos.length);
        }
      } catch (error) {
        console.error("Error fetching nuevos envios:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sortedEnvios = [...filteredEnvios].sort((a, b) =>
    b.trackingId.localeCompare(a.trackingId)
  );

  const currentEnvio = sortedEnvios[selected];

  useEffect(() => {
    if (onSelectedChange) {
      onSelectedChange(currentEnvio);
    }
  }, [currentEnvio, onSelectedChange]);

  return (
    <div className={styles.root}>
      <div className={styles.sidebar}>
        {nuevosCount > 0 && (
          <div className={styles.notification}>
            Tienes {nuevosCount} envíos nuevos.
          </div>
        )}
        <h2 className={styles.title}>Historial de envios:</h2>
         <select
          className={styles.filter}
          value={estadoFiltro}
          onChange={(e) => {
            setEstadoFiltro(e.target.value);
            setSelected(0);
          }}
        >{ESTADOS.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}</select>
       <div className={styles.list}>
  {sortedEnvios.map((envio, index) => (
  <div
    key={envio.trackingId}
    className={styles.envioItem}
  >
    <button
      className={`${styles.listItem} ${
        selected === index
          ? styles.activeItem
          : ""
      }`}
      onClick={() => setSelected(index)}
    >
      {envio.trackingId}
    </button>
  </div>
))}
</div>
      </div>
      <div className={styles.details}>
        <h2 className={styles.title}>Envio:</h2>
        {currentEnvio ? (
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.label}>Tracking ID:</span>
              <span>{currentEnvio.trackingId}</span>
            </div>
            {showUsuarioId && (
              <div className={styles.row}>
                <span className={styles.label}>
                  Usuario:
                </span>

                <span>{currentEnvio.usuarioId}</span>
              </div>
            )}
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
                  : "PENDIENTE"}
              </span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Direccion:</span>
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
              <span>{currentEnvio.demora_dias} dias</span>
            </div>
        <div className={styles.actions}>
          <Link
      href={`/envios/${currentEnvio.trackingId}`}
      className={styles.trackLink}
    >
      Ver seguimiento
    </Link> </div> 

          </div>
        ) : (
          <p>No hay envios disponibles.</p>
        )}
      </div>
    </div>
  );
}
