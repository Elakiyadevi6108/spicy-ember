import React, { useState, useEffect } from 'react';
import { Flame, Calendar, Menu, X, User as UserIcon, ShieldAlert } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenBooking
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'Our Story' },
    { id: 'menu', label: 'Menu' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'events', label: 'Events' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-nav py-3 shadow-xl' : 'bg-gradient-to-b from-[#0e0c0d]/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 text-left focus:outline-none group"
        >
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#e6a15c]/10 border border-[#d4af37]/30 group-hover:border-[#d4af37] transition-all">
            <Flame className="w-6 h-6 text-[#d4af37] animate-pulse" />
          </div>
          <div>
            <span className="block font-serif text-xl sm:text-2xl font-bold tracking-wider gold-gradient-text">
              SPICE & EMBER
            </span>
            <span className="block text-[10px] tracking-[0.25em] text-[#a39e9b] uppercase -mt-1 font-sans">
              Modern Indian Dining
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30'
                    : 'text-[#f8f5f0]/80 hover:text-[#f8f5f0] hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'text-amber-400 bg-amber-400/10 border border-amber-400/30'
                  : 'text-amber-300/80 hover:text-amber-300 hover:bg-amber-400/5'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Admin
            </button>
          )}

          {currentUser && currentUser.role === 'customer' && (
            <button
              onClick={() => handleNavClick('my-bookings')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'my-bookings'
                  ? 'text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30'
                  : 'text-[#f8f5f0]/80 hover:text-[#f8f5f0] hover:bg-white/5'
              }`}
            >
              My Bookings
            </button>
          )}
        </div>

        {/* Right CTA & User Auth */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin' : 'my-bookings')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#d4af37]/40 text-xs text-[#f8f5f0]"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="max-w-[100px] truncate">{currentUser.name}</span>
              </button>
              <button
                onClick={onLogout}
                className="text-xs text-[#a39e9b] hover:text-red-400 px-2 py-1"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs text-[#f8f5f0]/80 hover:text-[#d4af37] px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#d4af37]/30 transition-all"
            >
              Sign In
            </button>
          )}

          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#0e0c0d] bg-gradient-to-r from-[#d4af37] to-[#e6a15c] hover:from-[#e6a15c] hover:to-[#d4af37] rounded-xl shadow-lg hover:shadow-[#d4af37]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Calendar className="w-4 h-4" />
            <span>Book a Table</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenBooking}
            className="px-3 py-1.5 text-xs font-semibold text-[#0e0c0d] bg-gradient-to-r from-[#d4af37] to-[#e6a15c] rounded-lg"
          >
            Book
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#f8f5f0] hover:text-[#d4af37] rounded-lg border border-white/10"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel mt-2 mx-4 p-4 rounded-2xl border border-[#d4af37]/20 shadow-2xl flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`text-left px-4 py-3 rounded-xl text-base font-medium transition-all ${
                activeTab === link.id
                  ? 'text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30'
                  : 'text-[#f8f5f0]/80 hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin')}
              className="text-left px-4 py-3 rounded-xl text-base font-medium text-amber-400 bg-amber-400/10 border border-amber-400/30 flex items-center justify-between"
            >
              <span>Admin Dashboard</span>
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </button>
          )}

          {currentUser?.role === 'customer' && (
            <button
              onClick={() => handleNavClick('my-bookings')}
              className="text-left px-4 py-3 rounded-xl text-base font-medium text-[#d4af37] bg-[#d4af37]/10"
            >
              My Reservations
            </button>
          )}

          <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-2">
            {currentUser ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-[#f8f5f0]">{currentUser.name}</span>
                <button onClick={onLogout} className="text-xs text-red-400 font-medium">
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full text-center py-2.5 rounded-xl border border-[#d4af37]/30 text-[#d4af37] font-medium"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
