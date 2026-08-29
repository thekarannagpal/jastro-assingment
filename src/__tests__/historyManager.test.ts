import { describe, it, expect } from 'vitest';
import { baselineTemplate } from '../data/baselineTemplate';
import { applyEditCommand } from '../utils/editPipeline';
import { restoreElementToHistoryEntry } from '../utils/historyManager';
import { resolveElementForViewport } from '../utils/viewportResolver';

describe('Per-Element Per-Viewport Independent Recovery', () => {
  it('restores a past revision for one element without affecting unrelated elements or other viewports', () => {
    // 1. Edit mobile scope of hero-heading
    const mobileEdit = applyEditCommand(baselineTemplate, {
      id: 'cmd-1',
      timestamp: new Date().toISOString(),
      source: 'manual',
      targetIds: ['hero-heading'],
      viewportScope: 'mobile',
      changes: { 'hero-heading': { style: { fontSize: '12px' } } },
      description: 'Mobile edit 1'
    }).updatedTemplate;

    const initialHistoryEntry = mobileEdit.elements['hero-heading'].history[1]; // older entry

    // 2. Edit feature-card-1 to prove non-collateral safety
    const multiEdit = applyEditCommand(mobileEdit, {
      id: 'cmd-2',
      timestamp: new Date().toISOString(),
      source: 'manual',
      targetIds: ['feature-card-1'],
      viewportScope: 'all',
      changes: { 'feature-card-1': { content: { text: 'UNRELATED CARD EDIT' } } },
      description: 'Card edit'
    }).updatedTemplate;

    // 3. Restore hero-heading mobile scope to initial history entry
    const { updatedTemplate: restoredTemplate, error } = restoreElementToHistoryEntry(
      multiEdit,
      'hero-heading',
      initialHistoryEntry.id,
      'mobile'
    );

    expect(error).toBeUndefined();

    // Verify hero-heading restored for mobile
    const restoredHeading = restoredTemplate.elements['hero-heading'];
    const restoredMobile = resolveElementForViewport(restoredHeading, 'mobile');
    expect(restoredMobile.style.fontSize).toBe('28px'); // restored to baseline mobile value

    // Verify feature-card-1 remained untouched!
    expect(restoredTemplate.elements['feature-card-1'].content.text).toBe('UNRELATED CARD EDIT');

    // Verify append-only history audit trail recorded the recovery commit
    const latestHistory = restoredHeading.history[0];
    expect(latestHistory.source).toBe('recovery');
  });
});
