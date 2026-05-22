import './globals.css';
import { Inter } from 'next/font/google';
import Sidebar from './components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Shipping Test',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="header">
          <span className="headerTitle">PerfumeLibre</span>
          <span className="userName">NombreDeUsuario</span>
        </header>
        <div className="appShell">
          <main className="mainContent">{children}</main>
        </div>
      </body>
    </html>
  );
}