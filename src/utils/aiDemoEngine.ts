import type { TemplateModel, ViewportScope, AIProposalResult, AIProposalItem } from '../types/template';
import { resolveElementForViewport } from './viewportResolver';

export interface ScenarioExample {
  id: string;
  title: string;
  category: 'content' | 'style' | 'layout' | 'responsive' | 'multi' | 'failure';
  prompt: string;
  suggestedScope: ViewportScope;
  targetElementTypes?: string[];
  description: string;
}

export const PRESET_DEMO_PROMPTS: ScenarioExample[] = [
  {
    id: 'demo-1',
    title: 'Content Rewrite',
    category: 'content',
    prompt: 'Rewrite hero headline and subtitle to focus on AI speed and safety',
    suggestedScope: 'all',
    targetElementTypes: ['heading', 'text'],
    description: 'Updates headline & subtext with catchy high-converting copy'
  },
  {
    id: 'demo-2',
    title: 'Vibrant Glassmorphism Style',
    category: 'style',
    prompt: 'Apply vibrant purple glassmorphism background and gradient border',
    suggestedScope: 'all',
    targetElementTypes: ['card', 'nav', 'section', 'button'],
    description: 'Upgrades colors, borders, and shadows to modern glass look'
  },
  {
    id: 'demo-3',
    title: 'Resize & Reorder Layout',
    category: 'layout',
    prompt: 'Make button full width with larger padding and bold text',
    suggestedScope: 'all',
    targetElementTypes: ['button', 'card'],
    description: 'Adjusts width, padding, and font weight'
  },
  {
    id: 'demo-4',
    title: 'Mobile-Only Responsive Layout',
    category: 'responsive',
    prompt: 'Stack buttons vertically and reduce font size on mobile view',
    suggestedScope: 'mobile',
    targetElementTypes: ['container', 'heading', 'text', 'button'],
    description: 'Creates mobile-specific override leaving Desktop/Tablet untouched'
  },
  {
    id: 'demo-5',
    title: 'Multi-Element Pricing Highlight',
    category: 'multi',
    prompt: 'Highlight selected cards with glowing accent border and featured badge',
    suggestedScope: 'all',
    targetElementTypes: ['card'],
    description: 'Applies coordinated multi-element styling across selection'
  },
  {
    id: 'demo-fail-1',
    title: 'Safe Failure: Unsupported Intent',
    category: 'failure',
    prompt: 'Generate an interactive 3D WebGL game engine with physics',
    suggestedScope: 'all',
    description: 'Demonstrates graceful failure for instructions outside editor capability'
  },
  {
    id: 'demo-fail-2',
    title: 'Safe Failure: Unselected Target',
    category: 'failure',
    prompt: 'Update unselected navbar elements without user selection',
    suggestedScope: 'all',
    description: 'Demonstrates enforcement that AI cannot modify unselected elements'
  }
];

export function runAIDemoScenario(
  promptText: string,
  selectedIds: string[],
  scope: ViewportScope,
  template: TemplateModel
): AIProposalResult {
  const timestamp = new Date().toISOString();
  const proposalId = `prop-${Date.now()}`;

  // 1. Check if no elements selected
  if (selectedIds.length === 0) {
    return {
      id: proposalId,
      timestamp,
      prompt: promptText,
      viewportScope: scope,
      success: false,
      error: 'Selection required: Please select one or more elements on the canvas before running an AI instruction.',
      items: []
    };
  }

  const promptLower = promptText.toLowerCase().trim();

  // 2. Check failure scenario: Unsupported Intent
  if (
    promptLower.includes('3d') ||
    promptLower.includes('game') ||
    promptLower.includes('webgl') ||
    promptLower.includes('hack') ||
    promptLower.includes('database')
  ) {
    return {
      id: proposalId,
      timestamp,
      prompt: promptText,
      viewportScope: scope,
      success: false,
      error: 'Unsupported AI Instruction: The requested feature (3D/game engine/backend) is outside template editor design boundaries. Edits must target content, style, or layout properties.',
      items: []
    };
  }

  // 3. Check failure scenario: Unselected Target attempt
  if (promptLower.includes('unselected') || promptLower.includes('force outer')) {
    return {
      id: proposalId,
      timestamp,
      prompt: promptText,
      viewportScope: scope,
      success: false,
      error: 'Safe Scope Violation: AI proposals cannot reference or mutate element IDs outside user selection bounds.',
      items: []
    };
  }

  // Generate proposals strictly for selectedIds
  const items: AIProposalItem[] = [];

  for (const id of selectedIds) {
    const el = template.elements[id];
    if (!el) continue;

    const viewportForSnap = scope === 'all' ? 'desktop' : scope;
    const resolved = resolveElementForViewport(el, viewportForSnap);

    const proposed: AIProposalItem['proposed'] = {};
    let reasoning = '';

    // Match prompt patterns
    if (promptLower.includes('rewrite') || promptLower.includes('headline') || promptLower.includes('copy') || promptLower.includes('text')) {
      proposed.content = {};
      if (el.type === 'heading') {
        proposed.content.text = `⚡ Instant Scale: ${el.content.text || 'Next-Gen Workflow'}`;
        reasoning = 'Rewrote headline for high conversion & technical clarity.';
      } else if (el.type === 'text') {
        proposed.content.text = 'Empower your teams with real-time deterministic updates and per-element audit recovery.';
        reasoning = 'Refined body text for concise business positioning.';
      } else if (el.type === 'button') {
        proposed.content.linkText = 'Start Instant Demo →';
        reasoning = 'Updated button CTA label to action-oriented text.';
      } else if (el.type === 'card') {
        proposed.content.tagline = 'Automated proposal review & instant rollback guarantee.';
        reasoning = 'Rewrote card description for feature highlight.';
      } else {
        proposed.content.text = 'AI-Optimized Content Element';
        reasoning = 'Rewrote text content.';
      }
    } else if (promptLower.includes('glass') || promptLower.includes('purple') || promptLower.includes('style') || promptLower.includes('color')) {
      proposed.style = {
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        border: '1px solid rgba(168, 85, 247, 0.4)',
        boxShadow: '0 8px 32px rgba(147, 51, 234, 0.25)',
        borderRadius: '16px'
      };
      if (el.type === 'heading' || el.type === 'text') {
        proposed.style.color = '#c084fc';
      }
      reasoning = 'Applied glowing glassmorphic background, neon border, and backdrop shadow.';
    } else if (promptLower.includes('stack') || promptLower.includes('vertical') || promptLower.includes('mobile') || promptLower.includes('responsive')) {
      if (el.type === 'heading') {
        proposed.style = { fontSize: '22px', textAlign: 'center', lineHeight: '1.25' };
        reasoning = 'Reduced font size for compact mobile viewports.';
      } else if (el.type === 'container' || el.type === 'grid') {
        proposed.layout = { display: 'flex', flexDirection: 'column', gap: '12px' };
        reasoning = 'Stacked children vertically for single-column mobile view.';
      } else if (el.type === 'button') {
        proposed.style = { width: '100%', padding: '14px 20px', fontSize: '15px' };
        reasoning = 'Expanded button to full-width block for mobile touch targets.';
      } else {
        proposed.style = { padding: '12px' };
        reasoning = 'Adjusted padding for responsive touch layout.';
      }
    } else if (promptLower.includes('full width') || promptLower.includes('size') || promptLower.includes('padding') || promptLower.includes('reorder')) {
      proposed.style = { width: '100%', padding: '18px 24px', fontWeight: '800' };
      proposed.layout = { flexGrow: 1, order: 1 };
      reasoning = 'Expanded element size and assigned flex ordering.';
    } else if (promptLower.includes('highlight') || promptLower.includes('accent') || promptLower.includes('pricing') || promptLower.includes('badge')) {
      proposed.style = {
        border: '2px solid #38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        boxShadow: '0 0 24px rgba(56, 189, 248, 0.3)'
      };
      if (el.type === 'card' || el.type === 'badge') {
        proposed.content = { badge: '★ MOST POPULAR' };
      }
      reasoning = 'Highlighted card with cyan accent outline and featured badge.';
    } else {
      // Default smart proposal based on element type
      if (el.type === 'heading') {
        proposed.content = { text: `Updated: ${el.content.text || 'Heading'}` };
        proposed.style = { color: '#38bdf8' };
      } else if (el.type === 'button') {
        proposed.style = { backgroundColor: '#10b981', color: '#ffffff', borderRadius: '12px' };
      } else {
        proposed.style = { border: '1px solid #6366f1', padding: '16px' };
      }
      reasoning = `Applied tailored smart AI enhancement to ${el.name}.`;
    }

    items.push({
      elementId: el.id,
      elementName: el.name,
      proposed,
      beforeSnapshot: {
        style: resolved.style,
        layout: resolved.layout,
        content: resolved.content,
        overrides: JSON.parse(JSON.stringify(el.overrides))
      },
      scope,
      reasoning,
      status: 'pending'
    });
  }

  return {
    id: proposalId,
    timestamp,
    prompt: promptText,
    viewportScope: scope,
    success: true,
    items
  };
}
