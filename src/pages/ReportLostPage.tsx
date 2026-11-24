import React from 'react';
import { ReportForm } from '../components/ReportForm';
import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ReportLostPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <span className="text-xs text-slate-400 font-medium">Official Campus Registry</span>
      </div>

      <ReportForm type="lost" />

      {/* Helpful Tips Card */}
      <div className="bg-slate-100/70 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-teal-600" />
          Tips for Faster Recovery
        </h4>
        <ul className="list-disc list-inside space-y-1 text-slate-500">
          <li>Specify distinguishable markings like stickers, engravings, or unique scratches.</li>
          <li>Ensure the date and location correspond as accurately as possible to when you last had the item.</li>
          <li>Check the <Link to="/matches" className="text-teal-700 underline font-medium">Possible Matches</Link> page right after submitting!</li>
        </ul>
      </div>
    </div>
  );
};
