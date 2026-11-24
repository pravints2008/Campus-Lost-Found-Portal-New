import React from 'react';
import { ItemCategory, LocationType, ItemStatus } from '../types';
import { Filter, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  onReset: () => void;
  totalFiltered: number;
}

const CATEGORIES: ('All' | ItemCategory)[] = [
  'All',
  'ID Card',
  'Water Bottle',
  'Books',
  'Wallet',
  'Earphones',
  'Keys',
  'Others',
];

const LOCATIONS: ('All' | LocationType)[] = [
  'All',
  'Classroom',
  'Library',
  'Canteen',
  'Laboratory',
  'Hostel',
  'Other',
];

const STATUSES: ('All' | ItemStatus)[] = ['All', 'Open', 'Pending', 'Returned'];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedLocation,
  onSelectLocation,
  selectedStatus,
  onSelectStatus,
  onReset,
  totalFiltered,
}) => {
  const isFiltered =
    selectedCategory !== 'All' || selectedLocation !== 'All' || selectedStatus !== 'All';

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Filter className="w-4 h-4 text-teal-600" />
          <span>Filters</span>
          <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {totalFiltered} {totalFiltered === 1 ? 'item' : 'items'}
          </span>
        </div>

        {isFiltered && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-800 font-medium hover:underline transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Category Filter */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Location</label>
          <select
            value={selectedLocation}
            onChange={(e) => onSelectLocation(e.target.value)}
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc === 'All' ? 'All Locations' : loc}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => onSelectStatus(e.target.value)}
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st === 'All' ? 'All Statuses' : st}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
