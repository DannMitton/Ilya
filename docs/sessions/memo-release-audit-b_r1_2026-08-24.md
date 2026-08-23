# MEMO. Release re-audit, half B: upload, residue, open source, provenance

Run 2026-08-24 by an Opus subagent from the desk, on Dann's ruling. Read-only
against the tree at or after `e71e974`. Companion:
`memo-release-audit-a_r1_2026-08-24.md`. The agent's text follows verbatim.

---

Method note: `/usr/bin/grep` on this machine is GNU grep 3.7 and `/usr/bin/rg`
is ripgrep 13.0.0. Neither is a `.gitignore`-honouring shim, and every search
below passed explicit paths.

## 1. Score upload, as shipped

### The accept list

Two accept lists exist and they are not identical.

- `apps/web/src/lib/shane/ScoreUploader.svelte:104` holds the live one:
  `'.mnx,.json,.xml,.musicxml,.mxl,.musx,.mscz,.pdf,image/*'`.
- `lib/shane/ingestion/format-detection.ts:54` exports `ACCEPTED_EXTENSIONS`
  with the same members in a different order. No importer exists anywhere in
  `apps/web/src`, so it is a dead export that can drift from the live string
  without anything noticing.

The attribute is conditional: `ScoreUploader.svelte:128` sets
`acceptList = isMobile ? undefined : ACCEPT`, bound at `:719`, reasoning at
`:105-127` (iOS matches `accept` by registered type). `isMobile` is a width
test, named as a consequence at `:122-125`.

### What each format does end to end

Detection is magic bytes first, extension second (`format-detection.ts:165-215`).
Dispatch is `ingestScoreFile` at `lib/shane/ingestion/ingest.ts:158-262`.

| Input | Route | Ends at |
|---|---|---|
| `.mnx` / JSON with `"mnx":` | `ingest.ts:167-171` | `MnxScoreParser`, `mnx/direct` |
| MusicXML | `ingest.ts:173-177` | `MusicXmlScoreParser`, `musicxml/direct` |
| `.mxl` | `ingest.ts:179-194` | rootfile via `META-INF/container.xml`, `musicxml/mxl` |
| `.musx` | `ingest.ts:196-208` | denigma WASM worker, then MNX, `mnx/denigma` |
| `.mscz` | `ingest.ts:244-260` | webmscore, then MusicXML, `musicxml/webmscore` |
| PDF (`%PDF`) | `ingest.ts:210-242` | page reader, then MusicXML, `musicxml/reader`, `sourceFormat: 'pdf'` |
| Image (PNG, JPEG, GIF, BMP, WEBP, HEIC/HEIF/AVIF) | `ingest.ts:210-242` | same reader route, `sourceFormat: 'image'` |
| MIDI (`MThd`) | refused | `upload.err.midi` |
| `.mus` | refused by name | `upload.err.mus` |
| ZIP, unknown extension | refused | `upload.err.zipUnrecognised` |
| JSON without `"mnx":` | refused | `upload.err.jsonNotMnx` |
| XML, other root | refused | `upload.err.xmlNotMusicxml` plus the root name |

The `.mscz` "coming soon" copy at `i18n.ts:386` is unreachable from the
uploader: it fires only on `MSCZ_CONVERTER_UNAVAILABLE` (`ingest.ts:245`), and
`ScoreUploader.svelte:276` always supplies `msczConvert`.

### Does PDF import reach a rendered score?

Yes, by way of the page-reader flow, with the two questions asked before the
read:

1. `ScoreUploader.svelte:236-241`: on a picture with no stored answers,
   `ui = { kind: 'asking', file }`, nothing read.
2. The two questions render at `:602-630`: clef (three choices, `:160-164`)
   and key signature in fifths (`:170`). Defaults treble, no accidentals.
3. "Read this page" (`:360-363`) re-enters `handleFile` with the answers.
4. `:303-308` imports `./engine/page-pdf`; `rasterizePdf` renders every page
   at 400 DPI to greyscale PNG (`engine/page-pdf.ts:41`, `:51-111`).
   `pdfjs-dist` pinned exactly at `6.2.108` (`apps/web/package.json:24`).
5. Ink to the Pyodide worker (`:341-346`), output to MusicXML at
   `ingestion/recognized-to-musicxml.ts`, then the ordinary MusicXML parse
   (`ingest.ts:221-226`).
6. Arrival through the same `oningested` callback as every format
   (`+page.svelte:945`, `:2072-2073`). No special case.

Stated boundaries: the PDF is stored byte for byte, not as rasters
(`ScoreUploader.svelte:317-321`, `page-pdf.ts:21-24`); `pdfjs-dist` has no
`standardFontDataUrl`, so a PDF relying on non-embedded standard fonts may
render text wrong (`page-pdf.ts:26-30`).

### Does photograph import fail honestly?

It does not fail; a photograph is a routable format
(`format-detection.ts:182-186`). On success the singer sees the format label
`upload.format.imageReader` (`i18n.ts:394`), the dismissible fidelity banner
`upload.banner.reader` (`i18n.ts:396`), and the read report in the drawer
(`ScoreUploader.svelte:649-698`, keys `upload.report.*` at `i18n.ts:413-420`).
Honest failure copy exists for real failures: `upload.err.readerLoadFailed`
(`i18n.ts:422`), `upload.err.pageReadFailed` (`:423`),
`upload.err.imageUndecodable` (`:424`), `upload.err.pdfUnreadable` (`:425`),
mapped at `ScoreUploader.svelte:478-486`, all with French.

### Measured error or accuracy rate for the reader

Numbers exist; none is an end-to-end note accuracy rate on real singer inputs,
and two attractive-looking numbers measure something else:

- `tools/e16-harness/output/scorecard.md` shows `pitchF1 1.000` on all six
  pieces. **This is a stub recognizer**, per `tools/e16-harness/README.md:29-32`.
  Quoting it as reader accuracy would be a category error.
- `homr-scorecard.json` (pitch precision 0.1095, recall 0.1498; rhythm 0.6183 /
  0.8458 over 921 truth notes) measures **homr, a candidate engine, not the
  shipped reader**.
- The shipped reader's own numbers are component-level: staff detection 45
  correct, 1 loud, 1 silent over 47 pages (`tools/e16-harness/reader/README.md:105`);
  one blind page, 24 of 24 pitches, one duration defect, ruled PASS WITH NAMED
  DEBT 2026-07-27 (`:124`); piece 06, 20 of 37 notes abstain on duration
  (`ENVIRONMENT.md:648-651`).
- The repo records the gap in its own words: "Accuracy at s other than 17 is
  NOT ESTABLISHED" (`e57-brief-to-code-n59_r1_2026-08-16.md:188-189`); "The
  like-for-like was never measured. Do not report one as the other."
  (`ENVIRONMENT.md:636-638`).
- Known defects that emit confidently rather than abstaining:
  `tools/e16-harness/reader/README.md:101-120`, including the beam false
  positive (`:113`) and the unsound step 3 grouping search (`:119`).

### One gate that governs the whole upload surface

The uploader sits inside `{#if INCLUDE_SHANE}` (`+page.svelte:2056`), a
build-time literal from `lib/wall.ts:6-7`. `apps/web/.env.example:1-4` says to
leave `PUBLIC_INCLUDE_SHANE` unset in production builds; `apps/web/.env:1`
sets it to `true`; `.gitignore` carries no `.env` rule.

## 2. Visible-list residue, verified fresh

### N.17: `100vh`

Three occurrences remain: `+layout.svelte:15` (`.app-shell`),
`+page.svelte:3182` (`.app-content`) and `:3187` (`.main-content`), the latter
two inside `@media (max-width: 767px)` (`:3179`). `100dvh` is used once, at
`Drawer.svelte:1525`. The two `100vh` rules that would benefit most sit inside
the phone breakpoint itself. `+layout.svelte:19-25` neutralizes the shell
height for print.

### N.19: the calibration `updatedAt`

Still written, never printed. Written at `CalibrationWizard.svelte:426`,
`:454`, `:492`, `:666`, and `profileStore.ts:208`; declared at
`profileStore.ts:75`. The only date the profile UI prints is `createdAt`
(`ProfileSwitcher.svelte:293`, `fmtDate` at `:209`). Every other `updatedAt`
consumer belongs to the song library, not the voice profile. No i18n key
contains "updated" or « mis à jour ».

### N.27: the silent save-failure seam

Both halves confirmed. `profileStore.saveStore` still catches and drops, now
at `profileStore.ts:230-238`, returns `void`, so no caller can learn the write
refused. The recommendation sits at the reporting seam, the doc comment on
`Library.save` at `library/library.ts:288-310` above the method at `:311-329`,
naming `saveStore` as "the last catch-and-drop of its kind in the tree". Both
named strings exist: `storage.quotaFull` (`i18n.ts:734`) and
`storage.saveFailed.generic` (`i18n.ts:715`), each with French. One drift: the
comment cites `profileStore.ts:217-225`; the function is now at `:230-238`.

### The watch band

`WATCH_HEADER` at `watchlist.ts:92` is the bare English literal
`'Places to watch'`. **`watchEntryLine` at `watchlist.ts:530-590` builds every
line from English template literals; all eight branches are English-only**
(range `:540-543`, crossing `:551`, cover `:559`, tracking `:567`, turnover
`:576`, passaggio `:581-582`, timbre `:586`, sustain `:589`). Two helpers are
English-only (`transpositionPhrase` `:508`, `joinIntervals` `:514-520`), and
the appended advice clause from `advice-resolver.ts:127` is English-only,
appended at `:552`, `:560`, `:568`, `:577`.

`VoiceProfilePane` prints them in French mode: import at
`VoiceProfilePane.svelte:83`, render at `:790` (`aria-label={WATCH_HEADER}`),
`:791` (visible header), `:794` (per entry). Neither call receives a language
argument, and neither has one to receive. The component has the language
(`:98`, `T` at `:222`) and uses it for the octave notice eight lines above
(`:787`). The band renders whenever it has entries (`:500`) on the commentary
page above a `PageFooter` (`:800`), so it prints. This contradicts
`CONTRIBUTING.md:57` on bilingual parity.

## 3. Open-source readiness

### Licence

MIT. `LICENSE:1`, copyright Dann Mitton 2026 (`LICENSE:3`). Declared
consistently at `package.json:5`, `apps/web/package.json:6`, `README.md:95`.

### Does the README describe the current app?

Partly. It describes the transcription tool and LEARN accurately and does not
know about roughly half of what ships. Omitted entirely: the Guide surface;
Studio and the marked score; score upload in any format; voice calibration;
the song library and the `.ilya` binder; the `@ilya/score-parser` package.

False or drifted claims:

| Claim | Where | Status |
|---|---|---|
| `pnpm test:e2e` runs Playwright | `README.md:46` | False as written: no root `test:e2e` (`package.json:6-12`); the script exists only in `apps/web/package.json:17` |
| `+page.svelte # Application shell and LEARN content` | `README.md:64` | False: LEARN lives in `Reading/LearnContent.svelte` (4,099 lines) |
| Three packages | `README.md:66-69`, `:75` | False: four, `score-parser` omitted, a first-class dependency (`apps/web/package.json:23`) |
| Project structure block | `README.md:51-73` | Materially incomplete: omits `score-parser`, `tools/`, `docs/`, `lib/shane/`, `lib/library/`, `Reading/` |
| Node 18 or later | `README.md:31` | Matches `package.json:19-21`; CI pins Node 20 (`ci.yml:24`), harness needs 22.6; whether 18 builds is NOT ESTABLISHED |

### CONTRIBUTING against the actual gates

`CONTRIBUTING.md:42-45` names `pnpm test` and `pnpm test:e2e`. The real gate,
`.github/workflows/ci.yml`, runs three things: `svelte-check` against a
baseline of 23 known errors (`ci.yml:38-70`, never mentioned in CONTRIBUTING),
`pnpm test` (`:72-73`, matches), and the build (`:75-76`, not mentioned).
Playwright is not in CI at all; the one command CONTRIBUTING names as a gate
never runs on a pull request and does not exist as a root script.
`CONTRIBUTING.md:30` repeats the three-packages error.

### Code of conduct

None. `.github/` holds only `workflows/ci.yml`: no issue templates, no PR
template, no `CODE_OF_CONDUCT.md`, no `SECURITY.md`. For a project inviting
outside contributions this is the most conspicuous gap in the governance
surface.

### One working-tree oddity

`apps/web/src/lib 2/` exists and is empty: a Finder duplication artifact,
untracked, but visible to anyone listing `src/`.

## 4. Emitted-document provenance

### The print footer

One component serves both print paths:
`lib/components/Paper/PageFooter.svelte`, mounted by `TitlePage.svelte:174`,
`SubsequentPage.svelte:92`, and three times in `VoiceProfilePane.svelte`
(`:755`, `:800`, `:883`). It carries, at `PageFooter.svelte:73-82`:

1. **The attribution sentence** (`footer.attribution`, `i18n.ts:231` English,
   `:232` French): "Free and open source, Ilya 2026a operationalizes Craig
   Grayson's Russian Lyric Diction (University of Washington, 2012). Stress
   data and translation glosses via kaikki.org (CC BY-SA 4.0), test text via
   www.lieder.net. Made with love in Canada [flag]".
2. **The flag**: an inline SVG of the Canadian flag with the full maple-leaf
   path, rendered 14 by 7 px, `aria-label="Canada"`, embedded in both language
   strings. It prints because it is markup in the document, and it prints in
   colour because an SVG `fill` is foreground paint.
3. **One URL**: `https://dannmitton.com`, hard-coded at `PageFooter.svelte:76`,
   styled to look like plain text (`text-decoration: none !important`, `:176`).
4. **No name**: neither "Dann Mitton" nor any author name appears. The domain
   is the only thing that traces to the author.
5. **A version**: "2026a", hard-coded inside the attribution string, not read
   from any build variable.
6. Page numbering (`:80`), the provenance legend (`:27-64`), and the Fit
   broad-analysis note (`:67-69`).

**Gap: `ReadingPaper.svelte` mounts no `PageFooter`.** Learn and Guide render
into it (`+page.svelte:2356-2370`), so a printed Learn or Guide page carries no
attribution, no flag, no URL, and no page number.

### The `.ilya` binder export

The manifest (`binder.ts:33-39`, built `:143-153`) carries `format:
'ilya-binder'`, `schema: 1`, `appVersion`, `exportedAt`, and the song list.
**It carries no author name, no URL, no licence, no copyright notice, and no
application name beyond the format string.** `appVersion` comes from
`$app/environment`'s `version` (`+page.svelte:66`, `:1174`), and
`svelte.config.js:18-21` leaves `version.name` unset, so the shipped value is
SvelteKit's default `Date.now().toString()`: a millisecond epoch, not the
"2026a" the footer advertises. The binder tests use `'2026a'` as fixture
(`binder.test.ts:107` and elsewhere), which makes the shipped value look more
meaningful than it is. The absence of a sharing affordance is deliberate and
documented at `binder.ts:8-19`.

## What I could not establish

NOT ESTABLISHED beats a complete invented answer.

- **Any end-to-end accuracy or error rate for the shipped page reader on real
  singer inputs.** The 1.000 scorecard is a stub; homr is not the shipped
  reader; the reader's own numbers are component-level or single-page. No rate
  was invented.
- **Whether PDF import works in a browser.** The code path was read end to
  end; nothing here is a runtime observation.
- **Whether `apps/web/.env` is tracked by git**, and whether the README's
  remote URL is correct. Both need git, out of scope.
- **Whether Node 18 actually builds this tree.**
- **Whether the two `100vh` rules in the phone breakpoint cause a visible
  defect.** Needs a device walk.
- **The exact `appVersion` string a production binder carries.** The value
  exists only at build time.
- **Whether printed Learn and Guide pages are reachable as a print target at
  all.**
- **Whether `static/sw.js` delivers working offline behaviour** as
  `README.md:13` claims.
