# Brief to Design: N.108 revision 2, the drawer as three finite groups, now ruled

Written 2026-09-02 by the coordinating desk after Dann read your revision 1
return and ruled on it from drawings. **Revision 1 was an exploration. This is
a build brief for a prototype.** What was open is now ruled; what you asked
for is answered; and everything you could not read the first time is in this
pack.

## 0. Read first, in this order

All paths are in the repository `DannMitton/Ilya`, branch `Shane`, which is
connected to your project. Nothing else is needed.

1. `docs/sessions/n108-design-pack/README.md` (this pack's index).
2. `docs/sessions/brief-to-design-n108-drawer-three-groups_r1_2026-09-02.md`,
   your revision 1 brief, still true except where §2 below amends it.
3. `docs/sessions/n108-design-return_r1_2026-09-02.md` and
   `n108-design-mockups_r1_2026-09-02.html`, your own return, filed.
4. The three drawings Dann ruled from: `drawing-n108-three-choices_r1`,
   `drawing-n108-group-headers_r1`, `drawing-n108-radius_r1` (all
   `docs/sessions/*_2026-09-02.png`).
5. The rulings you listed as NOT ESTABLISHED, now in the pack: E.27, E.44,
   the 2026-08-18 dispositions ruling, and N.70.
6. `docs/memory/PRODUCT.md` §The turning layer and `docs/memory/CONTRACT.md`
   §5 (house style) for the words.

## 1. What Dann ruled on your return, 2026-09-02

Every item below is his, from a drawing he looked at, and none is open.

- **Choice 2, "frames, no fold."** Three frames as you drew them; an open
  station grows inside its group; the other groups stay exactly where they
  were; the drawer scrolls once something is open. **Your fold (opening a
  station folds the other two groups to a heading) is rejected**: the drawer
  must not rearrange under the singer's hand. The grey "Folded while ..."
  sentences go with it.
- **The fourth radius is 20 px**, a surface radius, ruled from 16, 20, and
  24. "Three radii, no fourth" is amended to four. His words: "20 looks
  terrific."
- **Group headers are a band of full-strength colour with reverse text in a
  light neutral.** Piece borrows Guide's cobalt `--quiet-cobalt #5C739E`,
  Text is sage `--sage #8B9A7D`, Score markup is lavender
  `--deeper-lavender #8E7E9B`. He chose this over ink-on-band and over your
  wash, knowing two facts, which are yours to solve inside his choice, not
  around it: cream `#F5F1E8` on the ruled sage measures 2.7:1 and on the
  ruled lavender 3.3:1 at label size, under WCAG's 4.5:1; and cobalt on the
  first group overrides "hue names place" for Guide, on purpose. Say how the
  Text and Score markup labels pass: a darker band token, a larger label, or
  another way, and give the measured ratio.
- **The first group is named PIECE**, not File. His words: "not every
  *piece* will be a song: some will be arias." Working names are now Piece,
  Text, Score markup. **French is deferred by his ruling**: English only on
  every band and station, and no French anywhere in the prototype.
- **The phone opens one station at a time; desktop any number** (E.27
  §3.4, kept as a desk default). On the phone, opening a second station
  closes the first; the groups and every heading stay where they were.

## 2. What this amends in revision 1

§3.1 File becomes Piece. §3.3's calibration question is answered by your
4.3 answer and stands as drawn: Voice expands in place, the ritual inside
it; on the phone it is the one open station. §3.6 colour is ruled as above.
§4.2 is ruled (b), frames. Everything else in revision 1 holds.

## 3. What to deliver: a working prototype

Dann's words: "My dream would be to get a prototype so awesome that you can
implement it immediately."

Deliver **one self-contained HTML file** of the drawer alone, not a picture
of it, that works when opened offline in a browser:

- Real tokens from `apps/web/src/app.css:21-72` and the real station names
  as they ship today (read `Drawer/sections.svelte.ts` and
  `Drawer/StationHeader.svelte` for the label recipe).
- Every station opens and closes on click, with the ruled behaviour: on a
  viewport of 767 px or less one open at a time, above it any number; the
  groups never move; the drawer scrolls when content exceeds the viewport.
- The opening state as ruled: Piece open with the intake waiting; Text and
  Score markup showing their station names.
- The intake in its four states, switchable (empty, poem received, score
  received, both), with Replace per line.
- Voice expanding in place into the five ritual phases
  (`CalibrationWizard.svelte:116`), with placeholder meters, so the height of
  each phase can be seen at both sizes.
- Motion: one duration, about 180 ms ease-out, opacity and transform only,
  per the ratified spec.
- A size switch in the prototype's own chrome (not in the drawer) between
  1400 × 900 and 430 × 932, or two copies side by side.
- The desktop bookmark tab where your 4.0 answer put it, drawn.

Write it so that Code can read the CSS and the structure straight into
Svelte: one element per station, classes named for what they are, no
framework, no external fetches, no fonts that are not already in
`apps/web/static/fonts`.

## 4. Questions you still owe, each with what would have to be true

4.1 The contrast fix for the sage and lavender bands under ruling A, with
the measured ratio of your solution.

4.2 The bookmark tab's place, drawn, now that the groups are ruled.

4.3 What the drawer looks like on the phone with Voice open in the capture
phase, at the real height of that phase, and whether any phase needs its own
scroll inside the station.

4.4 What a returning singer sees: which station is open when the drawer
restores from `ilya:openStations`, and how the old key migrates, in one
paragraph for Code.

4.5 Build neither is no longer the question; **build less** is: if one thing
in this brief had to be cut to ship, which, and what a singer loses.

## 5. Rules binding on everything

- **Drawer manipulates, page displays and prints.** Nothing on the paper.
- **Four radii now, no fifth:** 0, the 4 px control radius, 20 px for group
  surfaces, full-round.
- **Do not invent a hex value, a token name, or a string.** Every value you
  use carries where you got it, in the file's own comments.
- **English only; French deferred by ruling.** Placeholders marked as such.
- **Canadian spelling. Oxford comma. No em dashes.**
- **Agentless voice. Ilya is not AI.**
- **Geometry answers modality:** 44 px on a coarse pointer.
- **Ilya is ecumenical across voice types.**

## 6. Your return

1. The prototype file, named `n108-drawer-prototype_r1_<date>.html`.
2. A short memo answering 4.1 to 4.5, in order, each with what would have
   to be true.
3. Every number and every hex value you used, with where you got it.
4. A section headed NOT ESTABLISHED. **"NOT ESTABLISHED beats a complete
   invented answer."**
5. Words: which you coined and which you adopted.
