import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Award, Utensils } from 'lucide-react';

export const ChefSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#0e0c0d] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-[#d4af37]/30 shadow-2xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Chef Photo */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-2xl h-96 sm:h-[450px]">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80"
                  alt="Executive Chef Vikram Roy"
                  className="w-full h-full object-cover filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0d] via-transparent to-transparent opacity-80" />
              </div>

              {/* Overlapping Badge */}
              <div className="absolute bottom-4 left-4 right-4 glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="block text-xs uppercase text-[#a39e9b]">Culinary Master</span>
                  <span className="font-serif font-bold text-base text-[#d4af37]">Chef Vikram Roy</span>
                </div>
                <div className="p-2 rounded-lg bg-[#d4af37]/10 text-[#d4af37]">
                  <Award className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Chef Profile Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold uppercase tracking-wider">
                <Utensils className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Culinary Visionary</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#f8f5f0]">
                Meet Our <span className="gold-gradient-text">Chef</span>
              </h2>

              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-[#d4af37]">Chef Vikram Roy</h3>
                <p className="text-xs uppercase tracking-widest text-[#a39e9b]">Executive Head Chef & Culinary Director</p>
              </div>

              <p className="text-base text-[#a39e9b] font-light leading-relaxed">
                With over 18 years of international culinary experience across Michelin-rated kitchens in Mumbai, Dubai, and London, Chef Vikram Roy brings unmatched passion to Spice & Ember. His cooking philosophy combines ancient slow-tandoori grilling with contemporary plating techniques.
              </p>

              {/* Highlights & Signature Dish */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="p-4 rounded-xl bg-[#171416] border border-white/5">
                  <div className="flex items-center gap-2 text-[#d4af37] font-semibold text-sm mb-1">
                    <Flame className="w-4 h-4 text-[#e6a15c]" />
                    <span>Signature Dish</span>
                  </div>
                  <p className="text-xs text-[#f8f5f0] font-medium">Tandoori Smoked Lamb Raan</p>
                  <p className="text-[11px] text-[#a39e9b] mt-0.5">Slow-cooked 12 hours with 24 hand-ground spices</p>
                </div>

                <div className="p-4 rounded-xl bg-[#171416] border border-white/5">
                  <div className="flex items-center gap-2 text-[#d4af37] font-semibold text-sm mb-1">
                    <Star className="w-4 h-4 text-[#d4af37]" />
                    <span>Philosophy</span>
                  </div>
                  <p className="text-xs text-[#f8f5f0] font-medium">Authenticity meets Innovation</p>
                  <p className="text-[11px] text-[#a39e9b] mt-0.5">Fresh seasonal produce & zero artificial colors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
