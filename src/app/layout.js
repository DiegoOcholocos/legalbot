import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './provider';

export const metadata = {
  title: 'LegalBot',
  description:
    'Optimiza la gestión de tus expedientes legales con LegalBot, la IA que monitorea y sigue el progreso de tus casos judiciales.',
  icon: '/favicon.ico',
};

export default function RootLayout({ children, session }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="max-w-[100vw] w-[100vw] h-[100vh] min-h-screen">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
