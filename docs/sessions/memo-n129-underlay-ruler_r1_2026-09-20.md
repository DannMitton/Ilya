# Memo: N.129 step 1, the underlay draws in the face its widths were measured from

2026-09-20. Step 1 only. Step 2 (hyphens are never omitted) is not built. No git
command that writes was run.

## 1. What changed

- `packages/score-parser/src/staff-renderer.ts`
  - `:1110` new export `CYR_FONT_FAMILY`, `'Source Serif 4', Georgia, 'Times New Roman', serif`
    (the stack at `app.css:23`), with a comment naming Dann's ruling and the N.153 opsz
    obligation in one sentence.
  - `:3340` (was `:3327`) the Cyrillic `<text>` now carries `font-family="${CYR_FONT_FAMILY}"`.
  - `CYR_FONT_PX` (was `:132`) deleted. Its two uses (`:1063`, `:3394`) now read
    `CYR_FONT_SIZE`, the export at `:1100`. There was no reason to keep both. The comment
    at `:130-131` says so.
  - SVG root (`:3475`) untouched. `underlay-widths.ts` untouched.
- `packages/score-parser/src/index.ts`: exports `CYR_FONT_FAMILY`.
- `packages/score-parser/src/underlay-widths.test.ts`: three new tests (new file: none).
  1. The table's declared face, read from its own header line
     ("Per-1000-em advance widths for **X** Cyrillic"), must be the first family of
     `CYR_FONT_FAMILY`. **Checked to fail**: with the constant set to Source Sans 3 it
     failed, then I restored it.
  2. Every Cyrillic underlay `<text>` in `renderDemo()` carries the constant, and measure
     numbers still carry no `font-family`.
  3. `CYR_FONT_SIZE` is 12.5.

## 2. Expectation, then measurement

**Expectation, stated before measuring:** no column moves, no hyphen endpoint moves,
pagination byte-identical, only a `font-family` attribute added to Cyrillic texts.

**Measured** on the demo fixture and on the engraved Without Sun no. 1
(`apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml`), paginated with
default options and the unmeasured profile (notation-only path), before and after:

- 207 Cyrillic underlay texts on the paginated Sunless; all 207 gained the attribute, and
  the after-output **with those 207 attributes removed is byte-identical to the before-output**
  (whole `PaginatedScore` JSON: every `x`, every hyphen `<line>`, every system).
- Pages 5 → 5, systems 18 → 18, line elements 597 → 597.
- The likeliest failure I predicted (a snapshot asserting no `font-family`) did not occur.

I dumped through a throwaway test that I then deleted. Nothing of it remains in the tree.

## 3. Gates

| gate | baseline | now |
|---|---|---|
| phonology | 216 | 216 |
| dictionary | 235 | 235 |
| web-check | 0 errors, 12 warnings, 5 files | same |
| web-test | 1263 | 1263 |
| score-parser | 567 passed, 5 skipped (572) | **570 passed, 5 skipped (575)** |

**One baseline moves: score-parser +3, the three new tests.** No existing test's expected
value changed. I did not edit `~/Downloads/ilya-ship.sh`; its literal is `567 ... (572)` and
will read DEVIATED until Dann moves it to `570 passed | 5 skipped (575)`.

## 4. NOT ESTABLISHED

- **T05 systems per page:** step 2 measure, and T05 is Dann's library document, not in the
  tree. Not measured.
- **The word `не прог ляд – на я,`:** the string appears in no fixture in the tree (grepped
  `ляд` in every `.musicxml`). Which song it is in is NOT ESTABLISHED.
- **Print and browser walk:** not done. The serif drawing is verified in the SVG string,
  not in a rendered page. Whether the Source Serif 4 letterforms actually load and draw at
  12.5 px in the pane is unlooked-at. WRITTEN, not DONE.
- I did not check for other consumers that read Cyrillic text by face.
  `apps/web/src/lib/shane/selection-ring.ts:207` finds Cyrillic by `font-size === 12.5`,
  which is unchanged (and also matches measure numbers, a pre-existing looseness).

## 5. Decisions the brief did not settle (mine, reversible)

- `CYR_FONT_FAMILY` carries the full stack from `app.css:23`, not just the face name.
- Test 1 parses the table's header comment, since the table exports no face. If someone
  rewords that header line, the test fails loudly rather than passing silently.
- `IPA_FONT_PX` and `IPA_FONT_SIZE` are the same duplicate pair. Left alone: out of scope.
