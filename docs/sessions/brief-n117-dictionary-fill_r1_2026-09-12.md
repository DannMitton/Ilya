# Brief: N.117, the dictionary load fills the pill

Serves **N.117**, numbered by Dann 2026-09-07, unplaced. This brief does not
displace anything: it waits behind the increment 3 walk and N.119 unless Dann
says otherwise.

Ruled by Dann 2026-09-12, on `docs/sessions/drawing-dictionary-progress_r1_2026-09-12.html`
(Plate B) and `_r2_` (vertical rejected): **the Transcribe and fit pill fills
horizontally with sage while the dictionary loads, and the label turns white as
the fill's edge crosses it.**

Read `docs/memory/CONTRACT.md` before you start. Read this brief in full before
you touch a file.

## 1. What is there now, read 2026-09-12 by the desk

- The pill is `IntakePanel.svelte:642-649`. It already swaps its own label:
  `{loaderState.isLoading ? t('input.transcribeLoading', language) : t('input.transcribe', language)}`.
- `canTranscribe` is false for the whole load (`+page.svelte:2044-2046`,
  `!loaderState.isLoading`), so the pill is `disabled` and
  `.action-btn:disabled` dims it to `opacity: .45` (`IntakePanel.svelte:1185-1188`).
  It is also `.btn-ghost`, because `transcribeActs` requires `canTranscribe`
  (`+page.svelte:3493-3497`).
- `loaderState.progress` is a real fraction: 0 to 1 by byte count when the
  response carries `content-length`, and `-1` when it does not
  (`loader.ts:91-92`, `:273-295`). The NDJSON merge path also sets `-1`
  (`loader.ts:639`).
- On a cache hit `progress` is set straight to 1 without passing through the
  middle (`loader.ts:704`, `:712`).
- A determinate sage-on-stone bar with an indeterminate fallback already exists,
  marked "Kimi spec", inside the Analysis station's empty console
  (`AnalysisStation.svelte:87-99`, `:165-202`). Analysis is closed by default
  since `9026a56`, so a singer does not see it.
- The string exists in both languages: `input.transcribeLoading`,
  "Loading dictionary…" and « Chargement du dictionnaire… » (`i18n.ts:171`).
  **No new string, and no French is owed by this item.**

## 2. What to build

1. **The fill.** Inside the pill, an absolutely positioned layer pinned to the
   left, `width: {progress * 100}%`, `background: var(--sage)`, under the label.
   The pill already needs `overflow: hidden` and `position: relative`; assert
   both before you add them.
2. **The label inverts.** A second copy of the same string, white, absolutely
   positioned over the first and clipped to the fill:
   `clip-path: inset(0 calc(100% - <pct>) 0 0)`. The white copy is
   `aria-hidden="true"`. **The accessible name must not double.**
3. **The loading pill is not dimmed.** Loading is not the same state as
   unavailable. Keep the button unclickable, and exempt the loading state from
   `.action-btn:disabled`'s `opacity: .45`. Do it with a class on the button,
   not by changing `canTranscribe`, which guards the action itself
   (`+page.svelte:2365`).
4. **Nothing appears for the first 200 ms.** DESK DEFAULT, because a warm cache
   completes instantly and a full-width flash is worse than silence. If the load
   finishes inside the delay, the fill never draws at all.
5. **The indeterminate case ships with it.** When `progress` is `-1`, draw
   Kimi's existing sweep instead of the fill: 30% width, the keyframes at
   `AnalysisStation.svelte:194-202`, reused, not re-coined. The label does not
   invert in this case; it stays stone.
6. **`prefers-reduced-motion`.** Under it, the fill still tracks progress but
   drops the `transition`, and the indeterminate sweep does not animate: draw a
   static 30% fill instead.

## 3. What NOT to do

- **Do not touch `AnalysisStation.svelte`.** Whether its bar is now a duplicate
  is Dann's, not this increment's. Say in your memo that it is still there.
- Do not change `canTranscribe`, `transcribeActs`, or anything in `loader.ts`.
- Do not add a string, in either language.
- Do not put a percentage numeral on the pill. The label is the label.
- Do not change the pill's height, padding, radius, or font.

## 4. Definition of done

- At 1400 px and at 390 px, with storage and the service worker wiped so the
  dictionary is fetched cold, the pill fills left to right and the label turns
  white behind the edge.
- The pill is not dimmed while loading, and clicking it does nothing.
- With the dictionary cached, a reload draws no fill at all.
- The accessible name of the button is the string once, not twice.
- Five gates at baseline. **Gate 4 moves if you add a test; say the new number
  and move `~/Downloads/ilya-ship.sh:79` before the ship.**

## 5. Measure one thing and report it

**Does Ilya's dictionary response carry `content-length` in production?** One
network read on the branch alias. It decides whether a singer ever sees a
determinate fill or only the sweep, and the desk has not measured it. Report the
header value or report that it is absent. Do not infer it from the code.

## 6. The return memo

`docs/sessions/memo-n117-dictionary-fill_r1_<date>.md`. Files changed, with
`path:line` for every claim. What you walked, at which width, on which build.
The gate table with baselines. The §5 measurement. And a section listing what
you could not establish.

**NOT ESTABLISHED beats a complete invented answer.**
