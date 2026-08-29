import React from 'react';
import type { ViewportType, ViewportScope } from '../types/template';
import { Monitor, Tablet, Smartphone, RotateCcw, Sparkles, Layers, Code, CheckCircle2, ShieldCheck, Eye } from 'lucide-react';

interface TopNavbarProps {
  activeViewport: ViewportType;
  setActiveViewport: (v: ViewportType) => void;
  activeScope: ViewportScope;
  setActiveScope: (s: ViewportScope) => void;
  showCodeEditor: boolean;
  setShowCodeEditor: (val: boolean) => void;
  showScopeDiff: boolean;
  setShowScopeDiff: (val: boolean) => void;
  showMultiView: boolean;
  setShowMultiView: (val: boolean) => void;
  onResetTemplate: () => void;
  selectedCount: number;
  lastPersistedTime: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeViewport,
  setActiveViewport,
  activeScope,
  setActiveScope,
  showCodeEditor,
  setShowCodeEditor,
  showScopeDiff,
  setShowScopeDiff,
  showMultiView,
  setShowMultiView,
  onResetTemplate,
  selectedCount,
  lastPersistedTime,
}) => {
  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <div className="brand-logo">
          <div className="brand-icon">
            <Sparkles size={18} className="text-cyan-400" />
          </div>
          <div>
            <span className="brand-title">Scoped AI Editor</span>
            <span className="brand-subtitle">Responsive Template Builder</span>
          </div>
        </div>

        <div className="navbar-divider" />

        {/* Viewport Switcher */}
        <div className="viewport-switcher" role="group" aria-label="Viewport Preview Switcher">
          <button
            className={`viewport-btn ${activeViewport === 'desktop' && !showMultiView ? 'active' : ''}`}
            onClick={() => { setActiveViewport('desktop'); setShowMultiView(false); }}
            title="Desktop Viewport (1440px)"
          >
            <Monitor size={15} />
            <span>Desktop</span>
            <span className="dim-text">1440px</span>
          </button>
          <button
            className={`viewport-btn ${activeViewport === 'tablet' && !showMultiView ? 'active' : ''}`}
            onClick={() => { setActiveViewport('tablet'); setShowMultiView(false); }}
            title="Tablet Viewport (768px)"
          >
            <Tablet size={15} />
            <span>Tablet</span>
            <span className="dim-text">768px</span>
          </button>
          <button
            className={`viewport-btn ${activeViewport === 'mobile' && !showMultiView ? 'active' : ''}`}
            onClick={() => { setActiveViewport('mobile'); setShowMultiView(false); }}
            title="Mobile Viewport (375px)"
          >
            <Smartphone size={15} />
            <span>Mobile</span>
            <span className="dim-text">375px</span>
          </button>
          <button
            className={`viewport-btn ${showMultiView ? 'active' : ''}`}
            onClick={() => setShowMultiView(!showMultiView)}
            title="Side-by-Side Multi Viewport Matrix"
          >
            <Eye size={15} />
            <span>3-View Compare</span>
          </button>
        </div>
      </div>

      <div className="navbar-right">
        {/* Active Edit Scope Selector */}
        <div className="scope-selector-container">
          <span className="scope-label">Target Edit Scope:</span>
          <select
            value={activeScope}
            onChange={(e) => setActiveScope(e.target.value as ViewportScope)}
            className={`scope-select scope-${activeScope}`}
            aria-label="Target Viewport Scope for Edits"
          >
            <option value="all">🌐 All Views (Base)</option>
            <option value="desktop">🖥 Desktop Scope Only</option>
            <option value="tablet">📱 Tablet Scope Only</option>
            <option value="mobile">📲 Mobile Scope Only</option>
          </select>
        </div>

        {/* Custom Added Capability Toggle */}
        <button
          className={`nav-action-btn ${showScopeDiff ? 'active-diff' : ''}`}
          onClick={() => setShowScopeDiff(!showScopeDiff)}
          title="Toggle Scope-Diff Overlay to highlight viewport-specific modifications"
        >
          <Layers size={15} />
          <span>Scope Diff</span>
        </button>

        {/* Code Surface Toggle */}
        <button
          className={`nav-action-btn ${showCodeEditor ? 'active' : ''}`}
          onClick={() => setShowCodeEditor(!showCodeEditor)}
          title="Toggle Live Code & AST Editor Surface"
        >
          <Code size={15} />
          <span>Code Editor</span>
        </button>

        {/* Reset Template */}
        <button
          className="nav-action-btn reset-btn"
          onClick={onResetTemplate}
          title="Reset template to baseline default state"
        >
          <RotateCcw size={15} />
          <span>Reset</span>
        </button>

        {/* Persistence Indicator */}
        <div className="persist-badge" title={`Auto-saved at ${lastPersistedTime}`}>
          <CheckCircle2 size={13} className="text-emerald-400" />
          <span>Saved</span>
        </div>
      </div>
    </header>
  );
};
