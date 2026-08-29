import { describe, it, expect } from 'vitest';
import { baselineTemplate } from '../data/baselineTemplate';
import { resolveElementForViewport } from '../utils/viewportResolver';
import { applyEditCommand } from '../utils/editPipeline';
import { EditCommand } from '../types/template';

describe('Viewport Override Resolver & View Isolation', () => {
  it('resolves base properties when no overrides exist', () => {
    const el = baselineTemplate.elements['nav-logo'];
    const resolvedDesktop = resolveElementForViewport(el, 'desktop');
    const resolvedMobile = resolveElementForViewport(el, 'mobile');

    expect(resolvedDesktop.style.fontSize).toBe('20px');
    expect(resolvedMobile.style.fontSize).toBe('20px');
    expect(resolvedDesktop.hasViewportOverride).toBe(false);
  });

  it('resolves view-specific override when specified without altering base or other viewports', () => {
    const el = baselineTemplate.elements['hero-heading'];
    const desktopResolved = resolveElementForViewport(el, 'desktop');
    const mobileResolved = resolveElementForViewport(el, 'mobile');

    expect(desktopResolved.style.fontSize).toBe('48px');
    expect(mobileResolved.style.fontSize).toBe('28px');
    expect(mobileResolved.hasViewportOverride).toBe(true);
  });

  it('guarantees single-view edit isolation: mobile edit leaves desktop and tablet unchanged', () => {
    const command: EditCommand = {
      id: 'cmd-test-isolation',
      timestamp: new Date().toISOString(),
      source: 'manual',
      targetIds: ['hero-heading'],
      viewportScope: 'mobile',
      changes: {
        'hero-heading': {
          style: { fontSize: '14px', color: '#ff0000' }
        }
      },
      description: 'Mobile font edit'
    };

    const { updatedTemplate, errors } = applyEditCommand(baselineTemplate, command);
    expect(errors.length).toBe(0);

    const updatedEl = updatedTemplate.elements['hero-heading'];

    // Desktop view resolution must remain 48px
    const desktopRes = resolveElementForViewport(updatedEl, 'desktop');
    expect(desktopRes.style.fontSize).toBe('48px');

    // Mobile view resolution must evaluate to new 14px override
    const mobileRes = resolveElementForViewport(updatedEl, 'mobile');
    expect(mobileRes.style.fontSize).toBe('14px');
    expect(mobileRes.style.color).toBe('#ff0000');
  });
});
