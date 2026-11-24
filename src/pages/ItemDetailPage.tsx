import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { CategoryIcon } from '../components/CategoryIcon';
import { MatchCard } from '../components/MatchCard';
import { ClaimModal } from '../components/ClaimModal';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Palette, 
  User, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Share2,
  Trash2
} from 'lucide-react';

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, getItemMatches, updateItemStatus, deleteItem, showToast } = useApp();

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">Report Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested lost or found report may have been resolved or removed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    );
  }

  const isLost = item.type === 'lost';
  const matches = getItemMatches(item);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'info');
    }
  };

  const handleMarkReturned = () => {
    updateItemStatus(item.id, 'Returned');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to remove this report?')) {
      deleteItem(item.id);
      navigate(isLost ? '/lost-items' : '/found-items');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Back button & quick actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
            title="Copy report link"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Item Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image side */}
          <div className="relative h-72 md:h-full min-h-[300px] bg-slate-100 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-slate-200">
            {item.imageUrl || item.image_url ? (
              <img
                src={item.imageUrl || item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <CategoryIcon category={item.category} className="w-20 h-20 text-slate-300 stroke-[1.2] mb-2" />
                <span className="text-xs font-semibold text-slate-500">No photo uploaded with report</span>
                <span className="text-[11px] text-slate-400 mt-0.5">Category: {item.category}</span>
              </div>
            )}

            {/* Floating Type Pill */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md backdrop-blur-md ${
                  isLost ? 'bg-rose-600 text-white' : 'bg-teal-600 text-white'
                }`}
              >
                {isLost ? 'Lost Item Report' : 'Found Item Report'}
              </span>
            </div>
          </div>

          {/* Details side */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Status and ID */}
              <div className="flex items-center justify-between gap-2">
                <StatusBadge status={item.status} size="md" />
                <span className="text-xs text-slate-400 font-mono">ID: #{item.id.slice(0, 8)}</span>
              </div>

              {/* Title & Category */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {item.title}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                    <CategoryIcon category={item.category} className="w-3.5 h-3.5" />
                    {item.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                    <Palette className="w-3.5 h-3.5 text-navy-600" />
                    {item.color}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {item.description || 'No detailed description provided.'}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {isLost ? 'Last Seen Location' : 'Found At'}
                  </span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    <span>{item.location}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {isLost ? 'Date Lost' : 'Date Found'}
                  </span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>

              {/* Reporter Information (Safe without exposing private phone numbers) */}
              <div className="bg-teal-50/50 rounded-2xl p-4 border border-teal-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-bold text-teal-950 uppercase tracking-wider">
                      Reporter Student Details
                    </span>
                  </div>
                  <span className="text-[10px] text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-full font-medium">
                    Verified Campus ID
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                    {(item.reporter_name || item.reporterName || 'S').charAt(0)}
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800">{item.reporter_name || item.reporterName || 'Campus Student'}</p>
                    <p className="text-slate-500">Student ID: {item.reporter_student_id || item.reporterStudentId || 'STU-ID'}</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 italic pt-1">
                  * Note: Personal telephone numbers are kept confidential by system policy to avoid spam.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              {item.status !== 'Returned' && (
                <button
                  onClick={handleMarkReturned}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Returned</span>
                </button>
              )}

              <button
                onClick={handleDelete}
                className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove report"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Possible Matches Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Possible Matches for this Item ({matches.length})
              </h3>
              <p className="text-xs text-slate-500">
                Rule-based algorithmic matches based on category, colour, and location.
              </p>
            </div>
          </div>
        </div>

        {matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((m, idx) => (
              <MatchCard key={idx} match={m} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No algorithmic matches detected yet</p>
            <p className="text-[11px] text-slate-400">
              When a complementary report matching category and colour is submitted, it will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
