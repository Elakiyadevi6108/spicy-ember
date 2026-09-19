import React from 'react';
import { Search, Filter, Leaf } from 'lucide-react';

interface MenuFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  vegOnly: boolean;
  onToggleVegOnly: () => void;
}

export const MenuFilter: React.FC<MenuFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  vegOnly,
  onToggleVegOnly
}) => {
  return (
    <div className="space-y-6 mb-10">
      {/* Search and Veg Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-[#a39e9b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#171416] border border-[#d4af37]/20 rounded-xl text-sm text-[#f8f5f0] placeholder-[#a39e9b]/60 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
          />
        </div>

        {/* Veg Only Toggle */}
        <button
          onClick={onToggleVegOnly}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
            vegOnly
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
              : 'bg-[#171416] border-white/10 text-[#a39e9b] hover:text-[#f8f5f0]'
          }`}
        >
          <Leaf className="w-4 h-4 text-emerald-500" />
          <span>Vegetarian Only</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#e6a15c] text-[#0e0c0d] font-bold shadow-lg shadow-[#d4af37]/15'
                  : 'bg-[#171416] text-[#a39e9b] hover:text-[#f8f5f0] border border-white/5 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
