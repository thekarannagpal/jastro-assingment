# Scoped AI Template Editor

A browser-based Website Builder prototype built with React, TypeScript, and Vite. Designed for small-business owners adapting responsive baseline templates without safety risks: canvas and code surfaces stay in sync, desktop/tablet/mobile layouts remain strictly isolated, text-driven deterministic AI proposals stay inside selected bounds, and every manual or accepted AI edit can be recovered per element per viewport without rolling back unrelated work.

---

## Chosen Template Source
- **Template Name**: *Nova AI SaaS Landing Page*
- **Source**: Candidate-created original responsive baseline template designed for modern tech startup landing pages (inspired by Stripe and Linear visual aesthetics).
- **Stable Modular Elements**: 15+ selectable elements including navigation header, logo, nav CTA, hero badge, main headline, subtitle, primary/secondary button row, hero preview image, 3-card feature grid, 2-card pricing grid, and footer.

---

## Setup & Running Locally

### Prerequisites
- Node.js (v18+) & npm

### Commands
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Run automated test suite
npm test
```

---

## Architectural Mapping & Requirements

| Requirement | Implementation Component | Technical Design |
| :--- | :--- | :--- |
| **Durable Source of Truth** | [`src/types/template.ts`](file:///d:/Jastro/src/types/template.ts) & [`src/data/baselineTemplate.ts`](file:///d:/Jastro/src/data/baselineTemplate.ts) | Typed JSON-serializable AST model with stable element IDs (`root`, `hero-heading`, `nav-logo`, etc.), base values, viewport overrides, and per-element append-only history. |
| **Viewport Resolution Order** | [`src/utils/viewportResolver.ts`](file:///d:/Jastro/src/utils/viewportResolver.ts) | Base properties apply across all viewports (`desktop`, `tablet`, `mobile`). Viewport overrides in `element.overrides[viewport]` override base values for that specific viewport only. Single-view edits mutate ONLY `overrides[viewport]`, guaranteeing 100% isolation for other views. |
| **Selection Authority** | [`src/components/CanvasPreview.tsx`](file:///d:/Jastro/src/components/CanvasPreview.tsx) | Selection is stored as a set of stable element IDs. Supports single click, Shift/Ctrl/Cmd-click additive multi-selection, drag marquee box selection math, and keyboard navigation. |
| **Canvas & Code Surface Sync** | [`src/components/CodeEditorSurface.tsx`](file:///d:/Jastro/src/components/CodeEditorSurface.tsx) | Dual JSON/JSX code surface synced with canvas. Valid edits update state immediately; invalid JSON triggers an inline error banner without corrupting canonical state. |
| **Deterministic AI Engine** | [`src/utils/aiDemoEngine.ts`](file:///d:/Jastro/src/utils/aiDemoEngine.ts) | Predefined scenario engine mapping text instructions to typed proposals strictly targeting selected IDs, allowed fields, and target viewport scope. Includes safe failure examples. |
| **Proposal Review & Approval** | [`src/components/ProposalReviewModal.tsx`](file:///d:/Jastro/src/components/ProposalReviewModal.tsx) | Side-by-side before/after diff review modal. Users can accept or reject each proposed element independently before committing. |
| **Granular Recovery** | [`src/utils/historyManager.ts`](file:///d:/Jastro/src/utils/historyManager.ts) & [`src/components/HistoryRecoveryDrawer.tsx`](file:///d:/Jastro/src/components/HistoryRecoveryDrawer.tsx) | Reverts an element's state for a specific viewport scope to any past commit without altering unrelated elements or other viewports. Generates a new history commit. |
| **Persistence & Reset** | [`src/App.tsx`](file:///d:/Jastro/src/App.tsx) | Automatic sync with `localStorage` on every valid commit; deliberate template reset action restores pristine baseline. |

---

## Reviewer Deterministic AI Demo Examples

The AI Demo Panel includes preset buttons for reviewers to test all required scenario paths:

1. **Content Rewrite**:
   - *Prompt*: `"Rewrite hero headline and subtitle to focus on AI speed and safety"`
   - *Behavior*: Rewrites copy on selected `heading` and `text` elements.
2. **Style Change**:
   - *Prompt*: `"Apply vibrant purple glassmorphism background and gradient border"`
   - *Behavior*: Updates background, borders, and shadows to glassmorphic design system tokens.
3. **Move / Resize / Reorder**:
   - *Prompt*: `"Make button full width with larger padding and bold text"`
   - *Behavior*: Modifies layout properties (`width: 100%`, `flexGrow: 1`, `order: 1`).
4. **One-Viewport Responsive Adjustment**:
   - *Prompt*: `"Stack buttons vertically and reduce font size on mobile view"` (Scope: `mobile`)
   - *Behavior*: Creates a mobile-specific override on selected elements leaving Desktop and Tablet untouched.
5. **Multi-Element Edit**:
   - *Prompt*: `"Highlight selected cards with glowing accent border and featured badge"`
   - *Behavior*: Applies coordinated multi-element styling across all selected pricing cards.
6. **Safe Failures**:
   - *Unsupported Instruction*: `"Generate an interactive 3D WebGL game engine with physics"` (Triggers graceful error explaining boundary limits).
   - *Unselected Target*: `"Update unselected navbar elements force outer"` (Rejects proposals attempting to modify unselected elements).

---

## Trade-offs & Commit Boundaries

- **Commit Boundary**: Edits are atomic at the command level. Every command validates target IDs, viewport scope, and field structure before committing to state and creating an append-only element snapshot.
- **Trade-off**: Storing viewport overrides inside each element rather than separate CSS files increases JSON payload size, but guarantees 100% deterministic JSON serializability and element-level history recovery.
