import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MatchCard } from '../components/MatchCard';
import { SearchBar } from '../components/SearchBar';
import { Sparkles, Info, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';

export const MatchesPage: React.FC = () => {
  const { matches } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMatches = useMemo(() => {
    if (!searchQuery.trim()) return matches;
    const q = searchQuery.toLowerCase().trim();
    return matches.filter(
      (m) =>
        m.lostItem.title.toLowerCase().includes(q) ||
        m.foundItem.title.toLowerCase().includes(q) ||
        m.lostItem.category.toLowerCase().includes(q) ||
        m.lostItem.color.toLowerCase().includes(q) ||
        m.lostItem.location.toLowerCase().includes(q)
    );
  }, [matches, searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Rule-Based Engine
          </span>
          <span className="text-xs text-slate-400">Total: {matches.length} possible matches</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Smart Possible Matches
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Automated cross-referencing of reported lost belongings with turned-in found items.
        </p>
      </div>

      {/* Informational Guidance Alert */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs sm:text-sm text-amber-950">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-900">How "Possible Matches" Work:</p>
          <p className="text-slate-600 text-xs leading-relaxed">
            Our engine compares <strong className="font-semibold text-slate-800">Category</strong>, <strong className="font-semibold text-slate-800">Colour</strong>, <strong className="font-semibold text-slate-800">Location</strong>, and <strong className="font-semibold text-slate-800">Keyword Overlap</strong>. Items are flagged as potential pairs so students can verify whether the found object belongs to them.
          </p>
          <p className="text-[11px] text-amber-800 font-medium">
            Important: These are suggestions, not definitive verifications. Please verify ownership at the Student Desk.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter matches by item title, category, or colour..."
        />
      </div>

      {/* Matches List */}
      {filteredMatches.length > 0 ? (
        <div className="space-y-5">
          {filteredMatches.map((match, idx) => (
            <MatchCard key={`${match.lostItem.id}-${match.foundItem.id}-${idx}`} match={match} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No matching pairs found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            As students report more lost and found belongings, potential pairs matching category and colour will automatically appear here.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/report-lost"
              className="px-4 py-2 rounded-xl bg-navy-900 text-white font-semibold text-xs"
            >
              Report Lost Item
            </Link>
            <Link
              to="/report-found"
              className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs"
            >
              Report Found Item
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
