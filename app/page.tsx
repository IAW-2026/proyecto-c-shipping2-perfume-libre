import EnviosViewer from "./components/EnviosViewer";
import { getEnvios } from "../lib/envios";
import { auth,currentUser} from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

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
  return (
    <main className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Bienvenido</h2>
          <p>Accede rápido a tus envíos y opciones.</p>
        </div>

        <nav className={styles.nav}>
          <a href="#envios" className={styles.navLink}>
            Mis envíos
          </a>
          <a href="#simular" className={styles.navLink}>
            Simular compra
          </a>
        </nav>
      </aside>

      <section className={styles.content}>
        <div id="envios" className={styles.viewerSection}>
          <EnviosViewer envios={envios} />
        </div>
      </section>
    </main>
  );
}
