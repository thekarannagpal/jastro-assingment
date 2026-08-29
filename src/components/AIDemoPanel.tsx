import React, { useState } from 'react';
import type { ViewportScope, TemplateModel, AIProposalResult } from '../types/template';
import { PRESET_DEMO_PROMPTS, runAIDemoScenario } from '../utils/aiDemoEngine';
import { Sparkles, ShieldAlert, CheckCircle, Sparkle } from 'lucide-react';

interface AIDemoPanelProps {
  template: TemplateModel;
  selectedIds: Set<string>;
  activeScope: ViewportScope;
  onRunProposal: (result: AIProposalResult) => void;
}

export const AIDemoPanel: React.FC<AIDemoPanelProps> = ({
  template,
  selectedIds,
  activeScope,
  onRunProposal,
}) => {
  const [promptText, setPromptText] = useState('');
  const [targetScope, setTargetScope] = useState<ViewportScope>(activeScope);
  const selectedList = Array.from(selectedIds);

  const handleRun = (customPrompt?: string, customScope?: ViewportScope) => {
    const textToRun = customPrompt || promptText;
    const scopeToRun = customScope || targetScope;
    if (!textToRun.trim()) return;

    const result = runAIDemoScenario(textToRun, selectedList, scopeToRun, template);
    onRunProposal(result);
  };

  return (
    <div className="ai-demo-panel">
      <div className="panel-header">
        <div className="flex items-center gap-3">
          <div className="ai-sparkle-badge">
            <Sparkles size={18} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="panel-title flex items-center gap-2">
              <span>Deterministic AI Scenario Engine</span>
              <span className="text-[10px] font-extrabold bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">SCOPE SAFE</span>
            </h3>
            <span className="panel-subtitle">Text-driven proposals targeting selected element bounds</span>
          </div>
        </div>
      </div>

      {/* Target Selection Authority Bar */}
      <div className="selection-authority-bar">
        <span className="text-slate-400 font-semibold">Selection Authority:</span>
        {selectedList.length === 0 ? (
          <span className="no-sel-badge flex items-center gap-1">
            <ShieldAlert size={14} />
            <span>Selection Required (Click elements on canvas first)</span>
          </span>
        ) : (
          <span className="sel-target-list flex items-center gap-1.5">
            <CheckCircle size={14} className="text-cyan-400" />
            <span>
              {selectedList.length} Selected Target{selectedList.length > 1 ? 's' : ''}:{' '}
              <strong className="font-mono text-white">{selectedList.map(id => `#${id}`).join(', ')}</strong>
            </span>
          </span>
        )}
      </div>

      {/* Instruction Input Form */}
      <div className="ai-form-container">
        <div className="form-group mb-0">
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="ai-prompt-input" className="text-xs font-bold text-slate-300">
              Text Instruction
            </label>
            <div className="scope-inline-picker flex items-center gap-1.5 text-xs text-slate-400">
              <span>Target Viewport Scope:</span>
              <select
                value={targetScope}
                onChange={(e) => setTargetScope(e.target.value as ViewportScope)}
                className="mini-scope-select"
                aria-label="Target scope for AI proposal"
              >
                <option value="all">🌐 All Views (Base)</option>
                <option value="desktop">🖥 Desktop Scope</option>
                <option value="tablet">📱 Tablet Scope</option>
                <option value="mobile">📲 Mobile Scope</option>
              </select>
            </div>
          </div>

          <div className="prompt-input-wrapper">
            <textarea
              id="ai-prompt-input"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Enter instruction e.g. Apply vibrant purple glassmorphism background and rewrite headline..."
              rows={2}
              className="prompt-textarea"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleRun();
                }
              }}
            />
            <button
              className="run-prompt-btn"
              onClick={() => handleRun()}
              disabled={!promptText.trim()}
              title="Run AI Proposal (Enter)"
            >
              <Sparkle size={15} />
              <span>Generate Proposal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviewer Predefined Scenarios */}
      <div className="preset-scenarios-section">
        <h4 className="section-subtitle flex items-center gap-1.5">
          <span>Reviewer Predefined Scenarios</span>
          <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-normal">Click to Run</span>
        </h4>
        <div className="presets-grid">
          {PRESET_DEMO_PROMPTS.map((preset) => (
            <button
              key={preset.id}
              className={`preset-card category-${preset.category}`}
              onClick={() => {
                setPromptText(preset.prompt);
                setTargetScope(preset.suggestedScope);
                handleRun(preset.prompt, preset.suggestedScope);
              }}
            >
              <div className="preset-card-top">
                <span className="preset-cat-tag">{preset.category.toUpperCase()}</span>
                <span className="preset-scope-tag">Scope: {preset.suggestedScope}</span>
              </div>
              <div className="preset-title">{preset.title}</div>
              <div className="preset-desc">{preset.description}</div>
              <div className="preset-prompt-preview">"{preset.prompt}"</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
