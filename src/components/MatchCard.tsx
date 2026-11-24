import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MatchResult } from '../types';
import { ClaimModal } from './ClaimModal';
import { Sparkles, ArrowRight, ShieldCheck, Check, MapPin, Palette, Calendar } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

interface MatchCardProps {
  match: MatchResult;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const { lostItem, foundItem, matchScore, matchedFields, reasons } = match;

  const lostImg = lostItem.imageUrl || lostItem.image_url;
  const foundImg = foundItem.imageUrl || foundItem.image_url;

  return (
    <>
      <div className="bg-white rounded-2xl border-2 border-amber-200/90 shadow-card hover:shadow-dropdown transition-all duration-300 overflow-hidden flex flex-col">
        {/* Match Header Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-teal-600 to-navy-800 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Sparkles className="w-4 h-4 text-amber-200 animate-spin-slow" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">Smart Algorithm</span>
              <h4 className="font-bold text-sm tracking-wide">Possible Match Detected</h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-100 hidden sm:inline">Confidence Score:</span>
            <div className="bg-white text-navy-950 font-black text-xs sm:text-sm px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
              <span>{matchScore}%</span>
              <span className="text-[10px] text-slate-500 font-medium">Match</span>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Lost Item Summary */}
          <div className="space-y-3 pr-0 md:pr-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                Lost Report
              </span>
              <span className="text-xs text-slate-400">ID: #{lostItem.id.slice(0, 8)}</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                {lostImg ? (
                  <img src={lostImg} alt={lostItem.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <CategoryIcon category={lostItem.category} className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-slate-800 text-sm truncate">{lostItem.title}</h5>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{lostItem.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-navy-600" />
                <span className="truncate">{lostItem.color}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span className="truncate">{lostItem.location}</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Lost on: {lostItem.date}</span>
              </div>
            </div>

            <Link
              to={`/item/${lostItem.id}`}
              className="text-xs font-medium text-navy-700 hover:text-navy-900 inline-flex items-center gap-1 hover:underline"
            >
              <span>View full lost report</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Found Item Summary */}
          <div className="space-y-3 pt-4 md:pt-0 pl-0 md:pl-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-700 border border-teal-200">
                Found Report
              </span>
              <span className="text-xs text-slate-400">ID: #{foundItem.id.slice(0, 8)}</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                {foundImg ? (
                  <img src={foundImg} alt={foundItem.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <CategoryIcon category={foundItem.category} className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-slate-800 text-sm truncate">{foundItem.title}</h5>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{foundItem.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-navy-600" />
                <span className="truncate">{foundItem.color}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span className="truncate">{foundItem.location}</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Found on: {foundItem.date}</span>
              </div>
            </div>

            <Link
              to={`/item/${foundItem.id}`}
              className="text-xs font-medium text-teal-700 hover:text-teal-900 inline-flex items-center gap-1 hover:underline"
            >
              <span>View full found report</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Why this matched pills */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Matching Criteria:</span>
          {matchedFields.category && (
            <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
              <Check className="w-3 h-3" /> Category ({lostItem.category})
            </span>
          )}
          {matchedFields.color && (
            <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
              <Check className="w-3 h-3" /> Colour ({lostItem.color})
            </span>
          )}
          {matchedFields.location && (
            <span className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
              <Check className="w-3 h-3" /> Location ({lostItem.location})
            </span>
          )}
          {matchedFields.title && (
            <span className="text-xs font-medium bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-teal-200">
              <Check className="w-3 h-3" /> Keyword Match
            </span>
          )}
          {matchedFields.dateProximity && (
            <span className="text-xs font-medium bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-teal-200">
              <Check className="w-3 h-3" /> Date Alignment
            </span>
          )}
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500 italic">
            * This is an automated algorithmic suggestion. Verification by campus desk required.
          </p>
          <button
            onClick={() => setIsClaimOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm transition-colors shadow-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Express Interest / Claim Match</span>
          </button>
        </div>
      </div>

      <ClaimModal
        isOpen={isClaimOpen}
        onClose={() => setIsClaimOpen(false)}
        lostItem={lostItem}
        foundItem={foundItem}
      />
    </>
  );
};
