import React, { useState, useEffect } from 'react';
import { SentinelUserAccount } from '../../types';

import { 
  Mail, 
  Check, 
  X, 
  Server, 
  Key, 
  Shield, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Unplug,
  Radio
} from 'lucide-react';
import { sentinelTestImap, sentinelConnectImap, sentinelDisconnectImap } from '../../api';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAccount: SentinelUserAccount;
  onSave: (updated: Partial<SentinelUserAccount>) => Promise<void>;
  onRefreshData?: () => Promise<void>;
}

export const AccountModal: React.FC<AccountModalProps> = ({ 
  isOpen, 
  onClose, 
  userAccount, 
  onSave,
  onRefreshData 
}) => {
  const [email, setEmail] = useState(userAccount.email);
  const [name, setName] = useState(userAccount.name);
  const [provider, setProvider] = useState<SentinelUserAccount['provider']>(userAccount.provider || 'gmail');
  const [imapHost, setImapHost] = useState(userAccount.imapHost || 'imap.gmail.com');
  const [imapPort, setImapPort] = useState(userAccount.imapPort || 993);
  const [appPassword, setAppPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mailbox, setMailbox] = useState('INBOX');

  const [isTesting, setIsTesting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('sentinel_email');
      const storedPass = localStorage.getItem('sentinel_app_password');
      const storedProvider = localStorage.getItem('sentinel_provider') as any;
      const storedHost = localStorage.getItem('sentinel_imap_host');
      const storedPort = localStorage.getItem('sentinel_imap_port');

      setEmail(storedEmail || userAccount.email);
      setName(userAccount.name);
      setProvider(storedProvider || userAccount.provider || 'gmail');
      setImapHost(storedHost || userAccount.imapHost || 'imap.gmail.com');
      setImapPort(storedPort ? Number(storedPort) : (userAccount.imapPort || 993));
      if (storedPass) setAppPassword(storedPass);
      setTestResult(null);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, userAccount]);

  if (!isOpen) return null;

  const handleProviderSelect = (p: SentinelUserAccount['provider']) => {
    setProvider(p);
    setTestResult(null);
    setErrorMsg('');
    if (p === 'gmail') {
      setImapHost('imap.gmail.com');
      setImapPort(993);
    } else if (p === 'outlook') {
      setImapHost('outlook.office365.com');
      setImapPort(993);
    } else if (p === 'custom_imap') {
      setImapHost('mail.yourdomain.com');
      setImapPort(993);
    } else if (p === 'simulation') {
      setImapHost('localhost:3001/api/sentinel/emails');
      setImapPort(3001);
    }
  };

  const handleTestConnection = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!appPassword.trim()) {
      setErrorMsg('Please enter your App Password or IMAP password to test connection.');
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    setErrorMsg('');
    try {
      const res = await sentinelTestImap({
        host: imapHost,
        port: Number(imapPort),
        user: email.trim(),
        pass: appPassword.trim(),
        mailbox: mailbox.trim(),
        secure: true
      });

      if (res.success) {
        setTestResult({
          success: true,
          message: res.message || 'Connection successful!'
        });
      } else {
        setTestResult({
          success: false,
          message: res.error || res.message || 'Failed to connect.'
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Network error while testing IMAP connection.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleConnectLiveImap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // If simulation mode
    if (provider === 'simulation') {
      setIsConnecting(true);
      try {
        await onSave({
          email: email.trim(),
          name: name.trim(),
          provider: 'simulation',
          imapHost,
          imapPort,
          isLiveImapConnected: false
        });
        setSuccessMsg('Profile updated to Sandbox Simulation mode.');
        setTimeout(() => {
          onClose();
        }, 800);
      } finally {
        setIsConnecting(false);
      }
      return;
    }

    // Live IMAP connection
    if (!appPassword.trim()) {
      setErrorMsg('Please enter your App Password or IMAP password to connect.');
      return;
    }

    const cleanPass = appPassword.trim().replace(/\s+/g, '');

    setIsConnecting(true);
    setErrorMsg('');
    try {
      const res = await sentinelConnectImap({
        host: imapHost,
        port: Number(imapPort),
        user: email.trim(),
        pass: cleanPass,
        mailbox: mailbox.trim(),
        secure: true
      });

      if (res.success) {
        localStorage.setItem('sentinel_email', email.trim());
        localStorage.setItem('sentinel_app_password', cleanPass);
        localStorage.setItem('sentinel_provider', provider);
        localStorage.setItem('sentinel_imap_host', imapHost);
        localStorage.setItem('sentinel_imap_port', String(imapPort));

        setSuccessMsg(res.message || 'Successfully connected to live inbox!');
        if (onRefreshData) await onRefreshData();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res.error || res.message || 'Failed to connect to live IMAP.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection failed.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Disconnect live IMAP sync and switch back to secure demo inbox?')) return;
    setIsDisconnecting(true);
    try {
      await sentinelDisconnectImap();
      localStorage.removeItem('sentinel_app_password');
      if (onRefreshData) await onRefreshData();
      setSuccessMsg('Disconnected from live mail server. Returned to sandbox.');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to disconnect.');
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-obsidian-900 rounded-2xl border-2 border-pumpkin-500/80 max-w-xl w-full p-6 space-y-5 shadow-glow-pumpkin my-8">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-witch-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-pumpkin-500/20 text-pumpkin-400 border border-pumpkin-500/30">
              <Mail className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">🎃 Live Email & IMAP Synchronization</h3>
                {userAccount.isLiveImapConnected ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700 flex items-center gap-1 font-mono">
                    <Radio className="w-2.5 h-2.5 animate-pulse" /> Live Active
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-witch-950 text-witch-400 border border-witch-800 font-mono">
                    Sandbox Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-pumpkin-200/70 mt-0.5 font-sans">Connect your real Gmail or Outlook inbox to Sentinel AI</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Banner if already connected */}
        {userAccount.isLiveImapConnected && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/80 flex items-center justify-between gap-3 text-xs font-mono shadow-md">
            <div>
              <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Synchronized with: {userAccount.email}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Server: {userAccount.imapHost} | Total messages tracked: <span className="text-pumpkin-400 font-bold">{userAccount.imapStatus?.totalSynced || 'Active'}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="px-3 py-1.5 rounded-lg bg-vampire-950/80 border border-vampire-800 text-vampire-300 hover:bg-vampire-900 text-xs flex items-center gap-1 transition-all"
            >
              <Unplug className="w-3.5 h-3.5" />
              <span>{isDisconnecting ? 'Disconnecting...' : 'Disconnect'}</span>
            </button>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-xs font-mono text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-vampire-950/80 border border-vampire-800 text-xs font-mono text-vampire-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-vampire-400 shrink-0 mt-0.5" />
            <div className="space-y-1">{errorMsg}</div>
          </div>
        )}

        {/* Test Result Alert */}
        {testResult && (
          <div className={`p-3.5 rounded-xl border text-xs font-mono flex items-start gap-2 ${
            testResult.success
              ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
              : 'bg-pumpkin-950/60 border-pumpkin-700 text-pumpkin-300'
          }`}>
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-pumpkin-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 leading-relaxed">
              <span className="font-bold">{testResult.success ? 'Connection Test Succeeded:' : 'Connection Test Failed:'}</span>
              <p className="text-xs opacity-90">{testResult.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleConnectLiveImap} className="space-y-4 text-xs font-mono">
          {/* Email Provider Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold font-sans">Select Provider:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'gmail', label: 'Gmail / Google' },
                { id: 'outlook', label: 'Outlook / Office' },
                { id: 'custom_imap', label: 'Custom IMAP' },
                { id: 'simulation', label: 'Offline Sandbox' },
              ].map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handleProviderSelect(p.id as any)}
                  className={`p-2.5 rounded-xl text-center border transition-all text-xs font-bold ${
                    provider === p.id
                      ? 'bg-gradient-to-r from-pumpkin-500 to-pumpkin-600 text-obsidian-950 border-pumpkin-400 shadow-glow-pumpkin'
                      : 'bg-obsidian-950 border-witch-850 text-slate-300 hover:text-white hover:border-pumpkin-500/50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold font-sans">Your Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-obsidian-950 border border-witch-800 text-pumpkin-300 font-bold focus:border-pumpkin-500 focus:outline-none"
              placeholder="e.g. yourname@gmail.com"
            />
          </div>

          {/* Helper banner if user typed a Gmail address while still on Offline Sandbox */}
          {provider === 'simulation' && email.toLowerCase().includes('@gmail.com') && (
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs font-sans">
              <div className="text-cyan-200">
                <span className="font-bold text-cyan-300">💡 Gmail Detected:</span> You are currently in <strong className="text-white">Offline Sandbox</strong> mode. To fetch real emails, switch to live sync.
              </div>
              <button
                type="button"
                onClick={() => handleProviderSelect('gmail')}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 text-xs transition-colors shrink-0 shadow-md shadow-cyan-500/20"
              >
                Switch to Live Gmail Sync
              </button>
            </div>
          )}

          {/* Display Name */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold font-sans">Display / Passenger Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl bg-obsidian-950 border border-witch-800 text-slate-200 focus:border-pumpkin-500 focus:outline-none"
              placeholder="e.g. Tejaswi Verma"
            />
          </div>

          {/* Live IMAP Specific Fields */}
          {provider !== 'simulation' && (
            <>
              {/* Google App Password Guidance */}
              {provider === 'gmail' && (
                <div className="p-3.5 rounded-xl bg-witch-950/70 border border-witch-800 space-y-2 text-xs text-witch-200">
                  <div className="font-bold text-pumpkin-300 flex items-center justify-between">
                    <span>How to get your Gmail App Password (1 minute):</span>
                    <a
                      href="https://myaccount.google.com/apppasswords"
                      target="_blank"
                      rel="noreferrer"
                      className="text-pumpkin-400 hover:text-pumpkin-300 underline flex items-center gap-1 font-bold"
                    >
                      <span>Open Google Security</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-300 font-sans">
                    <li>Go to <span className="text-pumpkin-300 font-bold">Google Account &gt; Security</span> (ensure 2-Step Verification is ON).</li>
                    <li>Search or click <span className="text-pumpkin-300 font-bold">"App Passwords"</span>.</li>
                    <li>Create an app named <span className="text-white font-bold">"Sentinel AI"</span>.</li>
                    <li>Copy the generated 16-letter code and paste below.</li>
                  </ol>
                </div>
              )}

              {/* Password / App Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 font-semibold flex items-center gap-1.5 font-sans">
                    <Key className="w-3.5 h-3.5 text-pumpkin-400" />
                    <span>{provider === 'gmail' ? 'Google 16-Letter App Password:' : 'IMAP / App Password:'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-pumpkin-300 text-xs flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={appPassword}
                  onChange={(e) => setAppPassword(e.target.value)}
                  placeholder={provider === 'gmail' ? 'xxxx xxxx xxxx xxxx' : 'Your IMAP password or app token'}
                  className="w-full p-3 rounded-xl bg-obsidian-950 border border-witch-800 text-white font-mono tracking-wider focus:border-pumpkin-500 focus:outline-none"
                />
              </div>

              {/* Server Host & Port */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2 space-y-1">
                  <label className="text-slate-400 text-xs">IMAP Server Host:</label>
                  <input
                    type="text"
                    value={imapHost}
                    onChange={(e) => setImapHost(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-obsidian-950 border border-witch-800 text-slate-300 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 text-xs">SSL Port:</label>
                  <input
                    type="number"
                    value={imapPort}
                    onChange={(e) => setImapPort(parseInt(e.target.value))}
                    className="w-full p-2.5 rounded-lg bg-obsidian-950 border border-witch-800 text-slate-300 text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {/* Security & Privacy Guarantee */}
          <div className="p-3.5 rounded-xl bg-obsidian-950/80 border border-witch-850 space-y-1.5 text-xs text-slate-400 font-sans">
            <div className="text-slate-200 font-bold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Zero-Leakage & Air-Gap Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your credentials are held solely in temporary server memory and never written to disk. All incoming live messages pass through the Possessed Butler Quarantined LLM to sanitize prompt injections and isolate tripwire tokens.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
            {provider !== 'simulation' ? (
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !appPassword.trim()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-obsidian-950 border border-witch-800 hover:border-pumpkin-500 text-pumpkin-300 font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 transition-all text-xs"
              >
                {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Server className="w-3.5 h-3.5" />}
                <span>{isTesting ? 'Testing Server...' : 'Test Connection'}</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-obsidian-800 hover:bg-witch-900 border border-witch-800 text-slate-300 transition-colors text-xs font-sans"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isConnecting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pumpkin-500 to-pumpkin-600 hover:from-pumpkin-400 hover:to-pumpkin-500 text-obsidian-950 font-bold shadow-glow-pumpkin transition-all flex items-center justify-center gap-2 text-xs font-sans"
              >
                {isConnecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>
                  {isConnecting 
                    ? 'Connecting & Syncing...' 
                    : provider === 'simulation' 
                    ? 'Save Profile' 
                    : 'Connect & Sync Real Inbox'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
