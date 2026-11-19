# Code brief, lane 71: all nine voice types get a starting profile, each borrowing named on the page

r2, 2026-11-19, written by the Opus desk. QUEUE row 167. Branch `cloud-lane-71`, cut from
`Shane` `b79e33e9`. Every `path:line` below was read in this tree, in this session.

r2 applies Fable's review of r1 (`review-fable-lane71-voice-type-brief_r1_2026-11-19.md`, md5 `5791565e`,
DO NOT SEND, four blockers and nineteen amendments), Dann's amendment of 11:55 to 11:57, and
his ratifications of 11:59 and 12:01. Every string in this brief is now ratified text.

## 0. What these lines are for

A singer opens MELODY or INSIGHTS and reads a sentence that says whose resonances the page is
working from. That sentence is the singer's only way to know whether a finding describes their
voice or a template. Today it is accurate for five voice types and absent for four: a
contralto, a countertenor, a bass-baritone, and a singer who answered "Not sure" get no
starting profile at all, so MELODY and INSIGHTS withhold.

Dann ruled on 2026-11-19 that all nine types get a starting profile, borrowed from the nearest
voice Ilya can defend, and that every borrowing is named on the page. The lane opens the gate
and repairs every sentence that would otherwise tell a contralto that a mezzo's values are a
contralto's.

The principle that decides every wording question in this brief, ratified 10:08: **a sentence
never tells a singer the values are their own type's when they are a neighbour's.**

## 1. The ruling

`docs/sessions/ratified-voice-type-stand-ins_2026-11-19.md`, md5 `8d3f8a4f`, read in full by
this desk. Dann's words are transcribed there. Read it before step 1; this brief does not
restate it. The md5 moved twice today (`8153b0de` to `7b1c1826` to `8d3f8a4f`) as he amended
and then ratified; use `8d3f8a4f` and no earlier copy.

**Its section 8 is the amendment of 11:55 to 11:57 and outranks everything about "Not sure" in
its sections 2, 3, and 6.** "Not sure" takes NO starting profile. Read section 8 first.

Its section 1 (09:41) governs placement: *"transparency is paramount"*, and the concession is
stated **on the page**, never only behind a link.

Its section 7 is why this lane runs before the blank states (lane 72).

## 2. The gate

`voice/voiceTypes.ts:19-29` holds `TIER1`, the nine ids: `soprano`, `mezzo-soprano`,
`contralto`, `countertenor`, `tenor`, `baritone`, `bass-baritone`, `bass`, `not-sure`.

`voice/engine/stand-ins.ts:73` holds
`PLACEHOLDER_PROFILE_TYPES = ['soprano', 'mezzo-soprano', 'tenor', 'baritone', 'bass']`, and
the comment at `:64-72` says the other four are "left out on purpose ... until row 167 rules
their staves".

**Step 1.** Widen it to **EIGHT**: the five above plus `contralto`, `countertenor`, and
`bass-baritone`. **`not-sure` stays out, and so does no type at all.** Rewrite the comment to
cite the ruling's sections 1 and 8 in place of row 167's absence.

Dann's amendment of 11:56 and 11:57 is the authority, not the desk: a singer who is not sure
takes no starting profile, because an average of five staves corresponds to no vocal tract.
The order Ilya encourages is his: personal samples first, a proven generic voice type next,
and "I don't know" remains a valid answer that costs the singer nothing.

`stand-ins.ts:55-62` `standInBucket` already maps all nine and needs no change: contralto and
countertenor to `tenor-mezzo` (`:58`), bass-baritone to `bass` (`:60`), `not-sure` and none to
`middle` (`:61`). The `middle` bucket stays in the code: `:144` still uses `template('middle')`
as the reference shape for the tract scale of a personal voice. It stops being a starting
profile, not a shape.

**How the gate unblocks the pages, read this session.** `resolve-values.ts:154` sets
`generic = !anySung && hasPlaceholderProfile(voiceType)`; `:156` then fills the stand-ins, and
`stand-ins.ts:153` and `:158` write every missing resonance into `m.fR1` and `m.fR2`.
`analyze-score-adapter.ts:93` sets `completeness.formants` from `Object.keys(s.fR1).length > 0`,
and that flag is what `insights/InsightsPane.svelte:204` and `markup/MarkupPane.svelte:831`
read to stop withholding. Do not add a second gate anywhere on that path.

**Comments the widening makes stale.** Repair each in the same pass, naming the ruling:
`voice/engine/resolve-values.ts:14-18` and `:148-152`; `analysis/analyze-score-adapter.ts:66-71`;
`insights/identity.ts:55` and `:63-64`; `insights/singer-blocks.ts:116`;
`components/Drawer/voice-pane.ts:77-79`; `i18n.ts:1894` ("one of five types") and `:1903`;
`voice/engine/stand-ins.ts:64-72`. The tree must not go on describing the old rule.

## 3. The borrowed label

Three types print a staff that is not their own name. The ratified fills:

| declared type | `{borrowed}` EN | `{borrowed}` FR |
|---|---|---|
| contralto | mezzo-soprano | mezzo-soprano |
| bass-baritone | bass | basse |
| countertenor | mezzo and tenor | mezzo et ténor |

The other five print their own name. `not-sure` never fills a token in this lane.

**Step 2.** Add `borrowedStaffLabel(voiceType, language): string | undefined` beside
`voiceTypePrint` in `voiceTypes.ts:82-97`. Three new i18n keys carry the three staff labels;
"mezzo and tenor" is a staff name, not a voice type, so it cannot reuse a `voiceType.type.*`
key.

Its contract, each clause load-bearing:

1. For contralto, countertenor, and bass-baritone it returns the **fixed staff label above,
   whatever `voiceTypeSpecific` or `voiceTypeOther` hold.** The values came from the staff.
2. For the five published types it returns `voiceTypePrint`'s label, unchanged, so today's
   behaviour for them is untouched.
3. **For `not-sure` it returns `undefined`, whatever Other's text holds.** This is the
   correction Fable's blocker 1 found in r1. `voiceTypePrint:86-89` returns Other's typed text
   **before** the `not-sure` test at `:90`, so a singer on "Not sure" who typed "Russian Bass"
   reaches every `{voiceType}` fill today (`voiceTypes.test.ts:112`,
   `insights/identity.test.ts:36` pin it). Under the amendment "Not sure" holds no profile, so
   `generic` is false and the fills do not run; the helper still returns `undefined` so the
   guarantee does not rest on the gate alone.

**`{type}` in the ruling's templated line is the Tier 1 name**, never a Tier 2 label and never
Other's text. The ratified French depends on it: the template holds "because contralto,
contre-ténor, and baryton-basse are all masculine", which is true of the Tier 1 names and not
of every Tier 2 label (`voiceTypes.ts:38` holds haute-contre).

**`fillVoiceType` cannot fill the new tokens as written.** `voiceTypes.ts:109-110` replaces the
literal strings `de {voiceType}` and `{voiceType}`. The ruling's line carries `{type}` and
`{borrowed}`. Generalize the helper to take the token name, keeping its French elision rule and
its single-helper purpose (`:104-106`), and route every fill of `{borrowed}` through it. None
of today's three labels begins with a vowel letter, so the elision never fires on them; the
helper is there so a later fill cannot break it.

**The VOICE pane passes the Tier 1 id alone** (`voice-pane.ts:65-66`: "The type's own name, not
a finer label"). Section 4.6 keeps that call shape, so a bass who chose octavist does not read
"a octavist voice".

## 4. Every site, and what each becomes

Eleven. Nine reached through `AdaptedProfile.generic`, and two more that reach the voice type
by another route, found by Fable's blocker 4.

With "Not sure" out of the list there is no "Not sure" case in 4.1, 4.2, or 4.3: `generic` is
false for it, so `markup/subtitle.ts:11` leaves the label undefined and falls through, and
`insights/identity.ts:52` returns null. Nothing to draw and nothing to word.

### 4.1 MELODY's subtitle

`markup/subtitle.ts:10-13`, from `markup/MarkupPane.svelte:552`. `:11` fills
`profile.subtitlePlaceholder` (`i18n.ts:1487`) with `voiceTypePrint`.
**Becomes:** the fill is `borrowedStaffLabel`. A contralto reads "placeholder values for a
generic mezzo-soprano, not yet your own resonances."

### 4.2 INSIGHTS' lede

`insights/identity.ts:50-53` `genericLede`, from `insights/InsightsPane.svelte:503`. `:52` fills
`insights.generic.lede` (`i18n.ts:1895`) through `placeholderLabel` (`:56-58`).
**Becomes:** the fill is `borrowedStaffLabel`.

### 4.3 The vowel chart's caption

`insights/singer-blocks.ts:337`, fed `voiceTypeLabel` from `InsightsPane.svelte:373`, filling
`insights.r2.vowels.against.generic` (`i18n.ts:2040`).
**Becomes:** the fill is `borrowedStaffLabel`.

### 4.4 The Method endnote, three strings. RATIFIED by Dann 2026-11-19 12:01

`insights/identity.ts:66-70` `methodLineKey`, from `InsightsPane.svelte:292`. The strings carry
no token, so the repair is in the text:

- `i18n.ts:1897` `insights.method.generic.typed`
  EN: Method: computed from placeholder values, the voice characteristics you typed, and the
  score as sung, including repeats.
  FR: « Méthode : calculé à partir de valeurs par défaut, des caractéristiques vocales que vous
  avez indiquées et de la partition telle que chantée, reprises comprises. »
- `i18n.ts:1898` `insights.method.generic.untyped`
  EN: Method: computed from placeholder values and the score as sung, including repeats.
  FR: « Méthode : calculé à partir de valeurs par défaut et de la partition telle que chantée,
  reprises comprises. »
- `i18n.ts:1905` `insights.method.noScore.generic`
  EN: Method: from placeholder values, until you record your own vowels.
  FR: « Méthode : à partir de valeurs par défaut, jusqu'à ce que vous captiez vos propres
  voyelles. »

`i18n.ts:1906` `insights.method.noScore.none` stays as written and stays reachable: a singer
with no type, one on "Not sure", and an id this build does not know
(`analysis/stand-ins-snapshot.test.ts:72`, 'other-text'). Repair the comment at
`insights/identity.ts:63-64`, which still lists the four types.

### 4.5 The broad-analysis note. RATIFIED 2026-11-19 12:01

`analysis/analyze-score-adapter.ts:188-196` `composeBroadNote`, from `MarkupPane.svelte:846`.
`:195` selects `analysis.broad.body.generic` (`i18n.ts:1075`). Only the closing sentence moves.
EN: ... The forecast uses placeholder values.
FR: « ... La prévision repose sur des valeurs par défaut. »

### 4.6 The VOICE pane. One line ratified, one state removed

`components/Drawer/voice-pane.ts:35-44` `paneState`.

- `:43` `hasPlaceholderProfile(i.voiceType) ? 'typed-generic' : 'typed-none'`. With eight in the
  list, `typed-none` is unreachable: `:41` sends a non-Tier-1 id to `none`, `:42` sends
  `not-sure` to `not-sure`, and `:43` is then true for the other eight. Remove the state at
  `:33`, the return at `:43`, the key at `:49`, and the branch at `:64`.
- `calib.pane.typedNone` (`i18n.ts:1433`): **keep the string, marked unused in place with its
  ratified French**, which is this file's own convention for a retired string (`i18n.ts:1437`).
  r1 proposed deleting it; that departs from the convention for nothing.
- `:48` `calib.pane.typedGeneric` (`i18n.ts:1432`) keeps its ratified words; the fill becomes
  `borrowedStaffLabel`, called on the Tier 1 id as `:65-66` already does.
- `:50` `calib.pane.notSure` (`i18n.ts:1434`). **RATIFIED by Dann 2026-11-19 11:59**, replacing
  the live text whole:
  EN: Not knowing is a fine answer. Record your vowels in vocal fry and Ilya works from your
  own voice, which also gives you evidence in your own search. Or choose a voice type, and Ilya
  starts from published values for it.
  FR: « Ne pas savoir est une réponse valable. Captez vos voyelles en friture vocale et Ilya
  travaille à partir de votre propre voix, ce qui vous donne aussi des indices dans votre propre
  recherche. Ou choisissez un type de voix, et Ilya part de valeurs publiées pour celui-ci. »
  The control its last sentence points at is already drawn: `components/Drawer/VoicePane.svelte:85`
  renders `VoiceTypeIntake` in its own station. Build no new control.
- `:81-83` `showVowelSpaceDoor` reads `hasPlaceholderProfile` directly, so it is a tenth reader
  of the list. **DESK DEFAULT:** "Your vowel space" now opens for contralto, countertenor, and
  bass-baritone with nothing stored, and stays shut for "Not sure" and no type, which is what
  the comment at `:77-79` wanted. Rewrite that comment to the new membership.

### 4.7 The concession line on the page

`analysis/placeholder-line.ts:66-78` `placeholderLine` draws the page's existing ratified
disclosure, from `insights/InsightsPane.svelte:503` and `markup/MarkupPane.svelte:736`.
**DESK DEFAULT:** the ruling's section 3 templated line joins it there as a new key, drawn on
both pages.

Four things r1 left unsaid, each a blocker Fable raised:

1. **The ratified string goes in whole, remedy clause included.** "Do not repeat the remedy"
   means the lane adds no further remedy sentence of its own. It does not mean cutting
   "until you sample your own vowels in VOICE" from ratified text.
2. **The draw condition:** the line draws when the values in use are borrowed, which is
   `standInBucket(voiceType)` differing from the singer's own type, for contralto,
   countertenor, and bass-baritone. It never draws for the five published types or for
   "Not sure".
3. **It draws in the below-core state too.** A contralto who has sampled one to four core
   vowels is no longer `generic`, yet `stand-ins.ts:147` still takes her unsung vowels from the
   borrowed staff, and `placeholder-line.ts:73-75` replaces the placeholder line with the
   below-core sentence, which names no borrowing. The ratified Guide passage says Ilya "says so
   on the page every time". DESK DEFAULT: the borrowing line draws whenever a borrowed value is
   in use, the below-core state included. This applies his ratified words; it is not a new
   choice.
4. **`placeholderLine` returns a plain string, and the ratified line ends in a link.**
   `insights/InsightsPane.svelte:294` is the precedent: the L4 link follows the three generic
   Method lines. Follow it, or return the link beside the string; the lane chooses and reports
   which.

`placeholder-line.ts:76` returns null on an empty vowel list. NOT ESTABLISHED whether INSIGHTS
with no score passes an empty list; if it does, that page needs the line by another route.
Establish it before building, and report what you found.

### 4.8 Two sites that change behaviour and need no string

- `markup/MarkupPane.svelte:865` computes the hollow head from `e.placeholder`, and
  `markup/legend.ts:107` is its comment. Three more voices take that path. Correct; no change.
- `analysis/gates.ts:302` and `:323`, with `placeholder-line.ts:81-82`, feed
  `placeholder.comment.generic` (`i18n.ts:2075`), which names no voice type. No change.

### 4.9 The Guide passage, with one sentence struck

The ratified EN and FR passage is in sections 4 and 5 of the ruling. Seat it, EN and FR, in
`components/Reading/GuideContent.svelte`, beside the placeholder sentence in the MELODY
notation paragraph (`:395` English, `:91` French), and give the link "Why these values" /
« Pourquoi ces valeurs » its anchor. `guide-anchors.ts:1-22` holds renamed anchors only, so the
lane adds one and reports its id.

**Strike one sentence from the ratified passage, in both languages:** "If you have not named a
type, Ilya starts from the middle of its five staves." / « Si vous n'avez indiqué aucun type,
Ilya part du milieu de ses cinq portées. » Dann's amendment of 11:56 and 11:57 removed the
averaged start, so that sentence is no longer true. Nothing else in the passage changes.
"Nineteen sources were read in full" stays, deliberately, and dates the passage.

### 4.10 Two ratified strings that reach the voice type without `generic`. RATIFIED 12:01

- `i18n.ts:2569` `sheet.provenance`, drawn at `voice/chart/VowelSpaceSheet.svelte:163`, reached
  because `showVowelSpaceDoor` now opens for the three. Pinned at
  `voice/chart/ratified-strings.test.ts:29`. One clause moves:
  EN: ... and Mitton (2020), Table 5.3, scaled to the {borrowed} staff, for the second.
  FR: « ... et Mitton (2020), tableau 5.3, ajusté à la portée de {borrowed}, pour la deuxième. »
- `i18n.ts:2619` `capture.hint.placed.typed`, chosen at `voice/chart/screen-logic.ts:63` when
  `hasDeclaredType` is true (`:30`: any type but "Not sure"), drawn at
  `voice/VowelCapture.svelte:220`. Pinned at `voice/chart/ratified-strings.test.ts:70`.
  **This string is false on Ilya today, before any part of this lane runs:**
  `stand-ins.ts:147` takes `standInBucket(voiceType)` whenever the voice is not personal, `:58`
  and `:60` send the three to a neighbour's staff, and `:153` and `:158` fill from that shape.
  EN: Ilya has placed {v} from its {borrowed} values for now. Its placeholder moves as you
  record.
  FR: « Ilya a placé {v} d'après ses valeurs de {borrowed}, pour l'instant. Sa valeur par défaut
  évolue à mesure que vous captez vos voyelles. »

## 5. The one gate, and everything that reads it

This lane changes no formula. `template` (`stand-ins.ts:89-98`) computes what it computes
today; what changes is which voices may use it. The change passes through one boolean,
`AdaptedProfile.generic` (`resolve-values.ts:154`), and one direct reader of the list.

| reader | effect |
|---|---|
| `insights/identity.ts:42` `restsOnSamples` | unchanged; already false with nothing sung |
| `insights/identity.ts:50-53` `genericLede` | 4.2 |
| `insights/identity.ts:66-70` `methodLineKey` | 4.4 |
| `insights/singer-blocks.ts:254` | `placeholder.comment.generic`; names no type; unchanged |
| `insights/singer-blocks.ts:337` | 4.3 |
| `insights/InsightsPane.svelte:292`, `:373`, `:503` | call sites |
| `analysis/analyze-score-adapter.ts:183-195` | 4.5 |
| `analysis/gates.ts:302`, `:323` | names no type; unchanged |
| `markup/subtitle.ts:10-13` | 4.1 |
| `markup/MarkupPane.svelte:552`, `:736`, `:846`, `:865` | call sites |
| `components/Drawer/voice-pane.ts:43` | 4.6 |
| `components/Drawer/voice-pane.ts:81-83` `showVowelSpaceDoor` | reads the list directly; 4.6 |
| `analysis/analyze-score-adapter.ts:93` `completeness.formants` | turns true for the three, which is how the pages stop withholding: `insights/InsightsPane.svelte:204`, `markup/MarkupPane.svelte:831` |

What depended on these agreeing: they all describe the same voice on the same visit. A page
that calls the values a mezzo's in one sentence and a contralto's in the next is the defect
this lane exists to prevent. If a site resists the borrowed fill, do not special-case it:
report it and stop.

## 6. Every string, and where its ratification lives

Nothing in this brief is a draft. The lane invents no string and reopens none.

| string | ratified | where the text is |
|---|---|---|
| the templated borrowing line, EN and FR | 09:43, 09:52 | ruling sections 3 and 5 |
| the three `{borrowed}` fills, EN and FR | 09:43, 09:52 | ruling sections 3 and 5 |
| the link "Why these values" / « Pourquoi ces valeurs » | 09:43, 09:52 | ruling sections 3 and 5 |
| the Guide passage, EN and FR, less the struck sentence | 09:42, 09:52 | ruling sections 4 and 5, with 4.9 above |
| the subtitle and lede fills | 10:08 | ruling section 6 |
| `calib.pane.notSure`, EN and FR | 11:59 | ruling section 8 |
| the three Method strings, EN and FR | 12:01 | 4.4 above |
| `analysis.broad.body.generic`, EN and FR | 12:01 | 4.5 above |
| `sheet.provenance`, `capture.hint.placed.typed`, EN and FR | 12:01 | 4.10 above |

**What "verbatim" means.** English strings in this tree use U+2019 for the apostrophe
(`i18n.ts:1341`, pinned at `voice/chart/ratified-strings.test.ts:7`); the ruling's English uses
the straight one. Convert. French keeps U+2019 and the no-break space before a colon, as the
live strings do. The outer « » around each French line in the ruling are that document's
quotation marks and are not part of the string, unless the live string being replaced already
carries guillemets of its own.

## 7. Tests

Break none of these without saying so in the report.

**Tests the lane changes:** `components/Drawer/voice-pane.test.ts:15`, `:35` (it asserts
« une voix de contre-ténor », which is `typedNone`'s French), and `:126`;
`e2e/voice-pane.test.ts:94-95`; `e2e/insights-no-score.test.ts:55-62`;
`insights/identity.test.ts:68` and `:96`; `voice/engine/resolve-values.test.ts:14-22`;
`analysis/stand-ins-snapshot.test.ts:37-42`, `:72-80`, and `:100-101`.
`analysis/adapter-grid.ts:35` runs the four types through the adapter golden
(`analysis/__golden__/adapter-snapshots.json`): regenerate it on purpose and report every row
that moved.

**Tests the lane adds.** Each one catches a defect nothing else would:

1. All eight ids return true from `hasPlaceholderProfile`; `not-sure` and `undefined` return
   false.
2. For each of the three borrowing types, every one of the eleven sites is rendered and the
   declared type's own name appears in none of the `{voiceType}` fills. The section 3 line is
   the exception: it carries both the declared name and the borrowed one, on purpose.
3. A borrowing type with Other's text, and one with a Tier 2 label (sopranist, haute-contre),
   still fill with the fixed staff label.
4. "Not sure" with Other's text reaches no `{voiceType}` fill, and `borrowedStaffLabel` returns
   undefined for it.
5. None of `i18n.ts:1897`, `:1898`, `:1905`, `:1075` contains "your voice type" or
   « votre type de voix ». This catches the tokenless strings, which test 2 cannot.
6. `calib.pane.notSure` equals its ratified text, EN and FR, and `insights.method.noScore.none`
   is still reachable for a singer with no type.
7. The section 3 line draws on MELODY and on INSIGHTS for a contralto, in the `generic` state
   and in the below-core state, and does not draw for a bass or for "Not sure".
8. `{type}` fills with the Tier 1 name, so the French gender holds.
9. A regression pass for the five published types: a bass who chose octavist reads "a bass
   voice" in the VOICE pane.
10. One page rendered whole for a contralto, with every sentence on it read together, asserting
    that no two disagree about whose values these are. This is the defect section 5 names.
11. Every assertion above runs in French as well as English.
12. The Guide passage matches the ruling, EN and FR, less the struck sentence.

Pin every ratified string in `insights/ratified-lines.test.ts` with its ruling's date;
`voice/chart/ratified-strings.test.ts` already pins the two of 4.10.

## 8. Gates and ceilings

All eight gates at baseline. Gate 4's baseline on this tree is **"6691 passed | 1 skipped
(6692)"**, both halves (`STATE.md:19`). Report both; the lane 70 brief gave one of the two and
that lane spent time hunting four tests skipped for a missing scipy.

Report every ratchet that moves, with its before and after figure.

`e2e-phone/insights-links.test.ts:32` fails about 1 run in 5, identically on `61536a9f` and on
lane 70, with `expect(boundingBox().y).toBeGreaterThanOrEqual(0)` receiving `-0.0625` at `:46`.
Cause NOT ESTABLISHED. Not this lane's doing; report it if it fires and do not chase it.

## 9. What this brief could not establish

NOT ESTABLISHED beats a complete invented answer.

- Whether INSIGHTS with no score passes an empty vowel list to `placeholderLine`
  (`placeholder-line.ts:76`). Establish it before building section 4.7.
- Whether the Guide has an anchor the "Why these values" link can target.
  `guide-anchors.ts:1-22` holds renamed anchors only.
- Whether `CORE_BANDS` (`voice/engine/plausibility.ts:50`) reproduces Bozeman's figures
  faithfully. No desk read the figures this session.
- Outside this lane, and Dann's to rule: a singer on one of the five published types who typed
  Other text reads that text in `{voiceType}` today (`voiceTypes.ts:86-89`), so a mezzo-soprano
  who typed "contralto" already reads "a generic contralto" over a mezzo's values. This lane
  keeps that behaviour. Raised by Fable; recorded, not fixed here.

## 10. DESK DEFAULTS in this brief, Dann's to overrule

1. `borrowedStaffLabel` lives beside `voiceTypePrint` and returns the fixed staff label for the
   three whatever Tier 2 or Other holds (section 3).
2. The ruling's section 3 line is drawn by `placeholderLine` on MELODY and INSIGHTS, and also in
   the below-core state, which applies his ratified "every time" (section 4.7).
3. `typed-none` the state is removed; `calib.pane.typedNone` the string is kept and marked
   unused, following this file's convention (section 4.6).
4. "Your vowel space" opens for the three borrowing types and stays shut for "Not sure" and no
   type (section 4.6).
5. One sentence of the ratified Guide passage is struck, because his 11:56 amendment made it
   untrue (section 4.9).

## 11. Out of scope

`placeholder.line.many` and its siblings (`i18n.ts:2057`, `:2065`) say "through the DRAWER on
the left". That is directional language and the wrong surface name under Dann's rulings of
2026-11-18 22:35 and 23:41. It belongs to the directional census and the CONTROLS rename, not
to this lane. Change nothing about it here.
