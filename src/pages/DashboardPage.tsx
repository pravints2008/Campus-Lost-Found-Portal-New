import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { DashboardCard } from '../components/DashboardCard';
import { ItemCard } from '../components/ItemCard';
import { MatchCard } from '../components/MatchCard';
import { 
  User, 
  HelpCircle, 
  PackageSearch, 
  Sparkles, 
  CheckCircle2, 
  PlusCircle, 
  Edit3, 
  LogIn,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { items, matches, stats } = useApp();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'my-lost' | 'my-found' | 'my-matches'>('my-lost');

  // Filter items reported by current authenticated user
  const currentUserId = user?.id;
  const currentStudentId = profile?.student_id;
  const currentName = profile?.full_name?.toLowerCase();

  const myLostItems = items.filter((item) => {
    if (item.type !== 'lost') return false;
    if (currentUserId && item.user_id === currentUserId) return true;
    if (currentStudentId && (item.reporter_student_id === currentStudentId || item.reporterStudentId === currentStudentId)) return true;
    if (currentName && (item.reporter_name?.toLowerCase() === currentName || item.reporterName?.toLowerCase() === currentName)) return true;
    return false;
  });

  const myFoundItems = items.filter((item) => {
    if (item.type !== 'found') return false;
    if (currentUserId && item.user_id === currentUserId) return true;
    if (currentStudentId && (item.reporter_student_id === currentStudentId || item.reporterStudentId === currentStudentId)) return true;
    if (currentName && (item.reporter_name?.toLowerCase() === currentName || item.reporterName?.toLowerCase() === currentName)) return true;
    return false;
  });

  // Matches linked to current user
  const myMatches = matches.filter((m) => {
    if (!currentUserId && !currentStudentId && !currentName) return false;
    const isLostMine =
      (currentUserId && m.lostItem.user_id === currentUserId) ||
      (currentStudentId && (m.lostItem.reporter_student_id === currentStudentId || m.lostItem.reporterStudentId === currentStudentId)) ||
      (currentName && (m.lostItem.reporter_name?.toLowerCase() === currentName || m.lostItem.reporterName?.toLowerCase() === currentName));

    const isFoundMine =
      (currentUserId && m.foundItem.user_id === currentUserId) ||
      (currentStudentId && (m.foundItem.reporter_student_id === currentStudentId || m.foundItem.reporterStudentId === currentStudentId)) ||
      (currentName && (m.foundItem.reporter_name?.toLowerCase() === currentName || m.foundItem.reporterName?.toLowerCase() === currentName));

    return isLostMine || isFoundMine;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Student Profile Header Banner */}
      {user ? (
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-card border border-navy-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-teal-300">
              {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold">{profile?.full_name || user.email}</h1>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  {profile?.role || 'student'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Roll No: <span className="font-semibold text-white">{profile?.student_id || 'STU-ID'}</span> • {profile?.department || 'Department'}
              </p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Link
              to="/profile"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-all border border-white/15 backdrop-blur-md"
            >
              <Edit3 className="w-4 h-4 text-teal-300" />
              <span>Edit Profile</span>
            </Link>
            <Link
              to="/report-lost"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Report</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-navy-950 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-card border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-teal-900/50 px-2.5 py-0.5 rounded-full border border-teal-700">
              Student Portal
            </span>
            <h1 className="text-xl sm:text-2xl font-bold">Welcome to Campus Lost & Found</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Sign in with your student credentials to link your reported belongings, receive matching updates, and manage claim verifications.
            </p>
          </div>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm shadow-md transition-all shrink-0"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Create Account</span>
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="My Lost Reports"
          value={myLostItems.length}
          subtitle="Items you reported missing"
          icon={HelpCircle}
          variant="navy"
        />
        <DashboardCard
          title="My Found Reports"
          value={myFoundItems.length}
          subtitle="Turned in by you"
          icon={PackageSearch}
          variant="teal"
        />
        <DashboardCard
          title="My Possible Matches"
          value={myMatches.length}
          subtitle="Matches linked to your items"
          icon={Sparkles}
          variant="amber"
          badge={myMatches.length > 0 ? 'Review Needed' : 'None'}
        />
        <DashboardCard
          title="Campus Total Returns"
          value={stats.totalReturned}
          subtitle="Successfully returned campus-wide"
          icon={CheckCircle2}
          variant="emerald"
        />
      </div>

      {/* Tabs for Student's Activity */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">My Reports & Activity</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Database
            </span>
          </div>

          <div className="inline-flex p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('my-lost')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'my-lost'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Lost Items ({myLostItems.length})
            </button>
            <button
              onClick={() => setActiveTab('my-found')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'my-found'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Found Items ({myFoundItems.length})
            </button>
            <button
              onClick={() => setActiveTab('my-matches')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'my-matches'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Possible Matches ({myMatches.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: My Lost Items */}
        {activeTab === 'my-lost' && (
          <div>
            {myLostItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {myLostItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-semibold text-slate-700 text-base">You haven't reported any lost items</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Misplaced an ID card, water bottle, or books? Report it now so our smart matching can notify you when found.
                </p>
                <Link
                  to="/report-lost"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-900 text-white font-semibold text-xs transition-colors hover:bg-navy-800"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Lost Item</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Found Items */}
        {activeTab === 'my-found' && (
          <div>
            {myFoundItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {myFoundItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
                <PackageSearch className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-semibold text-slate-700 text-base">You haven't submitted any found items</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Found someone's lost keys or charger in a lab or classroom? Report it here to help a fellow classmate.
                </p>
                <Link
                  to="/report-found"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs transition-colors hover:bg-teal-700"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Report Found Item</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Matches */}
        {activeTab === 'my-matches' && (
          <div>
            {myMatches.length > 0 ? (
              <div className="space-y-4">
                {myMatches.map((m, idx) => (
                  <MatchCard key={idx} match={m} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 space-y-3">
                <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-semibold text-slate-700 text-base">No active matches for your items</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When a found report closely resembles one of your lost items (or vice-versa), our algorithm will automatically suggest it here.
                </p>
                <Link
                  to="/matches"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold text-xs transition-colors hover:bg-amber-600"
                >
                  <span>View All Campus Matches ({matches.length})</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
