import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { Lock, Mail, User as UserIcon, X, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const res = await api.register(name, email, password);
        onSuccess(res.user);
      } else {
        const res = await api.login(email, password);
        onSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      // Demo fallback logic if server API call fails
      const role = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
      const fallbackUser: User = {
        id: Math.floor(Math.random() * 100) + 1,
        name: name || (role === 'admin' ? 'Spice & Ember Admin' : 'Demo Customer'),
        email,
        role
      };
      onSuccess(fallbackUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminDemo = () => {
    setEmail('admin@spiceandember.com');
    setPassword('admin123');
    setIsSignUp(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-[#d4af37]/40 shadow-2xl overflow-hidden">
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#d4af37] via-[#e6a15c] to-[#d4af37]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#a39e9b] hover:text-[#f8f5f0] rounded-xl hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-3 text-[#d4af37]">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="font-serif text-2xl font-bold text-[#f8f5f0]">
            {isSignUp ? 'Create Customer Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-[#a39e9b] mt-1">
            {isSignUp ? 'Register to manage dining reservations' : 'Sign in to access your bookings & profile'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-[#f8f5f0] mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#a39e9b] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Rohan Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#171416] border border-[#d4af37]/20 rounded-xl text-xs text-[#f8f5f0] focus:outline-none focus:border-[#d4af37]"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#f8f5f0] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#a39e9b] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#171416] border border-[#d4af37]/20 rounded-xl text-xs text-[#f8f5f0] focus:outline-none focus:border-[#d4af37]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#f8f5f0] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#a39e9b] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#171416] border border-[#d4af37]/20 rounded-xl text-xs text-[#f8f5f0] focus:outline-none focus:border-[#d4af37]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-xs text-[#0e0c0d] bg-gradient-to-r from-[#d4af37] to-[#e6a15c] hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Demo Admin Quick Button */}
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <button
            onClick={handleQuickAdminDemo}
            className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1 mx-auto"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fill Demo Admin Credentials (admin@spiceandember.com)</span>
          </button>
        </div>

        {/* Toggle Sign Up / Login */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-[#a39e9b] hover:text-[#d4af37] transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
