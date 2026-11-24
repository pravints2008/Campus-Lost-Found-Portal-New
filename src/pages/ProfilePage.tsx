import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Hash, 
  Building, 
  Phone, 
  ShieldCheck, 
  LogOut, 
  Check, 
  ArrowLeft,
  Calendar
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile, signOut } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [department, setDepartment] = useState(profile?.department || 'Computer Science & Engineering');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { error } = await updateProfile({
      full_name: fullName.trim(),
      department,
      phone: phone.trim(),
    });
    setIsSaving(false);
    if (error) {
      showToast(`Error updating profile: ${error.message}`, 'error');
    } else {
      showToast('Profile updated in Supabase database!', 'success');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    showToast('Signed out successfully.', 'info');
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-teal-950 text-white p-6 sm:p-8 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-teal-300">
            {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">{profile?.full_name || 'Campus Student'}</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                {profile?.role || 'student'}
              </span>
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              <span>{user.email}</span>
            </p>
            <p className="text-xs text-slate-400">
              Student ID: <span className="text-white font-mono">{profile?.student_id || 'STU-ID'}</span>
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                Student / Roll ID
              </label>
              <input
                type="text"
                disabled
                value={profile?.student_id || 'STU-ID'}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                title="Contact administration to change roll ID"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-teal-600" />
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Management Studies">Management Studies</option>
                <option value="General Science">General Science</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              Contact Phone (Securely Stored in Database)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
