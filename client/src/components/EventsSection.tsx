import React, { useState, useEffect } from 'react';
import { EventItem } from '../types';
import { api } from '../services/api';
import { Calendar, Clock, Sparkles } from 'lucide-react';

interface EventsSectionProps {
  onBookEvent: (eventTitle: string) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ onBookEvent }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await api.getEvents();
      setEvents(data);
    } catch (err) {
      setEvents(fallbackEvents);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="events" className="py-24 bg-[#0e0c0d] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Exclusive Experiences</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#f8f5f0] mb-4">
            Special <span className="gold-gradient-text">Events & Nights</span>
          </h2>

          <p className="text-base sm:text-lg text-[#a39e9b] font-light">
            Join us for curated live music, seasonal tasting menus, and family weekend gatherings.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="glass-panel rounded-3xl overflow-hidden border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="relative h-60 sm:h-72 overflow-hidden bg-[#171416]">
                <img
                  src={ev.imageUrl}
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0d] via-transparent to-transparent opacity-90" />

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e0c0d]/90 text-[#d4af37] border border-[#d4af37]/30">
                    <Calendar className="w-3.5 h-3.5" />
                    {ev.date}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e0c0d]/90 text-[#f8f5f0] border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-[#e6a15c]" />
                    {ev.time}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#f8f5f0] group-hover:text-[#d4af37] transition-colors mb-2">
                    {ev.title}
                  </h3>
                  <p className="text-sm text-[#a39e9b] font-light leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-medium">Limited Seats Available</span>
                  <button
                    onClick={() => onBookEvent(ev.title)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#0e0c0d] bg-gradient-to-r from-[#d4af37] to-[#e6a15c] hover:from-[#e6a15c] hover:to-[#d4af37] shadow-md transition-all"
                  >
                    Book Event
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const fallbackEvents: EventItem[] = [
  {
    id: 1,
    title: 'Weekend Live Music Night',
    date: 'Every Friday & Saturday',
    time: '07:30 PM - 10:30 PM',
    description: 'Immerse yourself in acoustic jazz & classical fusion while enjoying our signature cocktails and tandoori grills.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'Family Dinner Night',
    date: 'Every Sunday',
    time: '06:30 PM - 10:30 PM',
    description: 'Complimentary dessert platter and custom kids menu for family bookings of 4 or more guests.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: "Chef's Special Tasting Evening",
    date: 'Last Wednesday of the Month',
    time: '07:00 PM - 10:00 PM',
    description: 'An exclusive 7-course culinary journey curated by Executive Chef Vikram Roy paired with fine mocktails & wines.',
    imageUrl: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'Private Dining & Celebrations',
    date: 'Available on Booking',
    time: 'Custom Slots',
    description: 'Reserve our luxury private dining suite for birthday parties, anniversaries, and corporate dinners.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
  }
];
