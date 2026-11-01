import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  QrCode, 
  CheckCircle2, 
  Terminal, 
  Copy, 
  Check, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const AndroidAppView: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-6 space-y-6 bg-slate-950 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-white tracking-wide">Sentinel AI — Android Application & APK Pipeline</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Native Android client built on React Native & Capacitor sharing the secured Sentinel backend API
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-purple-950 text-purple-300 border border-purple-800 font-mono text-xs font-bold">
            Android 10+ (API Level 29+)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Android Phone Mockup Simulator */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[310px] h-[600px] rounded-[42px] p-3.5 bg-slate-900 border-4 border-slate-700 shadow-2xl relative flex flex-col justify-between overflow-hidden">
            {/* Top speaker notch */}
            <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-2 shrink-0 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
            </div>

            {/* Simulated Phone Screen */}
            <div className="flex-1 rounded-[30px] bg-slate-950 border border-slate-800 flex flex-col justify-between p-3.5 overflow-hidden text-xs">
              {/* App Bar */}
              <div className="flex justify-between items-center pb-2 border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sentinel AI Mobile</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                  Connected
                </span>
              </div>

              {/* Chat Thread Simulator */}
              <div className="flex-1 overflow-y-auto space-y-2 py-2 text-[10px]">
                <div className="p-2 rounded-xl bg-slate-900 text-slate-300">
                  <span className="font-bold text-cyan-400">Sentinel:</span> Welcome back! You have 1 unread Adobe invoice and recent email updates.
                </div>
                <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-200 ml-3">
                  <span className="font-bold text-white">You:</span> Summarize the Adobe invoice attachment.
                </div>
                <div className="p-2 rounded-xl bg-slate-900 text-slate-300 space-y-1">
                  <span className="font-bold text-cyan-400">Sentinel:</span>
                  <div>Adobe receipt verified: $54.99 paid on Oct 31 via Visa ****4281. Clean PNG structure.</div>
                </div>
              </div>

              {/* Input bar */}
              <div className="pt-2 border-t border-slate-800 flex items-center gap-1.5 shrink-0">
                <div className="flex-1 bg-slate-900 rounded-lg px-2.5 py-1 text-[10px] text-slate-500">
                  Ask Sentinel on Android...
                </div>
                <div className="w-6 h-6 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-bold text-[10px]">
                  ➤
                </div>
              </div>
            </div>

            {/* Bottom Home indicator */}
            <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto mt-2 shrink-0"></div>
          </div>
        </div>

        {/* Right: APK Build Instructions & Pipeline */}
        <div className="lg:col-span-7 space-y-5 font-mono text-xs">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Android Build & APK Generation Instructions</span>
            </h3>
            <p className="text-slate-400 leading-relaxed font-sans text-xs">
              Sentinel AI uses standard cross-platform **Capacitor Android** and **React Native** to package this web application into an installable Android APK with native notifications and offline biometric authentication.
            </p>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>Step 1: Install Android runtime bridge</span>
                  <button onClick={() => copyCommand('npm install @capacitor/core @capacitor/android')} className="text-cyan-400 hover:text-white flex items-center gap-1 text-[10px]">
                    {copiedCmd === 'npm install @capacitor/core @capacitor/android' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-[11px]">
                  npm install @capacitor/core @capacitor/android
                </pre>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>Step 2: Initialize Android Native Project</span>
                  <button onClick={() => copyCommand('npx cap add android')} className="text-cyan-400 hover:text-white flex items-center gap-1 text-[10px]">
                    {copiedCmd === 'npx cap add android' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-[11px]">
                  npx cap add android && npx cap sync
                </pre>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>Step 3: Compile Debug / Release APK</span>
                  <button onClick={() => copyCommand('cd android && ./gradlew assembleDebug')} className="text-cyan-400 hover:text-white flex items-center gap-1 text-[10px]">
                    {copiedCmd === 'cd android && ./gradlew assembleDebug' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 text-[11px]">
                  cd android && ./gradlew assembleDebug
                </pre>
                <div className="text-[10px] text-slate-500">
                  Output APK path: <span className="text-slate-300">android/app/build/outputs/apk/debug/app-debug.apk</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 font-sans">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Mobile Security Architecture</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1 font-sans list-disc pl-5">
              <li>**Zero Credential Storage in APK**: Provider OAuth tokens are stored in the server's encrypted session store, not on the phone.</li>
              <li>**Biometric & OTP Gate**: Payment approvals on mobile require native biometric fingerprint/FaceID confirmation before firing the approval token.</li>
              <li>**Universal API Alignment**: The Android client connects directly to \`http://your-server-ip:3001/api/sentinel/*\`.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
