import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ItemCard } from '../components/ItemCard';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { PlusCircle, HelpCircle, PackageSearch, Sparkles } from 'lucide-react';

export const LostItemsPage: React.FC = () => {
  const { items } = useApp();
  const location = useLocation();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Filter lost items only
  const lostItems = useMemo(() => {
    return items.filter((item) => item.type === 'lost');
  }, [items]);

  // Apply search & filters
  const filteredItems = useMemo(() => {
    return lostItems.filter((item) => {
      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesColor = item.color.toLowerCase().includes(query);
        const matchesLoc = item.location.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesColor && !matchesLoc && !matchesCategory) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'All' && item.location !== selectedLocation) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'All' && item.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [lostItems, searchQuery, selectedCategory, selectedLocation, selectedStatus]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSelectedStatus('All');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
              Directory
            </span>
            <span className="text-xs text-slate-400">Total: {lostItems.length} items</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lost Belongings Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            All items reported missing by students and staff across the campus.
          </p>
        </div>

        <Link
          to="/report-lost"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-teal-400" />
          <span>Report Lost Item</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search lost items by name, color, location, keywords..."
        />
      </div>

      {/* Filter Panel */}
      <FilterPanel
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        onReset={handleResetFilters}
        totalFiltered={filteredItems.length}
      />

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No matching lost reports found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing active filters to see all reported belongings.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
