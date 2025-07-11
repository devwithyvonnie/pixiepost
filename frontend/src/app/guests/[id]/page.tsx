'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/app/utils/api';

export default function GuestDetailPage() {
  const params = useParams();
  const guestId = params?.id as string;

  const [guest, setGuest] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddTripForm, setShowAddTripForm] = useState(false);

  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [showSendEmailForm, setShowSendEmailForm] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSubmitting(true);
    setEmailError(null);
    setEmailSuccess(null);

    try {
      await api.post('/email/send', {
        guestId,
        subject: emailSubject,
        body: emailBody,
      });

      setEmailSubject('');
      setEmailBody('');
      setEmailSuccess('Email sent successfully!');
      setShowSendEmailForm(false);
    } catch (err: any) {
      console.error(err);
      setEmailError(err.response?.data?.message || 'Failed to send email');
    } finally {
      setEmailSubmitting(false);
    }
  };

  const handleAddTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      await api.post('/trips', {
        guestId,
        destination,
        startDate,
        endDate
      });

      setDestination('');
      setStartDate('');
      setEndDate('');

      // Refetch trips after adding:
      const tripsRes = await api.get(`/trips?guestId=${guestId}`);
      setTrips(tripsRes.data);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.response?.data?.message || 'Failed to add trip');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchGuestDetails = async () => {
      try {
        const guestRes = await api.get(`/guests/${guestId}`);
        setGuest(guestRes.data);

        const tripsRes = await api.get(`/trips?guestId=${guestId}`);
        setTrips(tripsRes.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load guest details');
      } finally {
        setLoading(false);
      }
    };

    if (guestId) fetchGuestDetails();
  }, [guestId]);

  return (
    <ProtectedRoute>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Guest Details</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && guest && (
          <>
            <div className="bg-white rounded shadow p-4">
              <p className="font-medium">{guest.name}</p>
              <p className="text-sm text-gray-500">{guest.email}</p>
              <p className="text-sm text-gray-500">Phone: {guest.phone || 'N/A'}</p>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h3 className="text-lg font-semibold mb-2">Trips</h3>

              {trips.length === 0 ? (
                <p>No trips for this guest.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {trips.map((trip) => (
                    <li key={trip._id} className="py-2">
                      <p className="font-medium">{trip.destination}</p>
                      <p className="text-sm text-gray-500">
                        Dates: {trip.startDate || 'N/A'} - {trip.endDate || 'N/A'}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={() => setShowAddTripForm(!showAddTripForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {showAddTripForm ? 'Cancel' : 'Add Trip'}
            </button>

            {showAddTripForm && (
              <div className="bg-white rounded shadow p-4 mt-4">
                <h3 className="text-lg font-semibold mb-2">Add New Trip</h3>
                {submitError && <p className="text-red-500">{submitError}</p>}
                <form onSubmit={handleAddTrip} className="space-y-2">
                  <div>
                    <label className="block text-sm">Destination</label>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? 'Adding...' : 'Add Trip'}
                  </button>
                </form>
              </div>
            )}

            <button
              onClick={() => setShowSendEmailForm(!showSendEmailForm)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4"
            >
              {showSendEmailForm ? 'Cancel' : 'Send Email'}
            </button>

            {showSendEmailForm && (
              <div className="bg-white rounded shadow p-4 mt-2">
                <h3 className="text-lg font-semibold mb-2">Send Email to {guest.name}</h3>
                {emailError && <p className="text-red-500">{emailError}</p>}
                {emailSuccess && <p className="text-green-600">{emailSuccess}</p>}
                <form onSubmit={handleSendEmail} className="space-y-2">
                  <div>
                    <label className="block text-sm">Subject</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Message</label>
                    <textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full border rounded px-2 py-1"
                      rows={4}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={emailSubmitting}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {emailSubmitting ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </div>
            )}

          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
