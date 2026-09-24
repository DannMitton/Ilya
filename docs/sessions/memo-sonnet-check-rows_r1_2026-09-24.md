# MEMO. The nine CHECK rows, one look each

**Sonnet, 2026-09-24, code-read only, read-only session.**

| row | verdict | evidence (path:line) | fix scope (IN only) |
|---|---|---|---|
| UNSETTLED-10, `.mscz` in browser | CLOSED (code) | `mscz-converter.ts:1-60` (full converter); `ingest.ts:246-260` dispatches `deps.msczConvert`; `ScoreUploader.svelte:569` wires it (`getConverter().convert`); `i18n.ts:896` + `ScoreUploader.svelte:853` show "coming soon" fires only as the `MSCZ_CONVERTER_UNAVAILABLE` fallback, not the normal path | n/a |
| OWED-9, `sustain.ts`/`watchlist.ts` stale field | CLOSED | N.128 shipped `085bb9e` (`LOG.md:3766`); `correction.ts:358-424` (`reflowOnsets`) returns corrected `rhythmicPosition`; `+page.svelte:788` `correctedLine = applyCorrections(...)`; `+page.svelte:1469-1485` `correctedScore.result.score.vocalLine = correctedLine`; `InsightsPane.svelte:108,121,128` and `VoiceProfilePane.svelte:496` both take `ingested={correctedScore}` and build `analyzed`/`watchList` from it | Both consumers now read events sourced from the post-correction line, not the reader's raw events. |
| INBOX-21, re-seat loses punctuation | CLOSED | `clitic-seat.ts:358-364` `carryPunctuation`, called at `score-seat.ts:114` and `clitic-seat.ts:311`; first added `c574cf88`, extended `4d79f24a` (N.118) | Both re-seat call sites carry trailing punctuation when the word matches. |
| INBOX-22, stale last note | CLOSED | `pairings.ts:661-687` `vacatedNotes`: inside the run always vacated, outside the run (incl. last note) vacated when `queueExhausted`; wired at `+page.svelte:534`; shipped `00149c3b` (N.113a) | A fully-seated piece's last note blanks; only an unfinished queue leaves it showing file text, by design. |
| INBOX-23, stray IPA 'a' on blank | CLOSED | `VoiceProfilePane.svelte:631-639` writes an explicit `''` via `applyBlank` (`pairings.ts:1163-1168`) so `staff-renderer.ts`'s `ipaPreview?.[id] ?? a?.vowel` fallback can't fire; shipped `d5a49ffc` (N.111-3a) | Blanked notes now get an explicit empty IPA string, not an omitted key. |
| INBOX-5, colour print | NOT ESTABLISHED (code gives no verdict) | `app.css:260-378` `@media print`: forces white backgrounds, hides chrome; no `print-color-adjust`/`-webkit-print-color-adjust` anywhere in the repo (grep, zero hits); `LOG.md:655-659` records the desk's own theory that a browser/driver greyscale setting, not CSS, explains "greyscale except the flag" | — |
| UNSETTLED-8, VERIFY/USER OVERRIDE in print | NOT ESTABLISHED (code read only) | `WordStack.svelte:376-386` `@media print` touches only `.word-stack` background and `.verify-label` background; it does not hide `.verify-label`, `.is-inferred::before`, or `.provenance-icon`/`user-override` svg (line 154); `app.css`'s global print block (260-378) hides only header-bar/drawer/tab-bar/ribbon/watermark/vercel-sigil, not these | — |
| N.121(a), N.121(b) | CLOSED | (a) `i18n.ts:631,643` placeholder + caption strings, wired `IntakePanel.svelte:370,430-433`, first shipped `cedf246e`; (b) `i18n.ts:655` `intake.placed`, wired `bandState.ts:102` | n/a |
| N.72 residue, iPhone home-screen | CLOSED (as a documentation question) | `OWED.md:580-583`: current text still reads "Dann to rule"; `LOG.md:660-662` "CLOSED AS KNOWN, no build"; `LOG.md:3736` confirms N.72 itself closed 2026-08-21, this residue carried over and never ruled | — |

**The two prints Dann should make:**

1. For INBOX-5: print any page with coloured turning noteheads, with the OS/browser print dialog set to colour (not "black and white"/greyscale), and check whether the noteheads and marks keep their colour on paper. No CSS in the repo forces or blocks colour, so the driver's own colour/greyscale toggle is the only candidate left.
2. For UNSETTLED-8: print a page carrying an inferred-stress word (dashed VERIFY box) and a user-override word (the pin-shaped badge), and check both appear on paper exactly as they show on screen. Code prints them by default; the only open question is whether that is the CONTRACT §6 exception Dann intends.

## NOT ESTABLISHED

- **INBOX-5.** Code carries no rule either way; whether print comes out greyscale is a driver/OS setting outside the CSS this session could read. Needs Dann's print, per above.
- **UNSETTLED-8.** Code shows both marks print by default; whether that is the ruled CONTRACT §6 exception (rather than an oversight) was not checked against CONTRACT.md in this pass and needs Dann's print, per above.
