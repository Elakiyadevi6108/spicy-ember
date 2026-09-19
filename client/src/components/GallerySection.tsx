import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Expand } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  url: string;
}

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Restaurant Interior', 'Signature Dishes', 'Chef', 'Dining Experience', 'Events'];

  const galleryItems: GalleryItem[] = [
    { id: 1, title: 'Charcoal Flame Tandoori Grill', category: 'Signature Dishes', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
    { id: 2, title: 'Main Dining Room Ambience', category: 'Restaurant Interior', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
    { id: 3, title: 'Executive Chef Crafting Plate', category: 'Chef', url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80' },
    { id: 4, title: 'Pan-seared Butter Chicken', category: 'Signature Dishes', url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80' },
    { id: 5, title: 'Patio Outdoor Seating at Dusk', category: 'Dining Experience', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80' },
    { id: 6, title: 'Friday Night Live Acoustic Band', category: 'Events', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80' },
    { id: 7, title: 'VIP Private Dining Suite', category: 'Restaurant Interior', url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80' },
    { id: 8, title: 'Gulab Jamun with Saffron Rabri', category: 'Signature Dishes', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' },
    { id: 9, title: 'Cocktail & Mocktail Bar Station', category: 'Dining Experience', url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80' }
  ];

  const filteredItems = galleryItems.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <section id="gallery" className="py-24 bg-[#0e0c0d] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-4">
            <Camera className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Visual Showcase</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#f8f5f0] mb-4">
            Spice & Ember <span className="gold-gradient-text">Gallery</span>
          </h2>

          <p className="text-base sm:text-lg text-[#a39e9b] font-light">
            Take a glimpse into our refined dining room, culinary creations, and unforgettable moments.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#e6a15c] text-[#0e0c0d] font-bold shadow-lg shadow-[#d4af37]/15'
                  : 'bg-[#171416] text-[#a39e9b] hover:text-[#f8f5f0] border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              onClick={() => setLightboxImage(item)}
              className="relative group rounded-2xl overflow-hidden glass-panel cursor-pointer border border-[#d4af37]/20 shadow-xl h-72"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0d] via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider mb-1">
                  {item.category}
                </span>
                <h4 className="font-serif font-bold text-lg text-[#f8f5f0] flex items-center justify-between">
                  <span>{item.title}</span>
                  <Expand className="w-5 h-5 text-[#d4af37]" />
                </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full glass-panel rounded-3xl overflow-hidden border border-[#d4af37]/40 shadow-2xl"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 p-2 text-white bg-black/60 hover:bg-black/80 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative max-h-[75vh] bg-black flex items-center justify-center">
                <img
                  src={lightboxImage.url}
                  alt={lightboxImage.title}
                  className="max-h-[75vh] w-auto object-contain"
                />
              </div>

              <div className="p-6 bg-[#0e0c0d] flex items-center justify-between border-t border-white/10">
                <div>
                  <span className="text-xs text-[#d4af37] font-semibold uppercase tracking-wider block mb-1">
                    {lightboxImage.category}
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#f8f5f0]">
                    {lightboxImage.title}
                  </h3>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
