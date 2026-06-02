import EstadosViewer from "@/app/components/EstadosViewer";
import { getEstadosEnvio } from "@/lib/envios";
/*Usamos esta pagina para mostrar el estado de un envio
Recibe el trackingId por params y 
onsulta a la bd para obtener los estados del envio*/
type PageProps = {
  params: Promise<{
    trackingId: string;
  }>;
};
//Muestra los estados obtenidos.
export default async function Page({
  params,
}: PageProps) {
  const { trackingId } = await params;
  const estados = await getEstadosEnvio(
    trackingId
  );

  return (
    <EstadosViewer estados={estados} />
  );
}