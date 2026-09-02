# N.108 return: the drawer as three finite groups

**From:** Claude (design desk). **To:** Fable, via Dann. **Date:** 2026-09-02.
**Revision 1.** Answers `docs/sessions/brief-to-design-n108-drawer-three-groups_r1_2026-09-02.md`.

Open `N108 Drawer three finite groups.html` beside this memo. It is one
self-contained file: the six mockups, the four intake states, the divot strip,
the prose answers, the value table, and NOT ESTABLISHED. This memo is the
record of the session and the short form of the return.

## 1. How the session ran

1. Dann pasted the brief. The project held no files, so `app.css` and the five
   rulings were unreadable. I built the full return with placeholder values,
   every one marked, and said so.
2. A verifier measured the drawings twice and caught three arithmetic errors
   in the 4.1 tally and two frames that overflowed silently. Both are fixed
   and both changed answers (see §3, items 4.1 and 4.2).
3. Dann connected `DannMitton/Ilya`. Branch `Shane` holds the 2026-09-02
   deploy. I read `app.css`, `Drawer.svelte`, `StationHeader.svelte`,
   `VoiceAnchor.svelte`, `sections.svelte.ts`, `CalibrationWizard.svelte`
   (phases only), `+page.svelte:1580-1591`, and the three GUI rulings filed in
   `docs/sessions`. Every value in the mockups was then replaced from source.
   The `claude/` project-knowledge files are not in the repository; only
   `fable-ruling-gui-principles-and-portrait-c_2026-08-18.md` is filed there.

## 2. What is designed

- The drawer keeps its footprint and its 520 px width. Three squircles stack
  flush inside it. The only change to the silhouette is two divots per edge.
- Groups are frames, not accordions. A group has no chevron and no closed
  state. All ten station names are visible at the opening state.
- File holds Repertoire, Metadata, the intake, and Export and import. The
  intake has no station row: the field is the station.
- Text holds Transcribe, Notation, Analysis. Score markup holds Underlay,
  Corrections, Voice.
- Opening a station body folds the other two groups to their headings, on
  both modalities. Calibration is the same motion: Voice expands in place.
- One intake accepts paste, typing, a dropped file, and the photograph
  button. On arrival it shrinks to one receipt line per kind, each with its
  own Replace.
- Place is carried three ways: a hue wash (Text sage, Score markup lavender,
  File unwashed), a shape mark (square, circle, diamond), and the name.

## 3. The answers, short form

**4.0 Silhouette.** The ruled three radii (2026-08-18 ruling) are 0, one
small control radius, and full-round. `app.css:21-72` declares no radius
token; the small radius lives as literals and 4 px is the drawer's commonest.
None is a squircle radius. A 4 px divot is a nick. The stack therefore needs
a fourth radius, which is Dann's to rule. Every mockup carries 20 px as a
labelled candidate. The pull's own drawn corner, R = 6.43 px
(`Drawer.svelte`, `LIP_W × 18/56`), is the one squircle already ruled; an
amendment derived from that drawing's cubic at group scale is the amendment
with a source. The bookmark tab is ruled at 20 × 152, centred, one outline
with the drawer's edge. With three squircles there is no continuous edge, and
at the opening state the centred tab lands on the Text group. Either the
outline breaks at the divots or the tab moves to the header band. Desk
preference: the header band. Drawn as ruled, centred.
*Would have to be true:* Dann names a surface radius at or above about 16 px;
the silhouette drawing is amended; the drawer body gives up its `#FAF8F5`
fill so the desk shows in the notches.

**4.1 Phone fit.** Yes. On the phone the drawer is a fixed overlay from the
top of the viewport (`Drawer.svelte`, the 767 px rule), so no app bar sits
above it. Tally: 12 + 48 header + 348 File + 200 Text + 200 Score markup + 12
= 820 of 932, slack 112. The desk default (Metadata closes first) does not
arise: every station is already one row. The intake's two buttons yield first.
*Would have to be true:* ten stations, one row each; the intake at 148 px; a
phone at 430 × 932 or taller. At 375 × 667 the frame reading fails.

**4.2 Frame or accordion.** (a) serves principle 10, (b) serves principle 6.
The brief's own ruled sentence, the opening state is the map, picks (b).
Dann's doubt is right: an expandable group is tricky chrome and breaks
principle 11. One thing gives: no slack holds a station body (phone 112 px,
desktop 8 px, Notation body 168 px), so opening a body folds the other two
groups. That departs from E.27's any-number rule on desktop and reshapes the
persisted open set in `sections.svelte.ts`.
*Would have to be true:* the ten stations stay ten, one row each.

**4.3 Calibration in place.** Drawn on both sizes. E.27's "never entered by a
chevron" survives: the chevron opens Voice, a labelled control starts the
ritual. What breaks: the takeover's guarantee that nothing else is reachable
(replaced by inert folded headings while recording); the microphone prompt is
browser chrome; and the ritual's height is not fixed. The wizard has five
phases (`CalibrationWizard.svelte:116`: welcome, readiness, capture, summary,
characteristics), the capture queue grows with the challenging vowels, the
summary is a seven-row roster, and today the takeover scrolls inside itself.
*Would have to be true:* every phase fits in about 400 px on the phone.

**4.4 Intake receipt.** Four states drawn. Replace is scoped per line; a second
file of a kind already present replaces that kind and rewrites only its line.
*Would have to be true:* Ilya can tell the kinds apart from the file itself.
A PDF is the failure case and the field must ask once, in place. The phone
picker carries no `accept` filter (N.70).

**4.5 Build neither.** Unify the intake only. A singer keeps the scattered
file system and the unsolved finiteness. Gains: nothing to relearn, no risk to
a ruled takeover, an afternoon instead of a week.
*Would have to be true:* today's drawer already fits at 430 × 932 without
scrolling. I read the tree and did not walk a deploy, so this is NOT
ESTABLISHED and it decides 4.5 on its own.

## 4. The one decision for Dann

Whether "three radii, no fourth" is amended to name a surface radius. Without
it, the silhouette in the brief cannot be drawn from the ruled set. Everything
else in the return is a desk default he can wave off.

## 5. Sourced values

See the table in the HTML. Sourced: `#8B9A7D`, `#8E7E9B`, `#FAF8F5`,
`#D1D7CB`, `#D8D4C8`, `#F0EBE0`, `#F5F1E8`, the ink hierarchy, 520 px, 20 × 152,
100% − 20 px, the 0.7rem station-label recipe, 44 px, 4 px, full-round, Source
Sans 3, the five phases. Mine and unsourced: 20 px group radius, 56 px desktop
app bar, 12 px phone pad, 18 px group side padding, 148 px empty intake, every
string, the three Notation toggle names.

## 6. NOT ESTABLISHED

Full list in the HTML. The heads: the fourth radius; the silhouette's fate;
today's drawer height on a phone; the desktop app bar height; the calibration
frame's desk (drawn on `--surround-transcription`, belongs on
`--surround-marked`); all copy and all French; the Notation toggle names; the
ritual's in-place copy; where the photograph reader lives; the migration of
`ilya:openStations`; the colour reading of §3.6; the four rulings not in the
repository (E.27, E.44, the dispositions ruling, N.70).

## 7. Words

Coined here: "frame reading" for option (b) of 4.2; "receipt line" for the
shrunken intake. Adopted from the brief: divot, squircle, station, takeover,
ritual, the three group working names.
