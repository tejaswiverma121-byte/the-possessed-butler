'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSentinel } from '../../context/SentinelContext';
import { Sidebar } from '../sentinel/Sidebar';
import { DetailsDrawer } from '../sentinel/DetailsDrawer';
import { AccountModal } from '../sentinel/AccountModal';
import { ApiKeyModal } from '../ApiKeyModal';
import { Menu, ChevronRight } from 'lucide-react';
import { FlyingBatSvg } from '../sentinel/HalloweenDecorations';

export const SentinelAppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const {
    userAccount,
    unreadEmailCount,
    pendingApprovalCount,
    activeTask,
    selectedEmailForDrawer,
    isDrawerOpen,
    closeDrawer,
    showAccountModal,
    setShowAccountModal,
    showApiKeyModal,
    setShowApiKeyModal,
    aiSettings,
    setAiSettings,
    loadAllData,
    handleUpdateAccount,
    handleMarkEmailAsRead
  } = useSentinel();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Cinematic full-bleed standalone pages without forced fixed sidebar
  const isStandalonePage = 
    pathname === '/' || 
    pathname?.startsWith('/login') || 
    pathname?.startsWith('/signin') || 
    pathname?.startsWith('/register') || 
    pathname?.startsWith('/create-account') || 
    pathname?.startsWith('/auth');

  if (isStandalonePage) {
    return (
      <div className="min-h-screen bg-[#09080B] text-[#E8E0D5] font-sans relative selection:bg-[#9E2638] selection:text-[#F3D9A4]">
        {children}
        <AccountModal
          isOpen={showAccountModal}
          onClose={() => setShowAccountModal(false)}
          userAccount={userAccount}
          onSave={handleUpdateAccount}
          onRefreshData={loadAllData}
        />
        <ApiKeyModal
          isOpen={showApiKeyModal}
          onClose={() => setShowApiKeyModal(false)}
          currentSettings={aiSettings}
          onSettingsUpdated={async () => {
            loadAllData();
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#05090f] text-slate-100 overflow-hidden font-sans relative selection:bg-pumpkin-500 selection:text-obsidian-950">
      {/* Sidebar (Desktop and Mobile) */}
      <Sidebar
        userAccount={userAccount}
        unreadEmailCount={unreadEmailCount}
        pendingApprovalCount={pendingApprovalCount}
        onNewChat={() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('sentinel:new-chat'));
          }
        }}
        onOpenAccountModal={() => setShowAccountModal(true)}
        onOpenApiKeyModal={() => setShowApiKeyModal(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-obsidian-950/95">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between p-3 bg-obsidian-900 border-b border-pumpkin-900/40 z-30 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-obsidian-950 text-pumpkin-400 border border-pumpkin-900 hover:border-pumpkin-600 transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5 font-display font-extrabold text-sm text-white">
              <span>SENTINEL AI</span>
              <FlyingBatSvg size={16} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pendingApprovalCount > 0 && (
              <Link 
                href="/tasks"
                className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-ember-500 text-obsidian-950 animate-pulse shadow-glow-ember"
              >
                {pendingApprovalCount} Action
              </Link>
            )}
            <button
              onClick={() => setShowAccountModal(true)}
              className="w-8 h-8 rounded-lg bg-pumpkin-950 border border-pumpkin-800 flex items-center justify-center text-xs"
            >
              🎃
            </button>
          </div>
        </header>

        {/* Top Active Task Status Bar if a task is active */}
        {activeTask && (
          <div className="bg-pumpkin-950/70 border-b border-pumpkin-600/70 px-4 md:px-6 py-2.5 flex items-center justify-between text-xs font-mono shrink-0 shadow-glow-pumpkin z-20 backdrop-blur-md">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <span className="w-2.5 h-2.5 rounded-full bg-pumpkin-400 animate-ping shrink-0" />
              <span className="font-bold text-pumpkin-300 uppercase shrink-0 flex items-center gap-1">
                <span>🎃 Active Task:</span>
              </span>
              <span className="text-white truncate font-sans font-medium">{activeTask.goal}</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] bg-pumpkin-900 text-pumpkin-200 border border-pumpkin-600 shrink-0 font-bold">
                {activeTask.status.toUpperCase()}
              </span>
            </div>
            <Link
              href="/tasks"
              className="text-pumpkin-400 hover:text-white flex items-center gap-1 shrink-0 font-bold transition-colors ml-2"
            >
              <span>Approvals ({pendingApprovalCount})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>

      {/* Collapsible Details Drawer */}
      <DetailsDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        selectedEmail={selectedEmailForDrawer}
        activeTask={activeTask}
        onMarkAsRead={handleMarkEmailAsRead}
      />

      {/* Global Modals */}
      <AccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        userAccount={userAccount}
        onSave={handleUpdateAccount}
        onRefreshData={loadAllData}
      />

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        currentSettings={aiSettings}
        onSettingsUpdated={async () => {
          loadAllData();
        }}
      />
    </div>
  );
};
