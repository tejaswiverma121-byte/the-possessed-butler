import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Key, CheckCircle, AlertTriangle, Zap, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { saveSettings } from '../api';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: { provider: string; hasKey: boolean; model: string };
  onSettingsUpdated: () => void;
}

type ProviderType = 'groq' | 'gemini' | 'openai' | 'domain_engine';

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSettingsUpdated,
}) => {
  const [provider, setProvider] = useState<ProviderType>(
    (currentSettings.provider as ProviderType) || 'groq'
  );
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState(currentSettings.model || 'llama-3.3-70b-versatile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (currentSettings.provider) {
      setProvider(currentSettings.provider as ProviderType);
    }
    if (currentSettings.model) {
      setModel(currentSettings.model);
    }
  }, [currentSettings]);

  if (!isOpen) return null;

  const handleProviderChange = (p: ProviderType) => {
    setProvider(p);
    if (p === 'groq') {
      setModel('openai/gpt-oss-120b');
    } else if (p === 'gemini') {
      setModel('gemini-2.0-flash');
    } else if (p === 'openai') {
      setModel('gpt-4o');
    } else {
      setModel('domain-engine');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    try {
      await saveSettings({ provider, apiKey: apiKey || undefined, model });
      setSaveMessage('✓ AI Provider & API Key saved securely!');
      onSettingsUpdated();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch {
      setSaveMessage('Error saving settings. Please verify server connection.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="rounded-2xl w-full max-w-xl p-6 space-y-5 bg-obsidian-950/95 border-2 border-pumpkin-900/80 shadow-glow-pumpkin relative text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-witch-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pumpkin-500/20 border border-pumpkin-500/40 flex items-center justify-center text-pumpkin-400 shadow-glow-pumpkin">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-white tracking-wide">
              AI Provider & LLM Engine Config
            </h2>
            <p className="text-xs text-pumpkin-300/80 font-sans">
              Connect Groq, Gemini, OpenAI, or use the local Sentinel Intelligence engine
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-mono font-bold text-pumpkin-300 mb-2 uppercase tracking-wider">
              Select Brain / LLM Provider
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Groq */}
              <button
                type="button"
                onClick={() => handleProviderChange('groq')}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  provider === 'groq'
                    ? 'border-pumpkin-500 bg-pumpkin-950/60 text-pumpkin-200 shadow-glow-pumpkin'
                    : 'border-witch-850 bg-obsidian-900/70 text-slate-400 hover:border-witch-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-white">Groq</div>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-pumpkin-500 text-obsidian-950 font-bold">
                    FAST
                  </span>
                </div>
                <div className="text-[10px] text-pumpkin-300/80 mt-1 font-mono">Llama 3.3 70B</div>
              </button>

              {/* Local / Built-in Engine */}
              <button
                type="button"
                onClick={() => handleProviderChange('domain_engine')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'domain_engine'
                    ? 'border-pumpkin-500 bg-pumpkin-950/60 text-pumpkin-200 shadow-glow-pumpkin'
                    : 'border-witch-850 bg-obsidian-900/70 text-slate-400 hover:border-witch-700'
                }`}
              >
                <div className="font-bold text-xs text-white">Local Engine</div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Ollama / Air-Gap</div>
              </button>

              {/* Gemini */}
              <button
                type="button"
                onClick={() => handleProviderChange('gemini')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'gemini'
                    ? 'border-pumpkin-500 bg-pumpkin-950/60 text-pumpkin-200 shadow-glow-pumpkin'
                    : 'border-witch-850 bg-obsidian-900/70 text-slate-400 hover:border-witch-700'
                }`}
              >
                <div className="font-bold text-xs text-white">Google Gemini</div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">2.0 Flash / Pro</div>
              </button>

              {/* OpenAI */}
              <button
                type="button"
                onClick={() => handleProviderChange('openai')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'openai'
                    ? 'border-pumpkin-500 bg-pumpkin-950/60 text-pumpkin-200 shadow-glow-pumpkin'
                    : 'border-witch-850 bg-obsidian-900/70 text-slate-400 hover:border-witch-700'
                }`}
              >
                <div className="font-bold text-xs text-white">OpenAI</div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">GPT-4o</div>
              </button>
            </div>
          </div>

          {/* Configuration Fields for Cloud Providers */}
          {provider !== 'domain_engine' ? (
            <div className="p-3.5 rounded-xl bg-obsidian-900/90 border border-witch-800 space-y-3.5">
              {/* API Key */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-mono font-bold text-slate-300">
                    {provider === 'groq' ? 'Groq API Key (gsk_...)' : provider === 'gemini' ? 'Google Gemini API Key' : 'OpenAI API Key'}
                  </label>
                  {provider === 'groq' && (
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-pumpkin-400 hover:text-pumpkin-300 font-mono flex items-center gap-1"
                    >
                      <span>Get Free Key</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    placeholder={
                      currentSettings.hasKey 
                        ? '•••••••••••••••• (Key saved on server — leave empty to keep)' 
                        : provider === 'groq' ? 'gsk_...' : 'Paste your API key here'
                    }
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-obsidian-950 text-slate-100 text-xs border border-witch-700 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-pumpkin-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  Selected Model
                </label>
                {provider === 'groq' ? (
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-obsidian-950 text-slate-100 text-xs border border-witch-700 rounded-lg px-3 py-2 focus:outline-none focus:border-pumpkin-500 font-mono"
                  >
                    <option value="openai/gpt-oss-120b">openai/gpt-oss-120b (Recommended • 120B High Intelligence)</option>
                    <option value="openai/gpt-oss-20b">openai/gpt-oss-20b (20B Fast Reasoning)</option>
                    <option value="qwen/qwen3.8-27b">qwen/qwen3.8-27b (Qwen 27B)</option>
                    <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Meta Llama 3.3 70B)</option>
                    <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (8B • Blazing Speed)</option>
                    <option value="mixtral-8x7b-32768">mixtral-8x7b-32768 (MoE • 32k Large Context)</option>
                  </select>
                ) : provider === 'gemini' ? (
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-obsidian-950 text-slate-100 text-xs border border-witch-700 rounded-lg px-3 py-2 focus:outline-none focus:border-pumpkin-500 font-mono"
                  >
                    <option value="gemini-2.0-flash">gemini-2.0-flash (Recommended)</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                    <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="gpt-4o"
                    className="w-full bg-obsidian-950 text-slate-100 text-xs border border-witch-700 rounded-lg px-3 py-2 focus:outline-none focus:border-pumpkin-500 font-mono"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-obsidian-900/90 border border-witch-800 space-y-1.5">
              <div className="flex items-center gap-2 text-pumpkin-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero External API Required (Local-First MCP)</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Sentinel AI automatically utilizes your local Ollama daemon (<code className="text-pumpkin-300">llama3.2</code>) or the internal sovereign intelligence pipeline for offline execution with zero external network leakage.
              </p>
            </div>
          )}

          {/* Privacy & Security Note */}
          <div className="p-3 rounded-xl bg-witch-950/70 border border-witch-850 flex items-start gap-2.5 text-[11px] text-slate-300">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-pumpkin-400" />
            <span>
              <strong>Security Protocol:</strong> Keys are stored securely server-side and never exposed to browser bundles or network logs. All external MCP actions still require your explicit single-use approval token.
            </span>
          </div>

          {saveMessage && (
            <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-bold font-mono">
              <CheckCircle className="w-4 h-4" />
              <span>{saveMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2.5 pt-2 border-t border-witch-850">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-pumpkin-500 to-pumpkin-600 hover:from-pumpkin-400 hover:to-pumpkin-500 text-obsidian-950 transition-all shadow-glow-pumpkin"
            >
              {isSaving ? 'Saving...' : 'Save & Activate Brain'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
