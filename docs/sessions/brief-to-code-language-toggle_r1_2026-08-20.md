# Brief to Code: the language toggle becomes one pill

**Ruled by Dann 2026-08-20. HOLD THIS until the chevron pass has shipped and
been walked: one brief at a time.** Ship two of the stations brief,
`brief-to-code-drawer-stations_r1_2026-08-20.md` §4, is still not started and
this does not displace it.

Read `docs/memory/CONTRACT.md` in full first.

---

## 1. What Dann ruled, and what he ruled it against

**The pair becomes one pill.** Today `HeaderBar.svelte:39-59` renders two
`<span role="button">` elements with `aria-pressed`, one marked `.active`.
**One control survives, and it names the language you are NOT in.** "Français"
on an English page, "English" on a French one.

**The pattern is Canada.ca's**, which Dann adopted after the desk researched it:
a single control labelled with the other official language, top right of the
header. He is not bound by it, and he took it for convention and familiarity
rather than compliance.

**The treatment is Dann's option D, ratified from a drawing:** white text on a
chip that is the band's own hue taken one step down. **He chose it over dark ink
on a translucent chip, knowing it costs four values instead of one.** He said
"I love D. Ratified."

---

## 2. The shape is already ruled. Do not invent it

`docs/sessions/fable-gui-audit-and-spec_r1_2026-08-18.md` §3.2, the three radii:
"0 for paper and desks, a small radius for every button, field, and card, and
**full-round only for toggle knobs and the language pills**." The current
control already draws `border-radius: 9999px` and `padding: 4px 12px`. **Keep
both.**

---

## 3. The four chips

| destination | band, unchanged | the chip | white on it |
|---|---|---|---|
| Transcription | `#8B9A7D` | `#6C7A5F` | 4.58 |
| Learn | `#A67B7B` | `#9A6A6A` | 4.52 |
| Guide | `#5C739E` | **the band itself, undarkened** | 4.77 |
| Marked score | `#8E7E9B` | `#806E8E` | 4.63 |

**Guide's band is already dark enough**, so its chip is the band colour and
would be invisible without an edge. **Give it a hairline,
`inset 0 0 0 1px rgba(255,255,255,.22)`, and only it.** That is what the drawing
shows.

**The ratios above are the coordinating desk's, computed not measured. Verify
each of the four in the browser and report your numbers beside these.** If any
falls under 4.5, say so rather than nudging the hex to pass.

**These four are new values with no tokens behind them.** Name them properly in
`app.css` rather than inlining literals. The census of 2026-07-29 flagged this
exact control for carrying three hand-picked literals beside one real token;
do not add four more of the same kind.

---

## 4. Three literals get deleted

`HeaderBar.svelte:189-199` gives `.lang-option:not(.active)` a solid
per-destination background: `--deeper-sage`, then `#8F6A6A`, `#4D6387`, and
`#74677F`. **Three of those four are hand-picked literals and they exist only to
colour the option you are not on.** With one pill there is no such option.
**Delete them.** Report anything else that referenced them.

---

## 5. What the control IS, which is not what it currently claims

- **It is a `<button>`, not a `<span role="button">`.** It changes application
  state; it does not navigate to a URL.
- **`aria-pressed` goes.** There is no pressed state left to describe.
- **The visible word carries its own `lang`.** On an English page the button's
  content is French, so it needs `lang="fr"`; on a French page, `lang="en"`.
  **This closes an item in `INBOX.md` from the same day:** "Français" currently
  sits inside an English document at `HeaderBar.svelte:58` with no `lang`, so a
  screen reader pronounces it with English phonetics. In a diction app, that is
  a poor joke. **Say in the memo that the inbox item is closed.**
- **The autonym is the accessible name**, per the Canada.ca pattern. Do not add
  an `aria-label` that replaces it: WCAG's label-in-name expects the accessible
  name to contain the visible text.

---

## 6. One thing NOT ruled, and do not decide it silently

**Whether the pill abbreviates to `FR` and `EN` on small screens.** Canada.ca
does exactly that below its breakpoint, with the full name in a title
attribute. **Dann has not ruled it and the desk did not press him.**

**Build the full word at every size.** Then measure the header at 360 x 640 with
the longest case, which is "Français" beside the sigil, and report whether it
fits. **If it collides, report the collision and leave it. Do not abbreviate
unasked.**

---

## 7. Done when

Dann walks these on a deploy.

1. One pill, top right, showing the language he is not in, on all four
   destinations.
2. Tapping it switches the app, and the pill then offers the language he came
   from.
3. Each chip is its band's hue one step down, white text, and Guide's carries
   its hairline.
4. The four measured contrast ratios are in the memo and all clear 4.5.
5. Nothing on any band uses `#8F6A6A`, `#4D6387`, or `#74677F` any more.
6. The header still fits at 360 x 640, or the collision is reported.
7. All five gates at baseline: 216, 235, 0 errors and 7 warnings in 4 files,
   682, 444 passed and 5 skipped. **Ask Dann before moving any count.**

---

## 8. The memo

Append to `docs/sessions/drawer-stations-ship1_r1_2026-08-20.md`, or start a new
one if that file has grown unwieldy and say which you chose. It carries: what
shipped with `path:line`; your four measured ratios against the desk's four
computed ones; the 360 px header measurement; confirmation that the inbox
`lang` item is closed; every decision this brief did not rule, stated as a
decision; and **NOT ESTABLISHED**, with what would settle each. **NOT
ESTABLISHED BEATS A COMPLETE INVENTED ANSWER.**

---
*Written by the coordinating desk, 2026-08-20. The pattern is sourced to
Canada.ca's language toggle specification and the GC Design System; the
treatment is Dann's, ratified from a drawing after the desk measured that the
existing control fails 4.5 in both states on all four bands, between 2.47 and
3.93.*
