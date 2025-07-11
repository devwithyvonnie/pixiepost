'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
    const { token, logout } = useAuth();

    return (
        <aside className="w-64 bg-white shadow-md p-4 space-y-4 h-screen fixed left-0 top-0">
            <h1 className="text-xl font-bold mb-4">Travel Agent</h1>
            {token ? (
                <nav className="space-y-2">
                    <Link href="/dashboard" className="block hover:underline">
                        Dashboard
                    </Link>
                    <Link href="/guests" className="block hover:underline">
                        Guests
                    </Link>

                    <button
                        onClick={logout}
                        className="block text-red-600 hover:underline"
                    >
                        Logout
                    </button>
                </nav>
            ) : (
                <nav>
                    <Link href="/login" className="block hover:underline">
                        Login
                    </Link>
                </nav>
            )}
        </aside>
    );
}
