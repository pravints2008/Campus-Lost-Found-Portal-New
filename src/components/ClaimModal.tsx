import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { LostFoundItem } from '../types';
import { X, Send, ShieldCheck, AlertCircle, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  lostItem: LostFoundItem;
  foundItem: LostFoundItem;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  isOpen,
  onClose,
  lostItem,
  foundItem,
}) => {
  const { submitClaim } = useApp();
  const { user, profile } = useAuth();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const claimantName = profile?.full_name || user?.email?.split('@')[0] || 'Campus Student';
  const claimantStudentId = profile?.student_id || 'STU-ID';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    await submitClaim(lostItem.id, foundItem.id, message.trim());
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-950 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-400/20 rounded-xl text-teal-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Express Interest in Possible Match</h3>
              <p className="text-xs text-slate-300">Safe, moderated verification via Campus Desk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Matched Pair Summary */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between font-medium">
              <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Lost Report
              </span>
              <span className="text-slate-700 font-semibold">{lostItem.title}</span>
            </div>
            <div className="flex items-center justify-between font-medium">
              <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Found Report
              </span>
              <span className="text-slate-700 font-semibold">{foundItem.title}</span>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/70 border border-teal-200/60 text-xs text-teal-900">
            <AlertCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p>
              Your verified profile (<strong className="font-semibold">{claimantName} - {claimantStudentId}</strong>) will be recorded in Supabase for the campus verification team and the finder. No personal phone numbers are publicly displayed.
            </p>
          </div>

          {!user && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <span>You are not signed in. For faster verification:</span>
              <Link to="/auth" className="font-bold text-teal-700 underline">
                Sign In
              </Link>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Verification Proof / Identifying Details *
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe unique identifying marks (e.g., sticker, scratches, brand logo, lock screen wallpaper, specific contents) to prove ownership..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Submitting to Database...' : 'Submit Match Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
