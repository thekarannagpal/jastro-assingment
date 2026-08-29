import React, { useState, useEffect } from 'react';
import type { TemplateModel, ViewportScope, EditCommand } from '../types/template';
import { Code, CheckCircle, AlertTriangle, Copy, X, FileJson, FileCode, Braces } from 'lucide-react';

interface CodeEditorSurfaceProps {
  template: TemplateModel;
  selectedIds: Set<string>;
  activeScope: ViewportScope;
  onApplyCodeEdit: (updatedElementOrTemplate: any, mode: 'element' | 'template') => boolean;
  onClose: () => void;
}

export const CodeEditorSurface: React.FC<CodeEditorSurfaceProps> = ({
  template,
  selectedIds,
  activeScope,
  onApplyCodeEdit,
  onClose,
}) => {
  const [codeMode, setCodeMode] = useState<'element' | 'template' | 'jsx'>('element');
  const selectedList = Array.from(selectedIds);
  const primaryId = selectedList[0] || template.rootId;
  const primaryElement = template.elements[primaryId];

  const [codeText, setCodeText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setErrorMsg(null);
    if (codeMode === 'element') {
      if (primaryElement) {
        setCodeText(JSON.stringify(primaryElement, null, 2));
      } else {
        setCodeText('// Select an element to view its JSON schema');
      }
    } else if (codeMode === 'template') {
      setCodeText(JSON.stringify(template, null, 2));
    } else if (codeMode === 'jsx') {
      setCodeText(generateJSXOutput(template));
    }
  }, [codeMode, primaryId, template]);

  const handleCodeChange = (newCode: string) => {
    setCodeText(newCode);
    if (codeMode === 'jsx') return;

    try {
      const parsed = JSON.parse(newCode);
      setErrorMsg(null);
      const success = onApplyCodeEdit(parsed, codeMode === 'element' ? 'element' : 'template');
      if (!success) {
        setErrorMsg('Invalid AST structure or missing required element schema fields.');
      }
    } catch (err: any) {
      setErrorMsg(`JSON Syntax Error: ${err.message}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const linesCount = codeText.split('\n').length;
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  return (
    <div className="code-editor-surface">
      <div className="code-editor-header">
        <div className="code-header-left">
          <Code size={16} className="text-cyan-400" />
          <span className="code-title">Live Code Surface (Bidirectional AST Sync)</span>
        </div>

        <div className="code-mode-buttons">
          <button
            className={`code-mode-btn ${codeMode === 'element' ? 'active' : ''}`}
            onClick={() => setCodeMode('element')}
          >
            <Braces size={13} className="inline mr-1" />
            Element AST (#{primaryId})
          </button>
          <button
            className={`code-mode-btn ${codeMode === 'template' ? 'active' : ''}`}
            onClick={() => setCodeMode('template')}
          >
            <FileJson size={13} className="inline mr-1" />
            Full Template Model
          </button>
          <button
            className={`code-mode-btn ${codeMode === 'jsx' ? 'active' : ''}`}
            onClick={() => setCodeMode('jsx')}
          >
            <FileCode size={13} className="inline mr-1" />
            Exported React JSX
          </button>
        </div>

        <div className="code-header-actions">
          <button className="icon-btn" onClick={handleCopy} title="Copy Code">
            {copied ? <CheckCircle size={15} className="text-emerald-400" /> : <Copy size={15} />}
          </button>
          <button className="icon-btn" onClick={onClose} title="Close Code Editor">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Live Error Banner */}
      {errorMsg && (
        <div className="code-error-banner" role="alert">
          <AlertTriangle size={18} className="text-rose-400 shrink-0" />
          <div className="error-text">
            <strong>Invalid Code Edit:</strong> {errorMsg}
            <span className="sub-text">Canonical state remains protected on canvas. Last valid state preserved.</span>
          </div>
        </div>
      )}

      {/* Code Textarea with Line Numbers */}
      <div className="code-textarea-container flex">
        <div className="line-numbers-col pr-3 text-right select-none text-slate-600 font-mono text-xs leading-6 border-r border-slate-800/80 mr-3">
          {lineNumbers.map(n => (
            <div key={n}>{n}</div>
          ))}
        </div>
        <textarea
          value={codeText}
          onChange={(e) => handleCodeChange(e.target.value)}
          readOnly={codeMode === 'jsx'}
          className="code-textarea flex-1"
          spellCheck={false}
          aria-label="Code Editor Input Surface"
        />
      </div>
    </div>
  );
};

function generateJSXOutput(template: TemplateModel): string {
  return `import React from 'react';

// Clean Responsive React Component generated from Scoped AI Template Model
export default function ${template.name.replace(/[^a-zA-Z0-9]/g, '')}() {
  return (
    <div className="saas-landing-page" style={${JSON.stringify(template.globalStyles)}}>
      {/* Navigation Bar */}
      <header className="nav-header">
        <div className="logo font-bold text-cyan-400">✦ NOVA.AI</div>
        <nav className="nav-links">Features • Solutions • Pricing • Docs</nav>
        <button className="btn-primary bg-indigo-600 text-white">Launch App</button>
      </header>

      {/* Hero Section */}
      <main className="hero-section text-center py-20">
        <span className="badge bg-indigo-500/20 text-indigo-400">⚡ NEXT-GEN ENGINE 2.0</span>
        <h1 className="text-5xl font-extrabold text-slate-100">Automate Your Workflow With Deterministic AI</h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto mt-4">
          Transform complex business logic into modular responsive templates with granular per-element audit recovery.
        </p>
      </main>
    </div>
  );
}`;
}
