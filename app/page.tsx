import HomeClient from "./components/HomeClient";
import { getEnvios } from "../lib/envios";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();

  if (user?.publicMetadata?.role === "admin") {
    redirect("/admin");
  }

  const envios = await getEnvios(userId);

  return <HomeClient envios={envios} />;
}