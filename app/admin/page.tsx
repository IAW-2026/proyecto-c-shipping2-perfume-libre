import EnviosViewer from "@/app/components/EnviosViewer";
import { getAllEnvios } from "@/lib/envios_ad";
import styles from "./Admin.module.css";
export default async function AdminPage() {

const envios = await getAllEnvios();

  return (
     <main>
      <h1 className={styles.adminTitle}>Panel de administracion</h1>
      <EnviosViewer envios={envios} 
        showUsuarioId={true}
/>
    </main>
  );
}
