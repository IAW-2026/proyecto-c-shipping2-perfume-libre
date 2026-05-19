import EnviosViewer from "./components/EnviosViewer";
import { getEnvios } from "../lib/envios";

export default async function Home() {
  const envios = await getEnvios();

  return <EnviosViewer envios={envios} />;
}
