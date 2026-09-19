import React, { useState } from 'react';
import { ReservationForm } from './ReservationForm';
import { ConfirmationModal } from './ConfirmationModal';
import { Reservation } from '../types';
import { Calendar, ShieldCheck, Clock, Award } from 'lucide-react';

interface ReservationSectionProps {
  onViewMyBookings: () => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({ onViewMyBookings }) => {
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  return (
    <section id="reservations" className="py-24 bg-[#0e0c0d] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-4">
            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Instant Online Booking</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#f8f5f0] mb-4">
            Reserve Your <span className="gold-gradient-text">Table</span>
          </h2>

          <p className="text-base sm:text-lg text-[#a39e9b] font-light">
            Plan your special evening with instant table confirmation, custom seating choices, and dedicated hospitality.
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto">
          <ReservationForm
            onSuccess={(res) => {
              setConfirmedReservation(res);
            }}
          />
        </div>

        {/* Feature Badges below form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#f8f5f0] text-sm">Instant Confirmation</h4>
              <p className="text-xs text-[#a39e9b]">Instant table assignment with ID</p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#f8f5f0] text-sm">Flexible Modification</h4>
              <p className="text-xs text-[#a39e9b]">Modify or cancel anytime online</p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#f8f5f0] text-sm">VIP Seating</h4>
              <p className="text-xs text-[#a39e9b]">Indoor, patio, window & private suites</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmedReservation && (
        <ConfirmationModal
          reservation={confirmedReservation}
          onClose={() => setConfirmedReservation(null)}
          onViewMyBookings={() => {
            setConfirmedReservation(null);
            onViewMyBookings();
          }}
        />
      )}
    </section>
  );
};
