import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './provider';

export const metadata = {
  title: 'TrackExp',
  description:
    'Gestiona eficientemente tus expedientes judiciales, TrackExp hace el seguimiento de tus causas.',
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
