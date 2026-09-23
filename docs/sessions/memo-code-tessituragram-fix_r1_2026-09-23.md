# MEMO. Two fixes to the r2 tessituragram

**Claude Code, 2026-09-23, `Shane` at `0ccda31`, uncommitted. WRITTEN, not DONE.**

**Gates:** 1 to 3 at baseline. Gate 4 is 1396 (+1, `insights.test.ts`, treble-8vb names). Gate 5 is 579 plus 5 (+1, `vocal-octave.test.ts`, MusicXML case).

## 1. The octave

**Cause:** `vocal-octave.ts:51` (now `:60`) shifted every treble-8vb line down an octave. A MusicXML pitch already sounds, so the shift ran twice. Fixed for MusicXML only. `staff-renderer.ts:418` now places treble-8vb from sounding pitch, so Score markup keeps its clef and prints as the edition does.

**Sunless 2, before and after:** compass A1 to E♭3, now A2 to E♭4. Tessitura C♯2 to B♭2, now C♯3 to B♭3. Shares 0/0/100, now 3/30/67. Findings C♯2 and E♭3, now one on A3. All wrong before.

**Seen, both languages:** Sunless 2's rows C♯3 to E♭4. Sunless 1 unchanged. Sunless 6 shows the share heading.

## 2. `byVowelShare`, `i18n.ts:1524`

## NOT ESTABLISHED

- Sunless 3, 5, and 6 are treble-8vb too and moved up an octave. Sunless 6 now reads C♯3 to D4, unchecked against the dissertation.
- MNX's octave-clef convention.
