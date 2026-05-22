"use client";
import styles from "./EnviosViewer.module.css";

export interface EstadoEnvio {
  id: number;
  trackingId: string;
  usuarioId: string;
  tipo_estado: string;
  fecha: string;
}

type EstadosViewerProps = {
  estados: EstadoEnvio[];
};

export default function EstadosViewer({estados,}: EstadosViewerProps) {  
return (
    <div className={styles.container}>
      <h2 className={styles.title}>Seguimiento del envio</h2>

      {estados.length === 0 ? (
        <p>No hay estados registrados.</p>
      ) : (
        <div className={styles.timeline}>
          {estados.map((estado) => (
            <div
              key={estado.id}
              className={styles.item}
            >
              <div className={styles.circle} />

              <div className={styles.content}>
                <h3>{estado.tipo_estado}</h3>

                <p>
                  {new Date(
                    estado.fecha
                  ).toLocaleString("es-AR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
