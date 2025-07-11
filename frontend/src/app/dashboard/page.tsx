'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/app/utils/api';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState({
    totalTrips: 0,
    emailsSent: 0,
    scheduledEmails: 0,
    drafts: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/agents/me/analytics');
        setAnalytics(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>

        {loading && <p>Loading analytics...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <section className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Analytics Summary</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="bg-gray-100 rounded p-3 text-center">
                <p className="text-sm text-gray-500">Total Trips</p>
                <p className="text-xl font-bold">{analytics.totalTrips}</p>
              </div>
              <div className="bg-gray-100 rounded p-3 text-center">
                <p className="text-sm text-gray-500">Emails Sent</p>
                <p className="text-xl font-bold">{analytics.emailsSent}</p>
              </div>
              <div className="bg-gray-100 rounded p-3 text-center">
                <p className="text-sm text-gray-500">Scheduled Emails</p>
                <p className="text-xl font-bold">{analytics.scheduledEmails}</p>
              </div>
              <div className="bg-gray-100 rounded p-3 text-center">
                <p className="text-sm text-gray-500">Drafts</p>
                <p className="text-xl font-bold">{analytics.drafts}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </ProtectedRoute>
  );
}
