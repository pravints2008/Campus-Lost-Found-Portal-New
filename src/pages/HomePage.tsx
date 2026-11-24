import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DashboardCard } from '../components/DashboardCard';
import { ItemCard } from '../components/ItemCard';
import { MatchCard } from '../components/MatchCard';
import { 
  PlusCircle, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  Compass,
  FileCheck,
  PackageSearch,
  Users
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { items, stats, matches } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');

  const filteredRecentItems = items
    .filter((item) => {
      if (activeTab === 'all') return true;
      return item.type === activeTab;
    })
    .slice(0, 6);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-900 to-navy-950 text-white rounded-3xl p-6 sm:p-12 shadow-card border border-navy-800">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold backdrop-blur-md">
            <Compass className="w-3.5 h-3.5" />
            <span>Campus Student Belongings Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Lost something? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-emerald-400">
              Let's help you find it.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The official centralized portal for students, faculty, and campus staff. Report lost possessions, submit discovered belongings, and let our smart rule-based matching connect the dots safely.
          </p>

          {/* Two Prominent Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/report-lost"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-900/30 transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Report Lost Item</span>
            </Link>
            <Link
              to="/report-found"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-teal-900/30 transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Report Found Item</span>
            </Link>
            <Link
              to="/matches"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-navy-800 hover:bg-navy-750 text-teal-300 border border-teal-500/30 font-semibold text-sm sm:text-base transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>View Matches ({matches.length})</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Lost Items"
            value={stats.totalLost}
            subtitle="Belongings currently reported missing"
            icon={HelpCircle}
            variant="navy"
          />
          <DashboardCard
            title="Total Found Items"
            value={stats.totalFound}
            subtitle="Turned in by honest students & staff"
            icon={PackageSearch}
            variant="teal"
          />
          <DashboardCard
            title="Successfully Returned"
            value={stats.totalReturned}
            subtitle="Safely restored to rightful owners"
            icon={CheckCircle2}
            variant="emerald"
            badge="Verified"
          />
          <DashboardCard
            title="Smart Matches"
            value={stats.activeMatchesCount}
            subtitle="Potential matches detected by algorithm"
            icon={Sparkles}
            variant="amber"
            badge="Active"
          />
        </div>
      </section>

      {/* Featured Possible Matches Showcase (if any) */}
      {matches.length > 0 && (
        <section className="bg-amber-50/50 rounded-3xl p-6 sm:p-8 border border-amber-200/80 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Smart Matching Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Possible Matches Identified
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Our rule-based engine detected potential overlap between recently lost and found reports.
              </p>
            </div>
            <Link
              to="/matches"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-900 bg-white px-4 py-2 rounded-xl border border-teal-200 shadow-2xs hover:shadow-xs transition-all shrink-0"
            >
              <span>Explore All {matches.length} Matches</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <MatchCard match={matches[0]} />
          </div>
        </section>
      )}

      {/* Recently Reported Items Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              Recently Reported Belongings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Browse the latest lost items and discovered possessions across all campus buildings
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex p-1 bg-slate-200/70 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-navy-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Reports ({items.length})
            </button>
            <button
              onClick={() => setActiveTab('lost')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'lost'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost Only ({stats.totalLost})
            </button>
            <button
              onClick={() => setActiveTab('found')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'found'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found Only ({stats.totalFound})
            </button>
          </div>
        </div>

        {/* Items Grid */}
        {filteredRecentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRecentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
            <PackageSearch className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No reports found in this category</p>
            <p className="text-xs text-slate-400 mt-1">Submit a report to see it appear here</p>
          </div>
        )}

        {/* View All Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/lost-items"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs transition-colors"
          >
            <span>View All Lost Items ({stats.totalLost})</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </Link>
          <Link
            to="/found-items"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-teal-300 bg-teal-50/50 hover:bg-teal-50 text-teal-800 font-semibold text-xs sm:text-sm shadow-xs transition-colors"
          >
            <span>View All Found Items ({stats.totalFound})</span>
            <ArrowRight className="w-4 h-4 text-teal-600" />
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-subtle space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Automated Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            How Campus Lost & Found Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A simple, secure three-step recovery process built for students and faculty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="rounded-2xl p-6 bg-slate-50 border border-slate-200/80 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              01
            </div>
            <h3 className="font-bold text-slate-800 text-base">Report the Item</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fill in the quick report form with category, colour, last known location (e.g. Library, Canteen, Lab), and optional photo.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl p-6 bg-teal-50/60 border border-teal-200/80 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              02
            </div>
            <h3 className="font-bold text-teal-950 text-base">Smart Rule-Based Matching</h3>
            <p className="text-xs text-teal-900/80 leading-relaxed">
              Our algorithm continuously compares category, colour, location, and keywords to flag possible matches automatically.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl p-6 bg-emerald-50/60 border border-emerald-200/80 space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              03
            </div>
            <h3 className="font-bold text-emerald-950 text-base">Verify & Reclaim</h3>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              Express interest in a match. Visit the Student Helpdesk or connect safely without exposing personal contact details publicly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
