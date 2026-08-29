import React, { useState } from 'react';
import type { TemplateModel, ViewportScope, ViewportType, EditCommand } from '../types/template';
import { resolveElementForViewport } from '../utils/viewportResolver';
import { Sliders, Layers, Eye, History, ChevronRight, ChevronDown, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface InspectorSidebarProps {
  template: TemplateModel;
  selectedIds: Set<string>;
  activeViewport: ViewportType;
  activeScope: ViewportScope;
  onApplyEdit: (command: EditCommand) => void;
  onSelectElement: (id: string, isAdditive: boolean) => void;
  onOpenHistoryDrawer: (elementId: string) => void;
}

export const InspectorSidebar: React.FC<InspectorSidebarProps> = ({
  template,
  selectedIds,
  activeViewport,
  activeScope,
  onApplyEdit,
  onSelectElement,
  onOpenHistoryDrawer,
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'layers' | 'overrides'>('properties');
  const selectedList = Array.from(selectedIds);
  const primaryId = selectedList[0];
  const primaryElement = primaryId ? template.elements[primaryId] : null;

  if (!primaryElement || selectedList.length === 0) {
    return (
      <aside className="inspector-sidebar">
        <div className="inspector-header">
          <h3 className="element-name">Inspector & Layers</h3>
        </div>
        <div className="empty-inspector-state p-6 text-center">
          <Sliders size={36} className="text-slate-600 mb-4 mx-auto" />
          <h4 className="text-sm font-bold text-slate-300 mb-2">No Element Selected</h4>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Click any canvas element, drag a marquee box, or select from the Layers tree to inspect and customize modular properties.
          </p>
          
          <div className="layers-tree-quick-view text-left">
            <h5 className="section-title">Component Hierarchy</h5>
            <ComponentTreeNode
              template={template}
              elementId={template.rootId}
              selectedIds={selectedIds}
              onSelectElement={onSelectElement}
            />
          </div>
        </div>
      </aside>
    );
  }

  const resolved = resolveElementForViewport(primaryElement, activeViewport);

  const handlePropChange = (category: 'content' | 'style' | 'layout', key: string, value: any) => {
    const command: EditCommand = {
      id: `cmd-${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: 'manual',
      targetIds: selectedList,
      viewportScope: activeScope,
      changes: {
        [primaryId]: {
          [category]: { [key]: value }
        }
      },
      description: `Updated ${key} in ${activeScope} scope`
    };
    onApplyEdit(command);
  };

  const FONT_PRESETS = ['12px', '14px', '16px', '18px', '24px', '32px', '48px', '64px'];
  const COLOR_SWATCHES = ['#f8fafc', '#38bdf8', '#6366f1', '#a855f7', '#10b981', '#f43f5e', '#fbbf24', '#090d16'];

  return (
    <aside className="inspector-sidebar">
      {/* Sidebar Top Header & Tabs */}
      <div className="inspector-header">
        <div className="element-meta-header">
          <span className="element-type-tag">{primaryElement.type}</span>
          <h3 className="element-name">{primaryElement.name}</h3>
          <span className="element-id-badge">#{primaryElement.id}</span>
        </div>

        {/* Viewport Target Scope Banner */}
        <div className={`scope-target-banner banner-${activeScope}`}>
          <span>Target Scope: <strong>{activeScope.toUpperCase()}</strong></span>
          <span className="scope-tip">
            {activeScope === 'all'
              ? 'Modifies base properties across all viewports.'
              : `Modifies ${activeScope.toUpperCase()} overrides only.`}
          </span>
        </div>

        {/* Sidebar Tabs */}
        <div className="inspector-tabs">
          <button
            className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            <Sliders size={14} />
            <span>Inspector</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'layers' ? 'active' : ''}`}
            onClick={() => setActiveTab('layers')}
          >
            <Layers size={14} />
            <span>Layers Tree</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'overrides' ? 'active' : ''}`}
            onClick={() => setActiveTab('overrides')}
          >
            <Eye size={14} />
            <span>Overrides</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="inspector-body">
        {activeTab === 'properties' && (
          <div className="properties-panel">
            {/* History Recovery Action */}
            <div className="recovery-action-bar">
              <button
                className="history-drawer-btn"
                onClick={() => onOpenHistoryDrawer(primaryElement.id)}
              >
                <History size={14} />
                <span>View Revision History (v{primaryElement.revision})</span>
              </button>
            </div>

            {/* Content Section */}
            {(primaryElement.content.text !== undefined ||
              primaryElement.content.linkText !== undefined ||
              primaryElement.content.badge !== undefined ||
              primaryElement.content.tagline !== undefined ||
              primaryElement.content.imageUrl !== undefined) && (
              <div className="inspector-section">
                <h4 className="section-title">Content & Text Copy</h4>
                {primaryElement.content.text !== undefined && (
                  <div className="form-group">
                    <label htmlFor="input-content-text">Text Body</label>
                    <textarea
                      id="input-content-text"
                      value={resolved.content.text || ''}
                      onChange={(e) => handlePropChange('content', 'text', e.target.value)}
                      rows={3}
                      className="form-control"
                    />
                  </div>
                )}

                {primaryElement.content.linkText !== undefined && (
                  <div className="form-group">
                    <label htmlFor="input-link-text">Button / Link Label</label>
                    <input
                      id="input-link-text"
                      type="text"
                      value={resolved.content.linkText || ''}
                      onChange={(e) => handlePropChange('content', 'linkText', e.target.value)}
                      className="form-control"
                    />
                  </div>
                )}

                {primaryElement.content.badge !== undefined && (
                  <div className="form-group">
                    <label htmlFor="input-badge-text">Badge Tagline</label>
                    <input
                      id="input-badge-text"
                      type="text"
                      value={resolved.content.badge || ''}
                      onChange={(e) => handlePropChange('content', 'badge', e.target.value)}
                      className="form-control"
                    />
                  </div>
                )}

                {primaryElement.content.tagline !== undefined && (
                  <div className="form-group">
                    <label htmlFor="input-tagline">Card Tagline</label>
                    <input
                      id="input-tagline"
                      type="text"
                      value={resolved.content.tagline || ''}
                      onChange={(e) => handlePropChange('content', 'tagline', e.target.value)}
                      className="form-control"
                    />
                  </div>
                )}

                {primaryElement.content.imageUrl !== undefined && (
                  <div className="form-group">
                    <label htmlFor="input-image-url">Image Resource URL</label>
                    <input
                      id="input-image-url"
                      type="text"
                      value={resolved.content.imageUrl || ''}
                      onChange={(e) => handlePropChange('content', 'imageUrl', e.target.value)}
                      className="form-control"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Typography Section */}
            <div className="inspector-section">
              <h4 className="section-title">Typography & Align</h4>
              <div className="form-row mb-2">
                <div className="form-group half">
                  <label htmlFor="input-font-size">Font Size</label>
                  <input
                    id="input-font-size"
                    type="text"
                    value={resolved.style.fontSize || ''}
                    onChange={(e) => handlePropChange('style', 'fontSize', e.target.value)}
                    placeholder="e.g. 18px"
                    className="form-control"
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="input-font-weight">Weight</label>
                  <select
                    id="input-font-weight"
                    value={resolved.style.fontWeight || '400'}
                    onChange={(e) => handlePropChange('style', 'fontWeight', e.target.value)}
                    className="form-control"
                  >
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">SemiBold (600)</option>
                    <option value="700">Bold (700)</option>
                    <option value="800">ExtraBold (800)</option>
                  </select>
                </div>
              </div>

              {/* Font Size Quick Chips */}
              <div className="quick-chips-row">
                {FONT_PRESETS.map((sz) => (
                  <button
                    key={sz}
                    className={`font-chip-btn ${resolved.style.fontSize === sz ? 'active' : ''}`}
                    onClick={() => handlePropChange('style', 'fontSize', sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {/* Align Buttons */}
              <div className="form-group">
                <label>Text Align</label>
                <div className="align-buttons-row">
                  <button
                    className={`align-chip-btn ${resolved.style.textAlign === 'left' ? 'active' : ''}`}
                    onClick={() => handlePropChange('style', 'textAlign', 'left')}
                    title="Align Left"
                  >
                    <AlignLeft size={14} />
                  </button>
                  <button
                    className={`align-chip-btn ${resolved.style.textAlign === 'center' ? 'active' : ''}`}
                    onClick={() => handlePropChange('style', 'textAlign', 'center')}
                    title="Align Center"
                  >
                    <AlignCenter size={14} />
                  </button>
                  <button
                    className={`align-chip-btn ${resolved.style.textAlign === 'right' ? 'active' : ''}`}
                    onClick={() => handlePropChange('style', 'textAlign', 'right')}
                    title="Align Right"
                  >
                    <AlignRight size={14} />
                  </button>
                </div>
              </div>

              {/* Text Color Swatches */}
              <div className="form-group">
                <label htmlFor="input-text-color">Color Palette</label>
                <div className="color-picker-input">
                  <input
                    type="color"
                    value={resolved.style.color?.startsWith('#') ? resolved.style.color : '#f8fafc'}
                    onChange={(e) => handlePropChange('style', 'color', e.target.value)}
                    className="color-swatch"
                  />
                  <input
                    id="input-text-color"
                    type="text"
                    value={resolved.style.color || ''}
                    onChange={(e) => handlePropChange('style', 'color', e.target.value)}
                    className="form-control flex-1"
                  />
                </div>
                <div className="flex gap-1.5 mt-2">
                  {COLOR_SWATCHES.map((hex) => (
                    <button
                      key={hex}
                      className="w-5 h-5 rounded-full border border-slate-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: hex }}
                      onClick={() => handlePropChange('style', 'color', hex)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Background & Borders */}
            <div className="inspector-section">
              <h4 className="section-title">Background & Glassmorphism</h4>
              <div className="form-group">
                <label htmlFor="input-bg-color">Background Color / RGBA</label>
                <input
                  id="input-bg-color"
                  type="text"
                  value={resolved.style.backgroundColor || ''}
                  onChange={(e) => handlePropChange('style', 'backgroundColor', e.target.value)}
                  placeholder="e.g. rgba(30,41,59,0.8)"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="input-border">Border Outline</label>
                <input
                  id="input-border"
                  type="text"
                  value={resolved.style.border || ''}
                  onChange={(e) => handlePropChange('style', 'border', e.target.value)}
                  placeholder="e.g. 1px solid rgba(255,255,255,0.1)"
                  className="form-control"
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="input-border-radius">Corner Radius</label>
                  <input
                    id="input-border-radius"
                    type="text"
                    value={resolved.style.borderRadius || ''}
                    onChange={(e) => handlePropChange('style', 'borderRadius', e.target.value)}
                    placeholder="e.g. 12px"
                    className="form-control"
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="input-shadow">Box Shadow</label>
                  <input
                    id="input-shadow"
                    type="text"
                    value={resolved.style.boxShadow || ''}
                    onChange={(e) => handlePropChange('style', 'boxShadow', e.target.value)}
                    placeholder="e.g. 0 8px 30px..."
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            {/* Spacing & Layout */}
            <div className="inspector-section">
              <h4 className="section-title">Dimensions & Spacing</h4>
              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="input-padding">Padding</label>
                  <input
                    id="input-padding"
                    type="text"
                    value={resolved.style.padding || ''}
                    onChange={(e) => handlePropChange('style', 'padding', e.target.value)}
                    placeholder="e.g. 16px 24px"
                    className="form-control"
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="input-margin">Margin</label>
                  <input
                    id="input-margin"
                    type="text"
                    value={resolved.style.margin || ''}
                    onChange={(e) => handlePropChange('style', 'margin', e.target.value)}
                    placeholder="e.g. 0 0 16px 0"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="input-width">Width</label>
                  <input
                    id="input-width"
                    type="text"
                    value={resolved.style.width || ''}
                    onChange={(e) => handlePropChange('style', 'width', e.target.value)}
                    placeholder="e.g. 100% or 400px"
                    className="form-control"
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="input-max-width">Max Width</label>
                  <input
                    id="input-max-width"
                    type="text"
                    value={resolved.style.maxWidth || ''}
                    onChange={(e) => handlePropChange('style', 'maxWidth', e.target.value)}
                    placeholder="e.g. 800px"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="layers-panel">
            <h4 className="section-title">Template DOM Hierarchy</h4>
            <p className="dim-text mb-3">Click to select an element. Shift+Click for multi-select.</p>
            <ComponentTreeNode
              template={template}
              elementId={template.rootId}
              selectedIds={selectedIds}
              onSelectElement={onSelectElement}
            />
          </div>
        )}

        {activeTab === 'overrides' && (
          <div className="overrides-panel">
            <h4 className="section-title">Viewport Overrides Audit</h4>
            <p className="dim-text mb-4">Inspect base values vs viewport-specific overrides for #{primaryElement.id}.</p>

            <div className="viewport-override-card">
              <h5>🖥 Desktop Overrides</h5>
              {primaryElement.overrides?.desktop ? (
                <pre className="override-json">{JSON.stringify(primaryElement.overrides.desktop, null, 2)}</pre>
              ) : (
                <span className="none-badge">No Desktop Overrides (Inherits Base)</span>
              )}
            </div>

            <div className="viewport-override-card">
              <h5>📱 Tablet Overrides</h5>
              {primaryElement.overrides?.tablet ? (
                <pre className="override-json">{JSON.stringify(primaryElement.overrides.tablet, null, 2)}</pre>
              ) : (
                <span className="none-badge">No Tablet Overrides (Inherits Base)</span>
              )}
            </div>

            <div className="viewport-override-card">
              <h5>📲 Mobile Overrides</h5>
              {primaryElement.overrides?.mobile ? (
                <pre className="override-json">{JSON.stringify(primaryElement.overrides.mobile, null, 2)}</pre>
              ) : (
                <span className="none-badge">No Mobile Overrides (Inherits Base)</span>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

// Recursive Component Tree Node
interface NodeProps {
  template: TemplateModel;
  elementId: string;
  selectedIds: Set<string>;
  onSelectElement: (id: string, isAdditive: boolean) => void;
}

const ComponentTreeNode: React.FC<NodeProps> = ({
  template,
  elementId,
  selectedIds,
  onSelectElement,
}) => {
  const element = template.elements[elementId];
  const [expanded, setExpanded] = useState(true);

  if (!element) return null;

  const isSelected = selectedIds.has(element.id);
  const hasChildren = element.children && element.children.length > 0;

  return (
    <div className="tree-node">
      <div
        className={`tree-node-row ${isSelected ? 'selected' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelectElement(element.id, e.shiftKey || e.ctrlKey || e.metaKey);
        }}
      >
        {hasChildren ? (
          <button
            className="expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        ) : (
          <span className="expand-placeholder" />
        )}
        <span className="node-type-icon">{element.type[0].toUpperCase()}</span>
        <span className="node-name">{element.name}</span>
        <span className="node-id">#{element.id}</span>
      </div>

      {hasChildren && expanded && (
        <div className="tree-node-children">
          {element.children.map((childId) => (
            <ComponentTreeNode
              key={childId}
              template={template}
              elementId={childId}
              selectedIds={selectedIds}
              onSelectElement={onSelectElement}
            />
          ))}
        </div>
      )}
    </div>
  );
};
