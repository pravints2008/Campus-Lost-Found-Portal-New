import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Mail, 
  Lock, 
  User, 
  Building, 
  Hash, 
  Phone, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  Database
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user, isConfigured } = useAuth();
  const { showToast } = useApp();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in, redirect
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (isSignUp) {
      if (!fullName.trim() || !studentId.trim()) {
        setErrorMsg('Please enter your full name and student ID.');
        setLoading(false);
        return;
      }

      const { error } = await signUp({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        studentId: studentId.trim(),
        department,
        phone: phone.trim(),
      });

      setLoading(false);
      if (error) {
        setErrorMsg(error.message);
      } else {
        showToast('Account created successfully! Check your email if verification is required.', 'success');
        navigate('/dashboard');
      }
    } else {
      const { error } = await signIn(email.trim(), password);
      setLoading(false);
      if (error) {
        setErrorMsg(error.message);
      } else {
        showToast('Signed in successfully!', 'success');
        const from = (location.state as any)?.from || '/dashboard';
        navigate(from);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 sm:px-0">
      {/* Configuration Status Notice */}
      {!isConfigured && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <Database className="w-4 h-4 text-amber-600" />
            <span>Supabase Connection Setup</span>
          </div>
          <p>
            To activate cloud database authentication, add your <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env</code>.
          </p>
          <p className="text-[11px] text-amber-700">
            The SQL schema script is located in <code>supabase/schema.sql</code>.
          </p>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-950 to-teal-900 text-white p-6 sm:p-8 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center text-white mx-auto shadow-md">
            <Compass className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {isSignUp ? 'Create Student Account' : 'Sign In to Campus Portal'}
          </h2>
          <p className="text-xs text-slate-300">
            {isSignUp
              ? 'Register with your college credentials to report and recover belongings'
              : 'Access your reported belongings, verify claims, and view smart matches'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              !isSignUp ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg('');
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              isSignUp ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Sharma"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-slate-500" />
                    Student / Roll ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="23CS108"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Electronics & Communication">ECE</option>
                    <option value="Mechanical Engineering">ME</option>
                    <option value="Information Technology">IT</option>
                    <option value="Civil Engineering">Civil</option>
                    <option value="Electrical Engineering">EEE</option>
                    <option value="Management Studies">MBA / BBA</option>
                    <option value="General Science">Sciences</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  Contact Phone (Kept Private)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-teal-600" />
              College Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@campus.edu"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Connecting to Supabase...</span>
            ) : (
              <>
                <span>{isSignUp ? 'Register Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center text-xs text-slate-500">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="font-bold text-teal-700 hover:underline"
                >
                  Sign In here
                </button>
              </p>
            ) : (
              <p>
                First time using the portal?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="font-bold text-teal-700 hover:underline"
                >
                  Create an account
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
