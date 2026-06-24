import Sidebar from "@/app/components/Sidebar";
import EnviosViewer from "@/app/components/EnviosViewer";
import { getAllEnvios } from "@/lib/envios_ad";
import styles from "./Admin.module.css";

export default async function AdminPage() {
  /*obtener todos los envios */
  const envios = await getAllEnvios();
  //Mostramos todos los envios
  //incluyendo el id del usuario asociado
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <main className={styles.adminContainer}>
        <h1 className={styles.adminTitle}>Panel de administración</h1>
        <EnviosViewer envios={envios} 
          showUsuarioId={true}
        />
      </main>
    </div>
  );
}
