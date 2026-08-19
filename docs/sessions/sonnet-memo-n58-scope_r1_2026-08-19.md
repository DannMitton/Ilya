# Sonnet memo: N.58 scoping, MIDI import, 2026-08-19, tree b0fbf14

**Farmed by Fable on Dann's instruction, replacing the lost 2026-08-14 brief.
Cost: 136,545 Sonnet tokens over 42 tool uses, inside the stated ~250k bound.
Filed verbatim below the rule; nothing edited except this header. The verdict
in one line: MIDI import is not cheap, it is a third parser (roughly 450 to
700 implementation lines plus tests plus fixtures built from scratch), its
old blocking objection (no lyrics) is gone because N.55b hand pairing now
exists, and the choice between "build after N.73" and "drop with the promise
removed" is Dann's taste ruling, put to him 2026-08-19.**

---

## 1. What a MIDI file can give Ilya

A Standard MIDI File (SMF) is chunked binary: one `MThd` header (format 0/1/2, track count, division/PPQ) followed by one or more `MTrk` chunks of `<delta-time><event>` pairs, delta-times encoded as variable-length quantities (7 bits/byte, high bit = continuation), channel-message status bytes eligible for running status (SOURCED, https://midimusic.github.io/tech/midispec.html, a mirror of "Standard MIDI-File Format Spec. 1.1"). Meta events relevant here:

| Meta event | Code | Ilya field |
|---|---|---|
| Set Tempo | `FF 51` | tempo map only; irrelevant to note values once ticks are in quarter-note units |
| Time Signature | `FF 58` | `TimeSignatureChange` |
| Key Signature | `FF 59` | `KeySignatureChange` |
| Sequence/Track Name | `FF 03` | track-selection heuristic (§2), not `partName` reliably |
| Lyric | `FF 05` | `SyllableInfo.text`, maybe |
| End of Track | `FF 2F` | track boundary |

Per-field verdict against `VocalLineEvent` (`packages/score-parser/src/types.ts:439-491`):

| VocalLineEvent field | MIDI |
|---|---|
| `pitch.step/octave` (types.ts:495-508) | **Provides** the MIDI note number; **cannot provide** enharmonic spelling (`alter`) directly: a 61 could be C sharp 4 or D flat 4, and spelling must be inferred from the key-signature meta event or guessed. |
| `duration.base/dots/tuplet` (types.ts:521-538) | **Cannot provide.** SMF states only the sounding tick length. MusicXML/MNX carry the notated value directly (`musicxml-parser.ts:385-388`, `:670-706`: the parser reads both a divisions-based sounding length AND a separate notated type). MIDI has no second channel: base, dots, and tuplet must be reconstructed from tick math against the PPQ, a rhythm-quantization problem, not a lookup. |
| `tied` (types.ts:572-585) | **Sometimes provides**, indirectly: a tie is one continuous note at the byte level, indistinguishable from one long note unless the importer splits an unengraveable duration back into a tie chain. |
| `syllable` (types.ts:617-738) | **Sometimes provides.** Lyric (0x05) meta events exist but no MIDI standard marks melisma-versus-new-syllable, verse number, or elision. Two incompatible wild conventions: RP-026 Lyric events, and the `.kar` convention using Text (0x01) events with hyphen-terminated syllables (SOURCED, https://midi.org/community/midi-specifications/how-many-midi-karaoke-formats-exist). |
| `keySignatures`/`timeSignatures` | **Sometimes provides**; the meta events are optional and often absent. |
| `clef` | **Cannot provide.** No MIDI concept of a clef exists at all. |
| `fermata`, `articulations` | **Cannot provide.** |
| `workMetadata` | **Sometimes provides**, loosely, via free-text Track Name with no schema. |

## 2. The vocal line problem

Three candidates: (1) track-name matching ("Vocal", "Voice", "Soprano", "Melody"), which fails silently on default track names; (2) monophony detection, which fails on multi-voice files; (3) **ask the singer**, the strongest fit: `ScoreUploader.svelte` already has an `'asking'` state (`:108`, `:536-564`) that stops before the read, collects clef and key via two selects, and calls `handleFile(file, answers)` (`:212-217`, `:336-339`). Section recommendation: heuristic 1 as a pre-filled default on an asking screen the singer can override, mirroring how `CLEF_CHOICES[0]` defaults to treble (`:139-144`).

## 3. The quantization question, honestly

**Notation-exported MIDI** (Finale/MuseScore/Sibelius): ticks are exact rational multiples of the PPQ (commonly 480 or 960), so note values CAN be recovered to engraving grade by matching tick lengths against the small family of durations with dots and simple tuplets. A bounded pattern-match, not free transcription.

**Performance-recorded MIDI**: timings carry human variance, and recovering notation demands genuine rhythm transcription (beat tracking, rubato modelling), GENERAL KNOWLEDGE marked as such, the same hard problem notation software's own MIDI-import quantizers approximate and still hand-correct. A naive importer turns performance MIDI into garbage: spurious 64th notes and ties from jitter.

**Scope to notation-exported files, said honestly in the UI** per the ruled copy law. SMF carries no flag distinguishing the two, so either a static disclosure at the drop point or a post-parse heuristic warning (tick lengths far off simple fractions of PPQ), surfaced the way `readReport` substitution counts already are (`ScoreUploader.svelte:609-630`).

## 4. The parser cost

Candidates (SOURCED, npm registry and bundlephobia, fetched 2026-08-19):

| Library | Version | Licence | Min | Gzip |
|---|---|---|---|---|
| `@tonejs/midi` | 2.0.28 | MIT | 31,529 B | 9,086 B |
| `midi-file` | 1.2.4 | MIT | 10,137 B | 2,899 B |

Neither does notation-value inference, vocal-line selection, or lyric alignment; that layer is hand-written regardless. The house vendoring precedent (`zip-reader.ts:1-11`) hand-built ZIP because "the lockfile cannot be regenerated from the sandbox, and CI installs with `--frozen-lockfile` (handover v34 §C)". NOT ESTABLISHED whether that constraint still holds; it decides library-versus-hand-rolled.

Hand-rolled SMF byte reader: roughly 150-250 lines, smaller than `zip-reader.ts`'s 198. The expensive parts have no precedent to size against: tick-to-measure accounting (~60-80), duration quantization (~100-150, open-ended if performance MIDI is in scope), pitch spelling (~40-60), track selection plus lyric alignment (~80-120), `ParsedScore` assembly with warnings. **Total: roughly 450-700 implementation lines** against `musicxml-parser.ts`'s 1,079 and `mnx-parser.ts`'s 1,162 (`wc -l`, this session), plus tests at rough parity (the house ratio: `musicxml-parser.test.ts` is 38,417 B against the parser's 40,644 B).

**Load-bearing type finding:** `types.ts:171` already names `'medium'` fidelity as "lossy conversion (homr OMR on raster PDF, MIDI)" and `types.ts:181-188`'s `SourceOrigin` already includes `'midi-converted-musicxml'`. The type layer anticipated MIDI; the detection/ingest layer did not: `format-detection.ts:32`'s `ScoreFormat` has no `'midi'` member (MIDI is only a `DetectionFailure` kind, `:40`), and `ingest.ts:48-55`'s `IngestProvenance` has no MIDI case. The origin name hints the intended shape: MIDI bytes to a MusicXML string feeding the existing parser, the same shape `.mscz` takes via the injected `msczConvert` seam (`ingest.ts:132`, `:244-259`). INFERENCE from the name, not confirmed by any design doc.

## 5. What the singer actually gets

Scenario: `rachmaninoff-vesnoi.mid` exported from MuseScore 4 with a Cyrillic vocal line and piano.

1. **Detection:** `isMidi()` (`format-detection.ts:68`) matches `MThd`; today that returns `DetectionFailure{kind:'midi'}` (`:178`) and the uploader says "soon" (`ScoreUploader.svelte:422-423`, `:638-642`).
2. **Track question:** if MuseScore named the track "Voice", a default pre-selects; else the singer is asked via the existing asking-state machinery.
3. **Clef and key:** clef is a CERTAIN absence, every MIDI import asks, unlike the PDF path's sometimes; key often auto-fills from 0x59 with the asking screen as fallback.
4. **Lyrics:** as of MuseScore PR #21541 (SOURCED, https://github.com/musescore/MuseScore/pull/21541, merged, backported to 4.4.0), MuseScore's export writes Lyric (0x05) events per segment. NOT ESTABLISHED whether the text carries syllable-type markers or `.kar` hyphens, which decides direct pairing versus N.55b hand pairing. Pre-4.4.0 or Finale/Sibelius exports (behaviour NOT ESTABLISHED): a lyric-less arrival, which N.55a plus N.55b plus the ruled Underlay station already handle as first-class.
5. **What prints:** pitches and honest rhythm, the singer's chosen clef, no fermatas or articulations ever; MIDI earns its own fidelity banner tier analogous to `'reader'` (`ScoreUploader.svelte:483-486`, `ingest.ts:66-70`), consistent with `types.ts:171` already rating MIDI `'medium'`, the same tier as OMR.

Gaps worse than MusicXML that copy must speak: clef always asked; rhythm silently wrong on anything but clean notation export unless a warning heuristic is built; no fermatas, articulations, or formatting ever.

## 6. The cost estimate

| Step | What changes | Rough lines |
|---|---|---|
| 1. Detection | `format-detection.ts`: add `'midi'` to `ScoreFormat`; note `ACCEPTED_EXTENSIONS` (`:54`) appears to be dead code, no reference found | 15-30 |
| 2. SMF byte reader | new file, hand-rolled or wrapping `midi-file` | 150-250 or 30-50 |
| 3. Track selection + asking screen | `ScoreUploader.svelte` state variant; possible new `IngestDeps` seam | 80-150 |
| 4. Quantization + spelling + assembly | new parser or MIDI-to-MusicXML converter feeding the existing parser | 250-400 |
| 5. Lyric/`SyllableInfo` mapping | includes the `.kar`-hyphen ambiguity | 60-100 |
| 6. Fidelity banner + copy | `IngestProvenance`, i18n strings (count NOT ESTABLISHED) | 20-40 + i18n |
| 7. Tests | house parity ratio | 400-600 |

**Fixtures:** VERIFIED this session that no `.mid`/`.midi` exists in `data/`, `tests/`, or `tools/e16-harness/` top level. NOT ESTABLISHED whether MuseScore is installed anywhere for round-tripping the harness pieces into notation-exported fixtures; a minimal hand-built `.mid` is buildable from the spec table without tooling.

## 7. The recommendation

The singer's benefit is real but narrower than the 2026-08-14 framing ("cheap to parse") assumed: this is closer to a third parser than to the unzip-and-relabel shape of `.mxl`/`.mscz`. Against that, the old blocking objection (no lyrics, no underlay) is gone: N.55a and N.55b make a lyric-less MIDI a survivable, already-built arrival.

**Build now: not recommended.** **Build after N.73: plausible**, once the beta's blockers are closed, if a MuseScore-exported romance is judged common enough to be worth several hundred lines and a fixture-building session. **Drop, with the promise removed: also a legitimate, honest closure** of N.58: "Coming soon: MIDI" (`ScoreUploader.svelte:17-19`, `:515`) is an undelivered promise, the `accept` string already lets a singer pick a `.mid` only to be told "soon" (`:79`, `:422-423`), and removing the promise is a small, bounded, shippable change and a real closure, not a deferral.

Between those two: a taste ruling that belongs with Dann, not this scoping pass.

## 8. NOT ESTABLISHED

| Claim | What would settle it |
|---|---|
| Whether handover v34 §C's lockfile constraint (cited by `zip-reader.ts:8`) still applies, deciding library-versus-hand-rolled | Read handover v34 §C, or a real `pnpm add` in the dev environment |
| Whether MuseScore's exported lyric events carry syllable-type signals or `.kar` hyphens | Export a real MuseScore 4.4+ file with multi-syllable Russian lyrics and inspect the bytes |
| Finale's and Sibelius's MIDI-export lyric behaviour | Vendor documentation or a real export from each |
| MIDI-related i18n copy and key count | Stage and read the i18n table |
| Whether `tools/e16-harness` subdirectories hold MusicXML sources usable as MuseScore round-trip fixtures | Open the harness subdirectories |
| Whether MuseScore is installed anywhere reachable | Ask Dann |
| The real-world rate of notation-export versus performance MIDI among singers' files | A judgement about Dann's actual singers, not a fact any spec settles |
| Bundlephobia figures beyond the summarizing fetch used | Re-fetch raw if decision-critical |
