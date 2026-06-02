import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from "next/image";
/*Layout principal de la pagina*/
/*Incluyendo botones de clerk */
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Shipping'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <header className="header">
          <Image src="/perfumeLogo.svg" alt="Perfume Logo" width={65} height={10} className="perfumeLogo" />
          <div className="headerActions">
               <Show when="signed-out">
                <SignInButton>
                  <button className="authButton">
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton>
                  <button className="authButton">
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>

              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
        </header>
        <div className="appShell">
          <main className="mainContent">{children}</main>
        </div>
      </body>
    </html>
    </ClerkProvider>
  );
}