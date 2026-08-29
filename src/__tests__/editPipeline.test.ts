import { describe, it, expect } from 'vitest';
import { baselineTemplate } from '../data/baselineTemplate';
import { validateEditCommand, applyEditCommand } from '../utils/editPipeline';
import type { EditCommand } from '../types/template';

describe('Edit Pipeline Validation & Execution', () => {
  it('rejects commands with unknown target IDs', () => {
    const command: EditCommand = {
      id: 'cmd-invalid-id',
      timestamp: new Date().toISOString(),
      source: 'manual',
      targetIds: ['non-existent-element-999'],
      viewportScope: 'all',
      changes: {},
      description: 'Invalid ID edit'
    };

    const validation = validateEditCommand(baselineTemplate, command);
    expect(validation.valid).toBe(false);
    expect(validation.errors[0]).toContain('does not exist');

    const { updatedTemplate } = applyEditCommand(baselineTemplate, command);
    expect(updatedTemplate.version).toBe(baselineTemplate.version);
  });

  it('rejects commands with forbidden content fields', () => {
    const command: EditCommand = {
      id: 'cmd-forbidden-field',
      timestamp: new Date().toISOString(),
      source: 'ai',
      targetIds: ['hero-heading'],
      viewportScope: 'all',
      changes: {
        'hero-heading': {
          content: { maliciousPayload: '<script>alert(1)</script>' } as any
        }
      },
      description: 'Forbidden field edit'
    };

    const validation = validateEditCommand(baselineTemplate, command);
    expect(validation.valid).toBe(false);
    expect(validation.errors[0]).toContain('Forbidden content field');
  });

  it('increments element revision and commits non-destructive history on valid edits', () => {
    const initialRev = baselineTemplate.elements['hero-heading'].revision;
    const initialHistLength = baselineTemplate.elements['hero-heading'].history.length;

    const command: EditCommand = {
      id: 'cmd-valid',
      timestamp: new Date().toISOString(),
      source: 'manual',
      targetIds: ['hero-heading'],
      viewportScope: 'all',
      changes: {
        'hero-heading': {
          style: { color: '#6366f1' }
        }
      },
      description: 'Valid color update'
    };

    const { updatedTemplate, errors } = applyEditCommand(baselineTemplate, command);
    expect(errors.length).toBe(0);

    const updatedEl = updatedTemplate.elements['hero-heading'];
    expect(updatedEl.revision).toBe(initialRev + 1);
    expect(updatedEl.history.length).toBe(initialHistLength + 1);
    expect(updatedEl.style.color).toBe('#6366f1');
  });
});
