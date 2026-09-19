import React from 'react';
import { Reservation } from '../types';
import { CheckCircle2, Calendar, Clock, Users, MapPin, Phone, Download, X } from 'lucide-react';

interface ConfirmationModalProps {
  reservation: Reservation;
  onClose: () => void;
  onViewMyBookings: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  reservation,
  onClose,
  onViewMyBookings
}) => {
  // Generate downloadable .ics calendar file
  const downloadCalendarFile = () => {
    const timeClean = reservation.time.replace(' PM', '').replace(' AM', '');
    const [hours, minutes] = timeClean.split(':');
    let hourNum = parseInt(hours, 10);
    if (reservation.time.includes('PM') && hourNum < 12) hourNum += 12;

    const startDateTime = new Date(`${reservation.date}T${String(hourNum).padStart(2, '0')}:${minutes}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 90 * 60 * 1000); // 90 min duration

    const formatDateStr = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Spice & Ember Restaurant//Table Reservation//EN',
      'BEGIN:VEVENT',
      `UID:${reservation.reservationId}@spiceandember.com`,
      `DTSTAMP:${formatDateStr(new Date())}`,
      `DTSTART:${formatDateStr(startDateTime)}`,
      `DTEND:${formatDateStr(endDateTime)}`,
      `SUMMARY:Table Reservation - Spice & Ember (${reservation.reservationId})`,
      `DESCRIPTION:Table booking for ${reservation.guests} guests under ${reservation.customerName}. Seating: ${reservation.seatingPreference}.`,
      'LOCATION:Spice & Ember, 123 Food Street, Coimbatore, Tamil Nadu',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `reservation-${reservation.reservationId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-[#d4af37]/40 shadow-2xl overflow-hidden">
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d4af37] via-[#e6a15c] to-[#d4af37]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#a39e9b] hover:text-[#f8f5f0] rounded-xl hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8 animate-bounce" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#f8f5f0] mb-1">
            Reservation Confirmed!
          </h2>
          <p className="text-xs sm:text-sm text-[#a39e9b]">
            Your table has been reserved. A confirmation copy has been sent to your email.
          </p>
        </div>

        {/* Reservation Card Details */}
        <div className="bg-[#0e0c0d]/90 p-5 rounded-2xl border border-white/10 space-y-4 mb-6 text-sm">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs uppercase tracking-wider text-[#a39e9b]">Reservation ID</span>
            <span className="font-mono text-base font-bold gold-gradient-text">{reservation.reservationId}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs text-[#a39e9b] mb-0.5">Guest Name</span>
              <span className="font-medium text-[#f8f5f0]">{reservation.customerName}</span>
            </div>

            <div>
              <span className="block text-xs text-[#a39e9b] mb-0.5">Party Size</span>
              <span className="font-medium text-[#f8f5f0] flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                {reservation.guests} {reservation.guests === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>

            <div>
              <span className="block text-xs text-[#a39e9b] mb-0.5">Date & Time</span>
              <span className="font-medium text-[#f8f5f0] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                {reservation.date}
              </span>
              <span className="text-xs text-[#d4af37] font-semibold flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                {reservation.time}
              </span>
            </div>

            <div>
              <span className="block text-xs text-[#a39e9b] mb-0.5">Seating Preference</span>
              <span className="font-medium text-[#f8f5f0]">{reservation.seatingPreference}</span>
              {reservation.tableNumber && (
                <span className="block text-[11px] text-[#a39e9b]">Table #{reservation.tableNumber}</span>
              )}
            </div>
          </div>

          {reservation.specialRequest && (
            <div className="pt-3 border-t border-white/10 text-xs">
              <span className="text-[#a39e9b] block mb-0.5">Special Request:</span>
              <span className="text-[#f8f5f0]/90 italic">"{reservation.specialRequest}"</span>
            </div>
          )}

          {/* Restaurant Venue Address */}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-1 text-xs text-[#a39e9b]">
            <div className="flex items-center gap-1.5 text-[#f8f5f0]/80">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <span>Spice & Ember, 123 Food Street, Coimbatore, TN</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#f8f5f0]/80">
              <Phone className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={downloadCalendarFile}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-[#f8f5f0] transition-all"
          >
            <Download className="w-4 h-4 text-[#d4af37]" />
            <span>Add to Calendar</span>
          </button>

          <button
            onClick={onViewMyBookings}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e6a15c] text-xs font-bold text-[#0e0c0d] hover:opacity-95 transition-all text-center"
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};
