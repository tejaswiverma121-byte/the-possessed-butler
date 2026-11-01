'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Flame,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSentinel } from '../../context/SentinelContext';
import { HangingSpider, GothicCobwebCorner } from '../../components/sentinel/InteractiveSpiderWebs';
import { CandlelightCursorFollower } from '../../components/sentinel/CandlelightCursorFollower';

const InductionRitual3D = dynamic(
  () => import('../../components/sentinel/InductionRitual3D').then((mod) => mod.InductionRitual3D),
  { ssr: false }
);

export default function RegisterPage() {
  const router = useRouter();
  const { loginWithGmail, loadAllData } = useSentinel();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  // Calculate Password Strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Awaiting Secret', color: 'bg-slate-700', width: '0%' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak — Susceptible to Curses', color: 'bg-[#6E1025]', width: '25%' };
      case 2:
        return { score: 2, label: 'Moderate — Basic Protection', color: 'bg-[#C5A46D]', width: '50%' };
      case 3:
        return { score: 3, label: 'Strong — Reinforced Ward', color: 'bg-amber-400', width: '75%' };
      case 4:
      default:
        return { score: 4, label: 'Impenetrable — Sovereign Vault Sealed', color: 'bg-emerald-400', width: '100%' };
    }
  };

  const strength = getPasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setStatus({ type: 'error', message: 'Please provide your Master identity name.' });
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setStatus({ type: 'error', message: 'Please provide a valid estate Gmail address.' });
      return;
    }

    if (password && confirmPassword && password !== confirmPassword) {
      setStatus({ type: 'error', message: 'The confirmation phrase does not match the secret password.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Inscribing Master record into sovereign estate registry...' });

    try {
      const res = await loginWithGmail(
        email.trim(),
        password.trim() || undefined,
        name.trim()
      );

      setStatus({
        type: 'success',
        message: 'Master Induction complete! Entering the mansion...'
      });

      await loadAllData();

      setTimeout(() => {
        router.push('/console');
      }, 1200);
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Registration failed. Please check your credentials.'
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07070A] text-[#E8E0D5] font-sans selection:bg-[#6E1025] selection:text-[#FFE4AD] flex items-center justify-center p-0 md:p-6 lg:p-10 relative overflow-hidden">
      
      {/* Cinematic Atmosphere */}
      <CandlelightCursorFollower />
      <GothicCobwebCorner position="top-left" size={140} opacity={0.35} />
      <GothicCobwebCorner position="top-right" size={140} opacity={0.35} />
      <HangingSpider xPercent={8} baseLength={110} swingRange={15} size={22} />
      <HangingSpider xPercent={92} baseLength={140} swingRange={18} size={22} />

      {/* Main Split-Screen Mansion Container */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-5xl rounded-none md:rounded-3xl bg-[#0E1017]/95 border-0 md:border-2 border-[#C5A46D]/40 shadow-2xl backdrop-blur-2xl z-10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]"
      >
        
        {/* =========================================================================
            LEFT COLUMN (Desktop): 3D Induction Ritual Chamber (Golden Key & Wards)
            ========================================================================= */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-8 overflow-hidden bg-[#07070A] border-r border-[#1A1F2C]">
          
          {/* Top Brand Return Link */}
          <div className="relative z-20">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs font-mono text-[#C5A46D] hover:text-[#FFE4AD] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Mansion Gates</span>
            </Link>
          </div>

          {/* Interactive 3D Induction Ritual Canvas */}
          <div className="absolute inset-0 z-10">
            <InductionRitual3D />
          </div>

          {/* Middle Text Overlay */}
          <div className="relative z-20 space-y-3 my-auto py-8 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#07070A]/85 border border-[#C5A46D]/50 text-[#FFE4AD] inline-block shadow-md">
              THE INDUCTION RITUAL
            </span>
            <blockquote className="font-serif italic text-lg text-white leading-relaxed drop-shadow-md">
              "Every great estate begins with a vow of absolute secrecy. Claim your title."
            </blockquote>
            <p className="text-xs font-mono text-slate-400">
              Upon induction, your AI Butler is bound to your command, executing sensitive tasks under strict human approval gates.
            </p>
          </div>

          {/* Bottom Security Checklist */}
          <div className="relative z-20 pt-4 border-t border-[#1A1F2C] text-[10px] font-mono text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-[#C5A46D]">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Decoy Canary Landmines Armed</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#C5A46D]">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Meta Prompt Guard 2 Defense Active</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Induction Registration Form
            ========================================================================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between relative bg-[#0E1017]/95">
          
          {/* Mobile Back Link */}
          <div className="lg:hidden mb-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#C5A46D] hover:text-[#FFE4AD]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Gates</span>
            </Link>
          </div>

          <div>
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#07070A] border border-[#C5A46D]/50 text-[#C5A46D] text-[11px] font-mono font-bold mb-3 shadow-sm">
              <Flame className="w-3 h-3 text-[#C5A46D] animate-pulse" />
              <span>ESTATE MASTER INDUCTION</span>
            </div>

            {/* Headings */}
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-wide">
              Claim Your Place in the Mansion.
            </h1>
            <p className="text-xs sm:text-sm text-[#AFC7E8] font-serif italic mt-1">
              Every journey begins with a single invitation.
            </p>

            {/* Top Switcher Tabs: Sign In vs Create Account */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#07070A] border border-[#1A1F2C] my-5 font-mono text-xs">
              <Link
                href="/login"
                className="py-2.5 text-center rounded-xl font-bold text-slate-400 hover:text-[#FFE4AD] transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="py-2.5 text-center rounded-xl font-bold bg-gradient-to-r from-[#6E1025] via-[#C5A46D] to-[#6E1025] text-[#07070A] shadow-md transition-all"
              >
                Create Account
              </Link>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="mt-4 space-y-4 font-mono text-xs">
              
              {/* Name Field */}
              <div>
                <label className="block font-bold text-[#FFE4AD] mb-1.5">
                  Master's Name / Moniker
                </label>
                <div className="flex items-center w-full px-3.5 py-1.5 rounded-xl bg-[#07070A] border border-[#1A1F2C] focus-within:border-[#C5A46D] focus-within:ring-1 focus-within:ring-[#C5A46D] transition-all shadow-inner">
                  <User className="w-4 h-4 text-[#C5A46D] shrink-0 mr-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Lord Carlisle or Master Tejaswi"
                    className="flex-1 bg-transparent text-sm text-[#E8E0D5] placeholder-slate-500 font-sans border-0 focus:outline-none focus:ring-0 shadow-none outline-none py-2"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block font-bold text-[#FFE4AD] mb-1.5">
                  Estate Gmail Address
                </label>
                <div className="flex items-center w-full px-3.5 py-1.5 rounded-xl bg-[#07070A] border border-[#1A1F2C] focus-within:border-[#C5A46D] focus-within:ring-1 focus-within:ring-[#C5A46D] transition-all shadow-inner">
                  <Mail className="w-4 h-4 text-[#C5A46D] shrink-0 mr-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., tejaswiverma236@gmail.com"
                    className="flex-1 bg-transparent text-sm text-[#E8E0D5] placeholder-slate-500 font-sans border-0 focus:outline-none focus:ring-0 shadow-none outline-none py-2"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block font-bold text-[#FFE4AD] mb-1.5">
                  Vault Secret / Google App Password
                </label>
                <div className="flex items-center w-full px-3.5 py-1.5 rounded-xl bg-[#07070A] border border-[#1A1F2C] focus-within:border-[#C5A46D] focus-within:ring-1 focus-within:ring-[#C5A46D] transition-all shadow-inner">
                  <Lock className="w-4 h-4 text-[#C5A46D] shrink-0 mr-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (or leave blank for Sandbox)"
                    className="flex-1 bg-transparent text-sm text-[#E8E0D5] placeholder-slate-500 font-mono tracking-wider border-0 focus:outline-none focus:ring-0 shadow-none outline-none py-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-[#FFE4AD] shrink-0 ml-2 p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400">Vault Defense Strength:</span>
                      <span className={strength.score >= 3 ? 'text-emerald-400 font-bold' : 'text-[#C5A46D]'}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#07070A] rounded-full overflow-hidden border border-[#1A1F2C]">
                      <div 
                        className={`h-full transition-all duration-300 ${strength.color}`} 
                        style={{ width: strength.width }} 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmation Password */}
              <div>
                <label className="block font-bold text-[#FFE4AD] mb-1.5">
                  Confirm Vault Secret
                </label>
                <div className="flex items-center w-full px-3.5 py-1.5 rounded-xl bg-[#07070A] border border-[#1A1F2C] focus-within:border-[#C5A46D] focus-within:ring-1 focus-within:ring-[#C5A46D] transition-all shadow-inner">
                  <Lock className="w-4 h-4 text-[#C5A46D] shrink-0 mr-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your secret phrase"
                    className="flex-1 bg-transparent text-sm text-[#E8E0D5] placeholder-slate-500 font-mono tracking-wider border-0 focus:outline-none focus:ring-0 shadow-none outline-none py-2"
                  />
                </div>
              </div>

              {/* Status Message */}
              {status.message && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 font-mono ${
                  status.type === 'loading' ? 'bg-[#6E1025]/30 border border-[#C5A46D] text-[#FFE4AD] animate-pulse' :
                  status.type === 'success' ? 'bg-emerald-950 border border-emerald-600 text-emerald-300' :
                  'bg-rose-950/60 border border-rose-700 text-white'
                }`}>
                  {status.type === 'loading' && <RefreshCw className="w-4 h-4 animate-spin shrink-0" />}
                  {status.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {status.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                  <span>{status.message}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={status.type === 'loading'}
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#6E1025] via-[#C5A46D] to-[#6E1025] hover:brightness-110 disabled:opacity-50 text-[#07070A] font-serif font-black text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(197,164,109,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>BEGIN YOUR INDUCTION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Bottom Switch to Login */}
          <div className="pt-6 mt-6 border-t border-[#1A1F2C] text-center text-xs font-mono text-slate-400">
            <span>Already initiated into the estate? </span>
            <Link 
              href="/login" 
              className="text-[#FFE4AD] font-bold hover:underline ml-1"
            >
              Enter the mansion →
            </Link>
          </div>

        </div>

      </motion.div>

    </div>
  );
}
