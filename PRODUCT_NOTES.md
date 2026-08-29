# Product Notes & System Architecture

## 1. Primary User, Job & Safe Edit Definition
- **Primary User**: Small-business owner adapting a website template without technical coding background.
- **User Job**: Customize copy, styling, layout, and mobile responsiveness for their business while utilizing deterministic AI assistance safely.
- **Safe Completed Template Edit**: An edit is *safe* when:
  1. It modifies ONLY the selected elements and targeted viewport scope.
  2. It leaves unselected elements and other viewport layouts 100% unchanged.
  3. It requires explicit user approval before applying AI proposals.
  4. It can be independently reverted for one element and one view without rolling back unrelated edits.

---

## 2. Core Definitions & Boundaries
- **Element**: A modular component node with a stable unique ID (`hero-heading`), human-readable name, parent/children relationships, base properties (`style`, `layout`, `content`), viewport overrides, revision number, and append-only commit history.
- **Group Selection**: A set of stable element IDs (`Set<string>`) selected via single click, Shift/Ctrl/Cmd additive click, or drag marquee box selection on canvas.
- **Committed Step**: An atomic `EditCommand` payload passing validation, mutating template state, incrementing element revision, and logging a history snapshot.
- **Viewport Scope**: Target scope (`all`, `desktop`, `tablet`, `mobile`). Single-view edits affect only `overrides[scope]`.
- **Editable Property Boundary**: Content (`text`, `badge`, `linkText`, `tagline`, `imageUrl`), Style (`color`, `backgroundColor`, `fontSize`, `fontWeight`, `padding`, `margin`, `border`, `borderRadius`, `boxShadow`), and Layout (`width`, `height`, `flexDirection`, `gridTemplateColumns`, `order`, `flexGrow`).

---

## 3. Canvas/Code State Sync & Viewport Override Resolution
- **Shared State**: Canonical source of truth is the JSON-serializable `TemplateModel`. Canvas preview renders from this state; code editor presents live JSON AST. Valid code edits parse and invoke `applyEditCommand`. Invalid code edits display an error banner without corrupting canonical state.
- **Viewport Override Resolution Order**:
  $$Computed = Base \oplus Overrides[ActiveViewport]$$
  - Base values apply across all viewports.
  - Viewport-specific overrides take precedence for that view only.
  - Edits made in scope $S \in \{\text{'desktop'}, \text{'tablet'}, \text{'mobile'}\}$ modify ONLY $Overrides[S]$. Base and other view overrides remain untouched.

---

## 4. Deterministic AI Demo & Validation Policy
- **Selection Authority**: AI proposals reference ONLY selected element IDs (`selectedIds`). If 0 elements are selected or prompt attempts to reference unselected IDs, runtime validation rejects the proposal with a clear error.
- **Safe Failure Handling**: Instructions outside editor capabilities (e.g. 3D WebGL, database hacks) or malformed payloads return structured error proposals without modifying template state.

---

## 5. Review, Partial Acceptance & Recovery Policy
- **Proposal Review**: AI output is rendered in a side-by-side before/after diff modal.
- **Independent Acceptance**: In multi-element proposals, users can click Accept or Reject per element independently.
- **Per-Element Recovery Policy**: Users can restore element $E$ at viewport scope $V$ to any prior commit $k$. Recovery restores properties for scope $V$ without touching other elements or viewports, and logs a new commit snapshot.

---

## 6. One Additional Capability Chosen
- **Feature Name**: **Scope-Aware Visual Diff & 3-Viewport Matrix Preview Overlay**
- **User Problem**: Non-technical users worry: *"If I make this text smaller for mobile, did I break desktop?"*
- **Solution**: A 3-Viewport comparison matrix showing live Desktop (1440px), Tablet (768px), and Mobile (375px) previews side-by-side with glowing Scope-Diff badges on modified elements.
- **Product Evidence to Validate**:
  1. **User Confidence Score**: 40% reduction in user hesitation when switching viewports.
  2. **Accidental Override Reduction**: 90% drop in unintended cross-viewport property overwrites.
  3. **Recovery Click Rate**: Decrease in rollback frequency due to instant visual verification.

---

## 7. Cuts, Assumptions & Priority Roadmap

### Cuts & Assumptions
- **Cuts**: No live LLM backend API connection (deterministic scenario engine per spec); freeform absolute drag positioning converted to flex/grid order & size properties for responsive stability.
- **Assumptions**: Desktop = 1440px width simulation, Tablet = 768px, Mobile = 375px.

### Next Three Priorities
1. **Visual Style Preset Themes**: One-click global palette swapper (e.g. Modern Dark, Minimalist Light, Cyberpunk Neon).
2. **Component Drag-and-Drop Reordering**: Drag handles in component tree layers panel to reorder DOM children interactively.
3. **Asset Manager & Upload Modal**: Image asset uploader with inline image crop & optimization.
