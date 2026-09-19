import React, { useState } from 'react';
import { Flame, Send, CheckCircle2, MapPin, Phone, Mail, Globe, MessageCircle, Share2 } from 'lucide-react';
import { api } from '../services/api';

interface FooterProps {
  onNavClick: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !/\S+@\S+\.\S+/.test(newsletterEmail)) return;

    try {
      await api.subscribeNewsletter(newsletterEmail);
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 5000);
    } catch (err) {
      setNewsletterSuccess(true);
    }
  };

  return (
    <footer className="bg-[#0a0809] text-[#f8f5f0] border-t border-[#d4af37]/20 pt-16 pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand Logo & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#e6a15c]/10 border border-[#d4af37]/30">
                <Flame className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div>
                <span className="block font-serif text-2xl font-bold tracking-wider gold-gradient-text">
                  SPICE & EMBER
                </span>
                <span className="block text-[10px] tracking-[0.25em] text-[#a39e9b] uppercase -mt-1 font-sans">
                  Modern Indian Dining
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#a39e9b] font-light leading-relaxed max-w-sm">
              Crafted flavors, slow tandoori charcoal embers, and warm hospitality in Coimbatore. Dedicated to bringing you unforgettable dining moments.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#social" className="p-2.5 rounded-xl bg-white/5 hover:bg-[#d4af37]/10 text-[#a39e9b] hover:text-[#d4af37] border border-white/10 transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#social" className="p-2.5 rounded-xl bg-white/5 hover:bg-[#d4af37]/10 text-[#a39e9b] hover:text-[#d4af37] border border-white/10 transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#social" className="p-2.5 rounded-xl bg-white/5 hover:bg-[#d4af37]/10 text-[#a39e9b] hover:text-[#d4af37] border border-white/10 transition-all">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#d4af37] uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#a39e9b]">
              {['home', 'about', 'menu', 'reservations', 'gallery', 'events', 'contact'].map((id) => (
                <li key={id}>
                  <button
                    onClick={() => onNavClick(id)}
                    className="hover:text-[#d4af37] transition-colors capitalize text-left"
                  >
                    {id === 'about' ? 'Our Story' : id}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact & Hours */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#d4af37] uppercase tracking-wider">
              Visit Us
            </h4>
            <div className="space-y-2 text-xs text-[#a39e9b]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>123 Food Street, Coimbatore, TN</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>hello@spiceandember.com</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="block text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold mb-1">
                Hours
              </span>
              <p className="text-xs text-[#a39e9b]">Mon-Fri: 12:00 PM – 11:00 PM</p>
              <p className="text-xs text-[#a39e9b]">Sat-Sun: 11:00 AM – 11:30 PM</p>
            </div>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#d4af37] uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-xs text-[#a39e9b] font-light">
              Subscribe for exclusive chef tasting invites, weekend music updates, and culinary offers.
            </p>

            {newsletterSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Subscribed! Check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#171416] border border-[#d4af37]/20 rounded-xl text-xs text-[#f8f5f0] placeholder-[#a39e9b]/50 focus:outline-none focus:border-[#d4af37]"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-gradient-to-r from-[#d4af37] to-[#e6a15c] text-[#0e0c0d] font-bold text-xs rounded-lg hover:opacity-90 transition-all flex items-center justify-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#a39e9b] gap-4">
          <p>© 2026 Spice & Ember. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-[#d4af37]">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-[#d4af37]">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
