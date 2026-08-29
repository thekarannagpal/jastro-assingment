import type { TemplateModel, ViewportScope, TemplateElement, ElementHistoryEntry } from '../types/template';

export function restoreElementToHistoryEntry(
  template: TemplateModel,
  elementId: string,
  historyEntryId: string,
  targetScope: ViewportScope
): { updatedTemplate: TemplateModel; error?: string } {
  const element = template.elements[elementId];
  if (!element) {
    return { updatedTemplate: template, error: `Element ID "${elementId}" not found.` };
  }

  const targetEntry = element.history.find(h => h.id === historyEntryId);
  if (!targetEntry) {
    return { updatedTemplate: template, error: `History entry "${historyEntryId}" not found.` };
  }

  const timestamp = new Date().toISOString();
  const nextOverrides = JSON.parse(JSON.stringify(element.overrides));

  let nextStyle = { ...element.style };
  let nextLayout = { ...element.layout };
  let nextContent = { ...element.content };

  if (targetScope === 'all') {
    // Restore base properties from historical snapshot
    nextStyle = { ...targetEntry.snapshot.style };
    nextLayout = { ...targetEntry.snapshot.layout };
    nextContent = { ...targetEntry.snapshot.content };
  } else {
    // Restore specific viewport scope override from historical snapshot
    const historicalOverride = targetEntry.snapshot.overrides?.[targetScope];
    if (historicalOverride) {
      nextOverrides[targetScope] = JSON.parse(JSON.stringify(historicalOverride));
    } else {
      // If historical entry had no override for this scope, remove override
      delete nextOverrides[targetScope];
    }
  }

  const newRevision = element.revision + 1;
  const newHistoryEntry: ElementHistoryEntry = {
    id: `hist-${elementId}-restore-${newRevision}-${Date.now()}`,
    timestamp,
    scope: targetScope,
    source: 'recovery',
    description: `Restored ${targetScope} scope to commit from ${new Date(targetEntry.timestamp).toLocaleTimeString()}`,
    snapshot: {
      style: nextStyle,
      layout: nextLayout,
      content: nextContent,
      overrides: nextOverrides
    }
  };

  const updatedElement: TemplateElement = {
    ...element,
    style: nextStyle,
    layout: nextLayout,
    content: nextContent,
    overrides: nextOverrides,
    revision: newRevision,
    history: [newHistoryEntry, ...element.history]
  };

  const updatedTemplate: TemplateModel = {
    ...template,
    version: template.version + 1,
    elements: {
      ...template.elements,
      [elementId]: updatedElement
    }
  };

  return { updatedTemplate };
}
