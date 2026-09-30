# Report from Code: the singer declares a voice type (slice A)

Written by Code 2026-09-30, against `brief-code-voice-type-slice-a_r1_2026-09-30.md`. Read on branch `Shane` at `47a6f8f`. The working tree was dirty before this session: `docs/memory/CONTRACT.md` and `docs/memory/OPEN.md` modified, and the brief and both drafts untracked. None of those four were touched. Nothing is committed.

## Step 1: the reading

**How the wizard gets `activeVoice`.** `CalibrationWizard.svelte:242` reads the whole store once, `let store = $state<ProfileStore>(loadStore(...))`, and `:243` derives `activeVoice` from it: `store.voices.find((v) => v.id === store.activeId)`.

**How it saves a field.** `setCharacteristic`, `:416-422` at `47a6f8f`, finds the active voice in `store`, writes the field, refreshes `v.updatedAt`, and calls `persistStore()` (`:364`). `setIntake` (`:428-435`) is the same shape for the intake. Nothing else is needed: the `$effect` at `:1071-1083` snapshots `activeVoice`'s fields into `onActiveProfileChange`, so any field it reads re-publishes on write.

**How `InsightsPane` receives `voiceName`.** `+page.svelte:4353` receives `onActiveProfileChange={(f, name, characteristics, updatedAt, intake) => …}` and mirrors each argument into page state (`:351-357`). `:4840` passes `voiceName={voiceName}` to `<InsightsPane>`. The pane builds the line at `InsightsPane.svelte:241-247` and uses it in the title header (`:599`, as `poet`) and the running head (`:491-493`).

**The plan for the ceilings.** The wizard was at 2124 of 2124 and the pane at 1349 of 1350.

- Wizard: drop the unused `voiceType` prop (three lines), and fold `setIntake` into one `setOwn` that serves the intake and the voice type, with the field logic moved to `profileStore.ts`. That pays for the import, the callback argument, and the one markup line.
- Pane: move the identity composition into a new module, `insights/identity.ts`, which also makes it testable. The pane keeps one derived line and gains the prop.

## What changed

### New files

- `apps/web/src/lib/voice/voiceTypes.ts` (94 lines). The nine Tier 1 ids, the 29 Tier 2 ids under their parents, `OTHER`, `withTier1()` (the Tier 1 change rule), and `voiceTypePrint()` (the printed label). No display strings. The capitals a name keeps are a per-language set: English keeps `Baryton Martin`, `Heldentenor`, and `Heldenbariton` whole; French keeps the two German names, and lowering the first letter gives « baryton Martin ».
- `apps/web/src/lib/voice/VoiceTypeIntake.svelte` (202 lines). Tier 1 radio group with **Clear answer**; **More specific (optional)** only after a type with finer labels, ending with **Other (type your own)** and a text field. Typing in the field selects Other. Saves on every change; holds no state.
- `apps/web/src/lib/insights/identity.ts` (33 lines). `composeIdentityLine()`. With no label it removes ` · {voiceType}` from the template before filling, so no empty separator prints. It fills in one pass, so a label containing `{date}` prints as typed.
- `apps/web/src/lib/voice/voiceTypes.test.ts` (22 tests) and `apps/web/src/lib/insights/identity.test.ts` (7 tests).

### Edited files

- `voice/profileStore.ts`, the calibration date (see desk defaults): `calibratedAt?` beside `updatedAt`, and `touchVoice()`, which refreshes `updatedAt` after a write that is not a reading and first copies an older voice's `updatedAt` into `calibratedAt`.
- `voice/profileStore.ts:88-96`: `voiceTypeSpecific?` (a Tier 2 id or `'other'`) and `voiceTypeOther?` beside `voiceType`. `validVoice()` is unchanged. `:124` `VoiceTypeChoice`; `:131` `assignToVoice()`, which writes a patch, removes fields given as `undefined`, and refreshes `updatedAt`.
- `voice/engine/plausibility.ts:135`, `bucketFor()`: adds `contralto` to `tenor-mezzo` and `bass-baritone` to `bass`. Every string it accepted before still routes the same.
- `voice/CalibrationWizard.svelte`: the `voiceType` prop is gone; `:245` derives `voiceType` from `activeVoice?.voiceType`, so the guard (`withPlausibility`, and the `{voiceType}` passed to the Pacifier) routes from the stored voice. `:430` `setOwn`. `:173` and `:1081` carry the choice out through `onActiveProfileChange`. `:1524` renders the intake first in Voice characteristics. `:1591` the Insights intake now calls `setOwn`. Length 2124, at its ceiling, not over.
- `insights/InsightsPane.svelte:92,117` the `voiceType` prop; `:247` the line from `composeIdentityLine`. `calibratedOn` stays at `:246`, because the method line (`:365`) still reads it. Length 1349.
- `routes/+page.svelte:359,4361,4845`: mirrors the choice and passes it to Insights. Length 6016 of 6028.
- `i18n.ts:1471-1472`: the two identity lines. `:1712-1756`: heading, hint, both group labels, nine Tier 1, 29 Tier 2, verbatim from the draft's two ratified tables. The Tier 2 French is stored in sentence case for the menu (« Basse chantante »), as the draft says; the print lowers it.

## Desk defaults taken

- `DESK DEFAULT` **"Not sure" shows no More specific group,** because it has no finer labels, and prints nothing even if an Other text is still stored.
- `DESK DEFAULT` **Clear answer on Tier 1 keeps Other's text in storage,** by the same "keeps Other's text" rule, so choosing a type again restores it. It prints nothing while no type is chosen.
- `DESK DEFAULT` **The Tier 1 "Not sure" label reuses the ratified words** « Je ne sais pas » under its own key, `voiceType.type.not-sure`.
- `DESK DEFAULT` **The unused `voiceType` prop is removed** from the wizard rather than kept beside the stored value, to fit the ceiling and so there is one source.
- `DESK DEFAULT` **"Calibrated {date}" is the date of the last sung reading, not the last edit** (Dann: "you decide", 2026-09-30). `persist()`, the wizard's only reading write, stamps `calibratedAt` with `updatedAt`. Characteristics, the intake, the readiness record, and the voice type call `touchVoice()` and leave `calibratedAt` alone. The wizard publishes `calibratedAt ?? updatedAt`. A voice saved before this change keeps its last date as its calibration date on its first edit. If earlier Range or intake edits had already moved that date, it cannot be recovered, because formants carry no timestamp.
- `DESK DEFAULT` **Duplicating a voice does not copy its voice type.** `duplicateActiveVoice` (`CalibrationWizard.svelte:509`) copies only formants, and characteristics and intake behave the same today.

## Gates

Run as the eight commands in `~/Downloads/ilya-ship.sh`, because the script refuses a tree with untracked files.

| Gate | Baseline | Now |
|---|---|---|
| 1 phonology | 251 passed (251) | 251 passed (251) |
| 2 dictionary | 235 passed (235) | 235 passed (235) |
| 3 web-check | 0 errors and 12 warnings in 5 files | 0 errors and 12 warnings in 5 files |
| 4 web-test | 1684 passed (1684) | **1713 passed (1713)**, the 29 new tests |
| 5 score-parser | 636 passed, 5 skipped (641) | 636 passed, 5 skipped (641) |
| 6 blurb | 145 passed (145) | 145 passed (145) |
| 7 integration | 55 passed (55) | 55 passed (55) |
| 8 ratchets | OK | OK. No ceiling raised. |

Gate 4's baseline in `ilya-ship.sh` must move from 1684 to 1713 when this is committed, or the script reports a deviation. The ratchet also says three ceilings can fall: `InsightsPane.svelte` 1350 to 1349, `MarkupPane.svelte` 1358 to 1302, `+page.svelte` 6028 to 6016. I left `ratchets.json` alone.

## The browser walk

Headless Chromium through Playwright against `http://localhost:5173` (the `ilya-web` dev server), with a seeded voice "Dann" dated 2026-09-12 and no `calibratedAt` (as a voice saved before this change), with `sunless-01-engraved.musicxml` loaded so Insights earns a page two and its running head. Read from the DOM and from `localStorage`, English then French:

1. **Bass, then Basso cantante**: stored `{voiceType: "bass", voiceTypeSpecific: "basso-cantante"}`. Running head: "Without Sun, no. 1: Within Four Walls · Insights for Dann · basso cantante · calibrated 2026-09-12". Header: "INSIGHTS FOR DANN · BASSO CANTANTE · CALIBRATED 2026-09-12". French: « Aperçus pour Dann · basse chantante · calibration du 2026-09-12 ». The date holds at 2026-09-12 through every step.
2. **Tenor**: stored `{voiceType: "tenor"}`, no finer choice checked, eight finer options offered (seven labels and Other). The same in French.
3. **Not sure**: the More specific group is gone; the line returns to "Insights for Dann · calibrated 2026-09-12", no empty separator. French likewise.
4. **Bass, then "Russian Bass" typed into Other**: Other checked, stored as typed; the running head prints "Russian Bass". French: « Basse Russe ».
5. **Clear answer**: `voiceType` removed, the line back to today's.

To walk it yourself, open this URL on the local dev server. Vercel does not show this until it is committed and pushed.

```
http://localhost:5173
```

Then open **Drawer**, **Voice**, **Re-calibrate**, **Add voice characteristics**. The Voice type group is first.

## Screenshots

All in `docs/sessions/`. Desk 1280 by 900, phone 390 by 844.

- `voice-type-a-en-intake-desk_2026-09-30.png`, `voice-type-a-en-intake-phone_2026-09-30.png`: Bass and Basso cantante selected.
- `voice-type-a-fr-intake-desk_2026-09-30.png`, `voice-type-a-fr-intake-phone_2026-09-30.png`: Basse and Basse chantante.
- `voice-type-a-en-header-desk_2026-09-30.png`, `voice-type-a-en-header-phone_2026-09-30.png`, and the two `fr-header` files: the Insights title header.
- `voice-type-a-en-running-desk_2026-09-30.png`, `voice-type-a-en-running-phone_2026-09-30.png`, and the two `fr-running` files: the page-two running head.

## For Dann

1. **Both headers uppercase the label, so "lower case mid-line" is not visible on screen.** `TitleHeader.svelte:66` calls `toUpperCase()` on the whole line, and the running head sets `font-variant-caps: all-small-caps` (`InsightsPane.svelte:1167`). The stored and composed strings are lower case with the names' capitals, as ruled, and the tests prove it. Other's text, typed with capitals, also prints in capitals or small capitals, not exactly as typed.
2. **A treble voice, or anyone who is "Not sure" but has a label,** cannot print one: "Not sure" hides Other. The draft sends trebles to free text. If they should print, the choice is whether Other appears under "Not sure".

## What I could not establish

- **The Playwright e2e suite was not run.** `e2e/singer-paths.test.ts:105` checks "NOT CALIBRATED" on a fresh origin, which still prints with no voice type, but I did not run the suite.
- **Not walked in the in-app Browser pane.** Headless Chromium only, per the phone-layout memory note; the pane was open but not used for these readings.
- **The phone header screenshots are small,** because `PageFit` scales the letter page to the phone's width. They show the line as a phone renders it, not a legible crop.
- **Screen readers:** the Other text field is named by `aria-label` with the Other label. Not tested with a screen reader.

## Addendum, later on 2026-09-30: three changes outside slice A

Dann asked for these during the walk: "fix this" for [i], and the Range order. Items 1 and 2 carry out `brief-code-voice-intake-order-and-keep-reading_r1_2026-09-28.md`, which was queued twice in `LOG.md` (lines 7804 and 7964) and never run.

1. **Higher limits first.** `CalibrationWizard.svelte`: Highest comfortable note above Lowest, Tessitura ceiling above floor, Secondary passaggio above Primary. Display order only; stored fields unchanged. Seen in the browser at 1600 wide.
2. **Keep my reading.** `engine/types.ts`: `plausibilityOverride?: true` on a reading. `engine/plausibility.ts`: `isUsable()` and `keepReading()`. The latter keeps the `implausible` verdict, sets the flag, and returns the reading to what its confidence earns. `analyze-score-adapter.ts` (fR1 and fR2), `InsightsPane.svelte` (`measuredVowels`), and `derivations.ts` (`usableAnchor`, inlined to avoid a circular import) accept a kept reading. The wizard's implausible hold adds a **Keep my reading** button and no longer times out after 1.6 s (`DESK DEFAULT`), because it now asks for a choice. A kept reading shows "Outside the usual band" in the roster. The choice logs `[voice] plausibility override`. The hold's kind and announcement moved to the new `voice/hold.ts`, unchanged, to fit the wizard under its ceiling (2120 of 2124).
3. **"No sound came through" on [i].** `engine/analyze.ts`: `SILENCE_RMS` 0.003 to 1e-5. The live gate is level-free and had already accepted the fry. The post-sweep floor then rejected a quiet take as silence. This is the same defect as the 2026-07-01 recalibration. Now the floor catches only a dead input, and `detect()` judges everything else.

**Strings.** `calib.capture.hold.keep` "Keep my reading" and `calib.roster.kept` "Outside the usual band". English is the brief's `DESK DEFAULT`. French is drafted by Code and NOT RATIFIED: « Garder ma lecture », « Hors de la plage habituelle ». « lecture » follows `calib.capture.hold.implausiblePrefix`; the brief drafted « Garder ma mesure ».

**Gates after all three:** phonology 251, dictionary 235, check 0 errors and 12 warnings, web 1719 (1684 at the start of the session; 29 slice A tests, 3 floor tests, 3 keep tests), score-parser 636 plus 5 skipped, blurb 145, integration 55, ratchets OK. Gate 4's baseline in `ilya-ship.sh` becomes 1719.

**Not established.**
- The **Keep my reading** hold has not been seen on screen. Headless Chromium on this Mac never resolves `getUserMedia`, even with the fake-device flags, and does not render audio. In the hidden Browser pane, a synthetic source reached the tap once: gate ACCEPT, reading fR1 218.7 Hz on [a], verdict `unchecked` because the bass band has no [a] window. Two later [i] runs got no audio and timed out at the gate. The logic is covered by unit tests only.
- Whether Dann's own [i] failure was the floor. That is the only path by which a take the live gate accepted reports "No sound came through". His console was not read.

## Second addendum, 2026-09-30: four small fixes before ship

From `brief-code-small-fixes-before-ship_r1_2026-09-30.md`, in the same uncommitted tree. No git writes.

### What changed

1. **Insights comment strings** (`apps/web/src/lib/i18n.ts:1645-1647`): `comment.tap`, `comment.count.one`, and `comment.count.many` now carry Dann's ratified English and French of 11:02, exactly as briefed. « D’autres » uses `’`, as the rest of the file does. The comment above them says RATIFIED, with the date and the Dayme citation for retiring "try". Three places followed the old string and were updated to match: `insights/comments.test.ts:316` and `:334` (the English count expectations), the doc comment at `insights/comment-text.ts:252`, and the doc comment at `insights/InsightsPane.svelte:22-23`.
2. **Doubled narrow no-break space**: `i18n.ts:1547`, `:1563`, `:1564` each had `  ` before « ; ». Each is now one ` `. A grep of `i18n.ts` for `  `, written as an escape or as the literal character, finds no others. **Count: 3 fixed, 0 remaining.**
3. **Other under "Not sure"** (desk default of 10:46):
   - `voice/voiceTypes.ts`, `voiceTypePrint()`: Other's text now prints under "Not sure". With Other empty, or with no Other, "Not sure" still prints nothing.
   - `voice/VoiceTypeIntake.svelte`: the second group shows for every Tier 1 choice. Under "Not sure" it holds only Other and its text field. It drops the "More specific (optional)" heading and names the group with `aria-label` set to the Other label.
   - `withTier1()` already kept Other and its text on a move to "Not sure", and cleared a finer label, so it did not change. Routing reads only the Tier 1 id, so "Not sure" stays `union`.
   - Tests: 3 in `voiceTypes.test.ts` (Other kept and still routing `union`, a finer label cleared, printing with and without text) and 1 in `identity.test.ts` (the line in both languages, and an empty Other dropping the segment).
4. **Keep my reading** (`i18n.ts:1089-1091`): the comment now reads "French RATIFIED by Dann 2026-09-30 10:48". The strings themselves did not change.

### Singer-facing "try" still in Insights and Markup (none changed)

- `apps/web/src/lib/i18n.ts:1624`, `comment.opener.1`: "You might try {action}" (fr « Vous pourriez essayer {de}{action} »).
- `apps/web/src/lib/i18n.ts:1628`, `comment.opener.5`: "Try {action}" (fr « Essayez {de}{action} »).
- `apps/web/src/lib/i18n.ts:1825`, `key.band.try`: "Try another key", Markup's key line and the Transposition ruler's accessible name.
- `apps/web/src/lib/i18n.ts:1855`, `insights.tryKey`: "Try this key", Insights' range findings.

The two openers are Insights comment strings in the strict sense. The two key controls are buttons, not comments, and are listed only for completeness. Every other "try" in `i18n.ts` belongs to upload, calibration, storage, or error copy, outside Insights and Markup. The `comment.working.try.*` keys have "try" in the key only, not in the copy.

### Gates

The eight commands from `~/Downloads/ilya-ship.sh`, run one by one.

| Gate | Before this addendum | Now |
|---|---|---|
| 1 phonology | 251 passed (251) | 251 passed (251) |
| 2 dictionary | 235 passed (235) | 235 passed (235) |
| 3 web-check | 0 errors and 12 warnings in 5 files | 0 errors and 12 warnings in 5 files |
| 4 web-test | 1719 passed (1719) | **1723 passed (1723)**, the 4 new tests |
| 5 score-parser | 636 passed, 5 skipped (641) | 636 passed, 5 skipped (641) |
| 6 blurb | 145 passed (145) | 145 passed (145) |
| 7 integration | 55 passed (55) | 55 passed (55) |
| 8 ratchets | OK | OK. No ceiling raised. |

Gate 4's baseline in `ilya-ship.sh` becomes 1723. The ratchet says three ceilings can fall: `MarkupPane.svelte` 1358 to 1302, `CalibrationWizard.svelte` 2124 to 2120, and `+page.svelte` 6028 to 6016. I left `ratchets.json` alone.

### The browser walk

Headless Chromium through Playwright against `http://localhost:5173` (the `ilya-web` dev server), 1440 by 900, with `sunless-01-engraved.musicxml` loaded. The seeded voice "Dann", calibrated 2026-09-12, has a reading for all ten vowels and typed characteristics. The values are chosen so that Insights earns a comments page. They are not a real singer's readings.

- **French comment tap**: the comments page's summary reads « D’autres pistes à explorer, et pourquoi ». In English it reads "1 more thing to explore · More to explore, and why".
- **French phonation string**: « … ne correspond pas à son chiffrage de mesure ; ses notes sont comptées telles qu’écrites. » The whole page text holds no `  `.
- **Voice type, "Not sure"**: before a choice, one group. After "Not sure", a second group holding only Other and its text field, with no heading and no finer labels. Typing "Russian Bass" checks Other and stores `{voiceType: "not-sure", voiceTypeSpecific: "other", voiceTypeOther: "Russian Bass"}`. `calibratedAt` stays 2026-09-12. French renders « Je ne sais pas » and « Autre (saisissez le vôtre) ».
- **The typed label prints**: with Other set to "Basse russe" under "Not sure", the header reads « APERÇUS POUR DANN · BASSE RUSSE · CALIBRATION DU 2026-09-12 ».

To walk it yourself, open the local dev server. Vercel does not show this until it is committed and pushed.

```
http://localhost:5173
```

Screenshots, in `docs/sessions/`:

- `small-fixes-fr-comment-tap_2026-09-30.png`
- `small-fixes-en-notsure-other_2026-09-30.png`
- `small-fixes-fr-notsure-other_2026-09-30.png`

### For Dann

1. `DESK DEFAULT` **Under "Not sure", the second group has no visible heading.** "More specific (optional)" reads wrong when there is no broader type to be more specific about, so I dropped it. Other's own label names the group for a screen reader. If a heading is wanted, it needs new copy in both languages.

### What I could not establish

- **The French count strings were not seen on screen.** The French page printed the tap label with no count. The one comment's other suggestion is `frenchOwed`, so a French page leaves it out and there is nothing to count. « 1 autre piste à explorer » and « {n} autres pistes à explorer » are in the tree, but no test or walk exercised them.
- **`insights.phonation.noTempo`** was not seen on screen, because the fixture states a tempo word. Only the `untrustedOne` line was seen. `noTempo` and `untrustedMany` rest on the grep.
- **Not walked in the in-app Browser pane**, and the Playwright e2e suite was not run.
- **Screen readers:** the `aria-label` on the "Not sure" group was read from the DOM, not tested with a screen reader.

## Third addendum, 2026-09-30: "try" out of the opener rotation

Dann asked whether the four remaining "try" strings needed action. The ruling is broader than the brief's "comment strings": *"No 'try' in what Insights says to the singer"* (`docs/memory/OPEN.md` §N.168, Dann 2026-09-29 22:51). Openers 1 ("You might try …") and 5 ("Try …") were live in the rotation of both Insights comments and Markup's watch box, which share the `comment.opener.*` strings. I took both out of the rotation. No new copy was needed.

- `apps/web/src/lib/insights/comment-text.ts`: `OPENERS` goes from `[1, 2, 3, 4, 5, 7]` to `[2, 3, 4, 7]`.
- `apps/web/src/lib/analysis/watchlist.ts`: `WATCH_OPENERS` is now `[2, 3, 4]`, exported. `gates.ts` rotates through it instead of `(k % 5) + 1`. The default opener and the duplicate-line key move from 1 to 2.
- `i18n.ts`: `comment.opener.1` and `.5` stay in the file, unused, with a RETIRED note. Undoing the change is one line in each rotation.
- **Not changed:** "Try another key" and "Try this key". They are button labels for an action in the app, not advice about the voice, so they sit outside Dayme's stance as the ruling applies it.

**Effects:**
- Markup's box now cycles three openers, not five. A band with more than three advice lines repeats an opener. At about two entries per printed page (the trial of 2026-09-28), that should rarely show.
- Insights' page rule ("no two comments share a lead opener, where the pools allow") has four openers for up to five comments. For a suggestion ending in ", and notice …" only openers 2 and 3 fit, so a lead opener repeats sooner. The fallback in `rotate()` already handles this.

**Tests:** 4 Markup expectations of "You might try" became "Consider". The rotation test now expects three openers and no "try". The French elision test uses opener 3 (« Il peut être intéressant d’… »). The E4 and D4 comment tests are forced to opener 2, with a comment saying their 13:45 templates are superseded by r7.

**Gates:** 1 phonology 251, 2 dictionary 235, 3 check 0 errors and 12 warnings, 4 web **1717** (down from 1723: the rotation test runs one case per seed up to `OPENERS.length × 3`, so 18 seeds became 12), 5 score-parser 636 plus 5 skipped, 6 blurb 145, 7 integration 55, 8 ratchets OK. Gate 4's baseline in `ilya-ship.sh` becomes 1717.

**Not established:** no browser walk of this change. It is covered by unit tests only.

## Fourth addendum, 2026-09-30: the comments rebuilt to r7

Dann asked for this right after the third addendum. The source is `~/Documents/Voice Pedagogy Library/Insights Research/_synthesis/draft-three-comments_r7_2026-09-29.md`: English ratified 2026-09-28 23:37, with the 2026-09-29 22:51 and 23:23 changes. Two of Dann's rulings, taken by question in this session, set the scope:
- **French:** drafted by Code, marked NOT RATIFIED in the code, and listed below for ratification.
- **The tap:** unchanged. r5's "why" paragraph and "To bring to your teacher" lines are not built, because they are unvetted.

### What a comment is now

1. **Frame.** One sentence: the note, how long it is sustained, and where it sits against the singer's first resonance, the turn, or the secondo. The leap, the phrase's top, and "the highest comfortable note you gave" no longer print (r5 §0, r4's desk correction).
2. **Consequence.** One cited sentence per spoken challenge, in Dann's shape of 23:14: resonance on a front close vowel, the turn on an open vowel, or the closed [u].
3. **Lead suggestion.** r7's lead, visible, in its ratified words:
   - [i]: "You might let the jaw drop …", MIL04-028.
   - [ɛ]: "Bozeman suggests keeping a fairly close vowel posture …", KVP2-037.
   - [u]: "If it suits your voice, let it lean toward [ʊ] …", uncited because the consequence already cites RMR-057.
   These leads keep their own opening words and always print their closer.
4. **Behind the tap.** The alternatives and McKinney's legato, which is now tap-only. The count and the references follow.

"(fR1)" prints once, on its first appearance on the comments page, set as *f*<sub>R1</sub> (Titze et al. 2015, Table I, p. 3006). *whoop* and *yell* are set in italics.

### Files

- `insights/comment-text.ts`: frame and consequence are now runs.
  - New: `speaks()`, `consequenceRuns()`, `SuggestionDef.opener`, `tapOnly`, and `cite`.
  - Gone: the frame shapes, `leapWords()`, and the `level` and `tract` suggestions. MIL04-035 was out by r4. PVA2-B-014 now sits in the [ɛ] consequence, and KVP2-037's lead states the same move.
  - `decrescendo` becomes an alternative for the closed [u].
- `insights/comment-sources.ts`:
  - Two works: Bozeman 2021 (Inside View Press, from the KVP2 memo) and Miller 1986 (publisher NOT ESTABLISHED; the records read give only the year).
  - Seven rows, read from the claims CSVs this session: KVP2-022, KVP2-026, KVP2-037, PVA2-A-046, PVA2-C-025, RMR-057, plus PVA2-B-014, which was already present.
  - `shortCitation` joins pages of one work ("pp. 97 and 115"; « p. 97 et 115 »). `Run.sub` is new.
- `insights/comments.ts`: `NoteComment.toSecondo`, for the [u] frame.
- `insights/InsightsPane.svelte`: renders the frame and the consequence as runs, with `<sub>`, and filters by `speaks()`.
- `i18n.ts`: the old frame, where, and leap keys and the `level` and `tract` strings are gone. New frame, where, consequence, and lead keys. "holds its shape" became "keeps its shape" in the decrescendo closer (retire "hold", 23:23).
- `tools/n168-frequency-run/comments-oracle.ts`: reads the frame through `runsText`, and adds the consequence to its T01 rendering. Not run.
- `insights/comments.test.ts`:
  - The three comments are pinned to r7's English word for word, and to the French draft.
  - New tests: which comments print, fR1's form, the printed rows, and a page-wide check for "(fR1)" once and for no "try" or "hold".

### Desk defaults taken (For Dann)

1. **A comment with nothing r7 can say no longer prints.** A sustained note whose vowel shows no resonance, turn, or closed [u] (a sustained [o] or [a], for example) used to print a frame and "keep the second half level". r7 has no consequence or lead for it, and MIL04-035 was withdrawn. Sustained notes will print less often than before. If they should print, they need a ruled sentence.
2. **Two [i] comments on one page read the same lead.** The ratified words do not rotate. The opener rotation still voices the suggestions behind the tap.
3. **Generalized frames (COMPOSED):**
   - "past where your [ɛ] turns" at 2 or more semitones.
   - The singular "1 second".
   - "is sustained" when the score states no tempo.
   - The [u]'s secondo clause as "at", "just above", "above", or "just under", and left out further down.
   - The secondo clause prints only on the closed [u], as r7 prints it.
4. **One consequence per challenge, whatever the side.** The front-vowel sentence also serves [ɪ], [ɨ], and [e], and a note a little under fR1. KVP2-022 is stated for /i/, so this is a trend applied, as r5 §7 notes.

### The French to ratify (Code's draft, NOT RATIFIED)

As the three comments render, with [u] on D4 and the other notes as r7 has them:

- « Ce [i] sur E4 se prolonge environ 4 secondes, au-dessus de la première résonance (*f*<sub>R1</sub>) de votre [i] chanté. Ici, le [i] tend de lui-même vers un timbre *youhou* ; mais le resserrer au lieu d’ouvrir la bouche tend à l’amincir (Bozeman, *Kinesthetic Voice Pedagogy 2*, 2021, p. 97 et 115). Vous pourriez laisser la mâchoire descendre avec la hauteur, la pointe de la langue vers l’avant, et observer si le [i] garde sa couleur (Miller, *Solutions for Singers*, 2004, p. 163). »
- « Ce [ɛ] sur E♭4 se prolonge environ 3 secondes, juste après la hauteur où votre [ɛ] change de timbre (autour de D4). La couleur tend ici à se fermer d’elle-même ; mais la garder ouverte peut la pousser vers un *cri* (Bozeman, *Practical Vocal Acoustics*, 2025, p. 45 et 65). Bozeman propose de garder une posture vocalique assez fermée tout au long du changement de timbre, et un peu au-delà. Observez si la couleur se ferme plus facilement (*Kinesthetic Voice Pedagogy 2*, 2021, p. 18-19). »
- « Ce [u] sur D4 se situe juste au-dessus de votre secondo passaggio et un peu sous la première résonance de votre [u] chanté. Ici, le [u] tend à s’ouvrir un peu de lui-même (Miller, *The Structure of Singing*, 1986, p. 157-158) ; mais le garder fermé tend vers un timbre *youhou* (Bozeman, *Practical Vocal Acoustics*, 2025, p. 94). Si cela convient à votre voix, laissez-le pencher vers [ʊ], et observez si le [u] garde sa couleur. »
- The composed pieces: « sur votre secondo passaggio », « au-dessus de votre secondo passaggio », « juste sous votre secondo passaggio », « après la hauteur où … change de timbre », « se prolonge » with no duration, and « seconde » in the singular.

Choices inside the draft: *youhou* follows the tree's existing « vers le youhou ». *cri* for yell is new. « secondo passaggio » stays Italian and upright, as in English.

### Gates

1 phonology 251, 2 dictionary 235, 3 check 0 errors and 12 warnings, 4 web **1721** (1717 plus the net new tests), 5 score-parser 636 plus 5 skipped, 6 blurb 145, 7 integration 55, 8 ratchets OK with no ceiling raised. Gate 4's baseline in `ilya-ship.sh` becomes 1721.

### Browser

Headless Chromium against `http://localhost:5173`, with the seeded voice and Sunless 1, in English and French.
- The one comment is a closed [u] on A3, and it renders r7's shape in both languages. English: "This [u] on A3 sits above your secondo passaggio and a little under the first resonance (fR1) of your sung [u]. Here the [u] tends to open a little on its own (Miller, …); but keeping it closed tends toward whoop timbre (Bozeman, …). If it suits your voice, let it lean toward [ʊ], and notice whether the [u] keeps its colour."
- "(fR1)" appears once on the page, with an italic *f* and a subscript R1.
- The French count line now shows on screen: « 2 autres pistes à explorer · D’autres pistes à explorer, et pourquoi ». This settles the second addendum's open item about the count.
- Screenshots: `r7-comment-en_2026-09-30.png` and `r7-comment-fr_2026-09-30.png`.

### What I could not establish

- **The resonance and turn comments were not seen in a browser.** The seeded voice earned only a closed-[u] comment on Sunless 1. The E4 [i] and E♭4 [ɛ] text is proved by the unit tests on the oracle's rows, not on screen.
- **The oracle (`comments-oracle.ts`) was not rerun.** Its corpus counts will move, because non-speaking comments now drop at the pane, not in `comments.ts`. The oracle counts what `comments.ts` fires.
- **Miller 1986's publisher and Bozeman 2021's ISBN.** No record read gives them, so "Sources cited" prints without them.
- **RMR-057's quotation in the tap** is the row's own quote column, which argues against vowel modification "to the schwa". It is not the sentence that supports "tends to open a little on its own". A better quotation needs the page, not the row.

## Fifth addendum, 2026-09-30: the comments' French seated (ratified 12:08)

Source: `docs/sessions/french-comments_r1_2026-09-30.md`, ratified by Dann 2026-09-30 12:08 (*"Ratified."*). No git writes.

### What changed (`apps/web/src/lib/i18n.ts`)

- **Table A, the r7 parts:** `comment.working.consequence.resonance`, `.turn`, and `.closedU`, and the leads `try.jaw`, `try.closePosture`, and `try.lean`. Their comments now read RATIFIED by Dann 2026-09-30 12:08. The strings did not change: before marking them, I compared each with the record character by character, with the apostrophe, italics, and citations normalized, and all six match. Each semicolon sits on U+202F, as the record checks.
- **Table B, the furniture:** the French slot now holds the ratified French in place of the English:

  | key | fr |
  |---|---|
  | `comment.heading` | Commentaires sur cette pièce |
  | `comment.more.one` | Une observation de plus |
  | `comment.more.many` | {n} observations de plus |
  | `comment.hidden.one` | Une observation masquée selon vos choix |
  | `comment.hidden.many` | {n} observations masquées selon vos choix |
  | `comment.sourcesCited` | Sources citées |

### Where I did less than the instruction said

The instruction was to mark "the `comment.working.*` French" as ratified. The record's table A lists only the three consequence sentences and the three leads. The frame and where parts are not in it:
- `frame.sustained`, `sustainedOne`, `sustainedUntimed`, and `sits`
- `where.and`, `where.above`, and `where.under`
- `where.turnJustPast` and `where.turnPast`
- the four `where.secondo*` pieces

The record's preamble names some of their words as adopted (« première résonance », « secondo passaggio », « se prolonge »), but it does not table them. The frames in the three comments are also not quoted anywhere in the record. So these stay marked NOT RATIFIED, with a comment saying they are outside the 12:08 record. If Dann meant the ruling to cover them, marking them is a comment-only change.

`try.mixed` and `try.preface` stay OWED in both slots, as the record says. `try.decrescendo` and `try.legato` keep their earlier ratifications (2026-09-25).

### Gates

1 phonology 251, 2 dictionary 235, 3 check 0 errors and 12 warnings, 4 web 1721, 5 score-parser 636 plus 5 skipped, 6 blurb 145, 7 integration 55, 8 ratchets OK. No counts moved, since only strings and comments changed.

### Browser

Headless Chromium, French, against `http://localhost:5173` with the seeded voice and Sunless 1. The comments page's section heads read « Commentaires sur cette pièce » and « Sources citées ».

### What I could not establish

- **« Une observation de plus » and the « masquée selon vos choix » lines were not seen on screen.** The seeded page has one comment, so no "more observations" group and nothing hidden by settings. They rest on the string edit alone.

## Sixth addendum, 2026-09-30: the frame and where parts seated (ratified 12:25)

Source: `docs/sessions/french-comments_r1_2026-09-30.md`, section C, ratified by Dann 2026-09-30 12:25. No git writes.

### What changed

- **`apps/web/src/lib/i18n.ts`, two French strings:**

  | key | before | now |
  |---|---|---|
  | `comment.working.where.under` | un peu sous la première résonance{fR1} de votre [{vowel}] chanté | un peu en dessous de la première résonance{fR1} de votre [{vowel}] chanté |
  | `comment.working.where.secondoJustUnder` | juste sous votre secondo passaggio | juste en dessous de votre secondo passaggio |

  The first is Dann's change. The second is the desk's default, shown to him in the same message.
- **The ratification comment** above the `comment.working.frame.*` and `where.*` keys now reads RATIFIED by Dann 2026-09-30 12:25, section C. It covers all four frames and all nine where parts. The other eleven strings did not change: I compared each with section C. The COMPOSED markers stay, because they describe the English generalizations, not the French.
- **`apps/web/src/lib/insights/comments.test.ts`:** the pinned French for the D4 [u] now reads « un peu en dessous de la première résonance ». Its two comments now say the French is ratified (12:08 and 12:25), not Code's draft.

With this change, every `comment.working.*` French string is ratified except `try.mixed` and `try.preface`. Those two stay OWED in both slots.

### Gates

1 phonology 251, 2 dictionary 235, 3 check 0 errors and 12 warnings, 4 web 1721, 5 score-parser 636 plus 5 skipped, 6 blurb 145, 7 integration 55, 8 ratchets OK. No counts moved.

Ratchets reports three ceilings that could be lowered: `MarkupPane.svelte` 1358 to 1302, `CalibrationWizard.svelte` 2124 to 2120, and `+page.svelte` 6028 to 6016. This change did not touch those files, and I left `scripts/ratchets.json` alone.

### What I could not establish

- **No browser walk.** The unit test proves the D4 [u] line. « juste en dessous de votre secondo passaggio » has no test and was not seen on screen, because no fixture puts a closed [u] just under the secondo.
- **`tools/n168-frequency-run/out/comments-oracle.md` still has « un peu sous ».** It is output from an earlier oracle run, before r7, and the oracle was not rerun.
