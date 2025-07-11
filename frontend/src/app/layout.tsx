import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Travel Agent Dashboard',
  description: 'Automate guest communication and analytics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 flex min-h-screen">
        <AuthProvider>
          <Sidebar />
          <main className="flex-1 p-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
