# Review (Fable): amendment r1 to brief r3, the French abbreviations and the pair row's ends

2026-11-26. Reviewed: `amendment-code-n94-ribbon-french-and-ends_r1_2026-11-26.md`, md5 `f4e84e34007275adcaf7f307560a2fea` (confirmed). Read from the working tree on `mac-n94-ribbon-slider`, uncommitted. No git write, no file edited but this one.

## Verdict: DO NOT SEND as r1

Five blockers. Item 1 and step 0 parts 1 and 2 are sendable once blocker 1 and amendments 1 and 2 are applied. Item 2 waits on blockers 2 to 5.

## Blockers

1. **Item 1 fails gate 4 as written, and the amendment names no test to change.** `apps/web/src/lib/melody/transposition-ruler.test.ts:227` reads `expect(shortInterval(2, 'fr')).toBe('M2');`. The new value `2de M` fails it. The done-when (amendment `:72`) says gate 4 holds at +15 "unless this amendment adds a test", which tells Code the count is the only thing that can move. **Change:** name `transposition-ruler.test.ts:227` as a site, and pin all six French values there in one assertion, as `:225` pins the English. The test file is inside brief r3's file list (`brief:272-274`).

2. **"Both halves" has two readings, and they build two different controls.** In this lane a half is the 96 by 46 px hit region: `TranspositionRuler.svelte:17` ("THE SPELLING HALVES are invisible regions 96 by 46 px"), `.spell` at `:568-574`, and the report's table (`report:97-104`). Read that way, amendment `:40-42` shifts the pair 68 px at slot one (96 less the 27.9 px of `report:35`) and also fires in slots two and six, where the node's centre is 83.6 px from the edge (1.5 slots of 55.7 px) and a 96 px half does not fit. The occasion sentence (`:37-38`) means the painted words. **Change:** say that the rule measures the painted text of each spelling (`.spell span`, `TranspositionRuler.svelte:298`), that the 96 px regions travel with the pair, and that they stay clipped by the window as brief r3 section 6 has it (`brief:214-216`).

3. **The done-when passes on the fault Dann was shown.** Amendment `:70`: "At −6 and at +6 on the phone, both halves of the pair sit inside the window and print in full, measured in px."
   - It names no language. In English the pair at an end is « G♭ / F♯ » (`report:63`), which already fits. The line is true today in English.
   - It names no fixture. On Sunless 01 as printed (two sharps) the pairs sit at −3, −1, and +4 (`report:57-61`), so −6 and +6 carry no pair and the line is true of nothing. Every docked browser test opens that print in English (`e2e/insights-key-lines.test.ts:567-568`, `openInsights` default `fifths = 2` at `:49`). No phone test in French exists.
   - "Measured" is a report, not an assertion. The window is `overflow: clip` (`TranspositionRuler.svelte:401-404`), so a visibility check passes on a clipped word.
   - It measures at 390 only, so a hard-coded 17 px passes. The dock is drawn wherever the screen's smallest side is under 768 (`+page.svelte:1004-1007`, `:995`).
   - Under blocker 2's other reading it can never pass.

   **Change:** the done-when is a browser test in `insights-key-lines.test.ts`, in the docked describe, on a print with no sharps or flats (`fifths: 0`, as `:375` does on the desktop), in French, at −6 and at +6, with each spelling live in turn. It asserts that the rect of each `.spell span` lies inside the rect of `[data-transposition-ribbon] .ribbon` by the named inset (amendment 5), at 390 and at one narrower width (320 or 360). **Code runs it on the tree before building item 2 and reports that it fails, with the −17 and +7 px it shows.** A test that was never red proves nothing about this fault. Gate 4 does not count it (it is Playwright), so the amendment's gate line stays true once blocker 1's pin is in.

4. **The reason given for writing the rule against the window is false in the code, and it steers the build into a moving target.** Amendment `:42-43`: "any node can reach the first or last slot." The pair is drawn on the selected node only (`TranspositionRuler.svelte:283`), and `slideWindow` keeps the selected node in slots two to six except where the ribbon ends (`transposition-ruler.ts:410-413`). At rest, a pair can sit in slot one only at −6 and in slot seven only at +6. What does pass through slots one and seven is a node in mid-slide: the track moves by a 0.2 s transform (`TranspositionRuler.svelte:241`, `:411-414`). A clamp measured against the window at the moment of selection reads the pair before the slide and leaves it off-centre in slot two or six after it. **Change:** strike the sentence. Say that the rule applies at rest, to index 0 and index 12 of the docked ribbon, by whatever distance the window's width requires; that a node which comes to rest in slots two to six is centred; and that nothing is computed from a position read during the slide.

5. **Item 2 builds the option Dann was offered and did not take, and the amendment does not say so.** `OPEN.md:4864` (ruling 17): "Offered: shift the pair inward and let it sit off-centre, or pad the card. RULED: pad the card", in his words "so the ends have room to centre properly". The report says it (`report:35-36`). The amendment's "departure, named" (`:49-52`) says only that it departs from "centre". `CONTRACT.md` section 1 item 4 makes taste his, and section 8 forbids a step that permits what he asked to be rid of. **Change:** state the fact in that paragraph, and put the choice to him before item 2 is built. It is one question, and a second option exists that keeps his ruling:
   - **A, the amendment's:** shift the pair at the two ends. Cost: an off-centre pair, in French, at −6 and +6 on a phone.
   - **B, mine ("end padding" is my term):** one empty slot beyond each end of the docked track, so −6 comes to rest in slot two and +6 in slot six, and every pair centres. This is "pad the card" carried to the phone. It also lifts the outer tap half at an end from 27.5 px (`report:103`) to about 83 px, which retires the ruled exemption to the 44 px floor. Cost: at an end the window shows six nodes and a blank slot, which bends ruling 15's "seven are visible" and brief r3's "except at the ends" (`brief:202-204`); `slideWindow` (`transposition-ruler.ts:410-413`) and its unit tests change; the drag's clamp at `TranspositionRuler.svelte:164` then needs a floor of 0 and a ceiling of 12, or it indexes a node that does not exist.
   - **My recommendation: B.** It keeps the choice he made at 14:07, needs no measurement in the browser, and cannot jitter (amendment 6). I have not drawn it or run it.

## Amendments

1. **Put a no-break space in the five two-part values (`i18n.ts:2401-2405`).** The amendment's claim is true for the one render site: `.interval` is `white-space: nowrap` (`TranspositionRuler.svelte:531`), `.interval-text` inherits it (`:535-538`), `shortInterval` is the only reader (`transposition-ruler.ts:368-369`, called at `TranspositionRuler.svelte:279` and nowhere else in `apps/` or `packages/`), and the span is `aria-hidden` (`:274`). But `CONTRACT.md` section 7 applies OQLF spacing "everywhere", the OQLF's page on the no-break space says the abbreviated elements of an expression are not separated, and this file carries the character in the value, not in the CSS (`i18n.ts:2362`, `:2364`, ` ` before the colon). `'2de m'` costs nothing and holds for any later reader. The unit pin of blocker 1 then carries ` ` too.

2. **Correct the "coined and adopted" paragraph (amendment `:20-22`).** `2de` is the OQLF's own abbreviation of « seconde ». `3ce` and `4te` are not "standard French ordinal abbreviations": « tierce » and « quarte » are nouns, and the OQLF page on ordinal abbreviations does not give them. Their source is NOT ESTABLISHED (see the last section). Also name the typography for what it is: the OQLF sets these letters raised and admits them on the line « lorsqu'il n'est pas possible de surélever les lettres ». The desk is taking that tolerance at 10 px. Whether Dann's "A" covered letters on the line is his to say; I cannot see the 18:54 exchange.

3. **Record the 18:54 ruling in `OPEN.md`, N.94.** A search of `OPEN.md`, `INBOX.md`, and `STATE.md` for `2de` returns nothing. `OPEN.md:4866` still gives the abbreviations as English only, and `:4870` still lists French as owed. This is the desk's write, not Code's.

4. **Say what this amendment does not rule.** `key.ruler.respell` (`i18n.ts:2399`, « Écrire plutôt {tonic} ») and `key.ruler.undo` (`:2400`, « Annuler ») remain the desk's drafts (`report:46-49`, `OPEN.md:4870`). The amendment's title says "French" and its body rules six values. One line keeps Code from reporting the lane's French as settled.

5. **Name the inset.** "Inside the window" is met at 0 px, with a word touching the screen's edge. State a figure. My suggestion, the desk's to strike: 5 px, the padding `.spell` already carries (`TranspositionRuler.svelte:575`).

6. **Say that the pair does not move on a swap.** The live word is bold (`:601-604`) and the other is not, so a shift measured from the painted width changes when she swaps, and the pair moves under her finger. If option A is built, compute the shift from the wider of the two states. Option B has no such case.

7. **Complete "Every other site" (amendment `:74-78`).** `.pair` (`:559-566`) is the only anchor, and the dock renders the same snippet (`TranspositionDock.svelte:99`); both claims are true. The words' positions also come from `.spell.flat` and `.spell.sharp` (`:587-595`) and `.slash` (`:610-619`). On the phone the row moves with the track's transform (`:241`) and is clipped by `.docked .ribbon` (`:401-404`); on the desktop the card clips it (`:357`). Scope any new rule under `.docked`, and leave `e2e/insights-key-lines.test.ts:374-389` as it is: its lines `:386-388` assert that the desktop pair is centred, which guards the desktop from this change.

8. **Ask for the hit sizes again.** Under option A the outer half at an end grows from 27.5 px and the inner half reaches further over slots two and three. `report:97-108` and its exemption sentence are then out of date. Under option B the exemption goes.

9. **Step 0, part 1: name what is measured.** The rect of `.interval-text` (`:275-279`, which includes the pick's underline) against the rect of its `.node`, with the overhang on each side reported separately, at 390, at the narrower width, and at 1440.

10. **Line references.** `shortInterval` is declared at `transposition-ruler.ts:368`; `:369` is its body. `.interval` is `TranspositionRuler.svelte:526-532`. Both claims about them are true.

## The citations, each opened

| the amendment's claim | finding |
|---|---|
| `i18n.ts:2401-2406`, six `fr` values equal the English | True. |
| `i18n.ts:2375-2380`, the readout's words; « Une tierce mineure » at `:2377`, `:2378`, `:2379`, `:2380` | True, as cited. |
| `key.ruler.orig` stays « ORIG. » in both languages | True, `i18n.ts:2398`. `respell` is `:2399`, `undo` is `:2400`; the amendment is silent on both (amendment 4). |
| `shortInterval` (`transposition-ruler.ts:369`) is the only reader and returns `key.ruler.orig` at zero | True; declared at `:368`. |
| `commitStop` (`:348-360`) | Not cited by the amendment. As built: the live spelling, then the print, then the undimmed twin, then the flat (`:356-358`). Untouched by either item. |
| `.interval` is 10 px and `white-space: nowrap` (`:526-533`) | True, `:526-532`. |
| `.pair` is `position: absolute; left: 50%; width: 0` (`:559-566`) and the only definition of the row's position | True as the anchor; incomplete (amendment 7). |
| The dock renders the same snippet (`TranspositionDock.svelte:99`) | True: `{@render body(true)}`. |
| `i18n-index.test.ts` counts keys, so a value change does not move the index | True: it counts `stringKeys()` by prefix and in total (`i18n-index.test.ts:28-32`, `:47-57`). It never reads a value. |
| "The desktop never fires the rule" | True at 1440 by the report's 4.9 px (`report:112`). Not established at any other desktop width. |

## What I judged, briefly

- **Ruling 11.** `3ce m`, `3ce M`, and `4te J` agree in form with « Une tierce mineure », « Une tierce majeure », and « Une quarte juste » (`i18n.ts:2377-2379`), noun then quality, which the shipped `m3`, `M3`, and `P4` do not. `2de m` and `2de M` against « Un demi-ton » and « Un ton » (`:2375-2376`) is the mismatch the amendment holds; English has the same one, and brief r3 forbids editing `key.ruler.interval.*` here (`brief:244-246`). Holding it is correct.
- **Other French in the file.** No other key in `i18n.ts` abbreviates an interval; a search for `2de`, `3ce`, and `4te` returns nothing. Nothing contradicts the forms.
- **Pins.** `e2e/insights-key-lines.test.ts:232` and `:249` pin the English abbreviations in an English run and are unaffected. The one French pin is blocker 1.
- **Case.** `m` against `M` carries the whole distinction. Neither component sets `text-transform`.
- **Keyboard, drag, swap, names.** The focus effect (`:123-127`), the arrows (`:129-135`), the swap (`:296`), and the accessible names (`:257`, `:295`) do not read the pair's position. The pair is hidden during a drag (`:283`) and returns on the lift, which is the moment of blocker 4.
- **Rulings 14, 15, 18.** Option A touches none of them: one pair, seven nodes, flats first. Its only collision is ruling 17. Option B bends ruling 15 at the two ends.
- **Deleted or reversed.** Nothing in the built code is deleted by either item. The one reversal is blocker 5.

## What I could not establish

**NOT ESTABLISHED beats a complete invented answer.**

- **Dann's 18:54 ruling.** It is in no file I searched. I took the amendment's word for the six forms.
- **That `3ce` and `4te` are in use in French theory writing.** I saw one search-result title that writes « 3ces Majeures et mineures ». I opened no source that gives `3ce m` or `4te J`. Roberge's *GDRM* was not opened by me either.
- **The OQLF's wording.** I read two OQLF pages through a tool that returns a summary with quotations, not the pages themselves: "Abréviation de l'adjectif ordinal" and "Contextes exigeant une espace insécable" (vitrinelinguistique.oqlf.gouv.qc.ca, ids 24271 and 24566). The desk opens them before relying on amendments 1 and 2.
- **Every painted width.** I ran no browser. The 17 px, 7 px, 27.9 px, 80 px, and 4.9 px figures are the report's. The 83.6 px and 68 px figures in blocker 2 are my arithmetic on them.
- **Whether the docked tests' route (`openDock`, `e2e:568-582`, through "Try this key") works on a print with no sharps or flats.** It needs INSIGHTS to offer a key there. Code finds the route and reports it.
- **Option B on a screen.** It is a design read from the code, not drawn and not run.
- **The desktop at widths other than 1440**, and anything on a real phone or in WebKit.
- **Not read:** the mockups; `transposition-ruler-state.svelte.ts`; `CONTRACT.md` sections 0.1 to 0.3 and 2 to 5.
