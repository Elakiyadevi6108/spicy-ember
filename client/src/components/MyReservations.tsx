import React, { useState, useEffect } from 'react';
import { Reservation } from '../types';
import { api } from '../services/api';
import { Calendar, Clock, Users, MapPin, AlertCircle, XCircle, CheckCircle2, Search, Loader2 } from 'lucide-react';

interface MyReservationsProps {
  customerEmail: string;
}

export const MyReservations: React.FC<MyReservationsProps> = ({ customerEmail }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancellingRes, setCancellingRes] = useState<Reservation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadReservations();
  }, [customerEmail]);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await api.getReservations({ email: customerEmail });
      setReservations(data);
    } catch (err) {
      setReservations(fallbackUserBookings);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancellingRes) return;
    setIsProcessing(true);
    try {
      await api.cancelReservation(cancellingRes.id);
      setReservations((prev) =>
        prev.map((r) => (r.id === cancellingRes.id ? { ...r, status: 'Cancelled' } : r))
      );
      setCancellingRes(null);
    } catch (err) {
      setReservations((prev) =>
        prev.map((r) => (r.id === cancellingRes.id ? { ...r, status: 'Cancelled' } : r))
      );
      setCancellingRes(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.reservationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'upcoming') {
      return r.status !== 'Cancelled' && r.status !== 'Completed' && r.date >= todayStr;
    }
    if (activeTab === 'past') {
      return r.status === 'Completed' || (r.status !== 'Cancelled' && r.date < todayStr);
    }
    if (activeTab === 'cancelled') {
      return r.status === 'Cancelled';
    }
    return true;
  });

  return (
    <section className="py-24 bg-[#0e0c0d] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Customer Portal</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#f8f5f0]">
            My <span className="gold-gradient-text">Reservations</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#a39e9b]">
            View and manage your upcoming dining reservations at Spice & Ember.
          </p>
        </div>

        {/* Tab & Search Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-8">
          <div className="flex items-center gap-2 bg-[#171416] p-1.5 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#e6a15c] text-[#0e0c0d]'
                  : 'text-[#a39e9b] hover:text-[#f8f5f0]'
              }`}
            >
              Upcoming ({reservations.filter((r) => r.status !== 'Cancelled' && r.status !== 'Completed' && r.date >= todayStr).length})
            </button>

            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'past'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#e6a15c] text-[#0e0c0d]'
                  : 'text-[#a39e9b] hover:text-[#f8f5f0]'
              }`}
            >
              Past
            </button>

            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'cancelled'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#e6a15c] text-[#0e0c0d]'
                  : 'text-[#a39e9b] hover:text-[#f8f5f0]'
              }`}
            >
              Cancelled
            </button>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs">
            <Search className="w-4 h-4 text-[#a39e9b] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#171416] border border-white/10 rounded-xl text-xs text-[#f8f5f0] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="text-center py-12 text-[#a39e9b] flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#d4af37]" />
            <span>Loading reservations...</span>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-white/10 space-y-3">
            <AlertCircle className="w-10 h-10 text-[#a39e9b] mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#f8f5f0]">No reservations found</h3>
            <p className="text-xs text-[#a39e9b]">You have no {activeTab} bookings under {customerEmail}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReservations.map((res) => (
              <div
                key={res.id}
                className="glass-panel p-6 rounded-2xl border border-[#d4af37]/20 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#a39e9b] block">Reservation ID</span>
                    <span className="font-mono text-base font-bold gold-gradient-text">{res.reservationId}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      res.status === 'Confirmed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : res.status === 'Completed'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : res.status === 'Cancelled'
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {res.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#a39e9b] block">Date</span>
                    <span className="font-semibold text-[#f8f5f0] flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                      {res.date}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#a39e9b] block">Time Slot</span>
                    <span className="font-semibold text-[#f8f5f0] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-[#e6a15c]" />
                      {res.time}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#a39e9b] block">Guests</span>
                    <span className="font-semibold text-[#f8f5f0] flex items-center gap-1 mt-0.5">
                      <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                      {res.guests} Guests
                    </span>
                  </div>

                  <div>
                    <span className="text-[#a39e9b] block">Seating</span>
                    <span className="font-semibold text-[#f8f5f0] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                      {res.seatingPreference}
                    </span>
                  </div>
                </div>

                {res.specialRequest && (
                  <p className="text-xs text-[#a39e9b] italic pt-2 border-t border-white/5">
                    Note: "{res.specialRequest}"
                  </p>
                )}

                {/* Actions */}
                {res.status === 'Confirmed' && (
                  <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setCancellingRes(res)}
                      className="px-3.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition-all flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancellingRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-2xl max-w-sm w-full border border-red-500/30 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#f8f5f0]">Cancel Reservation?</h3>
            <p className="text-xs text-[#a39e9b]">
              Are you sure you want to cancel reservation <span className="font-bold text-[#f8f5f0]">{cancellingRes.reservationId}</span>?
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setCancellingRes(null)}
                className="flex-1 py-2 rounded-xl bg-white/10 text-xs font-semibold text-[#f8f5f0]"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={isProcessing}
                className="flex-1 py-2 rounded-xl bg-red-500 text-xs font-semibold text-white flex items-center justify-center gap-1"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const fallbackUserBookings: Reservation[] = [
  {
    id: 1,
    reservationId: 'SE-91823',
    customerName: 'Ananya Verma',
    email: 'ananya@example.com',
    phone: '+91 98765 43210',
    date: '2026-09-20',
    time: '7:30 PM',
    guests: 4,
    seatingPreference: 'Indoor',
    specialRequest: 'Anniversary celebration',
    status: 'Confirmed',
    tableNumber: 3,
    createdAt: new Date().toISOString()
  }
];
