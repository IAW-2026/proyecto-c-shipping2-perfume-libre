"use client";
import styles from "./EnviosViewer.module.css";
/*Info de los estados de un envio*/
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
//retorna todos los envios asociados
//ordenados del mas antiguo al mas reciente
//o sino dice que no hay estados registrados

export default function EstadosViewer({estados,}: EstadosViewerProps) {  
return (
    <div className={styles.container}>
    <div className={styles.card}>
      <h2 className={styles.title}>Seguimiento del envio</h2>

      {estados.length === 0 ? (
        <p>No hay estados registrados.</p>
      ) : (
        <div className={styles.timeline}>
          {estados.map((estado,index) => (
            <div
              key={estado.id}
              className={styles.timelineItem}
            >
              <div className={styles.timelineMarker}>
                <div className={`${styles.circle} ${
                    index === estados.length - 1
                      ? styles.lastCircle
                      : styles.circle
                  }`} />

                {index < estados.length - 1 && (
                  <div className={styles.line} />
                )}
              </div>

              <div className={styles.timelineContent}>
                <h3>{estado.tipo_estado}</h3>
                <p>
                   {estado.fecha
                    ? new Date(
                        estado.fecha
                      ).toLocaleString("es-AR")
                    : "Sin fecha"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
