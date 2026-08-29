import React, { useState } from 'react';
import type { TemplateModel, ViewportScope, ElementHistoryEntry } from '../types/template';
import { restoreElementToHistoryEntry } from '../utils/historyManager';
import { RotateCcw, X, History, CheckCircle2, Calendar } from 'lucide-react';

interface HistoryRecoveryDrawerProps {
  template: TemplateModel;
  elementId: string | null;
  onClose: () => void;
  onRestoreCompleted: (updatedTemplate: TemplateModel) => void;
}

export const HistoryRecoveryDrawer: React.FC<HistoryRecoveryDrawerProps> = ({
  template,
  elementId,
  onClose,
  onRestoreCompleted,
}) => {
  const [scopeFilter, setScopeFilter] = useState<ViewportScope | 'all_views'>('all_views');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  if (!elementId || !template.elements[elementId]) return null;

  const element = template.elements[elementId];
  const history = element.history || [];

  // Filter history entries
  const filteredHistory = history.filter((entry) => {
    if (scopeFilter === 'all_views') return true;
    return entry.scope === scopeFilter;
  });

  const handleRestore = (entry: ElementHistoryEntry) => {
    const targetScope: ViewportScope = entry.scope === 'all' ? 'all' : entry.scope;
    const { updatedTemplate, error } = restoreElementToHistoryEntry(
      template,
      elementId,
      entry.id,
      targetScope
    );

    if (!error) {
      onRestoreCompleted(updatedTemplate);
      setSuccessBanner(`Restored ${element.name} (${targetScope} scope) to commit ${new Date(entry.timestamp).toLocaleTimeString()}`);
      setTimeout(() => setSuccessBanner(null), 4000);
    }
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="history-drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Element Recovery Audit Trail">
        <div className="drawer-header">
          <div className="drawer-title-group">
            <div className="history-icon-circle">
              <History size={18} className="text-cyan-400" />
            </div>
            <div>
              <h3>Per-Element Recovery Audit</h3>
              <span className="drawer-subtitle">
                Target Element: <strong>{element.name}</strong> (#{element.id})
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Scope Filter Switcher */}
        <div className="drawer-filter-bar">
          <span className="filter-label">Filter Timeline Scope:</span>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${scopeFilter === 'all_views' ? 'active' : ''}`}
              onClick={() => setScopeFilter('all_views')}
            >
              All Entries
            </button>
            <button
              className={`filter-btn ${scopeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setScopeFilter('all')}
            >
              Base Scope
            </button>
            <button
              className={`filter-btn ${scopeFilter === 'desktop' ? 'active' : ''}`}
              onClick={() => setScopeFilter('desktop')}
            >
              Desktop
            </button>
            <button
              className={`filter-btn ${scopeFilter === 'tablet' ? 'active' : ''}`}
              onClick={() => setScopeFilter('tablet')}
            >
              Tablet
            </button>
            <button
              className={`filter-btn ${scopeFilter === 'mobile' ? 'active' : ''}`}
              onClick={() => setScopeFilter('mobile')}
            >
              Mobile
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {successBanner && (
          <div className="restore-success-banner" role="status">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{successBanner}</span>
          </div>
        )}

        {/* History Timeline */}
        <div className="timeline-container">
          {filteredHistory.length === 0 ? (
            <div className="empty-timeline">
              <p>No history entries match the selected scope filter.</p>
            </div>
          ) : (
            filteredHistory.map((entry, idx) => (
              <div key={entry.id} className="timeline-card">
                <div className="timeline-card-header">
                  <div className="entry-meta">
                    <span className={`source-badge source-${entry.source}`}>{entry.source.toUpperCase()}</span>
                    <span className={`scope-badge scope-${entry.scope}`}>Scope: {entry.scope.toUpperCase()}</span>
                    {idx === 0 && <span className="current-head-tag">CURRENT REV</span>}
                  </div>
                  <span className="entry-time">
                    <Calendar size={12} />
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="entry-description">{entry.description}</div>

                {/* Snapshot Preview */}
                <details className="snapshot-preview-details">
                  <summary>View Snapshot JSON</summary>
                  <pre className="snapshot-pre">{JSON.stringify(entry.snapshot, null, 2)}</pre>
                </details>

                <div className="timeline-card-footer">
                  <button
                    className="restore-entry-btn"
                    onClick={() => handleRestore(entry)}
                    title="Restore element properties to this exact commit snapshot"
                  >
                    <RotateCcw size={13} />
                    <span>Restore This Revision</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
};
