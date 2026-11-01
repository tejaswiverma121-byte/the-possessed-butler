'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  sentinelGetChatHistory, 
  sentinelSendMessage, 
  sentinelClearChat 
} from '../../api';
import { SentinelChatMessage } from '../../types';
import { useSentinel } from '../../context/SentinelContext';
import { 
  ApprovalRequestCard, 
  EmailPreviewCard, 
  EmailListCard, 
  SecurityAlertCard 
} from '../../components/sentinel/ActionCards';
import { 
  CyberGothicAiCore, 
  AiCoreState 
} from '../../components/sentinel/CyberGothicAiCore';
import { 
  SpiderWebCorner, 
  FlyingBatSvg 
} from '../../components/sentinel/HalloweenDecorations';
import { 
  Send, 
  Sparkles, 
  Trash2,
  Lock,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Radio,
  Cpu,
  Mail,
  Zap,
  Terminal,
  Activity,
  KeyRound,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function CyberGothicConsolePage() {
  const router = useRouter();
  const { 
    userAccount, 
    openDrawerWithEmail, 
    handleResolveApproval, 
    loadAllData,
    unreadEmailCount,
    pendingApprovalCount,
    setShowApiKeyModal
  } = useSentinel();

  const [messages, setMessages] = useState<SentinelChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isScanningMode, setIsScanningMode] = useState(false);
  const [showCoreModal, setShowCoreModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Compute 3D Core state reactively based on live application events
  const coreState: AiCoreState = isSending
    ? 'processing'
    : isScanningMode
    ? 'scanning'
    : messages.some(m => m.actionCard?.type === 'security_alert')
    ? 'threat'
    : 'idle';

  // Load chat history on mount
  useEffect(() => {
    sentinelGetChatHistory()
      .then(res => {
        if (res?.history) setMessages(res.history);
      })
      .catch(err => console.error('Error fetching chat history:', err));

    const handleNewChat = async () => {
      try {
        await sentinelClearChat();
        setMessages([]);
      } catch (err) {
        console.error('Failed to clear chat:', err);
      }
    };

    window.addEventListener('sentinel:new-chat', handleNewChat);
    return () => window.removeEventListener('sentinel:new-chat', handleNewChat);
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isSending) return;

    if (textToSend.toLowerCase().includes('scan') || textToSend.toLowerCase().includes('prompt guard')) {
      setIsScanningMode(true);
    }

    const userMsg: SentinelChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsSending(true);

    try {
      const res = await sentinelSendMessage(textToSend, userAccount.email);
      if (res?.assistantMessage) {
        setMessages(prev => [...prev, res.assistantMessage]);
        loadAllData();

        // If email preview was returned, open details drawer automatically
        if (res.assistantMessage.actionCard?.type === 'email_preview') {
          openDrawerWithEmail(res.assistantMessage.actionCard.data);
        }
      }
    } catch (err: any) {
      alert(`Butler Transmission Error: ${err.message}`);
    } finally {
      setIsSending(false);
      setIsScanningMode(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await sentinelClearChat();
      setMessages([]);
    } catch (err) {
      console.error('Error clearing chat', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden justify-between font-sans bg-[#07090D] text-[#E8E0D5] relative selection:bg-[#9E2638] selection:text-[#19C5C9]">
      
      {/* Background Cyber-Gothic Environmental Grid & Hologram Layers */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#19C5C9_1px,transparent_1px)] [background-size:24px_24px] z-0" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#19C5C9]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF6900]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Breadcrumb & Return to Estate Bar */}
      <div className="px-4 py-2 border-b border-[#1A1F2C]/80 bg-[#0B1017]/90 backdrop-blur-md flex items-center justify-between text-xs font-mono relative z-20">
        <Link
          href="/"
          className="text-[#C7A56B] hover:text-[#FFE4AD] flex items-center gap-1.5 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Return to Mansion Gates</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className={`w-2 h-2 rounded-full ${
              coreState === 'processing' ? 'bg-[#FF6900] animate-ping' :
              coreState === 'threat' ? 'bg-[#C93646] animate-pulse' :
              'bg-[#19C5C9]'
            }`} />
            <span>AI Core: <strong className="text-white font-mono uppercase text-[11px]">{coreState}</strong></span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 border-l border-slate-800 pl-3">
            <span>Master:</span>
            <strong suppressHydrationWarning className="text-[#C7A56B] truncate max-w-[180px]">{userAccount.email}</strong>
          </div>
        </div>
      </div>

      {/* MAIN CINEMATIC COMMAND DECK & 3D LIVING AI CORE */}
      <div className="px-4 py-3 md:py-4 border-b border-[#1A1F2C] bg-gradient-to-r from-[#07090D] via-[#0E131C] to-[#07090D] relative z-10 shadow-lg">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: 3D Living AI Core Artifact */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => setShowCoreModal(true)}
              className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 cursor-pointer group"
              title="Click to inspect 3D Living AI Core diagnostics"
            >
              <CyberGothicAiCore 
                state={coreState} 
                className="w-full h-full" 
                interactive={true} 
              />
              <div className="absolute inset-0 rounded-full border border-[#19C5C9]/20 group-hover:border-[#19C5C9]/60 transition-colors pointer-events-none" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#19C5C9]/10 border border-[#19C5C9]/30 text-[#19C5C9] font-mono font-bold text-[10px] tracking-wider flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  <span>AUTONOMOUS CORE ACTIVE</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold">
                  LOCAL AIR-GAP
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold font-serif text-white tracking-wide flex items-center gap-2">
                <span>The Possessed Butler</span>
                <span className="text-[#C7A56B] font-mono text-xs font-normal">v2.4 Core</span>
              </h1>
              <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-md hidden sm:block">
                Sovereign executive assistant with pretrained Meta Prompt Guard 2 injection defenses and Single-Use Human-in-the-Loop authorization.
              </p>
            </div>
          </div>

          {/* Right: Real-time Security & Quick Actions Surface */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => handleSendMessage('Scan latest email for prompt injections with Prompt Guard 2')}
              className="px-3 py-1.5 rounded-xl bg-[#0B1017] hover:bg-[#101924] border border-[#19C5C9]/40 hover:border-[#19C5C9] text-xs font-mono text-[#19C5C9] flex items-center gap-1.5 transition-all shadow-sm"
              title="Run Meta Prompt Guard 2 classification on unread emails"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Prompt Guard 2 Scan</span>
            </button>

            <button
              onClick={() => handleSendMessage('Summarize my latest email with Groq')}
              className="px-3 py-1.5 rounded-xl bg-[#0B1017] hover:bg-[#1F1710] border border-[#FF6900]/40 hover:border-[#FF6900] text-xs font-mono text-[#FF6900] flex items-center gap-1.5 transition-all shadow-sm"
              title="Synthesize latest correspondence using executive AI summarizer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive Summary</span>
            </button>

            <button
              onClick={() => handleSendMessage('Verify Canary decoy tripwires')}
              className="px-3 py-1.5 rounded-xl bg-[#0B1017] hover:bg-[#201014] border border-[#C93646]/40 hover:border-[#C93646] text-xs font-mono text-[#FF4D60] flex items-center gap-1.5 transition-all shadow-sm"
              title="Audit active decoy canary credentials in vault memory"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Canary Audit</span>
            </button>

            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-xl bg-[#0B1017] hover:bg-rose-950/60 border border-slate-800 hover:border-rose-700 text-slate-400 hover:text-rose-300 transition-colors"
                title="Clear current conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* CHAT MESSAGES SCROLL AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 max-w-4xl mx-auto w-full relative z-10">
        
        {/* Welcome Empty State if no messages */}
        {messages.length === 0 && (
          <div className="py-8 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#101117] via-[#19C5C9]/20 to-[#FF6900]/20 border border-[#19C5C9]/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(25,197,201,0.2)]">
              <Sparkles className="w-8 h-8 text-[#19C5C9]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-serif font-bold text-white">The Butler Awaits Your Command, Master.</h2>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Your mailbox, executive summaries, and actions are air-gapped behind local Prompt Guard 2 ML classification and cryptographic approvals.
              </p>
            </div>

            {/* Quick Starter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-left">
              {[
                { title: 'Executive Summary', prompt: 'Summarize my latest email with Groq', icon: <Sparkles className="w-3.5 h-3.5 text-[#19C5C9]" /> },
                { title: 'Prompt Guard Scan', prompt: 'Scan latest email for prompt injections with Prompt Guard 2', icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> },
                { title: 'Search Flipkart / Adobe', prompt: 'Check my emails for the latest Adobe invoice', icon: <Mail className="w-3.5 h-3.5 text-[#FF6900]" /> },
                { title: 'Live Gmail Sync', prompt: 'Sync my real live Gmail inbox', icon: <Zap className="w-3.5 h-3.5 text-[#C7A56B]" /> },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="p-3 rounded-xl bg-[#0B1017]/90 hover:bg-[#121924] border border-[#1A1F2C] hover:border-[#19C5C9]/60 transition-all text-xs space-y-1 shadow-sm group"
                >
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate font-mono">
                    "{item.prompt}"
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Stream */}
        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isAssistant ? '' : 'flex-row-reverse'}`}
            >
              {isAssistant ? (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B1924] to-[#101117] border border-[#19C5C9]/60 flex items-center justify-center shrink-0 font-bold text-xs text-[#19C5C9] shadow-[0_0_15px_rgba(25,197,201,0.25)]">
                  <Cpu className="w-5 h-5 text-[#19C5C9]" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6E1025] to-[#C7A56B] border border-[#C7A56B]/70 flex items-center justify-center shrink-0 font-bold text-sm text-[#07090D] shadow-[0_0_15px_rgba(199,165,107,0.3)]">
                  👑
                </div>
              )}

              <div className={`max-w-2xl space-y-2 ${isAssistant ? '' : 'text-right'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed shadow-md backdrop-blur-md transition-all ${
                    isAssistant
                      ? 'bg-[#0E131C]/95 text-[#E8E0D5] border border-[#1A2230] font-sans'
                      : 'bg-gradient-to-r from-[#6E1025]/40 to-[#9E2638]/40 text-white border border-[#C7A56B]/60 shadow-[0_0_15px_rgba(110,16,37,0.3)] ml-auto text-left'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>

                {/* Render Interactive Action Cards */}
                {msg.actionCard?.type === 'approval_request' && (
                  <ApprovalRequestCard
                    taskId={msg.actionCard.data.taskId}
                    checkpoint={msg.actionCard.data.checkpoint}
                    onResolve={handleResolveApproval}
                  />
                )}

                {msg.actionCard?.type === 'email_preview' && (
                  <EmailPreviewCard
                    email={msg.actionCard.data}
                    onViewDetails={(em) => openDrawerWithEmail(em)}
                    onOpenInbox={(em) => {
                      openDrawerWithEmail(em);
                      router.push('/email');
                    }}
                  />
                )}

                {msg.actionCard?.type === 'email_list' && (
                  <EmailListCard
                    data={msg.actionCard.data}
                    onViewDetails={(em) => openDrawerWithEmail(em)}
                    onOpenInbox={(em) => {
                      openDrawerWithEmail(em);
                      router.push('/email');
                    }}
                  />
                )}

                {msg.actionCard?.type === 'security_alert' && (
                  <SecurityAlertCard email={msg.actionCard.data} />
                )}

                <div className="text-[10px] text-[#C7A56B]/80 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Transmission Spinner */}
        {isSending && (
          <div className="flex items-center gap-3 text-xs text-[#19C5C9] font-mono p-3 rounded-xl bg-[#0E131C] border border-[#19C5C9]/40 shadow-[0_0_15px_rgba(25,197,201,0.2)] max-w-fit">
            <div className="w-7 h-7 rounded-lg bg-[#07090D] border border-[#19C5C9]/60 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#19C5C9] animate-ping" />
            </div>
            <span>The Butler is executing Prompt Guard 2 ML inspection & tool reasoning...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* QUICK COMMAND PRESET PILLS */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-2 relative z-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-[11px] font-mono scrollbar-none">
          <span className="text-[#C7A56B] font-bold shrink-0 flex items-center gap-1.5 font-serif">
            <Terminal className="w-3.5 h-3.5 text-[#19C5C9]" />
            <span>Directives:</span>
          </span>
          {[
            'Summarize my latest email with Groq',
            'Scan latest email for prompt injections with Prompt Guard 2',
            'Check my emails for the latest Adobe invoice',
            'Verify Canary decoy tripwires',
            'Draft email to recruiter and ask for approval',
            'Sync my real live Gmail inbox'
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(preset)}
              className="px-3 py-1.5 rounded-xl bg-[#0B1017] hover:bg-[#121A26] text-slate-300 hover:text-[#19C5C9] border border-[#1A1F2C] hover:border-[#19C5C9]/50 shrink-0 transition-all font-medium shadow-sm"
            >
              "{preset}"
            </button>
          ))}
        </div>
      </div>

      {/* CHAT COMPOSER DOCK */}
      <div className="p-4 border-t border-[#1A1F2C] bg-[#07090D]/95 backdrop-blur-xl relative z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Instruct the Butler (e.g., 'Summarize latest email with Groq', 'Check Adobe invoice', 'Run Prompt Guard scan')..."
              className="w-full pl-4 pr-10 py-3.5 rounded-2xl bg-[#0B1017] border border-[#1A1F2C] text-sm text-[#E8E0D5] placeholder-slate-500 font-sans focus:outline-none focus:border-[#19C5C9] focus:ring-1 focus:ring-[#19C5C9] shadow-inner"
            />
            <div className="absolute right-3.5 top-3.5 text-[#19C5C9]">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </div>

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isSending}
            className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#19C5C9] via-[#00E5FF] to-[#19C5C9] hover:brightness-110 disabled:opacity-40 text-[#07090D] font-extrabold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(25,197,201,0.4)] font-mono transition-all"
          >
            <Send className="w-3.5 h-3.5 text-[#07090D] stroke-[2.5]" />
            <span>Transmit</span>
          </button>
        </div>
      </div>

      {/* 3D CORE DIAGNOSTICS MODAL */}
      {showCoreModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0E131C] border border-[#19C5C9]/50 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center pb-2 border-b border-[#1A2230]">
              <h3 className="text-sm font-bold font-serif text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#19C5C9]" />
                <span>Living AI Core Telemetry</span>
              </h3>
              <button onClick={() => setShowCoreModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="h-44 w-full relative">
              <CyberGothicAiCore state={coreState} className="w-full h-full" />
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[#1A2230]">
                <span className="text-slate-400">Current State:</span>
                <span className="font-bold text-[#19C5C9] uppercase">{coreState}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1A2230]">
                <span className="text-slate-400">Security Gate:</span>
                <span className="text-emerald-400 font-bold">Meta Prompt Guard 2 Active</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#1A2230]">
                <span className="text-slate-400">Canary Tripwire:</span>
                <span className="text-[#C7A56B]">CANARY_SENTINEL_CREDENTIAL_992xQ</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">HITL Gate:</span>
                <span className="text-white">Single-Use Cryptographic Tokens</span>
              </div>
            </div>

            <button
              onClick={() => setShowCoreModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#19C5C9] text-[#07090D] font-bold text-xs font-mono hover:brightness-110 transition-all shadow-md"
            >
              Close Diagnostics
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
