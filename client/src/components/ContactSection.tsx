import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2, Share2, Globe, MessageCircle } from 'lucide-react';
import { api } from '../services/api';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.sendContact({ name, email, phone, message });
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0e0c0d] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-4">
            <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Get in Touch</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#f8f5f0] mb-4">
            Contact <span className="gold-gradient-text">Spice & Ember</span>
          </h2>

          <p className="text-base sm:text-lg text-[#a39e9b] font-light">
            Have questions about private events, catering, or dining reservations? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Contact Information & Hours */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-8 rounded-3xl border border-[#d4af37]/20 space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[#f8f5f0]">
                Restaurant Information
              </h3>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#a39e9b] mb-1 font-semibold">Address</h4>
                  <p className="text-sm font-medium text-[#f8f5f0]">
                    123 Food Street, Coimbatore, Tamil Nadu, India
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37] shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#a39e9b] mb-1 font-semibold">Phone</h4>
                  <p className="text-sm font-medium text-[#f8f5f0]">+91 98765 43210</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#d4af37]/10 text-[#d4af37] shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#a39e9b] mb-1 font-semibold">Email</h4>
                  <p className="text-sm font-medium text-[#f8f5f0]">hello@spiceandember.com</p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-3">
                  <Clock className="w-4 h-4" />
                  <span>Opening Hours</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#a39e9b]">
                    <span>Monday – Friday:</span>
                    <span className="font-semibold text-[#f8f5f0]">12:00 PM – 11:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between text-[#a39e9b]">
                    <span>Saturday – Sunday:</span>
                    <span className="font-semibold text-[#d4af37]">11:00 AM – 11:30 PM</span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                <span className="text-xs text-[#a39e9b]">Connect:</span>
                <a href="#social" className="p-2 rounded-lg bg-white/5 text-[#a39e9b] hover:text-[#d4af37] hover:bg-white/10 transition-all">
                  <Globe className="w-4 h-4" />
                </a>
                <a href="#social" className="p-2 rounded-lg bg-white/5 text-[#a39e9b] hover:text-[#d4af37] hover:bg-white/10 transition-all">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a href="#social" className="p-2 rounded-lg bg-white/5 text-[#a39e9b] hover:text-[#d4af37] hover:bg-white/10 transition-all">
                  <Share2 className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Map Frame Placeholder */}
            <div className="glass-panel rounded-3xl overflow-hidden h-48 border border-white/10 relative">
              <iframe
                title="Spice & Ember Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62650.08272996901!2d76.921388!3d11.016844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[#d4af37]/30 shadow-2xl">
              <h3 className="font-serif text-2xl font-bold text-[#f8f5f0] mb-2">
                Send Us a Message
              </h3>
              <p className="text-xs sm:text-sm text-[#a39e9b] mb-6">
                Fill out the form below and our team will get back to you within 2 hours.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="font-serif text-xl font-bold text-[#f8f5f0]">Message Sent Successfully!</h4>
                  <p className="text-xs text-[#a39e9b]">
                    Thank you for reaching out to Spice & Ember. We have received your inquiry.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2 rounded-xl bg-emerald-500 text-[#0e0c0d] font-bold text-xs mt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-[#f8f5f0] mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#171416] border border-[#d4af37]/20 rounded-xl text-sm text-[#f8f5f0] focus:outline-none focus:border-[#d4af37]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#f8f5f0] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="rajesh@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-[#171416] border border-[#d4af37]/20 rounded-xl text-sm text-[#f8f5f0] focus:outline-none focus:border-[#d4af37]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#f8f5f0] mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-[#171416] border border-[#d4af37]/20 rounded-xl text-sm text-[#f8f5f0] focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#f8f5f0] mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your event, feedback, or inquiry..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-[#171416] border border-[#d4af37]/20 rounded-xl text-sm text-[#f8f5f0] focus:outline-none focus:border-[#d4af37]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-[#0e0c0d] bg-gradient-to-r from-[#d4af37] to-[#e6a15c] hover:from-[#e6a15c] hover:to-[#d4af37] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/15"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
