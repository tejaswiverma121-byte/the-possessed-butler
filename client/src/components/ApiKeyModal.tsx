import React, { useState } from 'react';
import { X, ShieldCheck, Key, CheckCircle, AlertTriangle } from 'lucide-react';
import { saveSettings } from '../api';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: { provider: string; hasKey: boolean; model: string };
  onSettingsUpdated: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSettingsUpdated,
}) => {
  const [provider, setProvider] = useState<'domain_engine' | 'gemini' | 'openai'>(
    (currentSettings.provider as any) || 'domain_engine'
  );
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(currentSettings.model || 'gemini-2.0-flash');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    try {
      await saveSettings({ provider, apiKey: apiKey || undefined, model });
      setSaveMessage('Credentials saved securely on server.');
      onSettingsUpdated();
      setTimeout(() => {
        onClose();
      }, 900);
    } catch {
      setSaveMessage('Error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-card rounded-2xl w-full max-w-lg p-6 space-y-5 border border-slate-700/80 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Provider & Orchestrator Config</h2>
            <p className="text-xs text-slate-400">Configure real LLM keys or use the Built-in Domain Engine</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Select Provider</label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setProvider('domain_engine')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'domain_engine'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-xs">Domain Engine</div>
                <div className="text-[10px] opacity-80 mt-0.5">Safe Built-in</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'gemini'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-xs">Google Gemini</div>
                <div className="text-[10px] opacity-80 mt-0.5">Flash / Pro</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'openai'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-xs">OpenAI</div>
                <div className="text-[10px] opacity-80 mt-0.5">GPT-4o</div>
              </button>
            </div>
          </div>

          {provider !== 'domain_engine' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {provider === 'gemini' ? 'Gemini API Key' : 'OpenAI API Key'}
                </label>
                <input
                  type="password"
                  placeholder="Paste API key (never stored in client or browser storage)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 text-xs border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Model Name</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder={provider === 'gemini' ? 'gemini-2.0-flash' : 'gpt-4o'}
                  className="w-full bg-slate-900 text-slate-100 text-xs border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero External API Required</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                The Built-in High-Fidelity Domain Intelligence Engine uses verified domain ontologies, 5-whys root-cause trees, fishbone decompositions, and automated test runners without incurring API costs.
              </p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 flex items-start gap-2.5 text-[11px] text-amber-300/90">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Security Guarantee:</strong> Keys are kept purely server-side in memory, never written to disk, and never exposed in browser bundles, previews, or prompts.
            </span>
          </div>

          {saveMessage && (
            <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>{saveMessage}</span>
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20"
            >
              {isSaving ? 'Saving...' : 'Apply Provider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
