import React from 'react';
import type { TemplateModel } from '../types/template';
import { TemplateRenderer } from './TemplateRenderer';
import { Monitor, Tablet, Smartphone, Layers, X } from 'lucide-react';

interface MultiViewportViewProps {
  template: TemplateModel;
  selectedIds: Set<string>;
  onSelectElement: (id: string, isAdditive: boolean) => void;
  showScopeDiff: boolean;
  onClose: () => void;
}

export const MultiViewportView: React.FC<MultiViewportViewProps> = ({
  template,
  selectedIds,
  onSelectElement,
  showScopeDiff,
  onClose,
}) => {
  return (
    <div className="multi-viewport-matrix">
      <div className="matrix-header">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-cyan-400" />
          <h3 className="matrix-title">3-Viewport Scope Comparison Matrix</h3>
          <span className="matrix-badge">Custom Added Capability</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="matrix-tip">Compare live Desktop, Tablet, and Mobile resolutions simultaneously.</span>
          <button className="close-matrix-btn" onClick={onClose}>
            <X size={16} />
            <span>Close Matrix</span>
          </button>
        </div>
      </div>

      <div className="matrix-grid">
        {/* Desktop View Column */}
        <div className="matrix-pane pane-desktop">
          <div className="pane-header">
            <Monitor size={16} className="text-indigo-400" />
            <span>Desktop Preview (1440px)</span>
          </div>
          <div className="pane-viewport-frame desktop-frame">
            <TemplateRenderer
              template={template}
              elementId={template.rootId}
              viewport="desktop"
              selectedIds={selectedIds}
              onSelectElement={onSelectElement}
              showScopeDiff={showScopeDiff}
            />
          </div>
        </div>

        {/* Tablet View Column */}
        <div className="matrix-pane pane-tablet">
          <div className="pane-header">
            <Tablet size={16} className="text-sky-400" />
            <span>Tablet Preview (768px)</span>
          </div>
          <div className="pane-viewport-frame tablet-frame">
            <TemplateRenderer
              template={template}
              elementId={template.rootId}
              viewport="tablet"
              selectedIds={selectedIds}
              onSelectElement={onSelectElement}
              showScopeDiff={showScopeDiff}
            />
          </div>
        </div>

        {/* Mobile View Column */}
        <div className="matrix-pane pane-mobile">
          <div className="pane-header">
            <Smartphone size={16} className="text-emerald-400" />
            <span>Mobile Preview (375px)</span>
          </div>
          <div className="pane-viewport-frame mobile-frame">
            <TemplateRenderer
              template={template}
              elementId={template.rootId}
              viewport="mobile"
              selectedIds={selectedIds}
              onSelectElement={onSelectElement}
              showScopeDiff={showScopeDiff}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
