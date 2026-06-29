"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../page.module.css";
import EnviosViewer, { Envio } from "../components/EnviosViewer";

type Props = {
  envios: Envio[];
};

export default function HomeClient({ envios }: Props) {
  const router = useRouter();
  const [selectedEnvio, setSelectedEnvio] =
    useState<Envio | null>(null);

  async function prepararEnvio() {
    if (!selectedEnvio) return;
    console.log("SELLER_URL:",process.env.NEXT_PUBLIC_SELLER_URL);
    const response = await fetch(
      `/api/seller/${selectedEnvio.id_vendedor}/ordenes/${selectedEnvio.id_orden}/preparar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trackingId: selectedEnvio.trackingId,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert(`Envio ${selectedEnvio.trackingId} enviado a preparacion.`);
      router.refresh();
    } else {
      alert(data.mensaje);
    }
  }

  async function entregarEnvio() {
    if (!selectedEnvio) return;
    if (selectedEnvio.estado_actual !== "RETIRADO") {
      alert("Solo se puede entregar un envío RETIRADO.");
      return;
    }

    const response = await fetch(
      `/api/debug/entregar/${selectedEnvio.id_orden}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert(`Envio ${selectedEnvio.trackingId} entregado.`);
      router.refresh();
    } else {
      alert(data.mensaje);
    }
  }

  async function marcarNoEntregado() {
    if (!selectedEnvio) return;
    if (selectedEnvio.estado_actual !== "RETIRADO") {
      alert("Solo se puede marcar NO_ENTREGADO un envio RETIRADO.");
      return;
    }

    const response = await fetch(
      `/api/debug/no-entregado/${selectedEnvio.id_orden}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert(`Envio ${selectedEnvio.trackingId} marcado como NO_ENTREGADO.`);
      router.refresh();
    } else {
      alert(data.mensaje);
    }
  }

  async function notificarBuyer() {
    if (!selectedEnvio) return;
    if (selectedEnvio.estado_actual !== "ENTREGADO") {
      alert("Solo se puede notificar buyer para envíos ENTREGADOS.");
      return;
    }

    const response = await fetch("/api/notificaciones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trackingId: selectedEnvio.trackingId,
        fecha_entrega: new Date().toISOString(),
        estado: "ENTREGADO",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Buyer fue notificado correctamente.");
      router.refresh();
    } else {
      alert(data.mensaje);
    }
  }

  return (
    <main className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>Bienvenido</h2>

        <button
          className={styles.actionButton}
          onClick={prepararEnvio}
          disabled={
            !selectedEnvio ||
            selectedEnvio.estado_actual !== "CREADO"
          }
        >
          Preparar envio
        </button>

        <button
          className={styles.actionButton}
          onClick={entregarEnvio}
          disabled={
            !selectedEnvio ||
            selectedEnvio.estado_actual !== "RETIRADO"
          }
        >
          Entregar envio
        </button>

        <button
          className={styles.actionButton}
          onClick={marcarNoEntregado}
          disabled={
            !selectedEnvio ||
            selectedEnvio.estado_actual !== "RETIRADO"
          }
        >
          Marcar como no entregado
        </button>

        <button
          className={styles.actionButton}
          onClick={notificarBuyer}
          disabled={
            !selectedEnvio ||
            selectedEnvio.estado_actual !== "ENTREGADO"
          }
        >
          Notificar buyer
        </button>
      </aside>

      <section className={styles.content}>
        <EnviosViewer
          envios={envios}
          onSelectedChange={setSelectedEnvio}
        />
      </section>
    </main>
  );
}