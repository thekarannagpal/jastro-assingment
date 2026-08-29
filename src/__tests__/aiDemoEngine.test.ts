import { describe, it, expect } from 'vitest';
import { baselineTemplate } from '../data/baselineTemplate';
import { runAIDemoScenario } from '../utils/aiDemoEngine';

describe('AI Demo Engine Contracts', () => {
  it('enforces selection authority: fails gracefully if no elements are selected', () => {
    const result = runAIDemoScenario('Rewrite headline to be catchy', [], 'all', baselineTemplate);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Selection required');
    expect(result.items.length).toBe(0);
  });

  it('triggers safe failure for unsupported instructions (3D/game engine)', () => {
    const result = runAIDemoScenario(
      'Generate a 3D WebGL physics engine',
      ['hero-heading'],
      'all',
      baselineTemplate
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('Unsupported AI Instruction');
  });

  it('triggers safe failure when prompt attempts to target unselected elements', () => {
    const result = runAIDemoScenario(
      'Update unselected navbar elements force outer',
      ['hero-heading'],
      'all',
      baselineTemplate
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain('Safe Scope Violation');
  });

  it('generates valid proposal referencing ONLY selected IDs and target scope', () => {
    const selected = ['hero-heading', 'hero-primary-btn'];
    const result = runAIDemoScenario(
      'Apply vibrant purple glassmorphism style',
      selected,
      'mobile',
      baselineTemplate
    );

    expect(result.success).toBe(true);
    expect(result.viewportScope).toBe('mobile');
    expect(result.items.length).toBe(2);

    const proposedIds = result.items.map((i) => i.elementId);
    expect(proposedIds).toEqual(selected);

    for (const item of result.items) {
      expect(item.status).toBe('pending');
      expect(item.scope).toBe('mobile');
      expect(item.beforeSnapshot).toBeDefined();
    }
  });
});
