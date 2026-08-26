# Fable ruling: the Calm Authority operational spec, and portrait C

**Ruled by Dann, 2026-08-18, in the Fable GUI session (Cowork). Fable drafted;
Dann ratified every item below in conversation, on rendered mockups.**

*(Filed into the repository 2026-08-25, verbatim from project knowledge
`claude/fable-ruling-gui-principles-and-portrait-c_2026-08-18.md`, so that
sessions without project access can read it. Note, 2026-08-25: the portrait C
section below is amended by Dann's 2026-08-25 portrait ruling, recorded in
`brief-design-mobile-correction_r1_2026-08-25.md`: the paper on a phone is the
true page at readable zoom, both orientations interactive and equally valid.
The eleven principles and the operational spec stand unamended.)*

## Ratified: the eleven-principle slate

1. Calm Authority governs (Dann's). 2. Drawer manipulates, page displays and
prints (ruled). 3. One term, one control, one meaning, forever (Nielsen).
4. Sourced or silent (ruled). 5. Every mark earns its ink (Tufte). 6.
Recognition over recall (Nielsen). 7. Geometry answers modality, not width
(ruled: pointer coarse, 44 px, rotation as mode switch). 8. Colour never
carries alone (ruled; WCAG 1.4.1). 9. Typography is the interface (Bringhurst).
10. Progressive disclosure. 11. Siblings behave identically.

## Ratified: the operational spec (short form)

- **Colour:** hue names place, ink names state; one accent per surface;
  low-chroma discipline kept; colour blocking at surface scale only.
- **Shape:** three radii, no fourth (0 paper, small controls, full-round knobs
  and pills). Nothing floats over the paper.
- **Grouping:** no orphan controls; station order invariant across documents;
  disclosure levels: pinned anchors, open stations, collapsed expert stations,
  one takeover (calibration).
- **Typography:** three voices (Reading serif, Instrument sans, Phonetic IPA),
  no voice borrows another's job; oversized type on arrival moments only.
- **Motion:** one duration (~180 ms ease-out), opacity and transform only;
  the paper never animates, it is replaced.
- **Error copy (ruled):** name what happened, what it means, one next step
  where warranted, case by case; never patronizing.
- **NOTATION opens collapsed (ruled):** the toggles are departures from
  Grayson's defaults, intentionally accessed.

## Ruled: portrait treatment C

Portrait's arrival is the fitted true page (whole, shadowed, owning header
block and colophon; attribution lives in the colophon). One tap enters a
**reading aid stripped of all paper dress** (no shadow, no edges, no header, no
colophon; labelled "reading aid, not the page"; labelled drawer pull); one tap
returns. The "designed for desktop" interstitial is retired. Treatment B
(dressed scroll as sole representation) is rejected. Rotation stays the mode
switch. PRODUCT.md amended.

## Ratified: Learn and Guide chapter openings

One full-strength colour band per chapter (rose Learn, cobalt Guide),
oversized sans title, italic deck, meta line, then the untouched serif reading
measure.

## Reconfirmed, not new

Tabs die everywhere under Studio (E.44): three destinations, pair chooses the
document, Learn and Guide set apart, phone bottom bar deleted.

## Artifacts, in the repository, never here

| path | md5 |
|---|---|
| `docs/sessions/fable-gui-audit-and-spec_r1_2026-08-18.md` | `80474828853ec7dc1c495fe9c954a967` |
| `docs/sessions/fable-gui-mockup_r1_2026-08-18.html` | `d623aa7ea9fe4c15c10604fddd78b121` |
| `docs/sessions/fable-gui-mockup_r2_2026-08-18.html` | `39501730ad74292647e1f2ca095a93e7` |
| `docs/sessions/fable-gui-session-record_2026-08-18.md` | session record, full detail |

r2 supersedes r1's portrait exhibit (r1 wrongly kept the four-tab bar there);
r1 remains the record of today-beside-Studio and the rejected B.

Audit findings F1 to F9 live in the audit doc; F7 (auto-name yielded the song
title `Я`) and F8 (song row reads as an input) are non-blocking Code one-looks.
Hue and typeface stand-ins in the mockups must be re-verified against
`app.css` before any build. Nothing was built; the GUI track still waits on the
beta line or a named displacement.
