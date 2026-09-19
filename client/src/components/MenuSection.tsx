import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MenuItem } from '../types';
import { MenuCard } from './MenuCard';
import { MenuFilter } from './MenuFilter';
import { api } from '../services/api';
import { Utensils, AlertCircle } from 'lucide-react';

export const MenuSection: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  const categories = [
    'All',
    'Starters',
    'Soups',
    'Main Course',
    'Indian Specials',
    'Continental',
    'Desserts',
    'Beverages'
  ];

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    setLoading(true);
    try {
      const data = await api.getMenuItems();
      setItems(data);
    } catch (err) {
      console.error('Failed to load menu:', err);
      // Fallback local items if backend API call fails
      setItems(fallbackMenu);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !vegOnly || item.isVeg;
    return matchesCat && matchesSearch && matchesVeg;
  });

  return (
    <section id="menu" className="py-24 bg-[#0e0c0d] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold uppercase tracking-wider mb-4">
            <Utensils className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Artisan Culinary Selection</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#f8f5f0] mb-4">
            Explore Our <span className="gold-gradient-text">Menu</span>
          </h2>

          <p className="text-base sm:text-lg text-[#a39e9b] font-light">
            Handcrafted with freshly ground spices, organic ingredients, and authentic tandoori flame grills.
          </p>
        </div>

        {/* Filter Bar */}
        <MenuFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          vegOnly={vegOnly}
          onToggleVegOnly={() => setVegOnly(!vegOnly)}
        />

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="glass-panel rounded-2xl p-4 h-72 animate-pulse flex flex-col justify-between">
                <div className="w-full h-40 bg-white/5 rounded-xl" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 glass-panel rounded-3xl border border-white/10">
            <AlertCircle className="w-12 h-12 text-[#a39e9b] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-[#f8f5f0] mb-2">No dishes found</h3>
            <p className="text-sm text-[#a39e9b] mb-6">
              Try adjusting your search criteria or switching categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setVegOnly(false);
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#d4af37] text-[#0e0c0d]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Menu Grid */
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

// Fallback menu data
const fallbackMenu: MenuItem[] = [
  { id: 1, name: 'Crispy Paneer', description: 'Cottage cheese cubes tossed in spicy aromatic herbs and crisp peppers.', price: 340, category: 'Starters', isVeg: true, isPopular: true, imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Chicken 65', description: 'Deep fried spicy chicken chunks tempered with curry leaves and red chili.', price: 420, category: 'Starters', isVeg: false, isPopular: true, imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Garlic Prawns', description: 'Jumbo prawns pan-seared with crushed garlic, green chili butter, and coriander.', price: 580, category: 'Starters', isVeg: false, isPopular: true, imageUrl: 'https://images.unsplash.com/photo-1559742811-822863646df8?auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'Vegetable Spring Rolls', description: 'Crispy golden pastry filled with seasoned julienned veggies and glass noodles.', price: 290, category: 'Starters', isVeg: true, isPopular: false, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' },
  { id: 5, name: 'Butter Chicken', description: 'Succulent chicken tikka simmered in rich velvety cashew tomato gravy.', price: 490, category: 'Main Course', isVeg: false, isPopular: true, imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80' },
  { id: 6, name: 'Paneer Tikka Masala', description: 'Char-broiled paneer cubes cooked in a fragrant spiced onion-tomato reduction.', price: 430, category: 'Main Course', isVeg: true, isPopular: true, imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80' },
  { id: 7, name: 'Chicken Biryani', description: 'Long-grain basmati rice layered with spiced marinated chicken and aromatics.', price: 480, category: 'Main Course', isVeg: false, isPopular: true, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80' },
  { id: 8, name: 'Vegetable Biryani', description: 'Fragrant basmati rice slow-cooked dum style with seasonal vegetables & mint.', price: 380, category: 'Main Course', isVeg: true, isPopular: false, imageUrl: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=600&q=80' },
  { id: 9, name: 'Grilled Fish with Herb Butter', description: 'Pan-seared sea bass filet served with lemon-garlic butter sauce and mashed potatoes.', price: 620, category: 'Main Course', isVeg: false, isPopular: true, imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80' },
  { id: 10, name: 'Gulab Jamun with Rabri', description: 'Hot saffron milk dumplings served over thick cardamom infused condensed milk.', price: 240, category: 'Desserts', isVeg: true, isPopular: true, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' },
  { id: 11, name: 'Chocolate Lava Cake', description: 'Warm dark chocolate cake with a molten chocolate core, served with vanilla ice cream.', price: 290, category: 'Desserts', isVeg: true, isPopular: true, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80' },
  { id: 12, name: 'Mango Lassi', description: 'Thick chilled yogurt drink blended with sweet Alphonso mango pulp and saffron.', price: 180, category: 'Beverages', isVeg: true, isPopular: true, imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80' }
];
