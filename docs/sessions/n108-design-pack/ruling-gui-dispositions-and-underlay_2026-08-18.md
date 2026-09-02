# Fable ruling: the census dispositions, Underlay, and contextual sentences (2026-08-18)

**Copied verbatim from project knowledge (`claude/fable-ruling-gui-dispositions-and-underlay_2026-08-18.md`) into the repository on 2026-09-02 so that Design can read it. Amended by Dann's N.108 rulings of 2026-09-02, in this pack.**

**Ruled by Dann, 2026-08-18, second sitting of the Fable GUI session. This
closes the fourteen open dispositions from the control census. Full record:
`docs/sessions/fable-gui-rulings-2_2026-08-18.md`. Census (92 control
templates, every disposition with a `path:line`):
`docs/sessions/sonnet-memo-control-census_2026-08-18.md`.**

## Ruled by Dann

- **App bar keeps and re-keys**: same bar, sigil, language toggle; colour keyed
  to three destinations (Studio sage, Learn rose, Guide cobalt).
- **Drawer pulls**: mobile gets one labelled pull (⌃ DRAWER) on both portrait
  states, replacing both unlabelled handles; the desktop lip becomes the
  **bookmark tab** (flat, flush with the drawer edge, drawer-paper fill,
  outward-rounded corners only; option A of
  `docs/sessions/ilya-lip-options_r1_2026-08-18.html`).
- **The Underlay station**: fifth scrolling station, between Source and
  Analysis, holding the pairing queue, cursor, slide operations, and Start
  over, with an honest empty state when no score is loaded. English name
  **Underlay**; French NOT RULED (candidates shown: « répartition »
  recommended, « paroles », « pose du texte »); ships only with the full
  French strings table.
- **Contextual-sentences design** for the slide operations. Click grammar
  unchanged (N.55b R4). Clicking a paired note selects it; the station then
  shows that pairing with its repairs as plain sentences ("Slide this syllable
  and everything after it, one note later / earlier"). Verbs render only on
  selection. Finale's two scopes collapse to one automatic rule: a slide runs
  to the first open note, or the end if none. Rotate on multi-select only.
  Insert-with-ripple rejected (would rewrite R4). N.55b's map, states, and
  storage untouched.

## Defaults taken under tether 13, stated aloud, vetoable by one word

Note-click carve-out extends to the Marked score; update toast and install
prompt out of redesign scope; "one takeover" scoped to calibration
(confirmation dialogs are a different class and stay); pair-state persistence
per E.44 S2; `VoiceProfilePane` is the Marked score document.

## Open before Code builds

The E.44 S0 slate (verify or rule six items), the full French strings table,
Dann's voice-profile texts plus the mobile AI-slop thread, the briefs to Code,
and a named displacement or the beta line's close.

---

## N.70, for Design's reference (ruled 2026-08-16, from `docs/memory/STATE.md`)

iOS matches a file input's `accept` attribute by registered type and knows
none of `.musicxml`, `.mnx`, `.musx`, `.mscz`, so it greyed out every format
Ilya reads while leaving PDFs and photos selectable. **Dann's fix: a filtered
`accept` list on desktop, no `accept` at all on mobile** (`ScoreUploader.svelte`,
`acceptList`). Measured: attribute present at 1400 px, absent below 768.
