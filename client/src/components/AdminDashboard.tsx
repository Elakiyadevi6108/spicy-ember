import React, { useState, useEffect } from 'react';
import { Reservation, Table, ReservationStatus } from '../types';
import { api } from '../services/api';
import { DashboardCard } from './DashboardCard';
import { TableManager } from './TableManager';
import { Calendar, Users, CheckCircle2, LayoutGrid, Utensils, Search, Filter, ShieldAlert, RefreshCw, Eye, XCircle, Clock } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'tables' | 'menu'>('overview');

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('');

  const [selectedResDetails, setSelectedResDetails] = useState<Reservation | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resData, tableData] = await Promise.all([
        api.getReservations(),
        api.getTables()
      ]);
      setReservations(resData);
      setTables(tableData);
    } catch (err) {
      setReservations(fallbackAdminRes);
      setTables(fallbackAdminTables);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number | string, newStatus: ReservationStatus) => {
    try {
      await api.updateReservation(id, { status: newStatus });
      setReservations((prev) =>
        prev.map((r) => (r.id === id || r.reservationId === id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      setReservations((prev) =>
        prev.map((r) => (r.id === id || r.reservationId === id ? { ...r, status: newStatus } : r))
      );
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Stats calculations
  const todayCount = reservations.filter((r) => r.date === todayStr && r.status !== 'Cancelled').length;
  const upcomingCount = reservations.filter((r) => r.date >= todayStr && r.status !== 'Cancelled').length;
  const availableTablesCount = tables.filter((t) => t.status === 'Available').length;
  const totalCustomers = new Set(reservations.map((r) => r.email)).size;

  // Filtered Reservations List
  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.reservationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesDate = !dateFilter || r.date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <section className="py-24 bg-[#0e0c0d] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Operations Hub</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#f8f5f0]">
              Spice & Ember <span className="gold-gradient-text">Management</span>
            </h2>
          </div>

          {/* Admin Navigation Pills */}
          <div className="flex items-center gap-1.5 bg-[#171416] p-1.5 rounded-xl border border-white/10 overflow-x-auto w-full md:w-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#e6a15c] text-[#0e0c0d]'
                  : 'text-[#a39e9b] hover:text-[#f8f5f0]'
              }`}
            >
              Dashboard Overview
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'reservations'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#e6a15c] text-[#0e0c0d]'
                  : 'text-[#a39e9b] hover:text-[#f8f5f0]'
              }`}
            >
              Reservations ({reservations.length})
            </button>

            <button
              onClick={() => setActiveTab('tables')}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'tables'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#e6a15c] text-[#0e0c0d]'
                  : 'text-[#a39e9b] hover:text-[#f8f5f0]'
              }`}
            >
              Table Floor Plan ({tables.length})
            </button>
          </div>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <DashboardCard
            title="Today's Reservations"
            value={todayCount}
            subtitle={`For ${todayStr}`}
            icon={Calendar}
            color="gold"
          />
          <DashboardCard
            title="Upcoming Bookings"
            value={upcomingCount}
            subtitle="Confirmed & Pending"
            icon={Clock}
            color="amber"
          />
          <DashboardCard
            title="Available Tables"
            value={`${availableTablesCount} / ${tables.length}`}
            subtitle="Ready for seating"
            icon={LayoutGrid}
            color="emerald"
          />
          <DashboardCard
            title="Total Customers"
            value={totalCustomers}
            subtitle="Unique guest profiles"
            icon={Users}
            color="blue"
          />
        </div>

        {/* View Switching */}
        {activeTab === 'tables' ? (
          <div className="glass-panel p-6 rounded-3xl border border-[#d4af37]/30">
            <TableManager tables={tables} onRefresh={loadData} />
          </div>
        ) : (
          /* Reservations View */
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 space-y-6">
            {/* Table Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-[#a39e9b] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, name, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#171416] border border-white/10 rounded-xl text-xs text-[#f8f5f0] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Status & Date Filter */}
              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#171416] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#f8f5f0] focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="No Show">No Show</option>
                </select>

                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-[#171416] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#f8f5f0] focus:outline-none"
                />

                <button
                  onClick={loadData}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#d4af37]"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reservations Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs text-[#a39e9b]">
                <thead className="bg-[#171416] text-[#f8f5f0] uppercase tracking-wider font-semibold border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3.5">ID</th>
                    <th className="px-4 py-3.5">Customer</th>
                    <th className="px-4 py-3.5">Date & Time</th>
                    <th className="px-4 py-3.5">Guests</th>
                    <th className="px-4 py-3.5">Table</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-[#a39e9b]">
                        No matching reservations found.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((res) => (
                      <tr key={res.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4 font-mono font-bold gold-gradient-text whitespace-nowrap">
                          {res.reservationId}
                        </td>

                        <td className="px-4 py-4 font-medium text-[#f8f5f0]">
                          <span className="block font-semibold">{res.customerName}</span>
                          <span className="text-[11px] text-[#a39e9b] block">{res.phone}</span>
                          <span className="text-[11px] text-[#a39e9b] truncate max-w-[140px] block">{res.email}</span>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="block font-medium text-[#f8f5f0]">{res.date}</span>
                          <span className="text-[#d4af37] font-semibold">{res.time}</span>
                        </td>

                        <td className="px-4 py-4 font-bold text-[#f8f5f0]">
                          {res.guests} Guests
                          <span className="block text-[11px] font-normal text-[#a39e9b]">{res.seatingPreference}</span>
                        </td>

                        <td className="px-4 py-4">
                          {res.tableNumber ? (
                            <span className="px-2.5 py-1 rounded-md bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 font-bold">
                              Table #{res.tableNumber}
                            </span>
                          ) : (
                            <span className="text-[#a39e9b] italic">Auto</span>
                          )}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              res.status === 'Confirmed'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : res.status === 'Completed'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                : res.status === 'Cancelled'
                                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                : res.status === 'No Show'
                                ? 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {res.status}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedResDetails(res)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#a39e9b] hover:text-[#f8f5f0]"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {res.status !== 'Confirmed' && res.status !== 'Completed' && (
                              <button
                                onClick={() => handleUpdateStatus(res.id, 'Confirmed')}
                                className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold hover:bg-emerald-500/20"
                              >
                                Confirm
                              </button>
                            )}

                            {res.status === 'Confirmed' && (
                              <button
                                onClick={() => handleUpdateStatus(res.id, 'Completed')}
                                className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[11px] font-semibold hover:bg-blue-500/20"
                              >
                                Complete
                              </button>
                            )}

                            {res.status !== 'Cancelled' && (
                              <button
                                onClick={() => handleUpdateStatus(res.id, 'Cancelled')}
                                className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-[11px] font-semibold hover:bg-red-500/20"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Details View Modal */}
      {selectedResDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-[#d4af37]/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-serif font-bold text-lg gold-gradient-text">
                Reservation {selectedResDetails.reservationId}
              </h3>
              <button onClick={() => setSelectedResDetails(null)} className="text-[#a39e9b] hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#a39e9b]">
              <p><strong className="text-white">Customer:</strong> {selectedResDetails.customerName}</p>
              <p><strong className="text-white">Phone:</strong> {selectedResDetails.phone}</p>
              <p><strong className="text-white">Email:</strong> {selectedResDetails.email}</p>
              <p><strong className="text-white">Date & Time:</strong> {selectedResDetails.date} at {selectedResDetails.time}</p>
              <p><strong className="text-white">Guests:</strong> {selectedResDetails.guests} ({selectedResDetails.seatingPreference})</p>
              <p><strong className="text-white">Assigned Table:</strong> Table #{selectedResDetails.tableNumber || '1'}</p>
              {selectedResDetails.specialRequest && (
                <p className="pt-2 italic text-[#f8f5f0]"><strong className="text-white font-normal">Notes:</strong> "{selectedResDetails.specialRequest}"</p>
              )}
            </div>

            <button
              onClick={() => setSelectedResDetails(null)}
              className="w-full py-2 rounded-xl bg-white/10 text-white font-semibold text-xs mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

const fallbackAdminRes: Reservation[] = [
  {
    id: 1,
    reservationId: 'SE-91823',
    customerName: 'Ananya Verma',
    email: 'ananya@example.com',
    phone: '+91 98765 43210',
    date: '2026-09-19',
    time: '7:30 PM',
    guests: 4,
    seatingPreference: 'Indoor',
    specialRequest: 'Quiet table please',
    status: 'Confirmed',
    tableNumber: 3,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    reservationId: 'SE-91824',
    customerName: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 98123 45678',
    date: '2026-09-19',
    time: '8:00 PM',
    guests: 2,
    seatingPreference: 'Window',
    specialRequest: '',
    status: 'Confirmed',
    tableNumber: 2,
    createdAt: new Date().toISOString()
  }
];

const fallbackAdminTables: Table[] = [
  { id: 1, tableNumber: 1, capacity: 2, location: 'Indoor', status: 'Available' },
  { id: 2, tableNumber: 2, capacity: 2, location: 'Window', status: 'Reserved' },
  { id: 3, tableNumber: 3, capacity: 4, location: 'Indoor', status: 'Reserved' },
  { id: 4, tableNumber: 4, capacity: 4, location: 'Outdoor', status: 'Available' }
];
