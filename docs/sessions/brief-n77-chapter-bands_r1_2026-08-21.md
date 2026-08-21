# BRIEF FOR CODE. N.77, ship 1: chapter-opening bands for Learn and Guide

**The design is ruled and drawn. You are not designing anything.** Ruling 6 of
2026-08-18 (`docs/sessions/fable-gui-session-record_2026-08-18.md:29-33`) was
ratified by Dann's eyes on the rendered mockup. The mockup draws it at fidelity:
`docs/sessions/fable-gui-mockup_r2_2026-08-18.html`, Exhibit 2, markup at
`:264-300` and CSS at `:92-98`.

Everything below was read in the tree at `46ab5e2` on 2026-08-21.

## The rule that governs every string

**COIN NOTHING, IN EITHER LANGUAGE.** Every word the band prints already exists
in the tree, in both French and English. Where a slot has no existing source,
**leave the slot out and say so in your memo.** Do not translate, do not
paraphrase, and do not write French Dann has not seen.

## What the band is

One full-strength colour band at the top of each chapter, then the existing
serif reading measure, untouched. Anatomy, in order: kicker, oversized sans
title, italic deck.

From the mockup's CSS, which is the ratified geometry:

- band: `padding: 34px 30px 30px`, text `#fdfbf6`
- kicker: sans, `10px`, `letter-spacing: .28em`, uppercase
- title: sans, `700`, `40px`, `line-height: 1.04`, `letter-spacing: -.01em`,
  `margin-top: 10px`
- deck: serif, italic, `15px`, `margin-top: 12px`, `max-width: 330px`

**Two departures from the mockup, both deliberate.**

1. **Use the app's own colour tokens, not the mockup's.** The mockup's
   `--rose` and `--cobalt` are stand-ins and its closing note says so. Learn's
   band is `--dusty-rose` (`app.css:38`). Guide's band is `--quiet-cobalt`
   (`app.css:42`).
2. **Drop the mockup's `opacity` on the kicker and the deck.** See the contrast
   finding below.

## Where the bands go

Each chapter heading appears twice in its file, French first, then English.
Both halves get a band.

**Learn, 8 chapters** (`LearnContent.svelte`): the `h3` elements carrying
`id="learn-unit-1"` through `id="learn-unit-7"`, plus the `h2` carrying
`id="learn-coda"`.

**Guide, 4 chapters** (`GuideContent.svelte`): the `h2` elements carrying
`id="guide-how"`, `id="guide-walkthrough"`, `id="guide-contributors"`, and
`id="guide-licences"`.

**I verified the anchors for `learn-unit-1`, `-2`, `-3`, `-7`, `learn-coda`, and
`guide-how` by reading them. I did NOT verify all twelve.** Establish the
inventory yourself before you write, and report any chapter whose shape differs
from the pattern above.

## Where each string comes from

**Learn's kicker and title.** The heading text is already
`Section 3 · Stressed Vowels` / `Section 3 · Les voyelles accentuées`
(`LearnContent.svelte:2786` and `:760`). Split it on the `·` separator: the
left half is the kicker, the right half is the title. `learn-coda`'s heading is
`8 · What These Rules Do Not Teach` / `8 · Les inclassables`, which splits the
same way and gives the kicker `8`. **If that reads wrong, report it rather than
inventing a word to pad it.**

**Learn's deck.** Each chapter opens with a one-line thesis in `<strong>`,
already bilingual: `LearnContent.svelte:2788` is
`<p id="learn-u3-inventory"><strong>Stressed vowels are the targets.</strong></p>`
and `:762` is its French. **That sentence is the deck.** Lift it into the band
and remove it from the body, so it appears once, not twice.

**I verified this pattern on chapter 3 only.** Check all eight. Where a chapter
has no opening `<strong>` line, its band carries no deck, and you say which.

**Guide's kicker, title, and deck.** The Guide's headings carry no `·` fragment
and its chapters have no opening thesis line. So: the title is the heading text
as it stands, and **the kicker and deck are both omitted for all four Guide
chapters.** Do not synthesize either. Dann writes them later.

## What ship 1 does NOT include

- **The meta line.** The mockup's `.room-meta` row (`:275`, `:299`) shows
  Grayson sections and a reading time in minutes. **Reading time exists nowhere
  in the tree; I grepped for it.** The Grayson source lines exist but sit at the
  END of each chapter (`LearnContent.svelte:757`, `:2783`), so moving them is a
  content decision that is Dann's. Leave the meta line out entirely.
- **The `room-next` previous/next row.** Not in ruling 6.
- **Any change to the reading measure below the band.** It is untouched.

## THE CONSTRAINT THAT BREAKS THINGS IF YOU MISS IT

`Drawer.svelte` holds a hand-written table of contents that scrolls to these
headings and highlights the active one. It reads them by `id`, through
`data-heading-id`, `isActive`, and `sectionContainsActive`
(`Drawer.svelte:185-218`, `:343-384`).

**Every heading must keep its element type and its `id` exactly as they are.**
Wrap the band around the heading or place it before the heading, but do not move
the `id` onto a new element, do not change `h3` to anything else, and do not
rename an anchor. If the visible title text moves into the band, the heading
itself must still exist, still carry its `id`, and still be reachable by the
scroll-spy. Say in your memo how you kept it, and prove it by walking the table
of contents.

## The contrast finding, measured, and it is Dann's to rule

Computed with the WCAG relative-luminance formula against the band's `#fdfbf6`
text:

- `--quiet-cobalt` `#5C739E`: **4.61:1**. Passes at every size.
- `--dusty-rose` `#A67B7B`: **3.54:1**. Passes the 3:1 large-text threshold for
  the 40px title. **Fails the 4.5:1 threshold for the 10px kicker.**

**Do not darken `--dusty-rose` and do not invent a band-only rose.** Build it as
specified at full opacity, measure the rendered result, and report the number.
Dann rules after he has seen it. This joins the contrast items `STATE.md`
already records as his.

## Done when

Report the rendered result, not the source. Production build, print media not
required.

1. All eight Learn chapters and all four Guide chapters open with a band, in
   both languages. Twenty-four bands total.
2. Learn's bands carry kicker, title, and deck. Guide's carry the title only.
3. The thesis sentence appears **once**, in the band, not twice.
4. **The control.** Open the drawer's table of contents and click through every
   Learn and Guide entry. Each one still scrolls to its chapter and still
   highlights. Name what you clicked.
5. Nothing outside the band changed: same reading measure, same fonts, same
   spacing below.
6. All five gates at baseline.

## What you owe back

A memo in the same commit, three sections:

- **What changed**, each with `path:line`.
- **The six done-conditions**, each with what you observed, not what you
  expected. Include the measured contrast.
- **What I could not establish.** `NOT ESTABLISHED` beats a complete invented
  answer. List every chapter that departed from the pattern and every slot you
  left empty.

Do not run `git`. Do not commit.
