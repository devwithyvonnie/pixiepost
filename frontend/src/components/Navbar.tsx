'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <header className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
      <h1 className="text-lg font-bold">Travel Agent Dashboard</h1>
      <nav className="space-x-4 flex items-center">
        {token ? (
          <>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
