"use client";

import { useState } from "react";
import styles from "../page.module.css";
import EnviosViewer, { Envio } from "../components/EnviosViewer";

type Props = {
  envios: Envio[];
};

export default function HomeClient({ envios }: Props) {
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
      alert(`Envío ${selectedEnvio.trackingId} enviado a preparación.`);
    } else {
      alert(data.mensaje);
    }
  }

  return (
    <main className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>Bienvenido</h2>

        <button
          onClick={prepararEnvio}
          disabled={
            !selectedEnvio ||
            selectedEnvio.estado_actual !== "CREADO"
          }
        >
          Preparar envío
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