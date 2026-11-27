# Review (Fable), delta: amendment r2 to brief r3, the French abbreviations and the padded track

2026-11-26. Reviewed: `amendment-code-n94-ribbon-french-and-ends_r2_2026-11-26.md`, md5 `47a86de0a9fabbd2f906025b09a7e607` (confirmed). Read against r1, my r1 review, report r1, and `OPEN.md` N.94 (`:4839-4871`). Read from the working tree on `mac-n94-ribbon-slider`, uncommitted. No git write, no file edited but this one. No browser run, no test run.

Dann's rulings of 18:54 and 19:13 are taken as given. I judged only whether r2 builds them correctly.

## Verdict: DO NOT SEND as r2. Item 1 is sendable today.

Three blockers, all on item 2, all repaired by text in the amendment. None needs a new ruling from Dann. Applied as written below, r3 does not need to come back to me.

**The finding in one paragraph.** r2 tells Code that the track "gains" a slot at each end and "spans the padded width" (`r2:53`, `:61-62`). Built that way, five sites r2 does not name go wrong, the rail first. There is a smaller build that gives the same picture and touches one line of logic: leave the track thirteen nodes wide and let the window travel one slot past each end. "Over-travel" is my term for it. Under it the rail, the fill, the dots, the thumb, the transform, the fades, the drag, and the CSS width all stay as built. r2 does not choose between the two, so Code would choose, and the one r2's words point at is the one that breaks.

## Survival of my r1 findings

**Blockers**
1. Test pin at `transposition-ruler.test.ts:227`: **answered** (`r2:27-29`, `:89`).
2. Two readings of "both halves": **answered.** Option B builds no shift rule, and the done-when names `.spell span` (`r2:93`). One leftover: `r2:72` says the outer half regains its full width. It does not. At slot two the node's centre is 1.5 slots from the edge, 83.6 px at 390 and 68.6 px at 320, against a 96 px half; report r1 already measured 83 by 46 there (`report:104`). The exemption still retires, because both figures clear 44 px.
3. A done-when that passed on the fault: **answered in substance** (French, the fixture, a rect assertion, red first, two widths, the 5 px inset). Two gaps, amendments 4 and 5.
4. The false reason ("any node can reach the first or last slot"): **answered.** The sentence is gone and option B has no clamp to mis-time.
5. Put the choice to Dann: **answered.** He ruled B at 19:13. I cannot see that exchange; I take r2's word.

**Amendments**
1. No-break space: **answered** (`r2:15-16`, table).
2. Coined and adopted: **answered, with one overreach** (amendment 8).
3. Home the rulings in `OPEN.md`: **partly.** `r2:68` promises it for 19:13 and is silent on 18:54. Neither is in `OPEN.md` now: a search for `2de`, `19:13`, and `blank slot` in N.94 returns nothing; the desk-default paragraph still gives the abbreviations as English only and the foot still lists French as owed.
4. Say what is not ruled: **answered** (`r2:43-44`).
5. Name the inset: **answered**, 5 px (`r2:93-94`).
6. No movement on a swap: **moot under B**, as I said then. The done-when tests each spelling live, which covers it.
7. Complete "every other site": **partly.** The pair's sites are listed; `.slash` is cited at `:601 onward` and is at `TranspositionRuler.svelte:610-619` (`:601-604` is `.spell.live`). The window's sites are incomplete (blocker 1).
8. Hit sizes again: **answered** (step 0, part 3).
9. Name what step 0 measures: **answered** (`r2:78-80`).
10. Line references: **answered.**

**What I now consider wrong in my own r1.**
- I wrote that under B the drag clamp at `:164` "needs a floor of 0 and a ceiling of 12, or it indexes a node that does not exist". False. `i` is `zero + snapSemitone(position)` (`TranspositionRuler.svelte:162`), and `snapSemitone` already bounds to ±6 (`transposition-ruler.ts:397-400`), so `nodes[i]` exists before `:164` runs. r2 carried my error forward in bold (`r2:63-64`).
- I did not name `e2e/insights-key-lines.test.ts:608`, which B turns red (blocker 2).
- I wrote that B "needs no measurement in the browser". It needs the picture looked at, because of blocker 3's consequence.

## Blockers

1. **r2 does not say how the blank slot is made, and its wording points at the build that breaks the rail.** `r2:53`, `:61-62`.

   If the track grows to fifteen slots (two blank flex children, or padding on the track):
   - **The rail and the fill go wrong, and r2 does not name them.** `centre()` at `TranspositionRuler.svelte:91` divides by `nodes.length` (13); the rail (`:243`) and the fill (`:247`) are absolutely positioned by that percentage of the track's box, which would be 15 slots wide. The rail would start 0.58 slots from the track's edge and end 0.58 slots short of the other, so it would run through both blank slots, and the fill would no longer end under the thumb. The dots, the thumb, and the node centres stay right, because they sit inside each `.node` (`:251`, `:263-273`, `.node` at `:440-444`). So the bar and the thumb would disagree. `centre()` is shared with the desktop, so the repair needs a docked branch.
   - **The drag maps to the wrong node.** `:161` takes the slot width as `run.width / nodes.length` and offsets by `zero`. On a 15-slot track both are off. r2 names `:164` and not `:161`.
   - **The CSS width is a literal.** `.docked .ribbon-track { width: calc(100% * 13 / 7) }` at `:411-414`. Not named.
   - **The opening window is a literal.** `slideWindow(3, selectedIndex)` at `:114`. In padded indexes, centre is 4. Not named.
   - **The fades.** `:307-308` read `first > 0` and `first < nodes.length - WINDOW_SLOTS`. In padded indexes the left fade would paint over node −6 when it is the first real node on screen with nothing hidden beyond it. Not named.
   - A blank DOM child inside `role="radiogroup"` (`:232`) needs `aria-hidden` and no button, or it can be reached.

   **Change, my recommendation, the desk's to strike (DESK DEFAULT, reversible):** state that the track does not grow. `first` stays a node index and its range widens from 0..6 to −1..7. The whole logic change is the clamp at `transposition-ruler.ts:412`: `Math.min(count - WINDOW_SLOTS + 1, Math.max(-1, kept))`. Walked through the code:
   - `:241`: `first = -1` gives `translateX(+7.69%)`, one slot of a 13-slot track. No edit.
   - `:91`, `:243`, `:247`, `:161`, `:412`: unchanged, the track is still 13 wide.
   - `:114`: `slideWindow(3, 0)` returns −1, so a song stored at −6 opens with the end in slot two. No edit.
   - `:307-308`: `first > 0` and `first < 6` are still "a side with more nodes". No edit.
   - `:164`: with `first = -1`, `Math.max(first, i)` is `i`, already 0 or more; with `first = 7`, the ceiling is 13 and `i` is at most 12. No edit. A drag over the blank slot lands on the end node, which is ruling 9's clamp.
   - There is no blank element, so nothing can take focus, be tabbed to, or be read aloud. An arrow key walks `nodes` (`:133`) and cannot land there.

   Then strike `r2:63-64` (the bold sentence about `:164`) and `r2:61-62`, or keep them as "read and confirmed unchanged". **I have not run or drawn this.** Step 0 part 3 is where it is seen.

2. **An existing browser test goes red by design, and the done-when neither names it nor requires the file to pass.** `e2e/insights-key-lines.test.ts:608`: the last tuple, `[-6, -6]`, taps −6 and expects `span(-6)`, seven nodes (`:598`, `:611`). Under B the window at −6 holds six nodes and a blank, so `window7` (`:586-597`) returns six. The test's title says "seven nodes" (`:600`). The done-when (`r2:86-99`) asks for the new French test, the desktop test at `:374-389`, and seven gates; Playwright is in no gate, so nothing in r2 requires `insights-key-lines.test.ts` to pass, and nothing tells Code that this failure is expected. **Change:** name `:608` and `:600`; say the expected window at −6 is `[-6..-1]` and at +6 is `[+1..+6]`; add "the whole of `e2e/insights-key-lines.test.ts` passes" to the done-when. The rest of that file holds under B by my reading: `:614-616` (tap −5, tap −1, window `span(-6)`), `:626-630` (arrows to +6, `toContain`), `:636-659` (the drag from the opening window).

3. **The named departure understates what Dann will see.** `r2:67-68`: "at the two ends one of the seven slots is blank". The blank does not leave when she does. The trigger is LATE (`OPEN.md`, ruling 15), so from −6 the window holds still while she walks back through −5, −4, −3, and −2; it slides only at −1 (`slideWindow`, `transposition-ruler.ts:411`: from `first = -1`, index 5 is the first to move it). Six nodes and a blank show for five resting positions at each end, not one. This follows from his two rulings together and I am not reopening either. **Change:** write the departure as it is, in r2 and where the desk homes it in `OPEN.md`, and have Code's report carry a picture of the dock at −6 and at −3 after −6. Whether that goes to Dann before the build is the desk's call under his rule 11; a wrong guess here costs one line to redo.

## Amendments

1. **Unit tests, by line.** `r2:59` says "its unit tests"; name them. `transposition-ruler.test.ts:300-302` ("stops at the ribbon ends", expects `[0, 0, 6, 6]`) becomes `[-1, 0, 6, 7]`. `:304-315` loops `first` over 0..6 and allows slots 1 and 7 at the ends; it becomes −1..7 with the slot always 2 to 6. `:290-298` hold as they are. The test's comment at `:289` stays true. Replacements one for one leave gate 4's count where the French pin leaves it.
2. **Comments that become false.** `transposition-ruler.ts:402` and `:405-409`; `TranspositionRuler.svelte:39-41`, `:113`, `:163`, `:399-400`; `TranspositionDock.svelte:6-8`. r2 names the first pair only. Also `i18n.ts:2396-2397`, which says the French set "is NOT RULED and ships equal to the English until Dann rules it": false once item 1 lands.
3. **Say what r2 supersedes in brief r3.** `brief:202-204` ("except at the ends") and `brief:214-216` (the clipped outer half in slot one). An amendment that leaves them standing leaves two instructions.
4. **The new French test waits for the slide.** The track moves by a 0.2 s transform (`TranspositionRuler.svelte:411-414`) and the pair is drawn the moment the node is selected (`:283`). A rect read mid-slide is a moving figure. Use the wait `window7` uses (`e2e:587`) or poll until the rect is still. Add two assertions that are the point of B: the pair is centred on the phone as `:385-388` asserts on the desktop, and the end node's centre lies in the second or sixth seventh of the `.ribbon` rect.
5. **The route to a French dock at `fifths: 0` is not named.** `openInsights` hard-codes `'en'` (`e2e:59`) and `openDock` looks for "As written" in English (`e2e:573`); whether INSIGHTS offers "Try this key" on that print is unknown. `openMelody` takes `lang` and `fifths` (`e2e:175`) and report r1 item 5 says the Piece band opens the dock on a phone. Tell Code to find the route, report which, and stop if there is none. Reaching −6 takes several taps or arrows, since the opening window is −3 to +3.
6. **A test that a drag over the blank lands on the end.** r2 states the rule (`r2:63-64`) and asks for no proof. With −6 selected and the window settled, a touch drag to x = 1 keeps −6 checked and the readout on the tritone. Same at +6.
7. **A tap on the blank slot does nothing. DESK DEFAULT to state.** Above the spelling band it hits the bare `.ribbon`, which is inside `[data-transposition-ribbon]` (`:147-148`), so it neither commits nor closes. In the band it hits the outer spelling half, as ruling 18 has it.
8. **OQLF provenance, one sentence to tighten** (`r2:31-34`). As the page reads through my tool: the general rule is a numeral and one to three raised lowercase letters, an `e` for ordinals; `1er`, `1re`, `2d`, `2de` are named as the differing cases; longer finals are discouraged. So `2de` is the page's form for the ordinal adjective « seconde » (« 2de partie »), and `3ce` and `4te` are built by analogy with `1re` and `2de`, not by the page's general method, which would give `3e` and `4e`. r2's "that page's method, a numeral followed by the word's raised final letters" is the desk's gloss. The quotation « il est admis de les écrire sur la ligne » is on the page. r2's NOT ESTABLISHED on `3ce` and `4te` is right and stays.
9. **Pin with the escape.** The six values at `transposition-ruler.test.ts:227` are written with ` `, as `i18n.ts` does, so a literal space cannot pass by eye.
10. **Correct `r2:72`** to "about 83 px at 390 and 68 px at 320, above the floor", and `r2:106` (`.slash`) to `:610-619`.
11. **Home 18:54 as well as 19:13 in `OPEN.md`.** The desk's write, not Code's.

## Item 1, judged

- **` ` is right for this file.** 101 lines of `i18n.ts` carry the escape and 24 a literal no-break space; the neighbours at `:2362` and `:2364` use the escape.
- **The shape of the pin is right**: six values in one `toEqual`, as `:225` does for English.
- **Nothing else pins the old French values.** `key.ruler.short` and `shortInterval` appear only at `i18n.ts:2401-2406`, `transposition-ruler.ts:368-369`, `TranspositionRuler.svelte:54` and `:279`, and `transposition-ruler.test.ts:12`, `:225-227`. `e2e:232` and `:249` pin the English in an English run. No screenshot or snapshot assertion names the ruler.
- **`fifths: 0` yields a pair at both ends.** `transposition-ruler.test.ts:211-216` and `:235` assert it, and `e2e:377` reads « sol bémol », « fa dièse » at −6 and at +6 on the desktop.

## Would the done-when catch the fault

Yes. `getBoundingClientRect` on `.spell span` ignores the clip, and `.docked .ribbon` runs to the screen's edges (`:401-404`, the −10 px margin cancels the dock's padding). At −6 today the flat word starts 17 px outside, at +6 the sharp word ends 7 px outside (`report:33-34`); both fail a 5 px inset. Under B at 390 the word has about 38 px to spare, by my arithmetic on the report's figures. With amendments 4 and 5 the test is sound.

## Deleted, broken, or reversed

- **Ruling 15**: departed from, named, under his 19:13 ruling; the naming is short of the fact (blocker 3).
- **Ruling 17**: kept, and now met on the phone.
- **Ruling 9**: kept under over-travel with no edit. Under a grown track it breaks at `:161`.
- **Ruling 18**: the halves travel with the pair; the outer one gains room.
- **Rulings 14, 16, 19, and the readout**: untouched.
- **Brief r3's "the drag stays among the seven nodes on screen"** (`:164`): kept only if `:164` is left alone. r2's bold sentence can be read as replacing the window bound with 0..12. Blocker 1's change removes the ambiguity.
- Nothing in the built code is deleted.

## What I could not establish

**NOT ESTABLISHED beats a complete invented answer.**

- **Over-travel on a screen.** Read from the code, line by line; not run, not drawn. A positive `translateX` under `overflow: clip` in WebKit is untested by anyone.
- **Dann's 18:54 and 19:13 exchanges.** In no file I searched. I do not know what cost he was shown at 19:13, which is why blocker 3 is the desk's call.
- **The OQLF page itself.** Read through a tool that returns quotations with a summary, not the page. *GDRM* not opened.
- **Any painted width.** The 83.6, 68.6, 38 px, and 0.58-slot figures are my arithmetic on the report's measurements and the CSS.
- **Whether the rest of `insights-key-lines.test.ts` holds under B.** Reasoned, not run.
- **The French dock's route at `fifths: 0`** (amendment 5).
- **Not re-read this session:** `i18n-index.test.ts` (r2's claim that it counts keys matched my r1 reading); `CONTRACT.md` beyond `:180`; `transposition-ruler-state.svelte.ts` beyond its `phone` getter; the mockups; `+page.svelte`.

Terms: "over-travel" and "grown track" are mine. "Padded track" and "blank slot" are r2's.
