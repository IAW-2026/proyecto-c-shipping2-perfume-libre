import EnviosViewer from "./components/EnviosViewer";
import { getEnvios } from "../lib/envios";
import { auth } from "@clerk/nextjs/server";
import { ADMIN_ID } from "../lib/auth";
import { redirect } from "next/navigation";


export default async function Home() {
  const {userId} = await auth();

 if (!userId) {
    return redirect("/sign-in");
  }

   if (userId==ADMIN_ID) {
    return redirect("/admin");
  }
const envios = await getEnvios(
  userId
);
  return <EnviosViewer envios={envios} />;
}
