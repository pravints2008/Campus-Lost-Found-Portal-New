import React from 'react';
import { Link } from 'react-router-dom';
import { LostFoundItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { CategoryIcon } from './CategoryIcon';
import { MapPin, Calendar, Palette, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ItemCardProps {
  item: LostFoundItem;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { getItemMatches } = useApp();
  const matches = getItemMatches(item);
  const hasPossibleMatch = matches.length > 0;

  const isLost = item.type === 'lost';
  const imgUrl = item.imageUrl || item.image_url;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle hover:shadow-card transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Image container */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-slate-100 to-slate-200">
            <CategoryIcon category={item.category} className="w-12 h-12 stroke-[1.25] text-slate-400 mb-1" />
            <span className="text-xs font-medium text-slate-500">No photo provided</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span
            className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs backdrop-blur-md ${
              isLost
                ? 'bg-rose-500/90 text-white'
                : 'bg-teal-600/90 text-white'
            }`}
          >
            {isLost ? 'Lost Item' : 'Found Item'}
          </span>
          <span className="text-xs font-medium bg-white/95 text-slate-700 px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 border border-slate-200/60 backdrop-blur-md">
            <CategoryIcon category={item.category} className="w-3 h-3 text-teal-600" />
            {item.category}
          </span>
        </div>

        {/* Possible Match Badge */}
        {hasPossibleMatch && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-amber-500/95 text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 backdrop-blur-sm animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{matches.length} Possible Match{matches.length > 1 ? 'es' : ''} Identified</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Status & Title */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-800 text-base line-clamp-1 group-hover:text-teal-700 transition-colors">
              {item.title}
            </h3>
            <StatusBadge status={item.status} size="sm" />
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {item.description || 'No additional description provided.'}
          </p>

          {/* Metadata Grid */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-navy-600 shrink-0" />
              <span className="truncate">{item.color}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{isLost ? 'Lost on' : 'Found on'}: {item.date}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-3 border-t border-slate-100">
          <Link
            to={`/item/${item.id}`}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-navy-50 hover:bg-navy-100 text-navy-800 font-medium text-xs sm:text-sm transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-navy-600 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
