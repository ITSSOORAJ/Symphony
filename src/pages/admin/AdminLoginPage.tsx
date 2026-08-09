import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, Flower2 } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@symphonyevents.com');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setErrorMsg('');

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid admin credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="bg-emerald-950 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-emerald-900/40 p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-amber-100">Staff & Admin Portal</h1>
          <p className="text-xs text-amber-200/70">Authenticated Control Center for Symphony Events & Caterers</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-900/60 border border-red-500 text-red-200 text-xs rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@symphonyevents.com"
                className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl py-3 pl-10 pr-3 text-sm text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-emerald-950 border border-amber-500/30 rounded-xl py-3 pl-10 pr-3 text-sm text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-950/80 rounded-xl border border-amber-500/20 text-xs text-amber-200/70">
            <span className="font-bold text-amber-300 block mb-0.5">Testing Credentials Prefilled:</span>
            <span>Email: <strong>admin@symphonyevents.com</strong> | Pass: <strong>admin123</strong></span>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-emerald-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all shadow-lg"
          >
            {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
