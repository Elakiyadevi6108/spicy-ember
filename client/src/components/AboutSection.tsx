import React from 'react';
import { motion } from 'framer-motion';
import { Award, UtensilsCrossed, Users, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const stats = [
    { label: 'Years of Culinary Mastery', value: '10+', icon: Award },
    { label: 'Signature Artisan Dishes', value: '50+', icon: UtensilsCrossed },
    { label: 'Happy Guests Served', value: '25K+', icon: Users }
  ];

  return (
    <section id="about" className="py-24 bg-[#0e0c0d] relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image Mosaic */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-[#d4af37]/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                alt="Spice & Ember Kitchen Ambience"
                className="w-full h-[420px] sm:h-[500px] object-cover filter brightness-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0d] via-transparent to-transparent opacity-80" />
            </div>

            {/* Overlapping Badge Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 sm:bottom-6 sm:right-6 glass-panel p-5 rounded-2xl border border-[#d4af37]/40 shadow-2xl max-w-xs hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#e6a15c] text-[#0e0c0d]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#f8f5f0]">Crafted with Passion</h4>
                  <p className="text-xs text-[#a39e9b]">Authentic Charcoal Grills & Modern Plating</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Narrative & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-4">
              <span>Heritage & Passion</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#f8f5f0] mb-6 leading-tight">
              Our <span className="gold-gradient-text">Story</span>
            </h2>

            <p className="text-base sm:text-lg text-[#a39e9b] leading-relaxed mb-6 font-light">
              Spice & Ember brings together traditional Indian regional flavors and modern culinary creativity. Every dish is prepared with carefully selected organic spices, thoughtful slow-cooking techniques, and a passion for memorable dining.
            </p>

            <p className="text-base sm:text-lg text-[#a39e9b] leading-relaxed mb-10 font-light">
              From our signature charcoal tandoori meats and wood-fired appetizers to rich, aromatic gravies and handcrafted desserts, we invite you to embark on an unforgettable gastronomic journey in the heart of Coimbatore.
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[#d4af37] mb-1">
                      <Icon className="w-4 h-4" />
                      <span className="font-serif text-2xl sm:text-3xl font-bold gold-gradient-text">
                        {stat.value}
                      </span>
                    </div>
                    <span className="block text-xs sm:text-sm text-[#a39e9b] font-medium leading-tight">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
