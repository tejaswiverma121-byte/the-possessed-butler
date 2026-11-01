'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  SentinelUserAccount, 
  SentinelEmail, 
  SentinelTask 
} from '../types';
import { 
  sentinelGetAccount, 
  sentinelGetEmails, 
  sentinelGetTasks, 
  sentinelUpdateAccount, 
  sentinelMarkEmailAsRead, 
  sentinelMarkAllEmailsAsRead, 
  sentinelSyncImap, 
  sentinelConnectImap, 
  sentinelDisconnectImap, 
  sentinelApproveTask, 
  fetchSettings 
} from '../api';

interface SentinelContextType {
  userAccount: SentinelUserAccount;
  emails: SentinelEmail[];
  tasks: SentinelTask[];
  activeTask?: SentinelTask;
  unreadEmailCount: number;
  pendingApprovalCount: number;
  selectedEmailForDrawer?: SentinelEmail;
  isDrawerOpen: boolean;
  showAccountModal: boolean;
  showApiKeyModal: boolean;
  aiSettings: { provider: string; hasKey: boolean; model: string };
  isAuthenticated: boolean;
  loginWithGmail: (email: string, appPassword?: string, name?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  openDrawerWithEmail: (email: SentinelEmail) => void;
  closeDrawer: () => void;
  setShowAccountModal: (show: boolean) => void;
  setShowApiKeyModal: (show: boolean) => void;
  loadAllData: () => Promise<void>;
  handleMarkEmailAsRead: (emailId: string, isRead: boolean) => Promise<void>;
  handleMarkAllEmailsAsRead: () => Promise<void>;
  handleSyncLiveImap: () => Promise<void>;
  handleConnectImap: (cfg: any) => Promise<any>;
  handleUpdateAccount: (updated: Partial<SentinelUserAccount>) => Promise<void>;
  handleResolveApproval: (taskId: string, approved: boolean) => Promise<void>;
  setAiSettings: React.Dispatch<React.SetStateAction<{ provider: string; hasKey: boolean; model: string }>>;
}

const SentinelContext = createContext<SentinelContextType | undefined>(undefined);

export const SentinelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean(localStorage.getItem('sentinel_email'));
    }
    return false;
  });

  const [userAccount, setUserAccount] = useState<SentinelUserAccount>(() => {
    const defaultEmail = typeof window !== 'undefined' ? localStorage.getItem('sentinel_email') || 'abcd@email.com' : 'abcd@email.com';
    const defaultName = typeof window !== 'undefined' ? localStorage.getItem('sentinel_user_name') || 'Abcd User' : 'Abcd User';
    return {
      id: 'user-default',
      email: defaultEmail,
      name: defaultName,
      provider: 'simulation',
      connectedAt: new Date().toISOString(),
      trustedSenders: ['@adobe.com', '@university.edu', 'team@workproject.com'],
      blockedSenders: ['@shadow.net', '@fake-secure-portal.com']
    };
  });

  const [emails, setEmails] = useState<SentinelEmail[]>([]);
  const [tasks, setTasks] = useState<SentinelTask[]>([]);
  const [selectedEmailForDrawer, setSelectedEmailForDrawer] = useState<SentinelEmail | undefined>(undefined);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [aiSettings, setAiSettings] = useState({ provider: 'domain_engine', hasKey: false, model: 'auto' });

  const loadAllData = async () => {
    try {
      const [emailData, taskData, accountData, settingsData] = await Promise.all([
        sentinelGetEmails().catch(() => ({ emails: [] })),
        sentinelGetTasks().catch(() => ({ tasks: [] })),
        sentinelGetAccount().catch(() => null),
        fetchSettings().catch(() => null)
      ]);

      if (emailData?.emails) setEmails(emailData.emails);
      if (taskData?.tasks && taskData.tasks.length > 0) {
        setTasks(taskData.tasks);
        if (typeof window !== 'undefined') {
          localStorage.setItem('sentinel_tasks_cache', JSON.stringify(taskData.tasks));
        }
      } else if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('sentinel_tasks_cache');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setTasks(parsed);
              fetch('/api/sentinel/tasks/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: parsed })
              }).catch(() => {});
            }
          } catch {}
        }
      }
      if (accountData?.account) setUserAccount(accountData.account);
      if (settingsData) setAiSettings(settingsData);

      // Auto-reconnect live email if localStorage has credentials
      if (typeof window !== 'undefined') {
        const storedEmail = localStorage.getItem('sentinel_email');
        const storedPass = localStorage.getItem('sentinel_app_password');
        if (storedEmail && storedPass && !accountData?.account?.isLiveImapConnected) {
          sentinelConnectImap({
            host: localStorage.getItem('sentinel_imap_host') || 'imap.gmail.com',
            port: Number(localStorage.getItem('sentinel_imap_port')) || 993,
            user: storedEmail,
            pass: storedPass,
            mailbox: 'INBOX',
            secure: true
          }).then(res => {
            if (res?.success && res.userAccount) {
              setUserAccount(res.userAccount);
              sentinelGetEmails().then(emRes => {
                if (emRes?.emails) setEmails(emRes.emails);
              });
            }
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Initial data load warning:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const openDrawerWithEmail = (email: SentinelEmail) => {
    setSelectedEmailForDrawer(email);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleMarkEmailAsRead = async (emailId: string, isRead: boolean) => {
    setEmails(prev => prev.map(e => e.id === emailId ? { ...e, isRead } : e));
    try {
      await sentinelMarkEmailAsRead(emailId, isRead);
    } catch (err) {
      console.error('Failed to update email status on server', err);
    }
  };

  const handleMarkAllEmailsAsRead = async () => {
    setEmails(prev => prev.map(e => ({ ...e, isRead: true })));
    try {
      await sentinelMarkAllEmailsAsRead();
    } catch (err) {
      console.error('Failed to mark all emails as read', err);
    }
  };

  const handleSyncLiveImap = async () => {
    const res = await sentinelSyncImap();
    if (res?.success && res.emails) {
      setEmails(res.emails);
      if (res.userAccount) setUserAccount(res.userAccount);
    }
  };

  const handleConnectImap = async (cfg: any) => {
    const res = await sentinelConnectImap(cfg);
    if (res?.success && res.userAccount) {
      setUserAccount(res.userAccount);
      const emailRes = await sentinelGetEmails();
      if (emailRes?.emails) setEmails(emailRes.emails);
    }
    return res;
  };

  const handleUpdateAccount = async (updated: Partial<SentinelUserAccount>) => {
    const res = await sentinelUpdateAccount(updated);
    if (res?.account) {
      setUserAccount(res.account);
    }
  };

  const handleResolveApproval = async (taskId: string, approved: boolean) => {
    try {
      const res = await sentinelApproveTask(taskId, approved);
      if (res?.task) {
        setTasks(prev => prev.map(t => t.id === taskId ? res.task : t));
        const [updatedEmails, updatedTasks] = await Promise.all([
          sentinelGetEmails(),
          sentinelGetTasks()
        ]);
        if (updatedEmails?.emails) setEmails(updatedEmails.emails);
        if (updatedTasks?.tasks) setTasks(updatedTasks.tasks);
      }
    } catch (err: any) {
      alert(`Approval error: ${err.message}`);
    }
  };

  const loginWithGmail = async (email: string, appPassword?: string, name?: string) => {
    const userName = name || email.split('@')[0];
    if (typeof window !== 'undefined') {
      localStorage.setItem('sentinel_email', email);
      localStorage.setItem('sentinel_user_name', userName);
      if (appPassword) {
        localStorage.setItem('sentinel_app_password', appPassword);
        localStorage.setItem('sentinel_imap_host', 'imap.gmail.com');
        localStorage.setItem('sentinel_imap_port', '993');
      } else {
        localStorage.removeItem('sentinel_app_password');
      }
    }

    if (appPassword) {
      try {
        const res = await sentinelConnectImap({
          host: 'imap.gmail.com',
          port: 993,
          user: email,
          pass: appPassword,
          mailbox: 'INBOX',
          secure: true
        });
        if (res?.success) {
          if (res.userAccount) setUserAccount(res.userAccount);
          if (res.emails) setEmails(res.emails);
          setIsAuthenticated(true);
          return { success: true, message: `Connected to live Gmail inbox (${email}) via IMAP & SMTP!` };
        } else {
          const updateRes = await sentinelUpdateAccount({
            email,
            name: userName,
            provider: 'simulation',
            isLiveImapConnected: false
          });
          if (updateRes?.account) setUserAccount(updateRes.account);
          setIsAuthenticated(true);
          return { 
            success: true, 
            message: `Logged in under ${email} in Sandbox Mode (Google IMAP rejected password: ${res?.error || 'Check 16-character App Password'}). Outgoing emails will use ${email}.` 
          };
        }
      } catch (err: any) {
        const updateRes = await sentinelUpdateAccount({
          email,
          name: userName,
          provider: 'simulation',
          isLiveImapConnected: false
        });
        if (updateRes?.account) setUserAccount(updateRes.account);
        setIsAuthenticated(true);
        return { 
          success: true, 
          message: `Logged in under ${email} in Sandbox Mode. Outgoing emails will display ${email}.` 
        };
      }
    } else {
      const updateRes = await sentinelUpdateAccount({
        email,
        name: userName,
        provider: 'simulation',
        isLiveImapConnected: false
      });
      if (updateRes?.account) setUserAccount(updateRes.account);
      setIsAuthenticated(true);
      return { success: true, message: `Logged in to Sentinel AI under ${email}.` };
    }
  };

  const logout = async () => {
    try {
      await sentinelDisconnectImap();
    } catch {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sentinel_email');
      localStorage.removeItem('sentinel_app_password');
      localStorage.removeItem('sentinel_user_name');
    }
    setIsAuthenticated(false);
    setUserAccount({
      id: 'user-default',
      email: 'demo@sentinel.ai',
      name: 'Sentinel Guest',
      provider: 'simulation',
      connectedAt: new Date().toISOString(),
      trustedSenders: ['@adobe.com', '@university.edu', 'team@workproject.com'],
      blockedSenders: ['@shadow.net', '@fake-secure-portal.com']
    });
  };

  const unreadEmailCount = emails.filter(e => !e.isRead).length;
  const activeTask = tasks.find(t => t.status === 'executing' || t.status === 'awaiting_approval' || t.status === 'planning');
  const pendingApprovalCount = tasks.filter(t => t.status === 'awaiting_approval').length;

  return (
    <SentinelContext.Provider value={{
      userAccount,
      emails,
      tasks,
      activeTask,
      unreadEmailCount,
      pendingApprovalCount,
      selectedEmailForDrawer,
      isDrawerOpen,
      showAccountModal,
      showApiKeyModal,
      aiSettings,
      isAuthenticated,
      loginWithGmail,
      logout,
      openDrawerWithEmail,
      closeDrawer,
      setShowAccountModal,
      setShowApiKeyModal,
      loadAllData,
      handleMarkEmailAsRead,
      handleMarkAllEmailsAsRead,
      handleSyncLiveImap,
      handleConnectImap,
      handleUpdateAccount,
      handleResolveApproval,
      setAiSettings
    }}>
      {children}
    </SentinelContext.Provider>
  );
};

export const useSentinel = () => {
  const context = useContext(SentinelContext);
  if (!context) {
    throw new Error('useSentinel must be used within a SentinelProvider');
  }
  return context;
};
