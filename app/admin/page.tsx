import EnviosViewer from "@/app/components/EnviosViewer";
import { getAllEnvios } from "@/lib/envios_ad";

export default async function AdminPage() {

const envios = await getAllEnvios();

  return (
     <main style={{ padding: 24 }}>
      <h1>Panel de administracion</h1>

      <EnviosViewer envios={envios} 
        showUsuarioId={true}
/>
    </main>
  );
}
