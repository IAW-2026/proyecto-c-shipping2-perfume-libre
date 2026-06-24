'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={styles.toggleButton}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logo}>Admin Panel</h2>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <Link href="/admin" className={styles.navLink}>
                <span className={styles.label}>Panel de administración</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/debug" className={styles.navLink}>
                <span className={styles.label}>Debug</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.logoutLink}>
            <span className={styles.label}>Volver</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
