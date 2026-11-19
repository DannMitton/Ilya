# Code brief, lane 71: all nine voice types get a starting profile, each borrowing named on the page

r4, 2026-11-19, written by the Opus desk. QUEUE row 167. Branch `cloud-lane-71`, cut from
`Shane` `b79e33e9`. Every `path:line` below was read in this tree, in this session.

r2 applied Fable's review of r1 (`review-fable-lane71-voice-type-brief_r1_2026-11-19.md`, md5 `5791565e`,
DO NOT SEND, four blockers and nineteen amendments), Dann's amendment of 11:55 to 11:57, and
his ratifications of 11:59 and 12:01.

r3 applies Fable's delta review of r2 (`review-fable-lane71-voice-type-brief_r2-delta_2026-11-19.md`,
md5 `3242dc45`, DO NOT SEND, two blockers and fifteen amendments), its delta review of r3
(`review-fable-lane71-voice-type-brief_r3-delta_2026-11-19.md`, md5 `fc06ba70`, DO NOT SEND,
one blocker and eleven amendments, plus eight carried), and **Dann's ruling of
2026-11-19 13:58 that "No average" reaches the starting path only** (`INBOX.md`, that time).
The five-staff average therefore stays as the vowel chart's drawing ground (`chart/zones.ts:89`,
`:91`) and as the fill for a partly sampled voice (`resolve-values.ts:153`, `:156`;
`stand-ins.ts:147`, `:61`). It is removed as a starting profile and nowhere else.

**r4 goes to the lane without a fourth review.** Three Fable reviews have run and every
amendment of all three is applied below. What remained after r3 was citation precision, and
behaviour is checked by the as-built review. Dann's standing rule is that a brief is reviewed
before Code gets it and the review's amendments are applied first; both are satisfied.

The one blocker of the r3 delta was French the desk wrote. It is withdrawn: the sources note
for an undeclared voice now reads "the middle of Ilya's five staves", taken word for word from
Dann's ratified Guide passage, so there is no new French in this brief and nothing in it waits
on him.

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

`stand-ins.ts:147` takes the bucket from `standInBucket(voiceType)` whenever the voice is not
personal, and `:61` returns `middle` for an undeclared voice, which is why the average survives
this lane on the paths Dann's 13:58 ruling names.

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
`voice/engine/stand-ins.ts:64-72`; `voice/chart/screen-logic.ts:29` ("the placeholder says
'your voice type'"); `voice/chart/zones.ts:21-23` (its list of withheld types). The tree must not go on describing the old rule.

## 3. The borrowed label

Three types print a staff that is not their own name. The ratified fills:

| declared type | `{borrowed}` EN | `{borrowed}` FR |
|---|---|---|
| contralto | mezzo-soprano | mezzo-soprano |
| bass-baritone | bass | basse |
| countertenor | mezzo and tenor | mezzo et ténor |

**Step 2.** Add `borrowedStaffLabel(voiceType, language): string | undefined` beside
`voiceTypePrint` in `voiceTypes.ts:82-97`. Three new i18n keys carry the three staff labels;
"mezzo and tenor" is a staff name, not a voice type, so it cannot reuse a `voiceType.type.*`
key.

Its contract, four clauses, each load-bearing:

1. For contralto, countertenor, and bass-baritone it returns the **fixed staff label above,
   whatever `voiceTypeSpecific` or `voiceTypeOther` hold.** The values came from the staff.
2. For the five published types it returns `voiceTypePrint`'s label **on the Tier 1 id**, as
   `voice-pane.ts:65-66` already does. Otherwise a bass who chose octavist reads "the octavist
   staff", which is not a staff Ilya has.
3. **For `not-sure` it returns `undefined`, whatever Other's text holds.** `voiceTypePrint:86-89`
   returns Other's typed text **before** the `not-sure` test at `:90`
   (`voiceTypes.test.ts:112`, `insights/identity.test.ts:36` pin it), so the guarantee cannot
   rest on the gate alone.
4. **It returns `undefined` for no type at all and for any id that is not Tier 1.**
   **"Undeclared" means exactly that `undefined`**, and every site below branches on it, never
   on `hasDeclaredType`: the sheet draws `sheet.provenance.undeclared`, and the capture hint
   takes `capture.hint.placed.untyped`, whatever `screen-logic.ts:30` says. This closes the raw
   token for an id the build does not know.

**`{type}` in the ruling's templated line is the Tier 1 name**, never a Tier 2 label and never
Other's text. The ratified French depends on it: the template holds because contralto,
contre-ténor, and baryton-basse are masculine, which is true of the Tier 1 names and not of
every Tier 2 label (`voiceTypes.ts:38` holds haute-contre).

**`fillVoiceType` cannot fill the new tokens as written.** `voiceTypes.ts:109-110` replaces the
literal `de {voiceType}` and `{voiceType}`. The ruling's line carries `{type}` and `{borrowed}`.
Generalize the helper to take the token name, keep its French elision rule and its
single-helper purpose (`:104-106`), and route every fill through it.

## 4. Every site, and what each becomes

Eleven. Nine reached through `AdaptedProfile.generic`, and two more that reach the voice type
by another route.

With "Not sure" out of the list there is no "Not sure" case in 4.1, 4.2, or 4.3: `generic` is
false for it, so `markup/subtitle.ts:11` leaves the label undefined and falls through, and
`insights/identity.ts:52` returns null.

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

- `insights.method.generic.typed` (`i18n.ts:1897`)
  EN: Method: computed from placeholder values, the voice characteristics you typed, and the
  score as sung, including repeats.
  FR: « Méthode : calculé à partir de valeurs par défaut, des caractéristiques vocales que
  vous avez indiquées et de la partition telle que chantée, reprises comprises. »
- `insights.method.generic.untyped` (`i18n.ts:1898`)
  EN: Method: computed from placeholder values and the score as sung, including repeats.
  FR: « Méthode : calculé à partir de valeurs par défaut et de la partition telle que
  chantée, reprises comprises. »
- `insights.method.noScore.generic` (`i18n.ts:1905`)
  EN: Method: from placeholder values, until you record your own vowels.
  FR: « Méthode : à partir de valeurs par défaut, jusqu’à ce que vous captiez vos
  propres voyelles. »

`insights.method.noScore.none` (`i18n.ts:1906`) stays as written and stays reachable: a singer
with no type, one on "Not sure", and an id this build does not know
(`analysis/stand-ins-snapshot.test.ts:72`, 'other-text'). Repair the comment at
`insights/identity.ts:63-64`, which still lists the four types; **three move now, not four.**

### 4.5 The broad-analysis note. RATIFIED 2026-11-19 12:01

`analysis/analyze-score-adapter.ts:188-196` `composeBroadNote`, from `MarkupPane.svelte:846`.
`:195` selects `analysis.broad.body.generic` (`i18n.ts:1075`). Only the closing sentence moves.
EN: ... The forecast uses placeholder values.
FR: « ... La prévision repose sur des valeurs par défaut. »

### 4.6 The VOICE pane. One line ratified, one state removed

`components/Drawer/voice-pane.ts:35-44` `paneState`.

- `:43` `hasPlaceholderProfile(i.voiceType) ? 'typed-generic' : 'typed-none'`. With eight in the
  list, `typed-none` is unreachable. Remove the state at `:33`, the return at `:43`, the key at
  `:49`, and the branch at `:64`.
- `calib.pane.typedNone` (`i18n.ts:1433`): **keep the string, marked unused in place with its
  ratified French**, which is this file's convention (`i18n.ts:1437`).
- `:48` `calib.pane.typedGeneric` (`i18n.ts:1432`) keeps its ratified words; the fill becomes
  `borrowedStaffLabel` on the Tier 1 id, as `:65-66` already calls it.
- `:50` `calib.pane.notSure` (`i18n.ts:1434`). **RATIFIED by Dann 2026-11-19 11:59**, replacing
  the live text whole:
  EN: Not knowing is a fine answer. Record your vowels in vocal fry and Ilya works from your
  own voice, which also gives you evidence in your own search. Or choose a voice type, and Ilya
  starts from published values for it.
  FR: « Ne pas savoir est une réponse valable. Captez vos voyelles en friture vocale et Ilya
  travaille à partir de votre propre voix, ce qui vous donne aussi des indices dans votre propre
  recherche. Ou choisissez un type de voix, et Ilya part de valeurs publiées pour celui-ci. »
  The control its last sentence points at is already drawn: `components/Drawer/VoicePane.svelte:85`
  renders `VoiceTypeIntake`. Build no new control.
- `:81-83` `showVowelSpaceDoor` reads `hasPlaceholderProfile` directly, a tenth reader of the
  list. **DESK DEFAULT:** "Your vowel space" opens for contralto, countertenor, and
  bass-baritone with nothing stored, and stays shut for "Not sure" and no type. Rewrite the
  comment at `:77-79` to the new membership.

### 4.7 The borrowing line on the page: its own function, not `placeholderLine`

**r3 hung this on `placeholderLine` and that cannot work.** Established in the tree:
`insights/InsightsPane.svelte:189` sets `placeholders = placeholderVowels(analyzed)`;
`analysis/placeholder-line.ts:27` returns `[]` with no analysis; `:76` then returns null; and
`:73-75` returns null first when something is sampled and nothing is analysed. So on INSIGHTS
with no score the line would never draw, and that page would name no borrowing at all, since
the lede needs a model (`InsightsPane.svelte:503`).

**Build the borrowing line as its own pure function**, with its own entry in the `note` array
at `insights/InsightsPane.svelte:503` and at `markup/MarkupPane.svelte:736`. It takes the voice
type and the sampled formants, and it does not look at the vowel list. That settles the
no-score page and the below-core state together, and it touches `placeholderLine` not at all.

**The draw rule, stated once, for both pages and for no score:**

> The declared Tier 1 id is contralto, countertenor, or bass-baritone, **and** the voice is not
> personal (`isPersonal`, `voice/engine/sung.ts:41`, five stable core vowels).

Both halves are load-bearing. "`standInBucket` differing from the singer's own type" is false
as a test, because `stand-ins.ts:58` returns `tenor-mezzo` for a tenor and a mezzo-soprano too.
And once five core vowels are stable the fill comes from `middle` times the tract scale
(`:144-147`), so no borrowed value is in use and the line must not draw.

**It does not hang on `methodGeneric`** (`InsightsPane.svelte:294`): a borrowing voice with one
to four core vowels sampled takes `insights.method.noScore.samples` (`insights/identity.ts:67`),
which is not a generic key, and that voice still needs the line.

**The ratified string goes in whole, remedy clause included.** "Do not repeat the remedy" means
the lane adds no further remedy sentence of its own.

**Named cost, DESK DEFAULT:** in the `generic` state this line and `placeholder.line.many` both
print, so the page gives the remedy twice, once as "the DRAWER on the left" (`i18n.ts:2057`) and
once as "VOICE". Dann's standing default of 2026-10-11 19:47 is that a page names its remedy
once, so this departs from it, deliberately, because the two sentences answer different
questions and the directional wording is the directional census's to fix, not this lane's. The
reading Dann would be overruling: a contralto who has sampled three vowels reads "until you
sample your own vowels in VOICE".

### 4.8 Two sites that change behaviour and need no string

- `markup/MarkupPane.svelte:866` is the reader (`filledHeads: !adapted.generic`), with
  `markup/legend.ts:105-108` as its comment; `:865` is `hollowHeads`, which reads
  `e.placeholder`, not `generic`. Three more voices take the path. Correct; no change.
- `analysis/gates.ts:302` and `:323`, reached from `MarkupPane.svelte:873`
  (`gatedLines(..., adapted.generic)`), with `placeholder-line.ts:81-82`, feed
  `placeholder.comment.generic` (`i18n.ts:2075`), which names no voice type. No change.

### 4.9 The Guide passage, whole

The ratified EN and FR passage is in sections 4 and 5 of the ruling. Seat it, both languages,
**in full, with nothing struck**, in `components/Reading/GuideContent.svelte`, beside the
placeholder sentence in the MELODY notation paragraph (`:395` English, `:91` French).

r2 proposed striking "If you have not named a type, Ilya starts from the middle of its five
staves." **That strike is withdrawn** on Dann's 13:58 ruling: the average reaches the chart's
ground and the partly sampled fill, so the sentence is true of what Ilya does.

Give the link "Why these values" / « Pourquoi ces valeurs » its anchor. `guide-anchors.ts` has
18 lines and holds renamed anchors only; the Guide's headings carry `id` attributes
(`GuideContent.svelte:21`, `:25`), so the new anchor is an `id`. Report its id.

### 4.10 Two ratified strings that reach the voice type without `generic`. RATIFIED 12:01

**Both draw for voices this lane does not widen**, so each needs a case for every voice.
`VowelSpaceSheet.svelte:163` draws the sources note with no condition, inside a sheet that opens
for any voice with a stored reading. Branch on `borrowedStaffLabel` being `undefined`, never on
`hasDeclaredType`.

- `sheet.provenance` (`i18n.ts:2569`), pinned at `voice/chart/ratified-strings.test.ts:29`.
  EN: ... and Mitton (2020), Table 5.3, scaled to the {borrowed} staff, for the second.
  FR: « ... et Mitton (2020), tableau 5.3, ajusté à la portée de {borrowed}, pour la deuxième. »
- **`sheet.provenance.undeclared`, a second key for an undeclared voice.** Its last clause:
  EN: ... and Mitton (2020), Table 5.3, scaled to the middle of Ilya’s five staves, for the
  second.
  FR: « ... et Mitton (2020), tableau 5.3, ajusté au milieu des cinq portées d’Ilya, pour la
  deuxième. »
  Every word is Dann’s: "the middle of its five staves" / « du milieu de ses cinq portées » is
  his ratified Guide passage, and « ajusté à » is the live string. This is not new French.
- `capture.hint.placed.typed` (`i18n.ts:2619`), chosen at `voice/chart/screen-logic.ts:63`,
  drawn at `voice/VowelCapture.svelte:220`, pinned at `ratified-strings.test.ts:70`.
  **False on Ilya today**, before this lane: `stand-ins.ts:147` takes `standInBucket(voiceType)`
  whenever the voice is not personal, `:58` and `:60` send the three to a neighbour's staff, and
  `:153` and `:158` fill from that shape.
  EN: Ilya has placed {v} from its {borrowed} values for now. Its placeholder moves as you
  record.
  FR: « Ilya a placé {v} d’après ses valeurs de {borrowed}, pour l’instant. Sa valeur par
  défaut évolue à mesure que vous captez vos voyelles. »
  An undeclared voice takes `capture.hint.placed.untyped`, which exists.

## 5. The one gate, and everything that reads it

This lane changes no formula. `template` (`stand-ins.ts:89-98`) computes what it computes
today. The change passes through one boolean, `AdaptedProfile.generic`
(`resolve-values.ts:154`), and one direct reader of the list.

| reader | effect |
|---|---|
| `insights/identity.ts:42` `restsOnSamples` | unchanged; already false with nothing sung |
| `insights/identity.ts:50-53` `genericLede` | 4.2 |
| `insights/identity.ts:66-70` `methodLineKey` | 4.4 |
| `insights/singer-blocks.ts:254` | `placeholder.comment.generic`; names no type; unchanged |
| `insights/singer-blocks.ts:337` | 4.3 |
| `insights/InsightsPane.svelte:292`, `:294`, `:373`, `:503` | call sites |
| `analysis/analyze-score-adapter.ts:183-195` | 4.5 |
| `analysis/gates.ts:302`, `:323` | names no type; unchanged |
| `markup/subtitle.ts:10-13` | 4.1 |
| `markup/MarkupPane.svelte:552`, `:736`, `:846`, `:866`, `:873` | call sites |
| `components/Drawer/voice-pane.ts:43` | 4.6 |
| `components/Drawer/voice-pane.ts:81-83` `showVowelSpaceDoor` | reads the list directly; 4.6 |
| `analysis/analyze-score-adapter.ts:93` `completeness.formants` | turns true for the three, which is how the pages stop withholding: `insights/InsightsPane.svelte:204`, `markup/MarkupPane.svelte:831` |

If a site resists the borrowed fill, do not special-case it: report it and stop.

## 6. Every string, and where its ratification lives

| string | status | where the text is |
|---|---|---|
| the templated borrowing line, EN and FR | ratified 09:43, 09:52 | ruling sections 3 and 5 |
| the three `{borrowed}` fills, EN and FR | ratified 09:43, 09:52 | ruling sections 3 and 5 |
| the link, EN and FR | ratified 09:43, 09:52 | ruling sections 3 and 5 |
| the Guide passage, EN and FR, whole | ratified 09:42, 09:52 | ruling sections 4 and 5 |
| the subtitle and lede fills | ratified 10:08 | ruling section 6 |
| `calib.pane.notSure`, EN and FR | ratified 11:59 | ruling section 8 |
| the three Method strings, the broad note, `sheet.provenance`, `capture.hint.placed.typed` | ratified 12:01 | 4.4, 4.5, 4.10 above, and the ruling file |
| `sheet.provenance.undeclared` | **DESK DEFAULT, assembled from Dann's ratified Guide wording; not separately ratified** | 4.10 above |

Every string but the last is Dann's ratified text. The last is his words in a new arrangement,
and it is the only line in this brief he has not seen in this exact form.

**Characters.** In both languages every apostrophe is U+2019. In French every colon takes
U+00A0 before it, as `i18n.ts:1897` does. This brief's own French is written in those
characters; match it byte for byte. The outer « » around each French line in the ruling are
that document's quotation marks and are not part of the string, unless the live string being
replaced already carries guillemets of its own.

## 7. Tests

**Tests the lane breaks and must update:** `insights/ratified-lines.test.ts:422-423`,
`:428-431`, `:437-438`; `analysis/analyze-score-adapter.test.ts:467-468`;
`components/Drawer/voice-pane.test.ts:15`, `:16`, `:35`, `:126`;
`voice/chart/screen-logic.test.ts:45`; `voice/chart/ratified-strings.test.ts:29` and `:70`
(they pin the OLD text of the two strings of 4.10); `e2e/voice-pane.test.ts:94-95`;
`e2e/insights-no-score.test.ts:34-35`, `:55-62`; `insights/identity.test.ts:68`, `:96`;
`voice/engine/resolve-values.test.ts:14-22`; `analysis/stand-ins-snapshot.test.ts:37-42`,
`:72-80`, `:100-101`.

`analysis/adapter-grid.ts:35` runs the types through the adapter golden
(`analysis/__golden__/adapter-snapshots.json`). **Three rows move, not four.** Regenerate on
purpose, report every row that changed, and confirm the `not-sure`, `undefined`, and `''` rows
did **not** move.

**Tests the lane adds:**

1. All eight ids return true from `hasPlaceholderProfile`; `not-sure` and `undefined` return
   false.
2. For each of the three borrowing types, every one of the eleven sites is rendered and the
   declared type's own name appears in none of the `{voiceType}` fills. The section 3 line is
   the exception: it carries both names on purpose.
3. A borrowing type with Other's text, and one with a Tier 2 label (sopranist, haute-contre),
   still fill with the fixed staff label.
4. "Not sure" with Other's text reaches no `{voiceType}` fill, and `borrowedStaffLabel` returns
   undefined for it, for no type, and for an id that is not Tier 1.
5. None of the strings `insights.method.generic.typed`, `.untyped`,
   `insights.method.noScore.generic`, `analysis.broad.body.generic`, `sheet.provenance`, or
   `capture.hint.placed.typed` contains "your voice type" or « votre type de voix ». Named by
   key, never by line number.
6. `calib.pane.notSure` equals its ratified text, EN and FR, and `insights.method.noScore.none`
   is still reachable for a singer with no type.
7. **The draw rule.** The borrowing line draws on MELODY and on INSIGHTS for a contralto with
   nothing sampled, for a contralto with three core vowels sampled, and on INSIGHTS with no
   score. It does **not** draw for a tenor, for a mezzo-soprano, for a contralto with five
   stable core vowels, for "Not sure", or for no type.
8. `{type}` fills with the Tier 1 name, so the French gender holds.
9. A bass who chose octavist reads "a bass voice" in the VOICE pane, "the bass staff" on the
   sheet, and "from its bass values" in the capture hint.
10. The sheet's door opens for the three with nothing stored, and stays shut for "Not sure" and
    no type.
11. "Not sure", no type, and an unknown id each draw `sheet.provenance.undeclared` and
    `capture.hint.placed.untyped`.
12. Across the nine Tier 1 ids, no type, and one unknown id, in both languages, **no rendered
    string at any of the eleven sites contains `{` or `}`.**
13. One page rendered whole for a contralto, every sentence read together, asserting no two
    disagree about whose values these are.
14. Every string the lane writes or edits: every apostrophe is U+2019, and every French colon
    carries U+00A0 before it.
15. The Guide passage matches the ruling, EN and FR, **whole**, the middle-of-five-staves
    sentence included.
16. Every assertion above runs in French as well as English.

Pin every ratified string in `insights/ratified-lines.test.ts` with its ruling's date.

## 8. Gates and ceilings

All eight gates at baseline. Gate 4's baseline on this tree is **"6691 passed | 1 skipped
(6692)"**, both halves (`STATE.md:19`). Report both.

Report every ratchet that moves, with its before and after figure.

`e2e-phone/insights-links.test.ts:32` fails about 1 run in 5, identically on `61536a9f` and on
lane 70, with `expect(boundingBox().y).toBeGreaterThanOrEqual(0)` receiving `-0.0625` at `:46`.
Cause NOT ESTABLISHED. Not this lane's doing; report it if it fires and do not chase it.

## 9. What this brief could not establish, and what the lane cannot close

NOT ESTABLISHED beats a complete invented answer.

1. **`capture.hint.placed.typed` stays false in one state the lane does not reach.** Once five
   core vowels are stable, every placeholder is the middle shape times the singer's tract scale
   (`stand-ins.ts:144-147`), and the hint still draws (`screen-logic.ts:58-64`). "From its
   {borrowed} values" is untrue there for all eight types, as "from your voice type" is untrue
   there today. The new text is more exactly wrong, which makes it findable. Leave it; it is
   its own item, for Dann.
2. **The first clause of the sources note is not true for an undeclared voice**, before this
   lane or after: with no type the zone is the union band (`plausibility.ts:211`) while the
   placeholder is the middle of five centres. That these agree is NOT ESTABLISHED and unlikely.
   Not this lane's.
3. **The guard and the stand-ins disagree about a countertenor.** `plausibility.ts:135-142`
   sends countertenor to `union`; `stand-ins.ts:58` sends him to `tenor-mezzo`. So his zones
   along the first resonance are the union bands (`plausibility.ts:211`, read by `zones.ts:96`)
   while his placeholders are the mezzo and tenor staff's centres, and after this lane the page
   says "mezzo and tenor values" beside a chart whose zones are neither. Aligning the guard
   changes which samples it accepts, which is a formula change this lane does not make.
   **Leave `bucketFor` alone and report what you see.**
4. The ratified `calib.pane.notSure` ends "Or choose a voice type, and Ilya starts from
   published values for it." For three of the eight there are none; the next sentence the
   singer reads corrects it. Recorded, not repaired here.
5. Whether `knip` or any other tool flags `calib.pane.typedNone` once it is unreachable.
6. Outside this lane: a singer on one of the five published types who typed Other text reads
   that text in `{voiceType}` today (`voiceTypes.ts:86-89`). This lane keeps that behaviour.

## 10. DESK DEFAULTS in this brief, Dann's to overrule

1. `borrowedStaffLabel` lives beside `voiceTypePrint`, is called on the Tier 1 id, and returns
   `undefined` for "Not sure", no type, and any id that is not Tier 1 (section 3).
2. The borrowing line is its own function with its own entry in the `note` array, not a branch
   of `placeholderLine`, and it draws in the below-core state and on INSIGHTS with no score
   (section 4.7).
3. In the `generic` state the page carries two remedy sentences, which departs from the
   standing default of 2026-10-11 19:47 (section 4.7).
4. `typed-none` the state is removed; `calib.pane.typedNone` the string is kept and marked
   unused, following this file's convention (section 4.6).
5. "Your vowel space" opens for the three borrowing types and stays shut for "Not sure" and no
   type (section 4.6).
6. `sheet.provenance.undeclared` is a new key whose words are assembled from Dann's ratified
   Guide passage (section 4.10).

Withdrawn from r2: the strike of one sentence of the ratified Guide passage (section 4.9).

## 11. Out of scope

`placeholder.line.many` and its siblings (`i18n.ts:2057`, `:2065`) say "through the DRAWER on
the left". That is directional language and the wrong surface name under Dann's rulings of
2026-11-18 22:35 and 23:41. It belongs to the directional census and the CONTROLS rename, not
to this lane. Change nothing about it here.
