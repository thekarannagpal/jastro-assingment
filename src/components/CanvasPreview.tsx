import React, { useRef, useState, useEffect } from 'react';
import type { TemplateModel, ViewportType } from '../types/template';
import { TemplateRenderer } from './TemplateRenderer';
import { CheckSquare } from 'lucide-react';

interface CanvasPreviewProps {
  template: TemplateModel;
  viewport: ViewportType;
  selectedIds: Set<string>;
  onSelectElement: (id: string, isAdditive: boolean) => void;
  onClearSelection: () => void;
  onSetSelectedSet: (ids: Set<string>) => void;
  onInlineContentEdit?: (id: string, newText: string) => void;
  showScopeDiff?: boolean;
}

interface MarqueeBox {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  template,
  viewport,
  selectedIds,
  onSelectElement,
  onClearSelection,
  onSetSelectedSet,
  onInlineContentEdit,
  showScopeDiff,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMarqueeActive, setIsMarqueeActive] = useState(false);
  const [marqueeBox, setMarqueeBox] = useState<MarqueeBox | null>(null);

  // Viewport container width styling
  const getViewportWidth = () => {
    switch (viewport) {
      case 'desktop':
        return '1440px';
      case 'tablet':
        return '768px';
      case 'mobile':
        return '375px';
      default:
        return '100%';
    }
  };

  // Marquee mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only initiate marquee if clicking background container (not an element inside)
    const targetEl = e.target as HTMLElement;
    if (targetEl.closest('.canvas-element')) {
      return;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsMarqueeActive(true);
    setMarqueeBox({ startX: x, startY: y, currentX: x, currentY: y });

    if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
      onClearSelection();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMarqueeActive || !marqueeBox || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    setMarqueeBox({ ...marqueeBox, currentX: x, currentY: y });

    // Compute bounding rect intersection with canvas elements
    const left = Math.min(marqueeBox.startX, x);
    const top = Math.min(marqueeBox.startY, y);
    const right = Math.max(marqueeBox.startX, x);
    const bottom = Math.max(marqueeBox.startY, y);

    const intersectedIds = new Set<string>(e.shiftKey ? Array.from(selectedIds) : []);
    const elementNodes = containerRef.current.querySelectorAll('.canvas-element[data-element-id]');

    elementNodes.forEach((node) => {
      const id = node.getAttribute('data-element-id');
      if (!id || id === 'root') return;

      const nodeRect = node.getBoundingClientRect();
      const relativeNodeLeft = nodeRect.left - rect.left;
      const relativeNodeTop = nodeRect.top - rect.top;
      const relativeNodeRight = relativeNodeLeft + nodeRect.width;
      const relativeNodeBottom = relativeNodeTop + nodeRect.height;

      // Check box intersection
      const isIntersecting =
        relativeNodeLeft < right &&
        relativeNodeRight > left &&
        relativeNodeTop < bottom &&
        relativeNodeBottom > top;

      if (isIntersecting) {
        intersectedIds.add(id);
      }
    });

    onSetSelectedSet(intersectedIds);
  };

  const handleMouseUp = () => {
    setIsMarqueeActive(false);
    setMarqueeBox(null);
  };

  // Keyboard navigation & hotkeys
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClearSelection();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onClearSelection]);

  const marqueeStyle: React.CSSProperties = marqueeBox
    ? {
        left: `${Math.min(marqueeBox.startX, marqueeBox.currentX)}px`,
        top: `${Math.min(marqueeBox.startY, marqueeBox.currentY)}px`,
        width: `${Math.abs(marqueeBox.currentX - marqueeBox.startX)}px`,
        height: `${Math.abs(marqueeBox.currentY - marqueeBox.startY)}px`,
      }
    : {};

  return (
    <div className="canvas-stage-wrapper" onClick={() => {}}>
      {/* Canvas Meta Header */}
      <div className="canvas-meta-bar">
        <div className="viewport-badge">
          <span className="dot active-dot" />
          <span>Viewport: <strong>{viewport.toUpperCase()}</strong> ({getViewportWidth()})</span>
        </div>

        <div className="selection-status-badge">
          <CheckSquare size={14} className="text-cyan-400" />
          <span>
            {selectedIds.size === 0
              ? 'No Selection (Click element or drag box)'
              : `${selectedIds.size} Element${selectedIds.size > 1 ? 's' : ''} Selected`}
          </span>
          {selectedIds.size > 0 && (
            <button className="clear-sel-btn" onClick={onClearSelection} title="Clear selection (Esc)">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Canvas Viewport Frame */}
      <div className="canvas-frame-container">
        <div
          ref={containerRef}
          className="canvas-viewport-frame"
          style={{ width: getViewportWidth() }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Marquee Box Selection Overlay */}
          {isMarqueeActive && marqueeBox && (
            <div className="drag-marquee-overlay" style={marqueeStyle} />
          )}

          {/* Root Render Tree */}
          <TemplateRenderer
            template={template}
            elementId={template.rootId}
            viewport={viewport}
            selectedIds={selectedIds}
            onSelectElement={onSelectElement}
            onInlineContentEdit={onInlineContentEdit}
            showScopeDiff={showScopeDiff}
          />
        </div>
      </div>
    </div>
  );
};
