import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Utensils, Clock, MapPin, Phone, Sparkles } from 'lucide-react';

interface HeroProps {
  onReserveClick: () => void;
  onExploreMenuClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onReserveClick, onExploreMenuClick }) => {
  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 overflow-hidden bg-[#0e0c0d]">
      {/* Hero Background Image with Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=85"
          alt="Spice & Ember Dining Experience"
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0c0d] via-[#0e0c0d]/80 to-[#0e0c0d]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0d] via-transparent to-[#0e0c0d]/60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto pt-12 sm:pt-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold tracking-wider uppercase mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Coimbatore's Premier Fine Dining</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#f8f5f0] leading-[1.1] mb-6"
          >
            GOOD FOOD. <br />
            <span className="gold-gradient-text">GOOD MOMENTS.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-[#a39e9b] leading-relaxed mb-8 max-w-xl font-light"
          >
            Experience handcrafted flavors, warm hospitality, and unforgettable dining centered around rich authentic spice and live charcoal ember grilling.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <button
              onClick={onReserveClick}
              className="flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-[#0e0c0d] bg-gradient-to-r from-[#d4af37] to-[#e6a15c] hover:from-[#e6a15c] hover:to-[#d4af37] rounded-xl shadow-xl shadow-[#d4af37]/15 hover:shadow-[#d4af37]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="w-5 h-5" />
              <span>Reserve a Table</span>
            </button>

            <button
              onClick={onExploreMenuClick}
              className="flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-[#f8f5f0] bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#d4af37]/40 rounded-xl transition-all"
            >
              <Utensils className="w-5 h-5 text-[#d4af37]" />
              <span>Explore Menu</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Information Bar Below Hero */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 sm:mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="glass-panel p-4 sm:p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10"
        >
          {/* Item 1: Open Today */}
          <div className="flex items-center gap-4 pt-2 md:pt-0 md:px-4">
            <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-[#a39e9b]">Open Today</span>
              <span className="font-semibold text-[#f8f5f0] text-sm sm:text-base">12:00 PM – 11:00 PM</span>
            </div>
          </div>

          {/* Item 2: Location */}
          <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-4">
            <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-[#a39e9b]">Location</span>
              <span className="font-semibold text-[#f8f5f0] text-sm sm:text-base">123 Food Street, Coimbatore</span>
            </div>
          </div>

          {/* Item 3: Direct Phone */}
          <div className="flex items-center gap-4 pt-4 md:pt-0 md:px-4">
            <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider text-[#a39e9b]">Reservations & Inquiries</span>
              <span className="font-semibold text-[#f8f5f0] text-sm sm:text-base">+91 98765 43210</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
