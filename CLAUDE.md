# MathKraft Homework Skill (Claude Instruction Guide)

This repository contains the MathKraft interactive mathematics homework engine and skill, designed in Retro-Neobrutalism aesthetic for offline single-file HTML worksheets.

## Commands
- **Test integrity**: `npm test` (or `node scripts/verify_skill.js`)
- **Build course**: `node skills/mathkraft-hw-ui/scripts/build-hw.js --config <path-to-course.json>`
- **Headless check (selftest)**: `node skills/mathkraft-hw-ui/scripts/build-hw.js --config <path-to-course.json> --check`

## How Claude Should Generate Worksheets
When the user asks you to create a new worksheet:

1. **Math LaTeX Formatting (STRICT RULE)**:
   - Inline math: `$formula$` (e.g., `$a_n = 3\cdot 2^n - 6$`, `$f(x) = 2^x$`).
   - Display math: `$$formula$$` (e.g., `$$S_n = \frac{n}{2}(a_1 + a_n)$$`).
   - NEVER leave raw math un-delimited. Always use `$ ... $`.

2. **UI & Layout Constraints**:
   - Do NOT alter CSS or add custom DOM containers.
   - Do NOT add breadcrumbs (`🏠 หน้าหลัก`) or external student info bars.
   - The engine automatically handles login, pills, timers, grading, and summary modals.

3. **Output Modes**:
   - **Mode A (Recommended)**: Output ONLY the JavaScript block:
     ```javascript
     (function () {
       'use strict';
       const MK = window.MK, Q = MK.Q;
       // Question generators...
       window.HW = { id: 'HW-01', ... levels: [...] };
     })();
     ```
     The user pastes this into `<script id="mathkraft-content">` inside `templates/template.html`.
   - **Mode B (Full HTML)**: Use `templates/template-cdn.html` as the base and output the complete HTML file.

4. **Supported Question Types**:
   - `Q.choice`: Multiple choice with auto-shuffle (`answer` is 0-indexed correct option before shuffle).
   - `Q.fill`: Fill-in-the-blank with `fields: [{ answer, unit, tol, ph }]`.
   - `Q.sort`: Drag-and-drop cards into bins (`bins`, `items`).
   - `Q.pairs`: 1-to-1 matching (`left`, `chips`).
   - `Q.order`: Step ordering with reasoning dropdown (`steps`, `reasons`).
   - `Q.find`: Error detection with 3 steps: find wrong line + select cause + input fix.
   - `Q.group`: Multi-part story problem with sequential sub-questions.
