import EnviosViewer from "./components/EnviosViewer";
import { getEnvios } from "../lib/envios";
import { auth,currentUser} from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function Home() {
/*obtener usuario logueado y confirmar su rol */
 const {userId} = await auth();

 if (!userId) {
    return redirect("/sign-in");
  }

const user = await currentUser();
//rol guardado en metadata de clerk
const role =
    user?.publicMetadata?.role as string | undefined;
//redirigir a pagina de admin si rol coincide
  if (role === "admin") {
    redirect("/admin");
  }
//obtener envios del usuario
const envios = await getEnvios(userId);
//devolver vista de todos los envios del usuario
  return <EnviosViewer envios={envios} />;
}
