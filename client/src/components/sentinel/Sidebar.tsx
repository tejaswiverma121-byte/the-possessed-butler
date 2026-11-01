'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MessageSquare, 
  Mail, 
  CheckSquare, 
  ShieldAlert, 
  Settings, 
  Smartphone, 
  Plus, 
  Edit3,
  GitPullRequest,
  Sparkles,
  Flame,
  Terminal,
  X
} from 'lucide-react';
import { SentinelUserAccount } from '../../types';
import { FlyingBatSvg, SpiderWebCorner } from './HalloweenDecorations';

interface SidebarProps {
  userAccount: SentinelUserAccount;
  unreadEmailCount: number;
  pendingApprovalCount: number;
  onNewChat?: () => void;
  onOpenAccountModal: () => void;
  onOpenApiKeyModal: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userAccount,
  unreadEmailCount,
  pendingApprovalCount,
  onNewChat,
  onOpenAccountModal,
  onOpenApiKeyModal,
  isMobileOpen,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { 
      href: '/', 
      label: 'Mansion Entrance', 
      icon: Flame,
      isActive: pathname === '/'
    },
    { 
      href: '/console', 
      label: 'Butler AI Console', 
      icon: Terminal,
      isActive: pathname === '/console'
    },
    { 
      href: '/email', 
      label: 'Email Inbox', 
      icon: Mail, 
      badge: unreadEmailCount > 0 ? unreadEmailCount : undefined, 
      badgeColor: 'bg-pumpkin-500 text-obsidian-950 font-extrabold shadow-glow-pumpkin',
      isActive: pathname === '/email'
    },
    { 
      href: '/tasks', 
      label: 'Tasks & Approvals', 
      icon: CheckSquare, 
      badge: pendingApprovalCount > 0 ? `${pendingApprovalCount} Action` : undefined, 
      badgeColor: 'bg-ember-500 text-obsidian-950 font-extrabold animate-pulse shadow-glow-ember',
      isActive: pathname === '/tasks'
    },
    { 
      href: '/security', 
      label: 'Security Center', 
      icon: ShieldAlert, 
      badge: 'Protected', 
      badgeColor: 'bg-pumpkin-950 text-pumpkin-300 border border-pumpkin-700',
      isActive: pathname === '/security'
    },
    { 
      href: '/android', 
      label: 'Android Mobile App', 
      icon: Smartphone, 
      badge: 'APK Ready', 
      badgeColor: 'bg-obsidian-900 text-pumpkin-400 border border-pumpkin-800',
      isActive: pathname === '/android'
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 h-screen bg-obsidian-950 border-r border-pumpkin-900/40 flex flex-col justify-between p-4 shrink-0 select-none font-sans overflow-hidden transition-transform duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Spiderweb in top-left */}
        <SpiderWebCorner className="top-0 left-0 w-20 h-20 -scale-x-100 opacity-20 pointer-events-none" />

        <div className="space-y-4 relative z-10 flex-1 overflow-y-auto pr-1">
          {/* Brand Header with Cyber Pumpkin Mascot */}
          <div className="px-2 pt-1 pb-3 border-b border-pumpkin-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative group cursor-pointer">
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-pumpkin-500 shadow-glow-pumpkin bg-obsidian-900">
                  <img 
                    src="/halloween/cyber_pumpkin_mascot.jpg" 
                    alt="Sentinel AI Cyber Pumpkin" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-pumpkin-400 rounded-full border-2 border-obsidian-950 animate-ping" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-pumpkin-400 rounded-full border-2 border-obsidian-950" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm font-display font-extrabold text-white tracking-wider">
                    SENTINEL AI
                  </h1>
                  <FlyingBatSvg size={18} />
                </div>
                <p className="text-[10px] text-pumpkin-400/90 font-mono flex items-center gap-1">
                  <span>Phantom Copilot</span>
                  <span className="text-pumpkin-500 text-[9px] font-bold">• SPOOKY</span>
                </p>
              </div>
            </div>

            {/* Close Button on Mobile */}
            {onCloseMobile && (
              <button 
                onClick={onCloseMobile}
                className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-900"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* New Chat Button */}
          <Link
            href="/"
            onClick={() => {
              if (onNewChat) onNewChat();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-pumpkin-600 via-ember-500 to-pumpkin-500 hover:from-pumpkin-500 hover:to-ember-400 text-obsidian-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-pumpkin transition-all font-mono tracking-wide"
          >
            <Plus className="w-4 h-4 text-obsidian-950 stroke-[3]" />
            <span>New Conversation</span>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.isActive;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-pumpkin-950/80 to-obsidian-900 text-pumpkin-300 font-bold shadow-md border-l-4 border-pumpkin-500 border-y border-r border-pumpkin-900/50'
                      : 'text-slate-400 hover:text-pumpkin-200 hover:bg-pumpkin-950/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-pumpkin-400' : 'text-slate-500'}`} />
                    <span className="tracking-tight">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-obsidian-900 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Settings & AI Keys Button */}
            <button
              onClick={() => {
                onOpenApiKeyModal();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-pumpkin-200 hover:bg-pumpkin-950/30 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-slate-500" />
                <span className="tracking-tight">Settings & AI Keys</span>
              </div>
            </button>
          </nav>
        </div>

        {/* User Account / Identity Section with Pencil Edit */}
        <div className="pt-3 border-t border-pumpkin-900/40 space-y-2 relative z-10 shrink-0">
          <div className="p-2.5 rounded-xl bg-obsidian-900 border border-pumpkin-900/50 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-pumpkin-950 border border-pumpkin-800 flex items-center justify-center text-pumpkin-400 shrink-0 font-bold">
                <span>🎃</span>
              </div>
              <div className="overflow-hidden">
                <div suppressHydrationWarning className="text-[12px] font-bold text-slate-100 truncate">
                  {mounted ? userAccount.name : 'Master User'}
                </div>
                <div suppressHydrationWarning className="text-[10px] font-mono text-pumpkin-400 truncate">
                  {mounted ? userAccount.email : 'tejaswiverma236@gmail.com'}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onOpenAccountModal();
                if (onCloseMobile) onCloseMobile();
              }}
              title="Edit User Email & Mailbox Connection"
              className="p-1.5 rounded-lg bg-obsidian-950 hover:bg-pumpkin-950 border border-pumpkin-900 hover:border-pumpkin-600 text-pumpkin-400 hover:text-pumpkin-300 transition-all shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between px-1 text-[10px] text-pumpkin-400/80 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-pumpkin-400 animate-pulse" />
              <span>Air-Gap Active</span>
            </span>
            <span className="text-emerald-400 font-bold">Zero Leakage</span>
          </div>
        </div>
      </aside>
    </>
  );
};
