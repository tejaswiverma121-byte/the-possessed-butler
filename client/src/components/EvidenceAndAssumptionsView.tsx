import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, FileCheck, Edit3, Save } from 'lucide-react';
import { EvidenceAssumptionItem } from '../types';
import { updateAssumption } from '../api';

interface EvidenceAndAssumptionsViewProps {
  projectId: string;
  items?: EvidenceAssumptionItem[];
  onRefresh: () => void;
}

export const EvidenceAndAssumptionsView: React.FC<EvidenceAndAssumptionsViewProps> = ({
  projectId,
  items,
  onRefresh,
}) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [correctionText, setCorrectionText] = useState('');
  const [statusVal, setStatusVal] = useState<'confirmed' | 'disputed' | 'needs_validation'>('confirmed');

  if (!items || items.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
        Compiling evidence and assumption register...
      </div>
    );
  }

  const handleStartEdit = (item: EvidenceAssumptionItem) => {
    setEditingItemId(item.id);
    setCorrectionText(item.userCorrection || '');
    setStatusVal(item.status);
  };

  const handleSaveEdit = async (itemId: string) => {
    try {
      await updateAssumption(projectId, itemId, statusVal, correctionText);
      setEditingItemId(null);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <FileCheck className="w-5 h-5 text-emerald-400" />
          <span>Evidence, Assumptions & Epistemic Boundaries</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The system strictly separates confirmed facts from working assumptions and unverified hypotheses. As a product owner, you can mark items as confirmed or disputed, and supply corrections to refine the solution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => {
          const isEditing = editingItemId === item.id;

          const typeBadge =
            item.type === 'verified_fact'
              ? { label: 'Verified Fact', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' }
              : item.type === 'user_reported'
              ? { label: 'User Reported', color: 'bg-blue-950 text-blue-300 border-blue-800' }
              : item.type === 'inferred'
              ? { label: 'Inferred Model', color: 'bg-purple-950 text-purple-300 border-purple-800' }
              : item.type === 'hypothesis'
              ? { label: 'Hypothesis', color: 'bg-amber-950 text-amber-300 border-amber-800' }
              : { label: 'Critical Unknown', color: 'bg-rose-950 text-rose-300 border-rose-800' };

          const statusBadge =
            item.status === 'confirmed'
              ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800'
              : item.status === 'disputed'
              ? 'bg-rose-900/40 text-rose-400 border border-rose-800'
              : 'bg-amber-900/40 text-amber-400 border border-amber-800';

          return (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${typeBadge.color}`}>
                    {typeBadge.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-medium ${statusBadge}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-100 leading-relaxed">
                  {item.statement}
                </p>

                <div className="text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-500">Source:</span> {item.source}
                </div>

                {item.userCorrection && !isEditing && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/50 text-[11px] text-emerald-300">
                    <span className="font-semibold block text-[10px] uppercase text-emerald-400">Your Correction:</span>
                    {item.userCorrection}
                  </div>
                )}
              </div>

              {/* Edit Controls */}
              {isEditing ? (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                      Status Feedback:
                    </label>
                    <select
                      value={statusVal}
                      onChange={(e) => setStatusVal(e.target.value as any)}
                      className="w-full bg-slate-950 text-slate-200 text-xs border border-slate-700 rounded-lg p-2"
                    >
                      <option value="confirmed">Confirmed Valid</option>
                      <option value="disputed">Disputed / Incorrect</option>
                      <option value="needs_validation">Requires Empirical Field Test</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                      User Note / Correction:
                    </label>
                    <textarea
                      rows={2}
                      value={correctionText}
                      onChange={(e) => setCorrectionText(e.target.value)}
                      placeholder="Add specific context or correct this assumption..."
                      className="w-full bg-slate-950 text-slate-200 text-xs border border-slate-700 rounded-lg p-2"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingItemId(null)}
                      className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-medium transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Adjust / Correct</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
