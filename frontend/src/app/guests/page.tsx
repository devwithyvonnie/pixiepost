'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import api from '@/app/utils/api';
import { useEffect, useState } from 'react';

export default function GuestsPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const res = await api.get('/guests');
        setGuests(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load guests');
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  return (
    <ProtectedRoute>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Guests</h2>

        {loading && <p>Loading guests...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && guests.length === 0 && (
          <p>No guests found.</p>
        )}

        {!loading && !error && guests.length > 0 && (
          <ul className="divide-y divide-gray-200">
            {guests.map((guest) => (
              <li key={guest._id} className="py-2 flex justify-between items-center">
                <div>
                  <p className="font-medium">{guest.name}</p>
                  <p className="text-sm text-gray-500">{guest.email}</p>
                </div>
                <Link href={`/guests/${guest._id}`} className="text-blue-600 hover:underline">
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}

