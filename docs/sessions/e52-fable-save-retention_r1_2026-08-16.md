# RETENTION — addendum r2 to the SAVE design: heavy sources, twinned versions, and the fate of ruling 2
**Fable, 16 August 2026. A conference, not a delegation: Dann asked for consensus between me and the coordinating session, whose four positions are tested in §9. Addendum to `fable-save-design_r1_2026-08-16.md` and `fable-save-socket_r1_2026-08-16.md`.**
**Read only, no git, Canadian spelling, no em-dashes. Code claims carry `path:line` or a command; research claims carry sources; reasoning without a citation says so.**

---

## 0. THE ANSWER, FOR DANN, IN ONE PARAGRAPH

Yes: for the heavy inputs there is a smaller stored version, and the trick is to notice that "what the human supplied" means two different things. When you drop in a MusicXML or a Finale file, the bytes are the music, so Ilya keeps every byte, and those files are small anyway (your largest measured 145,513 bytes). When you photograph a page, the bytes are not the music; **the ink is**. A 4 MB phone capture is mostly things no reader will ever use: colour, camera noise, and metadata. Ilya can keep the ink at full reading strength, in greyscale, at the resolution optical music readers actually need with margin to spare, for roughly a fifth to a third of the weight, and the conversion is invisible in the flow, exactly as you asked. What Ilya must never do is go one step further down to pure black-and-white, because deciding where grey becomes black is the first judgement call a reader makes, and storing that judgement would freeze your song at today's judgement, which is the very thing your own ruling exists to prevent. So the ruling survives, narrowed by one sentence you will be asked to ratify in §6.

---

## 1. WHAT IS TRUE IN THE TREE TODAY

- The picker advertises `.mnx,.json,.xml,.musicxml,.mxl,.musx,.mscz,.pdf,.mid,.midi,image/*` (`apps/web/src/lib/shane/ScoreUploader.svelte:48`).
- **No heavy format is ingested today.** PDF, image, and MIDI resolve to a calm "coming soon" note (`ScoreUploader.svelte:184-187`, copy at `i18n.ts:273-275`). This whole addendum therefore legislates for N.58 and N.59 before they arrive, which is the right time to do it.
- **The `.mscz` question the coordinator asked me to check: the path is live, not a stub.** `handleFile` detects `.mscz`, warms the webmscore converter, and injects it into ingest (`ScoreUploader.svelte:106`, `:113`, `:131-137`); routing through the converter to the MusicXML parser is the documented dispatch (`ingest.ts:20-22`). The `upload.soon.mscz` string fires only on `MSCZ_CONVERTER_UNAVAILABLE` (`ScoreUploader.svelte:217-218`), the converter-not-injected case. Whether a real `.mscz` converts end to end in a browser today is NOT ESTABLISHED here (no browser was run), but in the code it is an ingesting format, and for retention it is a zip either way.
- **Dann's own reader defines the extraction contract, and it is in the tree.** It opens its page image in greyscale, `cv2.imread(cfg['png'], cv2.IMREAD_GRAYSCALE)` (`tools/e16-harness/reader/reader.py:398`), and performs its own binarisation downstream (`tools/e16-harness/reader/substrate.py:12`, discussing "the binarisation threshold in the partially covered row"). Its working corpus runs at an interline of about 21 px: a staff-break threshold is computed as `1.7*21=35.7 px` against a measured 35 px gap (`reader.py:212`), on pages whose widest true system measures 1112 px (`substrate.py:22`).

That last point matters more than any external citation: **colour never enters Dann's reader, and black-and-white is made inside it, per page, adaptively.** Whatever we retain, greyscale is the reader's native food.

---

## 2. THE RETENTION POLICY (question 1)

One row per input kind the picker accepts. "Retained rendition" is what the library's `sources` store holds; the record always keeps the original file name, original byte length, and the original bytes' hash as facts, whatever is retained (main design §2.2).

| input kind | retained | fidelity | discarded | one song | one hundred songs |
|---|---|---|---|---|---|
| MNX (`.mnx`, `.json`), MusicXML (`.xml`, `.musicxml`) | the bytes, deflated at rest, restored byte-identical | perfect | nothing | 5 to 90 KB stored (text deflates roughly 10:1; reasoning, marked, from XML's redundancy; fixture floor 1,757 B measured) | under 10 MB |
| `.mxl`, `.mscz`, `.musx` | the bytes, stored uncompressed (already zips; gzip -9 grew the measured Kabalevsky 145,513 to 145,526, brief §3.5) | perfect | nothing | 30 to 150 KB measured | 3 to 15 MB |
| MIDI (`.mid`, `.midi`) | the bytes | perfect | nothing | typically tens of KB (reasoning, marked; MIDI is an event stream, not audio) | a few MB |
| vector PDF (notation-software export) | the bytes, as-is (PDF streams are already compressed) | perfect | nothing | typically 0.1 to 3 MB (reasoning, marked) | tens of MB only if the whole library were vector PDFs, which it will not be |
| scanned-wrapper PDF | the embedded page images, extracted verbatim, plus page order | exactly the signal the PDF itself carried | the wrapper's duplication: thumbnails, duplicate renditions, viewer furniture | the sum of its page images, commonly 0.3 to 1.5 MB per page (reasoning, marked) | budget-relevant; see §8 |
| raster capture, lossy input (JPEG, HEIC photo) | greyscale re-encode, JPEG quality about 0.85, resolution preserved up to a 4,000 px long edge, metadata stripped | at or above the §3 floor with margin | colour, EXIF, camera noise the encoder smooths | roughly 0.8 to 1.5 MB per page against 2.5 to 4.5 MB captured (reasoning, marked) | 20 to 40 MB for a hundred two-page photographed songs |
| raster scan, lossless input (PNG, TIFF-class) | greyscale, lossless: WebP-lossless where the platform encodes it, PNG otherwise | perfect at the pixel level after greyscale conversion | colour channels | commonly 0.2 to 0.8 MB per page (reasoning, marked) | 10 to 30 MB per hundred |

Two rules run through the table. **Lossless input is never re-encoded lossily, and lossy input is never re-encoded losslessly**: the first would discard signal, the second would embalm JPEG artefacts at PNG prices. And **the original's hash is always recorded**, so the record can always say precisely which bytes it was made from, even where those bytes were not kept.

---

## 3. THE FIDELITY FLOOR, RESEARCHED (question 2)

**Colour depth: greyscale, 8-bit, and never bilevel.** Three independent sources agree. Dann's own reader takes greyscale and binarises internally (`reader.py:398`, `substrate.py:12`). Audiveris, the reference open-source OMR engine, says in its scanning guide: "prefer grayscale images to black-and-white or color images," because it performs its own adaptive binarisation ([Audiveris scanning guide](https://audiveris.github.io/audiveris/_pages/guides/advanced/scanning/)). And the cautionary tale for baked-in bilevel is documented catastrophe: Xerox scanners using lossy JBIG2 silently substituted digits in scanned documents for years before D. Kriesel caught it in 2013 ([Kriesel's original report](https://www.dkriesel.com/en/blog/2013/0802_xerox-workcentres_are_switching_written_numbers_when_scanning), [The Register's coverage](https://www.theregister.com/2013/08/06/xerox_copier_flaw_means_dodgy_numbers_and_dangerous_designs/)). Symbol-substituting compression on a page a machine will later read is exactly the wrong object, so **JBIG2 in lossy mode is disqualified outright**, and bilevel generally is disqualified because binarisation is the extractor's first derived judgement, and storing a derived judgement is what ruling 2 exists to forbid. CCITT G4 survives in one narrow role: where a scanned PDF already carries its pages as CCITT bilevel, those bytes are the supplied signal and are kept verbatim (§4); Ilya just never manufactures bilevel itself.

**Resolution: the interline is the robust unit, and the literature and the tree agree on the number.** Audiveris asks for "about 20 pixels" between staff lines, calls below 200 DPI a resolution that "may hide key details," recommends 300 DPI for a standard page and 400 for small symbols, and calls more than 500 DPI waste ([Audiveris scanning guide](https://audiveris.github.io/audiveris/_pages/guides/advanced/scanning/)). Dann's reader's working corpus sits at an interline of about 21 px (`reader.py:212`). The agreement is not a coincidence: a vocal score's staff stands about 7 mm tall, which at 300 DPI puts the interline near 21 px (arithmetic, marked as reasoning). **The floor is therefore: interline no smaller than 20 px in the retained rendition, and retention aims a margin above the floor, near 28 to 30 px where the capture provides it, because the floor serves today's readers and the margin serves tomorrow's.** Until N.59's staff detection is available at import time to measure the interline directly, the operational proxy is: never downscale below a 300 DPI-equivalent page, cap the long edge at 4,000 px, and revisit the proxy once the reader can simply measure the interline on import (NOT ESTABLISHED item 3).

**Encoding, candidates and ratios.**

- **PNG**: universal, lossless, the baseline.
- **Lossless WebP**: Google's own study measures WebP lossless files about 26% smaller than PNG ([WebP lossless study](https://developers.google.com/speed/webp/docs/webp_lossless_alpha_study)). Chosen where the platform's canvas can encode it; whether Safari's `canvas.toBlob('image/webp')` encodes on current iOS is NOT ESTABLISHED, so PNG remains the guaranteed fallback and the design depends on nothing.
- **JPEG, quality about 0.85, greyscale**: for photographic captures. Universally encodable in every browser. Google's lossy study puts WebP 25 to 34% smaller than JPEG at equivalent quality ([WebP compression study](https://developers.google.com/speed/webp/docs/webp_study)), a nicety Ilya takes where encodable and ignores where not. That JPEG at this quality and resolution sits safely above the OMR floor is reasoning, marked as such: the OMR literature I could reach does not publish a JPEG-quality threshold (NOT ESTABLISHED item 2), and the mitigation is the resolution margin, which dominates.
- **AVIF**: excluded as impractical: no browser encodes AVIF from canvas without shipping a WASM encoder, which is bundle weight spent against no measured need.
- **CCITT G4, JBIG2**: no browser encodes them, lossy JBIG2 is disqualified above, and their one legitimate appearance is verbatim retention of streams a scanned PDF already contains.

---

## 4. PDF HANDLING (question 3)

Two objects, one extension.

**A vector PDF** from notation software carries the exact glyph geometry: it is the human-supplied artefact in the same sense a MusicXML file is, it is the input the `pdftomusic-pro-musicxml-from-vector-pdf` origin path expects (`packages/score-parser/src/types.ts:181-188` names the seven source paths), and rasterizing it would discard its best property. **Retained byte for byte.** Vector PDFs of songs are not heavy; where one is (embedded cover scans, whole-anthology exports), the budget of §8 handles it as it handles anything else.

**A scanned-wrapper PDF** is a folder of page images wearing a PDF coat. What the human supplied, in substance, is the page images; the coat is duplication. **Retained: the embedded page image streams, extracted verbatim, byte for byte, with their page order recorded.** JPEG streams stay JPEG; CCITT stays CCITT (§3). Only where an embedded image is grossly oversized against the §3 floor is it transcoded per the raster policy, and the original stream's hash is recorded as always.

**Telling them apart.** Mechanically, not heuristically where possible: a page whose content is a single full-page image XObject with no text or path-drawing operators is a scan; a page with path and text operators and no full-page image is vector. Mixed and ambiguous pages fall back to vector treatment, byte-for-byte retention, because the conservative direction is to keep more. This classification needs a PDF structure walk, which arrives with N.59's PDF work in any case; the policy is written now so N.59 implements it rather than improvising one (the per-format score arrival audit STATE.md records as never written would house the implementation detail).

---

## 5. THE `.musx` RULING, AND WASM-CONVERTED FORMATS GENERALLY (question 4)

**`.musx` is kept byte for byte, and the coordinator's unresolved point 4 resolves in favour of the ruling.** Four reasons, in order of weight:

1. **The weight argument does not apply to it.** Measured `.musx` files run 64,286 to 145,513 bytes (brief §3.5). The heaviest `.musx` is lighter than one normalized photographed page. A retention policy exists to tame megabytes; `.musx` has none.
2. **Retention adds zero static weight.** The 4.4 MB `denigma_wasm_mnx.wasm` (`du -sh apps/web/static/*`, run this session: 4.4M of 8.0M total) ships for the upload path regardless of what storage does, and it is already lazily warmed only when a real `.musx` arrives (`ScoreUploader.svelte:109-113`, the N.26 fix). Storing the converted MusicXML instead of the `.musx` would save at most tens of kilobytes per song and no static bytes at all.
3. **Discarding it is the exact scenario ruling 2 names.** The denigma path is graded `high`, not `native` (`types.ts:170-175`): conversion fidelity is expected to improve. A song stored as today's conversion is frozen at today's converter, with nothing to re-run when it improves. That is the brief's own words (§4.2) applied literally.
4. **Storing the conversion would store a derived artefact**, against CONTRACT §6, with no ruled exception.

The honest cost is conversion time on every open, which is NOT ESTABLISHED (main design §9.3) and is a time cost, not a storage cost: it is bounded by a progress affordance if measurement demands one, and the existing uploader already names that wait honestly (`upload.status.converting`, `ScoreUploader.svelte:116-120`). The same reasoning covers `.mscz` and webmscore: keep the bytes, convert on open, never store the conversion.

---

## 6. DOES THE RULING SURVIVE? (question 5)

**Yes for notation, narrowed for pictures, and the narrowing is named, not quietly interpreted.** Ruling 2's stated purpose is the ability to re-run a better extractor against undegraded input. For notation formats the bytes are the input and byte-identity is the only fidelity there is. For a picture, byte-identity and fidelity come apart: a greyscale re-encode above the floor carries everything any reader, present or future, will consume, at a fraction of the weight, while a bilevel copy destroys exactly the signal adaptive binarisation needs. The ruling's purpose survives; its letter needs one amendment for raster input.

**The replacement rule, one sentence, for Dann to ratify or refuse:**

> **Store what a human supplied: notation byte for byte, and a picture as its ink, in greyscale at no less than the reader's working resolution with margin, with the original's name and hash recorded whether or not its bytes are kept.**

If Dann refuses the amendment, the fallback is byte-for-byte retention of raster captures too, and §8's budget arithmetic simply runs three to five times higher; nothing else in the design changes. This is his call, and the design works under either answer.

---

## 7. WHAT THE SINGER IS TOLD (question 6)

**Dann's instruction holds in the flow: the conversion is silent there.** No dialog, no banner, no per-import notice, and, per the standing prohibition, **no mark on the page, ever**: the page displays and prints, the drawer manipulates, and a lossy retention mark on every photographed song's sheet would be a mark that appears on everything and says nothing.

Lossy retention still gets disclosed, in the two places where a fact belongs rather than a warning:

- **In the record and the binder.** The source entry carries `originalFileName`, `originalByteLength`, the original's hash, and, where a rendition was made, the rendition's parameters. That is provenance honesty (main design §8's design consequences), it costs no pixels, and it means the answer to "what exactly do I have?" is always in the file.
- **In the Guide, once.** One sentence in the existing Guide surface stating that photographed and scanned pages are stored as reading copies in greyscale and that the original stays in the singer's own camera roll or files. Written once, in both languages, French shown to Dann first (CONTRACT §5).

The one moment disclosure becomes active rather than passive is failure: if a rendition cannot be made (decode failure, quota), the drawer says so through the ordinary save-state surface (socket addendum §1), because a silent save site is prohibited while N.27 is open.

---

## 8. THE BUDGET (question 7)

**Arithmetic first.** With this policy, a hundred-song library of Dann's realistic shape (mostly notation files, some photographed songs) runs roughly 15 to 50 MB of sources plus about 2.5 MB of records. Even a hundred photographed two-page songs is about 20 to 40 MB (§2). Against origin quotas that start in the hundreds of megabytes (main design §6, order-of-magnitude, real quota NOT ESTABLISHED until step 1 reads `estimate()`), there is no cliff at the hundred-and-first song and none at the twentieth photograph.

**So: no hard per-song ceiling and no hard library ceiling.** Hard ceilings manufacture refusals at arbitrary numbers. Instead, three mechanisms:

1. **A soft advisory**, driven by real numbers: when `estimate()` reports usage above roughly 80% of quota, or a single song's sources exceed about 25 MB, the drawer's ordinary notice suggests exporting a binder and mentions the number. Advice with a figure, never a refusal.
2. **Placements always survive, by an amendment to the one-transaction rule.** The main design §2.1 wrote one atomic transaction across `songs` and `sources`. Amended: the save first attempts the atomic pair; on `quota-exceeded` it retries with the record alone, reports "the score was too large to store; your placements are saved; the score will be asked for on next open," and the re-attach path (main design §3 step 3 behaviour) does the rest. The tiny, irreplaceable thing is never hostage to the large, replaceable thing.
3. **Sources are independently evictable, by the singer only.** A per-song "Remove stored score, keep my work" control, which the separate `sources` store makes a one-line delete. Ilya never evicts a source on its own initiative: an automatic eviction policy is a silent destroyer of exactly the artefact ruling 2 protects, and the singer with a full disk is told the truth and handed the lever instead.

---

## 9. THE CONFERENCE: the coordinator's four positions, tested (question 8)

1. **"Notation sources stay byte for byte."** Agreed without reservation, and extended one step: plain-text notation deflates at rest and restores byte-identical (§2), which is weight saved at zero fidelity cost.
2. **"The original capture is not sacred; the signal is."** Agreed in substance, and sharpened where it was permissive: the position as stated would admit a bilevel rendition if OMR tolerated one, and §3 shows that is the wrong test. Binarisation is the extractor's first derivation, both extractors in evidence binarise adaptively per page (`substrate.py:12`; [Audiveris](https://audiveris.github.io/audiveris/_pages/guides/advanced/scanning/)), and the Xerox precedent shows what baked-in bilevel does to machine-read pages. The floor has a colour-depth clause: 8-bit greyscale, never bilevel, no matter what ratio bilevel offers.
3. **"The smallest artefact a future OMR run cannot tell apart from the original."** Disagreed with the framing, agreed with the intent. "Cannot tell apart by a future reader" is a counterfactual no test can check: future readers are not available to ask. The replacement is a concrete, checkable floor with a stated margin (§3): greyscale, interline at least 20 px retained near 28 to 30, lossy re-encoding only of already-lossy input. The margin is precisely the humility the counterfactual was reaching for, in a form a gate can verify.
4. **"`.musx` unresolved."** Resolved: byte for byte (§5). The deciding observation is that the weight problem `.musx` was suspected of does not exist: it is one of the lightest things in the table, its WASM ships regardless, and the conversion cost is time, bounded by an affordance, not storage.

Consensus position after the conference: the coordinator's frame survives with two amendments, the bilevel prohibition and the testable floor, and one resolution, `.musx`. Nothing in the four positions had to be discarded outright.

---

## 10. NOT ESTABLISHED

1. **Whether `.mscz` ingest succeeds end to end in a browser today.** The code path is live and injected (`ScoreUploader.svelte:106-137`); no browser was run in this commission. One drop of a real `.mscz` settles it.
2. **A published JPEG-quality threshold for OMR input.** The literature I reached specifies resolution and colour depth ([Audiveris scanning guide](https://audiveris.github.io/audiveris/_pages/guides/advanced/scanning/)) but not a lossy-quality floor. Quality 0.85 is engineering margin, marked as reasoning, protected by the resolution margin.
3. **The interline-measurement proxy.** Until N.59's staff detection runs at import, the 300 DPI-equivalent and 4,000 px long-edge proxies stand in for measuring the interline directly; they should be replaced by the measurement the day the reader can supply it.
4. **Safari's ability to encode WebP from canvas on current iOS.** The design falls back to PNG and depends on nothing here.
5. **HEIC decode outside Safari.** Phone captures may arrive as HEIC, which Chrome does not decode natively; whether N.59's intake needs a decode path or a "please use JPEG" message is a question for N.59's brief, noted here so it is not lost.
6. **Real conversion time on open for `.musx` and `.mscz`** (carried from the main design §9.3); it bounds the §5 ruling's cost and decides whether a progress affordance is needed.
7. **The real quota on Dann's devices** (carried; step 1 reads it), which turns §8's soft advisory from a percentage into a number.
8. **Typical sizes for vector PDFs, scanned-PDF page streams, and MIDI files in Dann's actual repertoire.** The table's figures for those rows are order-of-magnitude reasoning, marked as such; his own files will calibrate them the day the formats land.

---

*Prepared 16 August 2026 against the mounted tree, the staged copies, and the sources linked above. The reader facts are from `tools/e16-harness/reader/`, read in targeted extracts this session. Measured sizes are the brief's §3.5 and this session's `du`. Where a number is reasoning rather than measurement or citation, the table and text say so at the point of use.*
