import React, { useState } from 'react';
import { Table, TableStatus, SeatingPreference } from '../types';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, Users, MapPin, CheckCircle2, AlertTriangle, ShieldAlert, X } from 'lucide-react';

interface TableManagerProps {
  tables: Table[];
  onRefresh: () => void;
}

export const TableManager: React.FC<TableManagerProps> = ({ tables, onRefresh }) => {
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [tableNumber, setTableNumber] = useState(13);
  const [capacity, setCapacity] = useState(4);
  const [location, setLocation] = useState<SeatingPreference>('Indoor');
  const [status, setStatus] = useState<TableStatus>('Available');

  const [loading, setLoading] = useState(false);

  const handleSaveTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingTable) {
        await api.updateTable(editingTable.id, { tableNumber, capacity, location, status });
      } else {
        await api.createTable({ tableNumber, capacity, location, status });
      }
      onRefresh();
      setEditingTable(null);
      setIsAddingNew(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save table');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTable = async (id: number) => {
    if (!confirm('Are you sure you want to delete this table?')) return;
    try {
      await api.deleteTable(id);
      onRefresh();
    } catch (err) {
      alert('Failed to delete table');
    }
  };

  const handleQuickStatusChange = async (table: Table, newStatus: TableStatus) => {
    try {
      await api.updateTable(table.id, { status: newStatus });
      onRefresh();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const statusBadgeStyle = (st: TableStatus) => {
    switch (st) {
      case 'Available':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Reserved':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Occupied':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Maintenance':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#f8f5f0]">Visual Table Floor Plan</h3>
          <p className="text-xs text-[#a39e9b]">Manage restaurant seating capacities, floor locations, and current statuses.</p>
        </div>

        <button
          onClick={() => {
            const maxNum = tables.reduce((max, t) => Math.max(max, t.tableNumber), 0);
            setTableNumber(maxNum + 1);
            setCapacity(4);
            setLocation('Indoor');
            setStatus('Available');
            setEditingTable(null);
            setIsAddingNew(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6a15c] text-[#0e0c0d] font-bold text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Table</span>
        </button>
      </div>

      {/* Tables Floor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-[#d4af37]/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center font-serif font-bold text-lg gold-gradient-text">
                  #{table.tableNumber}
                </div>
                <div>
                  <span className="text-xs text-[#a39e9b] block">Location</span>
                  <span className="text-xs font-semibold text-[#f8f5f0] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#d4af37]" />
                    {table.location}
                  </span>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${statusBadgeStyle(table.status)}`}>
                {table.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
              <span className="text-[#a39e9b] flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                Capacity: <strong className="text-[#f8f5f0]">{table.capacity} Seats</strong>
              </span>

              {table.currentReservation && (
                <span className="text-[10px] text-amber-300 truncate max-w-[120px]" title={`Reserved by ${table.currentReservation.customerName}`}>
                  {table.currentReservation.customerName} ({table.currentReservation.time})
                </span>
              )}
            </div>

            {/* Quick Status Toggle buttons & Edit/Delete */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-1">
              <select
                value={table.status}
                onChange={(e) => handleQuickStatusChange(table, e.target.value as TableStatus)}
                className="bg-[#171416] text-[11px] text-[#f8f5f0] border border-white/10 rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingTable(table);
                    setTableNumber(table.tableNumber);
                    setCapacity(table.capacity);
                    setLocation(table.location);
                    setStatus(table.status);
                    setIsAddingNew(false);
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#a39e9b] hover:text-[#d4af37]"
                  title="Edit Table"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteTable(table.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  title="Delete Table"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Table Modal */}
      {(isAddingNew || editingTable) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-[#d4af37]/40 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-serif font-bold text-lg text-[#f8f5f0]">
                {editingTable ? `Edit Table #${editingTable.tableNumber}` : 'Add New Table'}
              </h3>
              <button onClick={() => { setIsAddingNew(false); setEditingTable(null); }} className="text-[#a39e9b] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTable} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#f8f5f0] mb-1 font-medium">Table Number *</label>
                <input
                  type="number"
                  min={1}
                  value={tableNumber}
                  onChange={(e) => setTableNumber(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 bg-[#171416] border border-white/10 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[#f8f5f0] mb-1 font-medium">Seating Capacity (Guests) *</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 bg-[#171416] border border-white/10 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[#f8f5f0] mb-1 font-medium">Location Area *</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value as SeatingPreference)}
                  className="w-full px-3 py-2 bg-[#171416] border border-white/10 rounded-xl text-white"
                >
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Window">Window</option>
                  <option value="Private Dining">Private Dining</option>
                </select>
              </div>

              <div>
                <label className="block text-[#f8f5f0] mb-1 font-medium">Initial Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TableStatus)}
                  className="w-full px-3 py-2 bg-[#171416] border border-white/10 rounded-xl text-white"
                >
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => { setIsAddingNew(false); setEditingTable(null); }}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6a15c] text-[#0e0c0d] font-bold"
                >
                  Save Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
