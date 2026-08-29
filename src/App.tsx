import React, { useState, useEffect } from 'react';
import type { TemplateModel, ViewportType, ViewportScope, EditCommand, AIProposalResult, AIProposalItem } from './types/template';
import { baselineTemplate } from './data/baselineTemplate';
import { applyEditCommand } from './utils/editPipeline';

import { TopNavbar } from './components/TopNavbar';
import { CanvasPreview } from './components/CanvasPreview';
import { InspectorSidebar } from './components/InspectorSidebar';
import { CodeEditorSurface } from './components/CodeEditorSurface';
import { AIDemoPanel } from './components/AIDemoPanel';
import { ProposalReviewModal } from './components/ProposalReviewModal';
import { HistoryRecoveryDrawer } from './components/HistoryRecoveryDrawer';
import { MultiViewportView } from './components/MultiViewportView';

const STORAGE_KEY = 'scoped_ai_template_editor_state';

export function App() {
  // 1. Template Canonical State with LocalStorage Persistence
  const [template, setTemplate] = useState<TemplateModel>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load saved state from LocalStorage:', e);
    }
    return baselineTemplate;
  });

  const [activeViewport, setActiveViewport] = useState<ViewportType>('desktop');
  const [activeScope, setActiveScope] = useState<ViewportScope>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['hero-heading']));

  const [showCodeEditor, setShowCodeEditor] = useState<boolean>(false);
  const [showScopeDiff, setShowScopeDiff] = useState<boolean>(true);
  const [showMultiView, setShowMultiView] = useState<boolean>(false);

  const [activeProposal, setActiveProposal] = useState<AIProposalResult | null>(null);
  const [historyDrawerElementId, setHistoryDrawerElementId] = useState<string | null>(null);
  const [lastPersistedTime, setLastPersistedTime] = useState<string>(new Date().toLocaleTimeString());

  // Auto-persist template changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(template));
      setLastPersistedTime(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [template]);

  // Selection handlers
  const handleSelectElement = (id: string, isAdditive: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(isAdditive ? prev : []);
      if (isAdditive && next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleSetSelectedSet = (ids: Set<string>) => {
    setSelectedIds(ids);
  };

  // Edit Execution Pipeline
  const handleApplyEdit = (command: EditCommand) => {
    const { updatedTemplate, errors } = applyEditCommand(template, command);
    if (errors.length === 0) {
      setTemplate(updatedTemplate);
    } else {
      console.error('Edit command rejected by validation pipeline:', errors);
    }
  };

  const handleInlineContentEdit = (id: string, newText: string) => {
    const el = template.elements[id];
    if (!el) return;
    const cat = el.content.linkText ? 'linkText' : el.content.badge ? 'badge' : 'text';

    const command: EditCommand = {
      id: `cmd-inline-${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: 'manual',
      targetIds: [id],
      viewportScope: activeScope,
      changes: {
        [id]: { content: { [cat]: newText } }
      },
      description: `Inline text edit on #${id}`
    };
    handleApplyEdit(command);
  };

  const handleApplyCodeEdit = (parsedObj: any, mode: 'element' | 'template'): boolean => {
    if (mode === 'template') {
      if (parsedObj && parsedObj.elements && parsedObj.rootId) {
        setTemplate(parsedObj);
        return true;
      }
      return false;
    } else if (mode === 'element') {
      if (parsedObj && parsedObj.id && template.elements[parsedObj.id]) {
        const nextElements = { ...template.elements, [parsedObj.id]: parsedObj };
        setTemplate({ ...template, version: template.version + 1, elements: nextElements });
        return true;
      }
      return false;
    }
    return false;
  };

  // AI Proposal Handler
  const handleApplyAcceptedAIProposals = (acceptedItems: AIProposalItem[], scope: ViewportScope) => {
    let currentTemplate = template;
    for (const item of acceptedItems) {
      const command: EditCommand = {
        id: `cmd-ai-${item.elementId}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        source: 'ai',
        targetIds: [item.elementId],
        viewportScope: scope,
        changes: {
          [item.elementId]: item.proposed
        },
        description: `Accepted AI Proposal (${item.reasoning})`
      };
      const { updatedTemplate, errors } = applyEditCommand(currentTemplate, command);
      if (errors.length === 0) {
        currentTemplate = updatedTemplate;
      }
    }
    setTemplate(currentTemplate);
  };

  const handleResetTemplate = () => {
    if (window.confirm('Reset template to baseline pristine state? All custom edits will be cleared.')) {
      setTemplate(baselineTemplate);
      localStorage.removeItem(STORAGE_KEY);
      setSelectedIds(new Set(['hero-heading']));
    }
  };

  return (
    <div className="app-editor-shell">
      {/* Top Navbar Header */}
      <TopNavbar
        activeViewport={activeViewport}
        setActiveViewport={setActiveViewport}
        activeScope={activeScope}
        setActiveScope={setActiveScope}
        showCodeEditor={showCodeEditor}
        setShowCodeEditor={setShowCodeEditor}
        showScopeDiff={showScopeDiff}
        setShowScopeDiff={setShowScopeDiff}
        showMultiView={showMultiView}
        setShowMultiView={setShowMultiView}
        onResetTemplate={handleResetTemplate}
        selectedCount={selectedIds.size}
        lastPersistedTime={lastPersistedTime}
      />

      {/* Main Workspace Body */}
      <div className="editor-workspace">
        {showMultiView ? (
          <MultiViewportView
            template={template}
            selectedIds={selectedIds}
            onSelectElement={handleSelectElement}
            showScopeDiff={showScopeDiff}
            onClose={() => setShowMultiView(false)}
          />
        ) : (
          <div className="canvas-and-ai-container">
            {/* Center Canvas Preview Stage */}
            <CanvasPreview
              template={template}
              viewport={activeViewport}
              selectedIds={selectedIds}
              onSelectElement={handleSelectElement}
              onClearSelection={handleClearSelection}
              onSetSelectedSet={handleSetSelectedSet}
              onInlineContentEdit={handleInlineContentEdit}
              showScopeDiff={showScopeDiff}
            />

            {/* Bottom Deterministic AI Demo Engine */}
            <AIDemoPanel
              template={template}
              selectedIds={selectedIds}
              activeScope={activeScope}
              onRunProposal={(proposal) => setActiveProposal(proposal)}
            />
          </div>
        )}

        {/* Right Inspector Sidebar */}
        <InspectorSidebar
          template={template}
          selectedIds={selectedIds}
          activeViewport={activeViewport}
          activeScope={activeScope}
          onApplyEdit={handleApplyEdit}
          onSelectElement={handleSelectElement}
          onOpenHistoryDrawer={(id) => setHistoryDrawerElementId(id)}
        />
      </div>

      {/* Live Code Surface Overlay/Panel */}
      {showCodeEditor && (
        <CodeEditorSurface
          template={template}
          selectedIds={selectedIds}
          activeScope={activeScope}
          onApplyCodeEdit={handleApplyCodeEdit}
          onClose={() => setShowCodeEditor(false)}
        />
      )}

      {/* AI Proposal Review Modal */}
      {activeProposal && (
        <ProposalReviewModal
          proposal={activeProposal}
          onClose={() => setActiveProposal(null)}
          onApplyAccepted={handleApplyAcceptedAIProposals}
        />
      )}

      {/* History Recovery Drawer */}
      {historyDrawerElementId && (
        <HistoryRecoveryDrawer
          template={template}
          elementId={historyDrawerElementId}
          onClose={() => setHistoryDrawerElementId(null)}
          onRestoreCompleted={(updated) => setTemplate(updated)}
        />
      )}
    </div>
  );
}

export default App;
