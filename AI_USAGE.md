# AI Usage Report

## 1. Tools & Models Used
- **AI Coding Assistant**: Antigravity Assistant (powered by Google Gemini 3.6 Flash & Claude Sonnet 3.7 engine).
- **Task Framing**: Used AI to scaffold data schemas (`TemplateModel`, `EditCommand`), implement viewport resolution math, generate deterministic AI scenario rules, build drag marquee selection math, and craft comprehensive Vitest test suites.

---

## 2. Redacted Interaction Examples

### Example A: Planning & Product Framing
> **User Prompt**: "Define the schema and resolution order for base values vs desktop, tablet, and mobile overrides so single-view edits never corrupt other views."
>
> **AI Response**: "We model each element with base properties (`style`, `layout`, `content`) and an `overrides` record mapping `desktop`, `tablet`, or `mobile` to partial overrides. Resolution order evaluates: $Computed = Base \oplus Overrides[ActiveViewport]$. Editing under a single-view scope mutates only `overrides[ActiveViewport]`, leaving $Base$ and other view overrides 100% untouched."

### Example B: Implementation & Test Interaction
> **User Prompt**: "Write a Vitest test for per-element per-viewport independent recovery to prove that restoring mobile scope for element A does not touch element B or desktop scope."
>
> **AI Response**: Generated `src/__tests__/historyManager.test.ts` testing sequential mobile edits, unrelated element edits, and restoring historical mobile snapshots while asserting that unrelated elements and desktop viewports remain identical.

---

## 3. Rejected or Corrected AI Suggestion

- **Initial AI Suggestion**: The model initially suggested implementing undo/redo as a global template state stack array (`history: TemplateModel[]`).
- **Reason for Rejection**: A global state stack violates the core requirement: *"restore one element without disturbing the rest of the page"*. Rolling back a global stack would undo unrelated manual edits made on other elements.
- **Resulting Change**: Replaced global stack with per-element append-only history logs (`element.history: ElementHistoryEntry[]`) storing scope-tagged snapshots. Recovery now restores only the targeted element's scope properties and appends a new commit log entry.

---

## 4. How Code Was Verified

1. **Automated Test Suite**:
   - Ran `npx vitest run` covering 100% of core contracts across `aiDemoEngine`, `viewportResolver`, `historyManager`, and `editPipeline`.
2. **Manual Scenarios Exercised**:
   - **Selection**: Verified single click, Shift-click additive multi-select, drag marquee box selection math, and keyboard Esc/Tab navigation.
   - **Canvas & Code Sync**: Edited text/styles on canvas and verified live code surface update. Typed invalid JSON in code editor and verified red error banner displayed while canvas remained protected.
   - **Viewport Scope Isolation**: Set scope to Mobile, modified Hero headline font size to 14px, switched preview to Desktop (48px) and Tablet (36px) to verify zero side effects.
   - **AI Demo Engine & Review**: Executed preset prompts (content rewrite, glassmorphism style, mobile stack, pricing multi-highlight, safe failure) and verified side-by-side proposal review with independent per-element Accept/Reject toggles.
   - **Granular Recovery**: Made 3 edits to Hero headline, opened recovery drawer, restored revision 1 for Mobile scope only, and confirmed Desktop scope was unchanged.
3. **Dependencies Reviewed**: `lucide-react` (icons), `vitest` and `@testing-library/react` (testing).

---

## 5. Workflow Limitations & Next Time Changes

- **Limitation**: When scaffolding complex multi-file React apps, AI models sometimes generate inline styles or CSS class collisions if design tokens aren't specified early.
- **Future Change**: Next time, create a unified CSS design tokens dictionary (`variables.css`) before generating UI components to ensure 100% visual consistency from the first commit.
