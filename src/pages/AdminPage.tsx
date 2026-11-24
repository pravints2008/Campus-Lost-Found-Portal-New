import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CategoryIcon } from '../components/CategoryIcon';
import { SearchBar } from '../components/SearchBar';
import { 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  MessageSquare,
  Database,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { ItemStatus } from '../types';

export const AdminPage: React.FC = () => {
  const { items, matches, claims, updateItemStatus, deleteItem, refreshData, stats, isConfigured } = useApp();
  const { user, profile } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'matches' | 'claims'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'lost' | 'found'>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  // Filtered reports
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filterType !== 'All' && item.type !== filterType) return false;
      if (filterStatus !== 'All' && item.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesReporter = (item.reporter_name || item.reporterName || '').toLowerCase().includes(q);
        const matchesStudentId = (item.reporter_student_id || item.reporterStudentId || '').toLowerCase().includes(q);
        const matchesLocation = item.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesReporter && !matchesStudentId && !matchesLocation) {
          return false;
        }
      }
      return true;
    });
  }, [items, filterType, filterStatus, searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      {/* Admin Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-card border border-navy-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Campus Administration Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Helpdesk & Database Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time management of student lost and found reports, verification of returned items, and claim resolutions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-teal-300 border border-teal-500/30 text-xs font-bold shadow-md transition-all disabled:opacity-50"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>
        </div>
      </div>

      {/* Database Status Alert */}
      <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
        isConfigured 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
          : 'bg-amber-50 border-amber-200 text-amber-950'
      }`}>
        <div className="flex items-center gap-2.5">
          <Database className={`w-4 h-4 ${isConfigured ? 'text-emerald-600' : 'text-amber-600'}`} />
          <span>
            {isConfigured ? (
              <>
                <strong className="font-semibold text-emerald-900">Supabase Connected:</strong> Syncing live data with cloud PostgreSQL database tables (<code>public.items</code>, <code>public.claims</code>).
              </>
            ) : (
              <>
                <strong className="font-semibold text-amber-900">Local Mode:</strong> Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env</code> to connect cloud Supabase instance.
              </>
            )}
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
          {isConfigured ? 'Live PostgreSQL' : 'Local Backup'}
        </span>
      </div>

      {/* Admin Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Reports</span>
          <p className="text-2xl font-bold text-navy-950 mt-1">{items.length}</p>
          <span className="text-[10px] text-slate-400">{stats.totalLost} Lost • {stats.totalFound} Found</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Claims</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {items.filter((i) => i.status === 'Pending').length}
          </p>
          <span className="text-[10px] text-slate-400">Under verification</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Returned Safely</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.totalReturned}</p>
          <span className="text-[10px] text-slate-400">Successfully restored</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Possible Matches</span>
          <p className="text-2xl font-bold text-teal-600 mt-1">{matches.length}</p>
          <span className="text-[10px] text-slate-400">Algorithmic matches</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div className="inline-flex p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-navy-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Reports ({items.length})
            </button>
            <button
              onClick={() => setActiveTab('claims')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'claims'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
              <span>Claim Requests ({claims.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'matches'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Smart Matches ({matches.length})</span>
            </button>
          </div>

          {activeTab === 'all' && (
            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
              >
                <option value="All">All Types</option>
                <option value="lost">Lost Reports</option>
                <option value="found">Found Reports</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Pending">Pending</option>
                <option value="Returned">Returned</option>
              </select>
            </div>
          )}
        </div>

        {/* Tab 1: All Reports Management Table */}
        {activeTab === 'all' && (
          <div className="space-y-4">
            <div className="max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by title, student name, roll no, location..."
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Item Details</th>
                      <th className="py-3.5 px-4">Location & Date</th>
                      <th className="py-3.5 px-4">Reporter</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => {
                      const repName = item.reporter_name || item.reporterName || 'Student';
                      const repStudentId = item.reporter_student_id || item.reporterStudentId || '';
                      const img = item.image_url || item.imageUrl;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                item.type === 'lost'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-teal-100 text-teal-700'
                              }`}
                            >
                              {item.type}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                                {img ? (
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <CategoryIcon category={item.category} className="w-4 h-4 text-slate-400" />
                                )}
                              </div>
                              <div>
                                <Link
                                  to={`/item/${item.id}`}
                                  className="font-semibold text-slate-800 hover:text-teal-700 transition-colors"
                                >
                                  {item.title}
                                </Link>
                                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                                  <span>{item.category}</span>
                                  <span>•</span>
                                  <span>{item.color}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                            <p className="font-medium text-slate-800">{item.location}</p>
                            <p className="text-[11px] text-slate-400">{item.date}</p>
                          </td>

                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                            <p className="font-semibold text-slate-800">{repName}</p>
                            <p className="text-[11px] text-slate-400">{repStudentId}</p>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <select
                              value={item.status}
                              onChange={(e) => updateItemStatus(item.id, e.target.value as ItemStatus)}
                              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            >
                              <option value="Open">Open</option>
                              <option value="Pending">Pending</option>
                              <option value="Returned">Returned</option>
                            </select>
                          </td>

                          <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                            {item.status !== 'Returned' && (
                              <button
                                onClick={() => updateItemStatus(item.id, 'Returned')}
                                className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-[11px] border border-emerald-200 transition-colors"
                                title="Mark as Returned in Database"
                              >
                                Return
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete report "${item.title}" from database?`)) {
                                  deleteItem(item.id);
                                }
                              }}
                              className="p-1 rounded text-rose-500 hover:bg-rose-50 transition-colors"
                              title="Delete from database"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Claims Requests */}
        {activeTab === 'claims' && (
          <div className="space-y-4">
            {claims.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {claims.map((claim) => (
                  <div
                    key={claim.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {claim.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(claim.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <span>Lost Item ID:</span>
                        <Link to={`/item/${claim.lost_item_id}`} className="text-teal-700 underline truncate">
                          {claim.lost_item_id}
                        </Link>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <span>Found Item ID:</span>
                        <Link to={`/item/${claim.found_item_id}`} className="text-teal-700 underline truncate">
                          {claim.found_item_id}
                        </Link>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700 block mb-0.5">
                        Claim Verification Note:
                      </span>
                      <p className="italic">"{claim.message}"</p>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          updateItemStatus(claim.lost_item_id, 'Returned');
                          updateItemStatus(claim.found_item_id, 'Returned');
                        }}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Mark Both Returned</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-2">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700">No active claim requests in database</h3>
                <p className="text-xs text-slate-400">
                  When a student clicks "Express Interest" on a possible match, their verification notes appear here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Smart Matches */}
        {activeTab === 'matches' && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>
                System has computed <strong className="font-semibold text-slate-800">{matches.length}</strong> active possible matches from database records.
              </span>
              <Link to="/matches" className="text-teal-700 font-semibold underline flex items-center gap-1">
                <span>View Full Matching Interface</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {matches.map((match, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {match.matchScore}% Match Score
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Category: {match.lostItem.category}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                      <span className="text-rose-700">Lost: {match.lostItem.title}</span>
                      <span className="text-slate-400">↔</span>
                      <span className="text-teal-700">Found: {match.foundItem.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Criteria: {match.reasons.join(' • ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        updateItemStatus(match.lostItem.id, 'Returned');
                        updateItemStatus(match.foundItem.id, 'Returned');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-medium text-xs hover:bg-emerald-700 transition-colors"
                    >
                      Verify & Return Both
                    </button>
                    <Link
                      to={`/item/${match.lostItem.id}`}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                      title="Inspect"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
