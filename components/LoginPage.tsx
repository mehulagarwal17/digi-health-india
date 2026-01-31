
import React, { useState } from 'react';
import { UserRole } from '../types';
import { User, Lock, ChevronDown, Loader2, Info, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.DOCTOR);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict credential mapping for specific roles
    const credentials: Record<string, { u: string; p: string }> = {
      [UserRole.DOCTOR]: { u: 'doctor01', p: 'password123' },
      [UserRole.AMBULANCE_DRIVER]: { u: 'ambu01', p: 'password123' },
      [UserRole.HOSPITAL_MANAGER]: { u: 'admin01', p: 'password123' },
      [UserRole.ASHA_WORKER]: { u: 'asha01', p: 'password123' }
    };

    const target = credentials[role];

    if (target) {
      // Role has strict credentials defined
      if (userId === target.u && password === target.p) {
        setIsLoading(true);
        setError('');
        
        setTimeout(() => {
          setIsLoading(false);
          onLogin(role);
        }, 1200);
      } else {
        setError('Invalid Username or Password.');
      }
    } else {
      // Prototype logic for other roles (non-strict)
      if (!userId || !password) {
        setError('Invalid Username or Password.');
        return;
      }
      
      setIsLoading(true);
      setError('');
      
      setTimeout(() => {
        setIsLoading(false);
        onLogin(role);
      }, 1200);
    }
  };

  const getRoleLabel = (r: UserRole) => {
    switch (r) {
      case UserRole.DOCTOR: return 'Doctor / Medical Officer';
      case UserRole.HOSPITAL_MANAGER: return 'Hospital Administrator';
      case UserRole.AMBULANCE_DRIVER: return 'Ambulance Operator';
      case UserRole.ASHA_WORKER: return 'Field Health Worker (ASHA)';
      case UserRole.DHO: return 'District Health Officer';
      case UserRole.NATIONAL_AUTHORITY: return 'National Authority';
      default: return 'Authorized Personnel';
    }
  };

  // Filter out roles that should not be visible in the dropdown
  const availableRoles = Object.values(UserRole).filter(
    r => r !== UserRole.DHO && r !== UserRole.NATIONAL_AUTHORITY
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-700 relative p-4 overflow-hidden">
      {/* Background Blur Elements for depth */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
      
      {/* Main Login Card */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden z-10 transition-all duration-500">
        
        {/* Left Panel - Branding */}
        <div className="w-full md:w-1/2 bg-[#1e2b58] text-white p-12 flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-2">
            <p className="text-slate-400 text-lg font-medium opacity-80">Welcome to</p>
            <h1 className="text-4xl font-bold tracking-wider">DIGI-HEALTH INDIA</h1>
          </div>
          
          <div className="pt-12 space-y-2">
            <div className="flex justify-center items-center gap-2 text-blue-400 mb-2">
              <ShieldCheck size={28} />
              <h2 className="text-2xl font-bold">Bharat Health AI</h2>
            </div>
            <p className="text-sm text-slate-400 font-medium tracking-wide">
              A Comprehensive National Health Management System
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12">
          <form onSubmit={handleLogin} className="space-y-8">
            
            {/* Login Type Dropdown */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Login Type</label>
              <div className="relative group border-b border-slate-300 pb-1">
                <div className="flex items-center gap-3">
                  <div className="text-[#0d47a1]">
                    <ChevronDown size={20} />
                  </div>
                  <select
                    className="w-full bg-transparent text-sm font-semibold text-slate-700 appearance-none focus:outline-none cursor-pointer"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                  >
                    {availableRoles.map((r) => (
                      <option key={r} value={r}>{getRoleLabel(r)}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-1">
              <div className="relative border-b border-slate-300 pb-1 flex items-center gap-3">
                <div className="text-[#0d47a1]">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  className="w-full bg-transparent text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  placeholder="User Name / ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="relative border-b border-slate-300 pb-1 flex items-center gap-3">
                <div className="text-[#0d47a1]">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  className="w-full bg-transparent text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="text-right">
                <button type="button" className="text-[10px] text-blue-600 hover:underline font-medium">Forgot Password ?</button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg flex items-center gap-2 border border-red-100 animate-shake">
                <Info size={14} />
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#0d47a1] text-white py-2.5 rounded-full font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  'Login'
                )}
              </button>
              <button
                type="button"
                onClick={() => { setUserId(''); setPassword(''); setError(''); }}
                className="flex-1 bg-white text-[#0d47a1] border-2 border-[#0d47a1] py-2.5 rounded-full font-bold text-sm hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-slate-400 space-y-1 z-10">
        <p className="text-[10px] font-bold tracking-widest uppercase">
          Hosted Date : {new Date().toLocaleDateString()} Version : 1.0.4-PROD
        </p>
        <div className="flex items-center justify-center gap-1">
          <span className="text-[10px] font-bold opacity-60">Powered by :</span>
          <span className="text-[11px] font-black text-white/80 tracking-tighter">Bharat Digital Infrastructure Services Pvt Ltd.</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
