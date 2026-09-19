import React from 'react';
import { MenuItem } from '../types';
import { Sparkles, Flame } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden group hover:border-[#d4af37]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#d4af37]/5 flex flex-col h-full">
      {/* Food Image */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-[#171416]">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171416] via-transparent to-transparent opacity-80" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {/* Veg / Non-Veg Indicator */}
          <div
            className={`w-6 h-6 rounded-md bg-[#0e0c0d]/90 backdrop-blur-md flex items-center justify-center border ${
              item.isVeg ? 'border-emerald-500' : 'border-red-500'
            }`}
            title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                item.isVeg ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            />
          </div>

          {item.isPopular && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d4af37] text-[#0e0c0d] text-[11px] font-bold shadow-md">
              <Sparkles className="w-3 h-3" />
              Popular
            </span>
          )}
        </div>

        {/* Category Pill */}
        <span className="absolute bottom-3 right-3 text-[11px] font-medium text-[#a39e9b] bg-[#0e0c0d]/80 px-2.5 py-1 rounded-md border border-white/10">
          {item.category}
        </span>
      </div>

      {/* Details */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-serif text-lg font-bold text-[#f8f5f0] group-hover:text-[#d4af37] transition-colors leading-snug">
              {item.name}
            </h3>
            <span className="font-serif text-lg font-bold text-[#d4af37] whitespace-nowrap">
              ₹{item.price}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#a39e9b] font-light leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#a39e9b]">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#e6a15c]" />
            Freshly Prepared
          </span>
          <span className="text-[11px] text-emerald-400 font-medium">In Stock</span>
        </div>
      </div>
    </div>
  );
};
