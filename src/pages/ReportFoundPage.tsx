import React from 'react';
import { ReportForm } from '../components/ReportForm';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ReportFoundPage: React.FC = () => {
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

      <ReportForm type="found" />

      {/* Helpful Tips Card */}
      <div className="bg-teal-50/60 rounded-2xl p-5 border border-teal-200/80 text-xs text-teal-900 space-y-2">
        <h4 className="font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          Student Welfare Safe Deposit Notice
        </h4>
        <p className="text-slate-600 leading-relaxed">
          Valuable items such as wallets, bank cards, official ID cards, or expensive electronics should be deposited at the <strong className="font-semibold text-slate-800">Student Welfare Desk (Room 102)</strong> or Campus Security for safe-keeping.
        </p>
      </div>
    </div>
  );
};
