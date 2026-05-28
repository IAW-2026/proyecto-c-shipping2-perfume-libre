import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Sidebar from "./components/Sidebar";

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
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <header className="header">
          <span className="headerTitle">PerfumeLibre</span>
          <div className="flex items-center gap-4">
              <Show when="signed-out">
                <SignInButton />

                <SignUpButton>
                  <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 px-4 cursor-pointer">
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
          <Sidebar />
          <main className="mainContent">{children}</main>
        </div>
      </body>
    </html>
    </ClerkProvider>
  );
}