"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        {isOpen ? "◀" : "▶"}
      </button>
      <aside className={`${styles.sidebar} ${!isOpen ? styles.hidden : ""}`}>
        <div className={styles.sidebarBrand}>Panel</div>
        <nav className={styles.navList}>
          <Link
            className={`${styles.navLink} ${styles.active}`}
            href="/"
          >
          Historial de Envios
          </Link>
         <Link
          className={styles.navLink}
          href="/admin"
        >
          Panel Admin
        </Link>
        </nav>
      </aside>
    </>
  );
}
