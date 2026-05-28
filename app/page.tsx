import EnviosViewer from "./components/EnviosViewer";
import { getEnvios } from "../lib/envios";

export default async function Home() {
  const usuarioId = "300";

const envios = await getEnvios(
  usuarioId
);
  return <EnviosViewer envios={envios} />;
}
