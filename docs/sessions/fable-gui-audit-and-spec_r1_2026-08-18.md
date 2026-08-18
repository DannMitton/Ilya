# Ilya GUI audit, and Calm Authority made operational

**From:** Claude (Fable). **To:** Dann. **Date:** 2026-08-18. **Revision 1.**

**Instrument.** Walked live on deploy `ilya-b0gn6a3ru-dannmittons-projects.vercel.app`
(commit `ed8318e`, the newest READY build) in your Chrome, 1427 by 840 desktop,
390 by 844 portrait, 844 by 390 landscape. States walked: Transcription empty and
populated (two lines of Pushkin), Fit, Learn, Guide, drawer closed, mobile drawer
sheet, the mobile interstitial. Not walked: Print (the system print dialog blocks
my instrument), Safari, a loaded score in Fit, the calibration ritual. Fonts in
use: not established, I did not read the CSS this session. One side effect: a song
auto-named `Я` now sits in that deploy origin's IndexedDB; each deploy is its own
origin, so nothing you use daily was touched.

---

## 1. What is already excellent, so we do not sand it off

- **The word stack is the best thing on the screen.** IPA above, bold Cyrillic
  centre, italic gloss below: three registers, three type voices, no rules or
  boxes. This is Calm Authority achieved, and every mockup keeps it.
- **The four-hue wayfinding works.** The header and tab stripe shift sage,
  lavender, rose, cobalt per destination. You already have quiet colour blocking;
  it needs enforcement, not replacement.
- **The toggle grammar is honest.** Each NOTATION switch shows both of its
  meanings, off-label left, on-label right. Nothing to memorize.
- **The instrument tells the truth.** `13 words in 14ms`, and the calm empty
  states on both papers.

## 2. Findings, ranked

**F1. Fit's drawer is a different country from Transcription's.** METADATA and
SONGS vanish, though the song is the same object. Print changes shape and
position: one of three equal buttons in Transcription, a lone centred button in
Fit. Export and Import drift vertically. **The cure is already ruled**: the E.44
Studio ruling's anchors (piece and NOTATION pinned top, voice pinned bottom,
stations between, identical across documents). This audit found nothing that
ruling does not fix; the finding is that it is not yet built.

**F2. The calibration plea is an orphan.** "Please name your profile so we can
map your voice..." sits centred, bold, conversational, inside a panel whose
grammar is small-caps station labels. It reads as a modal that forgot its
curtain. The ruled cure is the calibration takeover plus the bottom voice
anchor. Also: "Please" violates the house style you ruled today.

**F3. One accent per surface is broken in Fit.** The single filled action in
Fit's drawer, Start, is sage. Fit speaks lavender everywhere else on that
screen. On Transcription, sage Transcribe is correct. Rule needed (§3.2).

**F4. With the drawer closed on desktop, the app has no doors.** The tab bar
lives inside the drawer, so closing the drawer strands you on the current
destination. Ruled cure: N.42, the desk selector on the desk. Not built.

**F5. The mobile interstitial still ships.** "Ilya is designed for desktop /
Continue anyway" gates every phone visit. A project document is titled
`e45-n63-ruled-kill-the-interstitial` (instrument: title only, not read this
session); if that title says what it seems to, the deploy contradicts a ruling.

**F6. Portrait has three defects of calm.** The attribution paragraph crowds
two lines of poem at equal visual weight; a tall void of bare desk sits between
the card and the pull-up chevron; and the unlabelled chevron is pure recall (you
must already know the drawer hides there). The card is also edge-to-edge: the
scroll has no paper identity, which is part of why it feels like a violation to
you.

**F7. Auto-name produced a one-letter song.** The poem `Я вас любил: любовь
ещё...` yielded the song title `Я`. STATE.md records 4b auto-naming `Я тебя
любил` from a poem, so something about this line (the colon? a stop-word rule?)
truncates to a single letter. Cause not established; `titleFromPoem` or its
equivalent needs one look.

**F8. The song row still reads as a text input.** Light fill, input-like shape.
The 4b memo says Code found this class of defect; the row on this deploy still
carries the ambiguity. Low severity.

**F9. The Vercel toolbar sigil floats over the app** on every preview deploy
(dark circular button, right edge). Known and recorded in ENVIRONMENT.md; it is
not yours, but any outside eyes you recruit will critique it as yours. Brief
any future reviewer, or show them a production URL.

## 3. Calm Authority, operationalized

Constitution: restraint, coherence, and respect for the singer's attention.
Everything below is a testable consequence. Words marked *coined* are mine
today; everything else is adopted from your existing rulings or named canon.

### 3.1 Colour

- **Hue names place. Ink names state.** (*coined as a slogan; the practice is
  your E.36 system*.) Sage, lavender, rose, cobalt say *where you are*, never
  *what is selected, valid, or dangerous*. Selection, focus, and validity are
  carried by ink: borders, fills, underlines at the card's weight.
- **One accent per surface.** Every screen has exactly one hue family plus ink
  and paper neutrals. A second hue on a surface must mean something (F3 fails
  this test).
- Keep the low-chroma discipline (measured 0.045 to 0.073 in E.36). Scandinavian
  colour blocking enters at the **surface** scale: header band, desk, empty
  states, Learn and Guide title pages, where there is room; never at the
  control scale, where it becomes noise at 520 px.
- **Colour never carries alone** (your ruling; WCAG 1.4.1). WCAG, for the
  record, is broader than blindness: contrast, touch-target, and cognitive-load
  rules that serve every tired singer at a piano. Your 44 px floor is already a
  WCAG practice.

### 3.2 Shape

- **Three radii, no fourth** (*coined*): 0 for paper and desks (print has no
  rounded corners), a small radius (the current control rounding) for every
  button, field, and card, and full-round only for toggle knobs and the
  language pills. Any new control picks from these three.
- **The paper is sacred geometry**: nothing floats over it, nothing on it is a
  control (your ruling), and it never animates (§3.5).

### 3.3 Grouping

- **No orphan controls** (*coined*). Every drawer control lives inside a
  labelled station (the small-caps letterspaced labels you already use:
  METADATA, SONGS, NOTATION). F2 is the standing violation.
- **Station order is invariant across documents.** The Studio anchors: piece
  and NOTATION pinned top, voice pinned bottom, Source, Analysis, Output
  scrolling between. A singer's hand learns one map.
- **Progressive disclosure** (adopted; your instinct about the drawer is
  right): pinned anchors are level one, open stations level two, collapsed
  expert stations level three (NOTATION's toggles collapsed by default for a
  new singer), and the calibration takeover is the only level four. Depth by
  intent, not by scroll length.

### 3.4 Typography

- **Three voices, each with one job** (*coined roles, adopted practice*): the
  Reading voice (the paper's serif, carries the poem and the prose), the
  Instrument voice (the drawer's sans, small caps for station names), and the
  Phonetic voice (the IPA rendering). No voice borrows another's job; the
  calibration plea (F2) is Reading voice inside an Instrument panel, which is
  why it feels wrong.
- Oversized type belongs to **arrival moments**: empty states, Learn and Guide
  chapter openings, the interstitial's replacement if any survives. Never in
  the working drawer.
- Current typefaces stay until mockups prove a better performer; they are up
  for grabs by your word, but F1 through F6 cost you more than any font swap
  gains.

### 3.5 Motion

- **One duration, one easing** (*coined*): roughly 180 ms ease-out (the 175 ms
  tab animation already measured in the tree rounds to this) for drawer,
  stations, and selection. Opacity and transform only.
- **The paper never animates.** Content appears by replacement, as print does.
  Motion is for instruments; stillness is the page's authority.

### 3.6 Copy voice on failure

Your ruling today, transcribed: **name what happened, what it means, and where
possible one next step; a next step is not always needed and is judged case by
case. Never patronizing, never cute, never "oops", never blame.** This slots
into house style as the error-message clause.

## 4. The portrait question, which is yours to rule

You reopened the portrait scroll tonight (PRODUCT.md lists the asymmetry as
closed; reopening it is your right, and I record that this is a change to the
portrait accommodation, not to rotation-as-mode-switch, which you kept). The
honest arithmetic first: a letter page fitted to a 390 px portrait screen
renders 12 pt text at roughly 4.5 pt. **A fitted portrait paper is legible as a
shape, not as text.** So the real choices are:

- **A. The fitted page as an overview** (your proposal): portrait shows the
  true paper, whole, beautiful, unreadable up close; reading happens by
  rotating (the existing mode switch) or pinching. Calm, honest, print-faithful.
  Cost: a singer who only wants the next line of IPA must rotate or zoom.
- **B. The scroll, given paper identity**: keep the readable portrait scroll
  but dress it as a page (margins, the header block, attribution demoted to a
  colophon at the true end, the void closed). Cheapest; keeps readability;
  remains a second representation of the object.
- **C. Both, layered**: the fitted page as the arrival view, one tap to enter
  the readable scroll. Most work; risks a fourth level of disclosure.
- **Build neither** (tether 13): the interstitial dies (F5, already ruled if
  the title reads true), portrait stays as shipped, and the beta line keeps
  its priority. Defensible, because rotation already reaches the true paper.

Mockups can show A, B, and C side by side at 390 px before you rule.

## 5. Next steps, in order

1. You rule on §4, or defer it to the mockups.
2. Fable builds one clickable HTML comparison: current drawer beside the
   Studio-anchor drawer (F1, F2, F3 cured on screen), and the three portrait
   treatments. Your eyes judge. Worst case roughly 120k to 180k Fable tokens.
3. The five-user task script for D follows the mockup ruling, not before,
   so testers see the candidate, not the known defects.
4. F7 (auto-name) and F8 (song row) are one-look code items for a future Code
   session; neither blocks design.

*Fable, 2026-08-18. Walked, not inferred, except where marked not established.*
