'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Mail, 
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
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSentinel } from '../../context/SentinelContext';
import { HangingSpider, GothicCobwebCorner } from '../../components/sentinel/InteractiveSpiderWebs';
import { CandlelightCursorFollower } from '../../components/sentinel/CandlelightCursorFollower';

const PrivateStudy3D = dynamic(
  () => import('../../components/sentinel/PrivateStudy3D').then((mod) => mod.PrivateStudy3D),
  { ssr: false }
);

export default function LoginPage() {
  const router = useRouter();
  const { 
    userAccount, 
    loginWithGmail, 
    isAuthenticated,
    loadAllData
  } = useSentinel();

  const [email, setEmail] = useState<string>(
    userAccount?.email && userAccount.email !== 'abcd@email.com' && userAccount.email !== 'demo@sentinel.ai'
      ? userAccount.email
      : 'tejaswiverma236@gmail.com'
  );
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState<boolean>(false);
  const [showHelpGuide, setShowHelpGuide] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus({ type: 'error', message: 'Please enter your estate Gmail address.' });
      return;
    }

    setStatus({ 
      type: 'loading', 
      message: password.trim() 
        ? 'Verifying estate credentials with Google IMAP & SMTP...' 
        : 'Initiating Master session in sovereign sandbox mode...' 
    });

    try {
      const res = await loginWithGmail(
        email.trim(),
        password.trim() || undefined,
        email.split('@')[0]
      );

      setStatus({
        type: 'success',
        message: res.message || 'Credentials accepted. Unlocking the mansion gates...'
      });

      await loadAllData();

      setTimeout(() => {
        router.push('/console');
      }, 1200);
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Verification failed. Please check your address or Google App Password.'
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07070A] text-[#E8E0D5] font-sans selection:bg-[#6E1025] selection:text-[#FFE4AD] flex items-center justify-center p-0 md:p-6 lg:p-10 relative overflow-hidden">
      
      {/* Cinematic Mouse-Reactive Atmosphere */}
      <CandlelightCursorFollower />
      <GothicCobwebCorner position="top-left" size={140} opacity={0.35} />
      <GothicCobwebCorner position="top-right" size={140} opacity={0.35} />
      <HangingSpider xPercent={6} baseLength={120} swingRange={18} size={24} />
      <HangingSpider xPercent={94} baseLength={130} swingRange={20} size={24} />

      {/* Main Split-Screen Mansion Container */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-5xl rounded-none md:rounded-3xl bg-[#0E1017]/95 border-0 md:border-2 border-[#C5A46D]/40 shadow-2xl backdrop-blur-2xl z-10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]"
      >
        
        {/* =========================================================================
            LEFT COLUMN (Desktop): 3D Private Study Chamber & Atmospheric Artifact
            ========================================================================= */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-8 overflow-hidden bg-[#07070A] border-r border-[#1A1F2C]">
          
          {/* Top Brand Link */}
          <div className="relative z-20">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs font-mono text-[#C5A46D] hover:text-[#FFE4AD] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Mansion Gates</span>
            </Link>
          </div>

          {/* Interactive 3D Private Study Canvas */}
          <div className="absolute inset-0 z-10">
            <PrivateStudy3D />
          </div>

          {/* Middle Atmospheric Overlay Text */}
          <div className="relative z-20 space-y-3 my-auto py-8 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#07070A]/80 border border-[#C5A46D]/50 text-[#FFE4AD] inline-block shadow-md">
              THE BUTLER'S PRIVATE CHAMBER
            </span>
            <blockquote className="font-serif italic text-lg text-white leading-relaxed drop-shadow-md">
              "Behind every heavy oak door lies a secret. Enter, if you dare, Master."
            </blockquote>
            <p className="text-xs font-mono text-slate-400">
              Your correspondence is guarded by pretrained Meta Prompt Guard 2 classifiers.
            </p>
          </div>

          {/* Bottom Security Assurance */}
          <div className="relative z-20 pt-4 border-t border-[#1A1F2C] text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Air-Gap Zero-Leakage</span>
            <span className="text-emerald-400 font-bold">Encrypted Session</span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: Authentication Panel
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
              <span>MASTER AUTHENTICATION</span>
            </div>

            {/* Headings */}
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-wide">
              Welcome Back, Master.
            </h1>
            <p className="text-xs sm:text-sm text-[#AFC7E8] font-serif italic mt-1">
              The mansion remembers you.
            </p>

            {/* Top Switcher Tabs: Sign In vs Create Account */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#07070A] border border-[#1A1F2C] my-5 font-mono text-xs">
              <Link
                href="/login"
                className="py-2.5 text-center rounded-xl font-bold bg-gradient-to-r from-[#6E1025] via-[#C5A46D] to-[#6E1025] text-[#07070A] shadow-md transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="py-2.5 text-center rounded-xl font-bold text-slate-400 hover:text-[#FFE4AD] transition-all"
              >
                Create Account
              </Link>
            </div>

            {/* If user is already authenticated */}
            {isAuthenticated && userAccount.email && (
              <div className="my-5 p-3.5 rounded-2xl bg-[#07070A] border border-[#C5A46D]/50 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="truncate">Current Session: <strong className="text-[#FFE4AD]">{userAccount.email}</strong></span>
                </div>
                <Link
                  href="/console"
                  className="px-3 py-1 rounded-xl bg-[#6E1025] text-[#FFE4AD] hover:brightness-110 font-bold shrink-0 ml-2"
                >
                  Enter Console →
                </Link>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="mt-6 space-y-4 font-mono text-xs">
              
              {/* Email Field */}
              <div>
                <label className="block font-bold text-[#FFE4AD] mb-1.5">
                  Master's Gmail Address
                </label>
                <div className="flex items-center w-full px-3.5 py-1.5 rounded-xl bg-[#07070A] border border-[#1A1F2C] focus-within:border-[#C5A46D] focus-within:ring-1 focus-within:ring-[#C5A46D] transition-all shadow-inner">
                  <Mail className="w-4 h-4 text-[#C5A46D] shrink-0 mr-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., master@estate.com"
                    className="flex-1 bg-transparent text-sm text-[#E8E0D5] placeholder-slate-500 font-sans border-0 focus:outline-none focus:ring-0 shadow-none outline-none py-2"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-[#FFE4AD] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#C5A46D]" />
                    <span>Estate / App Password (16-char)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHelpGuide(!showHelpGuide)}
                    className="text-[11px] text-[#C5A46D] hover:text-[#FFE4AD] font-sans flex items-center gap-1"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>App Password guide</span>
                  </button>
                </div>

                <div className="flex items-center w-full px-3.5 py-1.5 rounded-xl bg-[#07070A] border border-[#1A1F2C] focus-within:border-[#C5A46D] focus-within:ring-1 focus-within:ring-[#C5A46D] transition-all shadow-inner">
                  <Lock className="w-4 h-4 text-[#C5A46D] shrink-0 mr-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="xxxx xxxx xxxx xxxx (or blank for Sandbox)"
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

                {/* Optional Help Guide */}
                {showHelpGuide && (
                  <div className="mt-2.5 p-3 rounded-xl bg-[#07070A] border border-[#C5A46D]/40 text-xs text-slate-300 font-sans space-y-1.5">
                    <div className="font-serif font-bold text-[#FFE4AD] text-[11px]">
                      🗝️ Connecting Real Gmail Live:
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      Generate a free 16-character code in Google Account &gt; Security &gt;{' '}
                      <a 
                        href="https://myaccount.google.com/apppasswords" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[#C5A46D] underline inline-flex items-center gap-0.5"
                      >
                        App Passwords <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      . Or leave blank to explore in offline Sandbox mode!
                    </p>
                  </div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#07070A] border-[#1A1F2C] text-[#6E1025] focus:ring-[#C5A46D]"
                  />
                  <span>Remember Master's Identity</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-[#C5A46D] hover:text-[#FFE4AD] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Status & Error Message Box */}
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

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={status.type === 'loading'}
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#6E1025] via-[#C5A46D] to-[#6E1025] hover:brightness-110 disabled:opacity-50 text-[#07070A] font-serif font-black text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(197,164,109,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>ENTER THE MANSION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Bottom Switch to Register */}
          <div className="pt-6 mt-6 border-t border-[#1A1F2C] text-center text-xs font-mono text-slate-400">
            <span>New to the estate? </span>
            <Link 
              href="/register" 
              className="text-[#FFE4AD] font-bold hover:underline ml-1"
            >
              Claim your place in the mansion →
            </Link>
          </div>

        </div>

      </motion.div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0E1017] border border-[#C5A46D] shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-[#FFE4AD] font-serif font-bold text-lg">
              <KeyRound className="w-5 h-5 text-[#C5A46D]" />
              <span>Estate Key Recovery</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Because The Possessed Butler operates under a <strong>100% sovereign, local-first architecture</strong>, passwords are never stored on external cloud servers.
            </p>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              To reset your credentials, generate a fresh 16-character App Password inside your Google Account settings, or log in with any Gmail address in offline Sandbox mode.
            </p>
            <button
              onClick={() => setShowForgotPasswordModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#07070A] border border-[#C5A46D]/60 text-xs font-mono font-bold text-[#FFE4AD] hover:bg-[#1A1F2C]"
            >
              I Understand, Return to Gate
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
