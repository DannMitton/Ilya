# Deferred Brief: Cosmetic Critique of Shane's Chrome
**Date:** 2026-07-13
**From:** Kimi (at Dann's request)
**Status:** DEFERRED — execute only after live wiring is proven and the app shell is stable
**Trigger:** "Wiring proven" = score upload → parse → render → overlay → print pipeline complete on a real score, with the correction UI bound and at least one fidelity banner rendering correctly.
---
## 1. Purpose
This is not a design brief. It is a methodological brief: four resources and a critique protocol to run against the app's chrome once the functional architecture is settled, so that cosmetic refinement does not precede structural truth.
## 2. Why deferred
Cosmetic critique is most valuable when the interface is showing real data under real use, not placeholder states. Empty states, provisional markers, and "Coming soon" affordances all read differently when the pipeline behind them is live. Evaluating the chrome now risks polishing surfaces that may change shape once the correction UI, the overlay engine, and the print renderer are all competing for the same drawer and main-pane real estate.
## 3. The four resources
### 3.1 Nielsen's 10 Usability Heuristics
Jakob Nielsen's established heuristics, applied specifically to the scholarly-pedagogical context of Shane. Not a generic consumer-app reading. Focus areas:
- **Visibility of system status:** Is the Provisional/Captured/Estimated state legible at a glance in the vowel roster? Does the collapse/expand of the CalibrationWizard communicate its state?
- **Match between system and real world:** Do "Re-take," "Finish," and "Start over" match the singer's mental model of a calibration session, or a software wizard?
- **Error prevention:** Does the upload widget's disabled "Coming soon" state prevent false starts, or does it invite frustration?
- **Recognition over recall:** Does the drawer/main-pane split rely on the user remembering where tools live, or is the spatial mapping consistent across Transcription and Fit tabs?
### 3.2 Bringhurst, *The Elements of Typographic Style* (4th ed.)
Robert Bringhurst's authority on typographic refinement, applied to the Paper system and the Ilya-styled chrome. Focus areas:
- **Measure and leading:** Is the drawer text comfortable at the current width, or does the measure strain readability?
- **Hierarchy:** Do the Metadata block, the ScoreUploader, the profile summary, and the action buttons have a clear and consistent typographic hierarchy (size, weight, spacing), or do they compete?
- **The hairline rule:** Is the horizontal rule separating drawer sections used with restraint and precision, or does it accumulate into visual noise?
- **Small caps and old-style figures:** Are they used consistently (header, footer, provenance lines) or inconsistently (only in some tabs)?
- **Color register:** Does the cream sheet (`--paper-cream`) hold the analytical marks (sage turning layer, red squircle, amber cues) with sufficient dignity, or do the functional colors fight the paper tone?
### 3.3 WCAG 2.1 Level AA (contrast and touch targets)
Accessibility baseline, not an aspirational goal. Focus areas:
- **Contrast:** Is the "Provisional" amber/yellow state readable against the cream background? Is the disabled "Coming soon" text sufficiently distinct from active text? Is the sage turning layer visible to color-deficient users?
- **Touch targets:** Are the "Re-take" buttons, the expand chevrons, and the score-uploader hit areas large enough for a Surface Pro in tablet mode (minimum 44×44 CSS px)?
- **Focus indicators:** Does keyboard navigation through the drawer show visible focus rings that match the app's understated aesthetic?
### 3.4 Comparative reference: professional engraving and academic readers
Benchmarking against established tools that handle dense metadata alongside a primary document. Focus areas:
- **Dorico / Sibelius:** How do they handle sidebar properties vs. main score view? Does Shane's drawer/main-pane split respect the same spatial conventions (tool panel on left, document on right), and does the collapse behavior feel analogous?
- **IMSLP / Google Scholar reader mode:** How do they present bibliographic metadata (composer, poet, opus) without overwhelming the primary text? Does Shane's Metadata block achieve the same restraint?
- **MuseScore / Finale:** How do they handle empty states and upload/import workflows? Does Shane's "Drop a score here" affordance meet the same clarity standard?
## 4. Protocol (how to run the critique)
When triggered, execute in this order:
1. **Capture the full state space.** Screenshots of every drawer state (empty, uploading, loaded, collapsed, expanded), every main-pane state (empty, profile document, score rendered, print preview), and every fidelity banner tier.
2. **Heuristic pass.** Run Nielsen's 10 heuristics against the captured states, noting violations and severity (cosmetic, minor, major, critical).
3. **Typographic pass.** Run Bringhurst's principles against the Paper system chrome, noting where the scholarly register is honored or broken.
4. **Accessibility pass.** WCAG contrast check (automated via browser DevTools or aXe) and manual touch-target measurement.
5. **Comparative pass.** Side-by-side screenshots with the benchmark tools, noting where Shane diverges and whether the divergence is justified by its pedagogical mission.
6. **Synthesize.** A single ranked list of cosmetic issues, grouped by: (a) structural chrome (drawer, tabs, navigation), (b) the Paper system (print renderer, footer, header), (c) interaction surfaces (buttons, toggles, upload widget), (d) analytical marks (color, shape, legend). No more than 10 items per group.
## 5. Deliverable
A markdown document: `shane-cosmetic-critique_YYYY-MM-DD.md`, added to the project files, with:
- The ranked issue list
- Screenshot evidence for each
- Citation to the specific heuristic, Bringhurst principle, WCAG criterion, or comparative tool that supports the finding
- Proposed remediation for each, with effort estimate (quick / medium / substantial)
## 6. Constraints
- No redesign proposals that alter the information architecture (drawer=workshop / main pane=gallery) or the shared visual language with Ilya. Cosmetic refinement only.
- No introduction of new UI patterns (modals, tooltips, animations) unless justified by a specific heuristic violation. Restraint is the aesthetic.
- No critique of placeholder copy ("Aria or song title") unless the placeholder itself is confusing in context.
---
*Deferred until wiring is proven. Trigger condition: score upload → parse → render → overlay → print pipeline complete on a real score, with correction UI bound and fidelity banner rendering.*

---

## Addenda proposed by Claude (2026-07-13, for Dann's and Kimi's review; not part of Kimi's brief)

1. **Think-aloud sessions with two or three real singers.** Heuristic evaluation complements user testing; it does not replace it, and Nielsen himself is explicit on that point. Dann is designing alone, and the four lenses above are all expert-inspection methods: none of them can catch a mental-model mismatch the way ten minutes of watching a singer drop a score, calibrate, and print will. Even informal moderated sessions (a studio colleague, a student) belong in the protocol, ideally before the synthesis step so their findings rank alongside the heuristic ones.
2. **Double the state capture across EN and FR.** French strings run measurably longer than English; measure, wrapping, and clipping failures often exist only in French mode, and the project enforces 100% French parity. Protocol step 1 should capture every state twice.
3. **A screen-reader walkthrough, not only contrast and targets.** The wizard carries bespoke live-region machinery (persistent regions, speakable vowel names, the §4.6 glyph discipline). WCAG automated checks exercise none of it. One full VoiceOver pass through calibration and score upload should join the accessibility pass.
4. **A printed-artifact pass under Gould.** The brief benchmarks on-screen chrome; the project's acceptance criterion is a printed document legible to a singer (Appendices B and C as visual target, gould-vocal-engraving-rules_v5 as the only engraving authority). The critique should include the physical print, on paper and in hand, judged against those two sources rather than the screen lenses.
