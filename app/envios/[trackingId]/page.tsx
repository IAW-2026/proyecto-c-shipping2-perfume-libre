import EstadosViewer from "@/app/components/EstadosViewer";
import { getEstadosEnvio } from "@/lib/envios";

type PageProps = {
  params: Promise<{
    trackingId: string;
  }>;
};

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