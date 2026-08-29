import React, { useState } from 'react';
import type { TemplateModel, ViewportType, TemplateElement } from '../types/template';
import { resolveElementForViewport } from '../utils/viewportResolver';
import { Sparkles, Layers, Cpu, RotateCcw } from 'lucide-react';

interface TemplateRendererProps {
  template: TemplateModel;
  elementId: string;
  viewport: ViewportType;
  selectedIds: Set<string>;
  onSelectElement: (id: string, isAdditive: boolean) => void;
  onInlineContentEdit?: (id: string, newText: string) => void;
  showScopeDiff?: boolean;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  template,
  elementId,
  viewport,
  selectedIds,
  onSelectElement,
  onInlineContentEdit,
  showScopeDiff,
}) => {
  const element = template.elements[elementId];
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [inlineValue, setInlineValue] = useState('');

  if (!element) return null;

  const resolved = resolveElementForViewport(element, viewport);
  const isSelected = selectedIds.has(element.id);
  const hasScopeOverride = resolved.hasViewportOverride;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isAdditive = e.shiftKey || e.ctrlKey || e.metaKey;
    onSelectElement(element.id, isAdditive);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.content.text || element.content.linkText || element.content.badge) {
      setIsEditingInline(true);
      setInlineValue(element.content.text || element.content.linkText || element.content.badge || '');
    }
  };

  const handleInlineBlur = () => {
    setIsEditingInline(false);
    if (onInlineContentEdit && inlineValue !== (element.content.text || element.content.linkText || element.content.badge)) {
      onInlineContentEdit(element.id, inlineValue);
    }
  };

  const handleInlineKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleInlineBlur();
    } else if (e.key === 'Escape') {
      setIsEditingInline(false);
    }
  };

  // Convert resolved style & layout to React CSSProperties
  const computedCss: React.CSSProperties = {
    ...resolved.style,
    ...resolved.layout,
    position: (resolved.layout.position as React.CSSProperties['position']) || 'relative',
    boxSizing: 'border-box',
    transition: 'all 0.15s ease-in-out',
  };

  const selectionClassName = `canvas-element element-type-${element.type} ${isSelected ? 'selected' : ''} ${hasScopeOverride && showScopeDiff ? 'has-scope-diff' : ''}`;

  // Helper to render child elements recursively
  const renderChildren = () => {
    if (!element.children || element.children.length === 0) return null;
    return element.children.map((childId) => (
      <TemplateRenderer
        key={childId}
        template={template}
        elementId={childId}
        viewport={viewport}
        selectedIds={selectedIds}
        onSelectElement={onSelectElement}
        onInlineContentEdit={onInlineContentEdit}
        showScopeDiff={showScopeDiff}
      />
    ));
  };

  // Render element based on type
  const renderContent = () => {
    const { content } = resolved;

    switch (element.type) {
      case 'heading':
        return (
          <>
            {isEditingInline ? (
              <input
                type="text"
                value={inlineValue}
                onChange={(e) => setInlineValue(e.target.value)}
                onBlur={handleInlineBlur}
                onKeyDown={handleInlineKeyDown}
                autoFocus
                className="inline-text-input"
              />
            ) : (
              <span>{content.text || element.name}</span>
            )}
            {renderChildren()}
          </>
        );

      case 'text':
        return (
          <>
            {isEditingInline ? (
              <textarea
                value={inlineValue}
                onChange={(e) => setInlineValue(e.target.value)}
                onBlur={handleInlineBlur}
                onKeyDown={handleInlineKeyDown}
                autoFocus
                className="inline-textarea-input"
              />
            ) : (
              <span>{content.text || element.name}</span>
            )}
            {renderChildren()}
          </>
        );

      case 'badge':
        return (
          <>
            <span>{content.badge || content.text || 'BADGE'}</span>
            {renderChildren()}
          </>
        );

      case 'button':
        return (
          <div className="rendered-btn-wrapper">
            {isEditingInline ? (
              <input
                type="text"
                value={inlineValue}
                onChange={(e) => setInlineValue(e.target.value)}
                onBlur={handleInlineBlur}
                onKeyDown={handleInlineKeyDown}
                autoFocus
                className="inline-text-input"
              />
            ) : (
              <span>{content.linkText || content.text || 'Button'}</span>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="image-wrapper">
            <img
              src={content.imageUrl || 'https://via.placeholder.com/800x400'}
              alt={content.imageAlt || element.name}
              style={{ width: '100%', height: 'auto', borderRadius: resolved.style.borderRadius || '8px' }}
            />
          </div>
        );

      case 'card':
        return (
          <div className="card-inner-container">
            {content.badge && <span className="card-badge">{content.badge}</span>}
            {content.text && <h4 className="card-title">{content.text}</h4>}
            {content.tagline && <p className="card-tagline">{content.tagline}</p>}
            {content.listItems && content.listItems.length > 0 && (
              <ul className="card-list">
                {content.listItems.map((item, idx) => (
                  <li key={idx}>✓ {item}</li>
                ))}
              </ul>
            )}
            {content.linkText && <div className="card-link">{content.linkText}</div>}
            {renderChildren()}
          </div>
        );

      default:
        return renderChildren();
    }
  };

  return (
    <div
      id={`element-${element.id}`}
      data-element-id={element.id}
      className={selectionClassName}
      style={computedCss}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      tabIndex={0}
      role="button"
      aria-label={`${element.name} (${element.type})`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectElement(element.id, e.shiftKey);
        }
      }}
    >
      {/* Selection Label Badge */}
      {isSelected && (
        <div className="selection-badge">
          <span className="badge-id">{element.id}</span>
          <span className="badge-type">{element.type}</span>
          {element.revision > 1 && <span className="badge-rev">v{element.revision}</span>}
        </div>
      )}

      {/* Custom Added Capability: Scope Diff Badge */}
      {showScopeDiff && hasScopeOverride && (
        <div className="scope-diff-indicator" title={`Has ${viewport.toUpperCase()} override`}>
          <Layers size={11} />
          <span>{viewport.toUpperCase()} OVERRIDE</span>
        </div>
      )}

      {renderContent()}
    </div>
  );
};
