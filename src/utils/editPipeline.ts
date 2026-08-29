import type { TemplateModel, EditCommand, ViewportScope, TemplateElement, ElementHistoryEntry } from '../types/template';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateEditCommand(
  template: TemplateModel,
  command: EditCommand
): ValidationResult {
  const errors: string[] = [];

  if (!command.targetIds || command.targetIds.length === 0) {
    errors.push('Edit command must target at least one element ID.');
  }

  for (const id of command.targetIds) {
    if (!template.elements[id]) {
      errors.push(`Target element ID "${id}" does not exist in template.`);
    }
  }

  const validScopes: ViewportScope[] = ['all', 'desktop', 'tablet', 'mobile'];
  if (!validScopes.includes(command.viewportScope)) {
    errors.push(`Invalid viewport scope "${command.viewportScope}". Allowed scopes: ${validScopes.join(', ')}.`);
  }

  for (const [id, change] of Object.entries(command.changes)) {
    if (!template.elements[id]) {
      errors.push(`Change references unknown target ID "${id}".`);
      continue;
    }

    // Check for forbidden / malformed fields
    if (change.content) {
      const allowedContentKeys = ['text', 'tagline', 'badge', 'imageUrl', 'imageAlt', 'linkText', 'linkHref', 'icon', 'listItems'];
      for (const key of Object.keys(change.content)) {
        if (!allowedContentKeys.includes(key)) {
          errors.push(`Forbidden content field "${key}" on element "${id}".`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function applyEditCommand(
  template: TemplateModel,
  command: EditCommand
): { updatedTemplate: TemplateModel; errors: string[] } {
  const validation = validateEditCommand(template, command);
  if (!validation.valid) {
    return { updatedTemplate: template, errors: validation.errors };
  }

  const timestamp = new Date().toISOString();
  const nextElements = { ...template.elements };

  for (const targetId of command.targetIds) {
    const element = nextElements[targetId];
    if (!element) continue;

    const change = command.changes[targetId] || {};
    const scope = command.viewportScope;

    const updatedElement: TemplateElement = {
      ...element,
      revision: element.revision + 1,
      overrides: { ...element.overrides }
    };

    if (scope === 'all') {
      // Modify base properties
      updatedElement.style = { ...updatedElement.style, ...(change.style || {}) };
      updatedElement.layout = { ...updatedElement.layout, ...(change.layout || {}) };
      updatedElement.content = { ...updatedElement.content, ...(change.content || {}) };
    } else {
      // Scope-specific override
      const existingOverride = updatedElement.overrides[scope] || {};
      updatedElement.overrides[scope] = {
        style: { ...(existingOverride.style || {}), ...(change.style || {}) },
        layout: { ...(existingOverride.layout || {}), ...(change.layout || {}) },
        content: { ...(existingOverride.content || {}), ...(change.content || {}) }
      };
    }

    // Record non-destructive history snapshot
    const historyEntry: ElementHistoryEntry = {
      id: `hist-${targetId}-${updatedElement.revision}-${Date.now()}`,
      timestamp,
      scope,
      source: command.source,
      description: command.description || `Edited in ${scope} scope`,
      snapshot: {
        style: { ...updatedElement.style },
        layout: { ...updatedElement.layout },
        content: { ...updatedElement.content },
        overrides: JSON.parse(JSON.stringify(updatedElement.overrides))
      }
    };

    updatedElement.history = [historyEntry, ...updatedElement.history];
    nextElements[targetId] = updatedElement;
  }

  const updatedTemplate: TemplateModel = {
    ...template,
    version: template.version + 1,
    elements: nextElements
  };

  return { updatedTemplate, errors: [] };
}
