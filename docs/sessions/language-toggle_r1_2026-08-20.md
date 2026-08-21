# The language toggle becomes one pill

**Built by Code, 2026-08-20. `WRITTEN`, not `DONE`: Dann has not walked it on a
deploy.**

Brief: `docs/sessions/brief-to-code-language-toggle_r1_2026-08-20.md`, read in
full this session.
Ratified drawing: `docs/sessions/lang-toggle-options_r1_2026-08-20.html`, option
D, read in full this session.
Also read in full: `docs/memory/CONTRACT.md`, `README.md`,
`docs/memory/STATE.md`, `docs/memory/INBOX.md`,
`apps/web/src/lib/components/HeaderBar.svelte`.

**This memo is a new file rather than an append.** The brief's §8 offered
`docs/sessions/drawer-stations-ship1_r1_2026-08-20.md` or a new file if that one
had grown unwieldy. It stands at 1,392 lines and carries a different item, so
this went in its own file.

**The brief's own hold is satisfied.** It says "HOLD THIS until the chevron pass
has shipped and been walked." The chevron shipped as `b0a9860` and
`STATE.md:118-120` records it walked and accepted. It displaces nothing: ship
two of `brief-to-code-drawer-stations_r1_2026-08-20.md` §4 is still not started.

---

## 1. What shipped

### The control

`apps/web/src/lib/components/HeaderBar.svelte:45`. One `<button type="button"
class="lang-pill">`, carrying the autonym of the language the singer is not in,
with its own `lang` attribute on the same element.

- `:25-26` derive the other language and its label.
- `:28-30` `switchLanguage()` calls `onlanguagechange(other)`.
- `:159-172` the pill's own rule: 13 px sans, white, `border: none`,
  `border-radius: 9999px`, `padding: 4px 12px`, `white-space: nowrap`.
- `:179-194` the four per-destination chips, each reading its token.
- `:187-190` Guide alone carries `box-shadow: inset 0 0 0 1px rgba(255, 255,
  255, 0.22)`.
- `:202-206` hover.
- `:208-211` the focus ring.

The radius and the padding are unchanged from the pair, per the brief's §2 and
`fable-gui-audit-and-spec_r1_2026-08-18.md` §3.2: "full-round only for toggle
knobs and the language pills."

### What the control is now

Read out of the rendered accessibility tree at 360 x 640, not out of the source:

```
button "Français" [ref_1] type="button"
```

The accessible name is the visible word and nothing sits over it. `aria-pressed`
is gone, `role="button"` is gone, `tabindex="0"` is gone, and the two
`<span role="button">` elements and the `.lang-separator` between them are
deleted.

### The four tokens

`apps/web/src/app.css:107-110`, named rather than inlined, because the census of
2026-07-29 flagged this exact control for carrying three hand-picked literals
beside one real token.

```
--lang-chip-transcription: #6C7A5F;
--lang-chip-learn: #9A6A6A;
--lang-chip-guide: var(--quiet-cobalt);
--lang-chip-marked: #806E8E;
```

They sit directly under the `--surround-*` desk tints and take the same naming
shape, so the header chip and the desk beneath it read as one set.

### What was deleted

`.lang-option:not(.active)`'s four per-destination backgrounds, its four hover
`text-decoration-color` rules, `.lang-option.active`, `.lang-option:not(.active)`,
`.language-toggle`, `.lang-separator`, and `handleKeydown`. A native `<button>`
answers Enter and Space itself, so the key handler had no work left.

---

## 2. The four contrast ratios, measured in a browser

**The instrument.** Chromium in the Browser pane, at `localhost:5173`, driving
the four real destination controls in the desk head rather than setting classes
by hand. For each destination the script reads `getComputedStyle` on the actual
`.lang-pill` and the actual `.header-bar`, and computes the WCAG 2.x ratio in
the page from those two values.

**What could have made the instrument lie, and how it was ruled out.** Both
`.header-bar` and `.lang-pill` transition `background-color` over 300 ms, and
the `tab-*` class flips synchronously while the painted colour does not. The
first run reported Learn as `tab-learn` carrying sage `#8B9A7D`, which is a
contradiction on its face, and it was thrown out rather than reported. The
reading below comes from a settle loop that re-reads every 200 ms and accepts a
value only after three identical consecutive reads.

| destination | band | chip | desk computed | **Code measured** | clears 4.5 |
|---|---|---|---|---|---|
| Transcription | `#8B9A7D` | `#6C7A5F` | 4.58 | **4.58** | yes |
| Learn | `#A67B7B` | `#9A6A6A` | 4.52 | **4.52** | yes |
| Guide | `#5C739E` | `#5C739E` | 4.77 | **4.77** | yes |
| Marked score | `#8E7E9B` | `#806E8E` | 4.63 | **4.63** | yes |

**All four agree with the coordinating desk to the second decimal, and all four
clear 4.5.** No hex was nudged to make a number pass.

**Guide's chip is confirmed to be the band itself**, not a near neighbour: both
read `rgb(92, 115, 158)` in the same measurement, so the `var(--quiet-cobalt)`
form holds.

**The hairline cannot touch the number above, and that was checked rather than
assumed.** The stated failure mode was that `inset 0 0 0 1px rgba(255,255,255,.22)`
paints white over the chip and lifts the background under the text, which would
put Guide's real ratio below the 4.77 computed for the bare hue. The computed
shadow reads `rgba(255, 255, 255, 0.22) 0px 0px 0px 1px inset`: zero offset,
zero blur, 1 px spread. The pill's computed padding is `4px 12px`, so the
nearest edge of the text box sits 4 px from any border. A 1 px band cannot reach
it. The hairline is an edge and nothing else.

**These ratios are the first time this control has cleared 4.5.** The pair
failed in both states on all four bands, 2.47 to 3.93 (`STATE.md:157-159`).

---

## 3. The header at 360 x 640

**Stated before the measurement:** the pill measures 69.04 px and the sigil is a
22 px `[Ilya]`, so roughly 160 px of clear space, and no collision. The named
likeliest failure mode was that a width-only check misses the real one, because
`.sigil-version` is absolutely positioned at `top: 26px; left: 34px` and the
`2026a` badge hangs outside the sigil's own box.

**Measured**, viewport 360 x 640, English page, longest case "Français" beside
the sigil:

| element | left | right | top | bottom | width |
|---|---|---|---|---|---|
| header | 0 | 360 | 0 | 48 | 360 |
| sigil | 16 | 77.97 | 7.5 | 40.5 | 61.97 |
| `2026a` badge | 50 | 76.27 | 33.5 | 43.5 | 26.27 |
| pill | 274.96 | 344 | 13.5 | 34.5 | 69.04 |

- **It fits, with 196.99 px of clear space** between the sigil's right edge and
  the pill's left edge.
- The badge was measured, per the stated failure mode. It ends at 76.27, inside
  the sigil's own 77.97, and its bottom at 43.5 leaves 4.5 px clear of the
  header's 48 px floor. It overhangs nothing.
- The pill's right edge lands at exactly 344, which is the header's 16 px right
  padding to the pixel.
- `header.scrollWidth > header.clientWidth` is false and
  `documentElement.scrollWidth > clientWidth` is false. Nothing scrolls
  sideways.
- `pill.getClientRects().length` is 1. The word does not wrap.

**"Français" is the longest case and it is the one measured.** On the French
page the pill reads "English" at 63.55 px, 5.49 px narrower.

**Nothing was abbreviated.** The brief's §6 asked for the full word at every
size and for a collision to be reported rather than cured unasked. There is no
collision to report.

---

## 4. The whole path, walked in the browser

Measured on the running app, not reasoned about:

| step | before | after |
|---|---|---|
| English page, pill label | `Français`, `lang="fr"` | |
| tap the pill | | `document.documentElement.lang` goes `en` to `fr` |
| the app switches | `Transcription / Marked score / Learn / Guide` | `Transcription / Partition annotée / Leçons / Guide` |
| the pill offers the way back | | `English`, `lang="en"` |
| tap again | | back to `en`, pill reads `Français` |

All four destinations were then walked and each drew its own chip, confirmed
both by computed style and by screenshot: sage, rose, cobalt with the hairline,
lavender.

---

## 5. Where the tree disagreed with the brief. The tree wins

**Four places, and one of them changes what the brief can claim.**

### 5.1 §7's done item 5 cannot be met, and it is not this brief's to meet

The brief says at §4 that `#8F6A6A`, `#4D6387`, and `#74677F` "exist only to
colour the option you are not on", and at §7 item 5 that "nothing on any band
uses" them any more.

**That is false against the tree.** All three are also the `.sigil-version`
backgrounds, which colour the `2026a` badge nestled in the sigil's descender.
After this build they survive at `HeaderBar.svelte:132`, `:136`, and `:144`, in
the same file, forty lines above the rules that were deleted.

**They were left alone, deliberately.** `STATE.md:596-621` records the `2026a`
qualifier as a live, unruled question in Dann's own words, with the desk's
recommendation to strip the badge explicitly marked "NOT a ruling" and "nothing
may be built on this." Removing three of the badge's four colours would be
building on that lean by the back door.

**So done item 5 reads, honestly: the language pill no longer uses any of the
three. The `2026a` badge still does, on three of its four bands, and closing
that is the badge's own item.**

### 5.2 §4's citation is off

The brief cites `HeaderBar.svelte:189-199`. The tree carried four rules at
`:190-204`, one per destination, not three at `:189-199`. Same rules, different
span.

### 5.3 The census's `Drawer.svelte:669` is stale

`sonnet-memo-control-census_2026-08-18.md:206` lists `#74677F` at
`Drawer.svelte:669` as "Drawer's collapsed-Shane hover shade". A grep over all
of `apps/web/src/` returns no such literal in `Drawer.svelte`. It has gone
somewhere in the eleven commits since. Recorded so the next reader does not go
looking for it.

### 5.4 The brief did not name the end-to-end test, and it would have broken

`apps/web/e2e/core-loop.test.ts` drove `.lang-option` by its text and asserted
`aria-pressed` at three places. Both are gone. The test is repaired at
`:158-173` to read the pill's label and `lang` instead, which is the whole state
the control now carries, and the two other call sites at `:177` and `:189` take
the new selector.

**`test:e2e` is not one of the five gates** (`ilya-ship.sh:76-80`, recorded at
`STATE.md:1426`), so nothing would have caught this at ship time. It was found
by grepping for the deleted class rather than by a run.

---

## 6. Decisions this brief did not rule, stated as decisions

**Every one of these is reversible in one rule or one line.**

1. **Hover.** The pair drew an underline in the band's own hue. That colour
   cannot survive here: on Guide the chip is the band, so a band-hue underline
   would be invisible. **Decision: keep the underline and let it take the text's
   own white**, one declaration for all four bands instead of four. White is
   already measured against every chip, so this invents no colour. The
   alternative considered and rejected was the `opacity: 0.85` hover the voice
   anchor uses (`STATE.md:391`); on this control it would lighten the chip
   toward the band and push the ratio under 4.5.
2. **Token names.** `--lang-chip-*`, mirroring the `--surround-*` desk tints
   they sit beside.
3. **Guide's token is written as `var(--quiet-cobalt)`, not as the literal
   `#5C739E`.** The drawing's point is that Guide's chip *is* its band, so
   writing it as the band's own token means the two can never drift. The other
   three are hand-derived and must be re-derived by hand if a band ever moves.
   That is the cost option D was ratified knowing, and the token comment says so
   in the file.
4. **The label is not routed through `t()`.** It is an autonym: on an English
   page the word is French and on a French page it is English, so a translated
   string would say the wrong word in both. It is hard-coded in the template and
   the reason is written there.
5. **The transition changed** from `color, background-color, text-decoration` at
   0.2 s to `background-color 300ms ease`, which is `.header-bar`'s own value, so
   the chip and its band move together instead of the chip arriving first.
6. **No `title` attribute.** Canada.ca puts the full name in `title` only where
   it abbreviates. Nothing abbreviates here.
7. **The focus ring keeps `outline: 2px solid white; outline-offset: 2px`** and
   drops its re-declaration of `border-radius`, which the pill already carries.

---

## 7. The inbox item is closed

`INBOX.md`, 2026-08-20: *"The word 'Français' sits inside an English document at
HeaderBar.svelte:58 with no lang attribute on it, so a screen reader pronounces
it with English phonetics. WCAG language-of-parts."*

**Closed.** The visible word carries its own `lang` on the element that holds
it, at `HeaderBar.svelte:45`, and it is bound rather than fixed, so it is
`fr` when the word is "Français" and `en` when the word is "English". Both were
observed in the browser in §4 above.

**The line it cites no longer exists.** `HeaderBar.svelte:58` was the second of
the two spans and is deleted.

---

## 8. The five gates

Run on the settled tree, after every edit:

| gate | baseline | this run |
|---|---|---|
| phonology | 216 passed (216) | **216 passed (216)** |
| dictionary | 235 passed (235) | **235 passed (235)** |
| web-check | 0 errors and 7 warnings in 4 files | **0 errors and 7 warnings in 4 files** |
| web-test | 682 passed (682) | **682 passed (682)** |
| score-parser | 444 passed, 5 skipped (449) | **444 passed, 5 skipped (449)** |

**Nothing moved, so no permission was needed.**

---

## 9. NOT ESTABLISHED

**NOT ESTABLISHED BEATS A COMPLETE INVENTED ANSWER.**

- **Whether the pill should abbreviate to `FR` and `EN` below a breakpoint.**
  Still not ruled, and the measurement narrows it rather than settling it: the
  full word fits at 360 x 640 with 197 px to spare, so the question is now about
  taste and not about space. **Settled by:** Dann's ruling.
- **Whether Guide's hairline reads to an eye.** Its geometry is measured and its
  contribution to the contrast number is ruled out, but nobody has judged
  whether it separates the chip from the band well enough. **Settled by:** Dann's
  walk.
- **The pill's touch target is 69.04 x 21 px, which is below the 44 px floor.**
  This is unchanged from the pair and the brief kept `padding: 4px 12px`
  explicitly, so it was named rather than changed. CONTRACT §6 records that the
  cursor alone takes the 44 px floor and every other syllable stays plain, but
  it does not speak to a header control. **Settled by:** Dann ruling whether the
  header pill is a third touch-geometry exemption or takes the floor.
- **Anything narrower than 360 px.** Only 360 x 640 was measured, which is the
  case the brief named.
- **Safari, and any real phone.** Every number in this memo comes from the
  Chromium pane on Dann's Mac at a 360 x 640 emulated viewport. A real iPhone is
  not established.
- **Whether the deleted hover underline was ever wanted.** It is carried forward
  because it already existed on this control, not because anything ruled it.

---

## 10. What Dann walks

1. One pill, top right, showing the language he is not in, on all four
   destinations.
2. Tapping it switches the app, and the pill then offers the language he came
   from.
3. Each chip is its band's hue one step down, white text, and Guide's carries
   its hairline.
4. The header at 360 x 640 with "Français" beside the sigil.

---
*Written by Claude Code, 2026-08-20, against the working tree. Every ratio and
every rectangle in this memo was read out of a running browser. No number here
was computed from the stylesheet alone.*
