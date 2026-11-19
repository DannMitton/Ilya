# Code brief, lane 71: all nine voice types get a starting profile, each borrowing named on the page

r1, 2026-11-19, written by the Opus desk. QUEUE row 167. Branch `cloud-lane-71`, cut from
`Shane` `b79e33e9`. Every `path:line` below was read in this tree, in this session.

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

`docs/sessions/ratified-voice-type-stand-ins_2026-11-19.md`, md5 `8153b0de`, read in full by
this desk. Dann's words are transcribed there. Read it before step 1; this brief does not
restate it.

Its section 1 (09:41) governs placement: *"transparency is paramount"*, and the concession is
stated **on the page**, never only behind a link.

Its section 7 is why this lane runs before the blank states (lane 72).

## 2. The gate

`apps/web/src/lib/voice/voiceTypes.ts:19-29` holds `TIER1`, the nine ids, in this order:
`soprano`, `mezzo-soprano`, `contralto`, `countertenor`, `tenor`, `baritone`, `bass-baritone`,
`bass`, `not-sure`.

`apps/web/src/lib/voice/engine/stand-ins.ts:73` holds
`PLACEHOLDER_PROFILE_TYPES = ['soprano', 'mezzo-soprano', 'tenor', 'baritone', 'bass']`, and
its comment at `:66-72` says the other four are "left out on purpose ... until row 167 rules
their staves". Row 167 is now ruled.

**Step 1.** Widen `PLACEHOLDER_PROFILE_TYPES` to all nine ids of `TIER1`, and rewrite the
comment to cite this ruling instead of row 167's absence. A singer with no voice type at all
is NOT in the list: `hasPlaceholderProfile(undefined)` stays false. DESK DEFAULT, from Dann
09:13, *"a generic profile that they select"*: a singer who has selected nothing has selected
nothing, and the blank-state ask of lane 72 is exactly for them.

`stand-ins.ts:55-62` `standInBucket` already maps all nine, so no mapping changes:
contralto and countertenor to `tenor-mezzo`, bass-baritone to `bass`, `not-sure` to `middle`.
The countertenor's mapping carries "COUNTERTENOR BY THE TRACT: DESK INFERENCE" at `:52`; the
ruling takes it, and section 1 of the ruling gives the reason to record there.

`stand-ins.ts:89-96` `template` builds `middle` as the geometric middle of five staves with
`tenor-mezzo` counted twice (`:92`). That is what the ratified "Not sure" line calls "averages
its five voice types". No change.

`apps/web/src/lib/voice/engine/resolve-values.ts:154` is the only gate:
`const generic = !anySung && hasPlaceholderProfile(voiceType);`. Nothing else changes for
`generic` to flip for four values. Do not add a second gate.

## 3. The borrowed label

Three types print a staff that is not their own name. The ratified fills, EN then FR:

| declared type | `{borrowed}` EN | `{borrowed}` FR |
|---|---|---|
| contralto | mezzo-soprano | mezzo-soprano |
| bass-baritone | bass | basse |
| countertenor | mezzo and tenor | mezzo et ténor |

The other five print their own name. "Not sure" prints nothing and takes its own sentence.

**Step 2.** Add `borrowedStaffLabel(voiceType, language): string | undefined` beside
`voiceTypePrint` in `voiceTypes.ts:82-97`, returning the borrowed staff's label for the three
types above and `voiceTypePrint`'s own label for the five published types. Three new i18n keys
carry the three labels; "mezzo and tenor" is a staff name, not a voice type, so it cannot
reuse a `voiceType.type.*` key.

Two facts the lane must carry:

1. `voiceTypePrint:91-94` returns the singer's **Tier 2** label when they chose one, so a
   contralto who chose a finer label prints that label today. For the three borrowing types
   `borrowedStaffLabel` discards it, because the values came from the staff and not from the
   finer label. That is the ruling's principle, applied.
2. `voiceTypePrint:90` returns `undefined` for `not-sure`. Keep that. "Not sure" never fills a
   `{voiceType}` token in this lane; it takes its own sentence everywhere.

`fillVoiceType` (`voiceTypes.ts:108-111`) elides French « de » to « d’ » before a vowel letter.
None of the three borrowed labels begins with a vowel letter, so the elision never fires on
today's fills, but route `{borrowed}` through the same helper so a later fill cannot break it.

## 4. Every site, and what each becomes

Nine sites. Six are the sentences Fable's delta review found; three were found by this desk's
own read of the tree and are marked NEW.

### 4.1 MELODY's subtitle

`apps/web/src/lib/markup/subtitle.ts:10-13`, reached from `markup/MarkupPane.svelte:552`.
`:11` fills `profile.subtitlePlaceholder` (`i18n.ts:1487`, "Resonance profile: placeholder
values for a generic {voiceType}, not yet your own resonances.") with `voiceTypePrint`.

Becomes: the fill is `borrowedStaffLabel`. A contralto reads "placeholder values for a generic
mezzo-soprano". "Not sure" takes its own ratified sentence (section 6 of the ruling):
"Resonance profile: an average of Ilya's five voice types, not yet your own resonances."

### 4.2 INSIGHTS' lede

`apps/web/src/lib/insights/identity.ts:50-53` `genericLede`, reached from
`insights/InsightsPane.svelte:503`. `:52` fills `insights.generic.lede` (`i18n.ts:1895`) with
`placeholderLabel` (`:56-58`), which is `voiceTypePrint`.

Becomes: the fill is `borrowedStaffLabel`. "Not sure" takes its own sentence, which is a DRAFT
for Dann (section 6 of the brief).

### 4.3 The vowel chart's caption

`apps/web/src/lib/insights/singer-blocks.ts:337`, fed `voiceTypeLabel` from
`InsightsPane.svelte:373`. Fills `insights.r2.vowels.against.generic` (`i18n.ts:2040`,
"against where each vowel turns in a generic {voiceType}").

Becomes: the fill is `borrowedStaffLabel`. For "Not sure", the caption falls back to
`insights.r2.vowels.against` (`:337`'s own else branch), which names no type. No new string.

### 4.4 The Method endnote, three strings. NEW

`apps/web/src/lib/insights/identity.ts:66-70` `methodLineKey`, reached from
`InsightsPane.svelte:292`. Fable's review named the key selection at `:68-69`; the defect is in
the strings it selects, which carry no token:

- `i18n.ts:1897` `insights.method.generic.typed`: "computed from placeholder values for your
  voice type, ..."
- `i18n.ts:1898` `insights.method.generic.untyped`: the same opening.
- `i18n.ts:1905` `insights.method.noScore.generic`: "from generic values for your voice type,
  ..."

For a contralto each is false: the values are a mezzo's. Reword all three so the claim is
about placeholder values without claiming the singer's type, EN and FR. DRAFTS for Dann.

`i18n.ts:1906` `insights.method.noScore.none` stays as written and stays reachable, now only
for a singer with no voice type at all. Its comment at `identity.ts:64` lists "contralto,
countertenor, bass-baritone, 'Not sure', or no type" and is now wrong: repair it to "no type".

### 4.5 The broad-analysis note. NEW

`apps/web/src/lib/analysis/analyze-score-adapter.ts:188-196` `composeBroadNote`, reached from
`markup/MarkupPane.svelte:846`. `:195` selects `analysis.broad.body.generic` (`i18n.ts:1075`),
which ends "The forecast uses placeholder values for your voice type." No token, same false
claim for a borrowing type. Reword, EN and FR. DRAFT for Dann.

### 4.6 The VOICE pane's two lines. NEW

`apps/web/src/lib/components/Drawer/voice-pane.ts:38-43` `paneState`:

- `:43` `return hasPlaceholderProfile(i.voiceType) ? 'typed-generic' : 'typed-none';`
  Once all nine are in the list, `typed-none` is unreachable, because `:41` already sends every
  non-Tier-1 id to `none` and `:42` sends `not-sure` to `not-sure`. Remove the `typed-none`
  state, its key at `:49`, its string `calib.pane.typedNone` (`i18n.ts:1433`), its branch at
  `:64`, and its test case at `components/Drawer/voice-pane.test.ts:15`.
- `:48` `calib.pane.typedGeneric` (`i18n.ts:1432`, "Ilya is using generic values for a
  {voiceType} voice until you record your own."): the fill becomes `borrowedStaffLabel`.
- `:50` `calib.pane.notSure` (`i18n.ts:1434`, "Ilya builds your resonance profile from your own
  vowels, recorded in vocal fry. Record them to begin.") is now false: "Not sure" does have a
  profile. Rewrite, EN and FR. DRAFT for Dann.

### 4.7 The concession line on the page

`apps/web/src/lib/analysis/placeholder-line.ts:66` `placeholderLine` already draws the on-page
line that names placeholder vowels on both MELODY and INSIGHTS (`i18n.ts:2057-2068`), ratified
2026-10-11. **DESK DEFAULT:** the ruling's section 3 line joins it there, as two new keys, one
templated for the three borrowing types and one for "Not sure", each ending with the link
"Why these values". Reason: section 3's own words point the singer to VOICE, so the line is not
in VOICE; and `placeholderLine` is the page's existing, ratified home for exactly this
disclosure. Both lines are already ratified, EN and FR, in sections 3 and 5 of the ruling, and
go in verbatim.

Do not repeat the remedy: the existing placeholder line already carries it, and Dann's standing
default of 2026-10-11 19:47 is that a page names its remedy once.

### 4.8 Two sites that change behaviour and need no string

- `apps/web/src/lib/markup/legend.ts:107`: a placeholder voice draws no filled head. Four more
  voices now take that path. Correct as written; no change.
- `apps/web/src/lib/analysis/gates.ts:302`, `:323` and `placeholder-line.ts:81-82` feed
  `placeholder.comment.generic` (`i18n.ts:2075`, "This finding rests on a placeholder value for
  {vowel}."), which names no voice type. Correct as written; no change.

### 4.9 The Guide passage

The ratified EN and FR passage is in sections 4 and 5 of the ruling. Seat it in the Guide
beside the existing placeholder material, EN and FR, verbatim. The link "Why these values" /
« Pourquoi ces valeurs » points to it.

"Nineteen sources were read in full" is kept deliberately and dates the passage.

## 5. The one gate, and everything that reads it

This lane changes no formula. `template` (`stand-ins.ts:89-96`) computes the same values it
computes today; what changes is which voices are allowed to use them. The whole change passes
through one boolean, `AdaptedProfile.generic`, set at `resolve-values.ts:154`.

Every reader of that boolean in this tree, read this session, and what each does when it flips
true for contralto, countertenor, bass-baritone, and "Not sure":

| reader | effect |
|---|---|
| `insights/identity.ts:42` `restsOnSamples` | unchanged; already false with nothing sung |
| `insights/identity.ts:50-53` `genericLede` | section 4.2 |
| `insights/identity.ts:66-70` `methodLineKey` | section 4.4 |
| `insights/singer-blocks.ts:254` | feeds `placeholder.comment.generic`; names no type; unchanged |
| `insights/singer-blocks.ts:337` | section 4.3 |
| `insights/InsightsPane.svelte:292`, `:373`, `:503` | call sites of the three above |
| `analysis/analyze-score-adapter.ts:183-195` | section 4.5 |
| `analysis/gates.ts:302`, `:323` | names no type; unchanged |
| `markup/subtitle.ts:10-13` | section 4.1 |
| `markup/legend.ts:107` | no filled head drawn; correct; unchanged |
| `markup/MarkupPane.svelte:552`, `:846`, `:873` | call sites |
| `components/Drawer/voice-pane.ts:43` | section 4.6 |

What depended on these agreeing: every one of them describes the same voice on the same visit,
so a page that calls the values a mezzo's in one sentence and a contralto's in the next is the
defect this lane exists to prevent. If a site resists the borrowed fill, do not special-case
it: report it and stop.

## 6. The lines that are DRAFTS, not ratified

Everything in sections 3, 4, and 5 of the ruling is ratified, EN and FR, and goes in verbatim.
These are not, and the lane does NOT invent them. The desk puts them to Dann as one sheet and
sends the lane their ratified text as an amendment:

1. INSIGHTS' lede for "Not sure" (section 4.2), EN and FR. The ruling gives the MELODY
   subtitle's wording for "Not sure" and not the lede's.
2. `insights.method.generic.typed`, `.untyped`, and `insights.method.noScore.generic`
   (section 4.4), EN and FR.
3. `analysis.broad.body.generic` (section 4.5), EN and FR.
4. `calib.pane.notSure` (section 4.6), EN and FR.
5. French for the two sentences of the ruling's section 6, named there as owed.

## 7. Tests

- `components/Drawer/voice-pane.test.ts`: the contralto case at `:15` expects `typed-none` and
  its string. It must now expect `typed-generic` with the borrowed fill. Remove nothing else
  from that file without saying so.
- `insights/ratified-lines.test.ts` pins the ratified strings; every string this lane adds or
  rewords is pinned there with its ruling's date.
- A test that walks all nine `TIER1` ids through `hasPlaceholderProfile` and asserts nine true,
  and `hasPlaceholderProfile(undefined)` false.
- A test that walks the three borrowing types through every one of the nine sites and asserts
  that the declared type's own name appears in none of them.
- A test that asserts `insights.method.noScore.none` is still reachable, for a singer with no
  voice type.

## 8. Gates and ceilings

All eight gates at baseline. Gate 4's baseline on this tree is "6691 passed | 1 skipped
(6692)" (`STATE.md`, the 2026-11-19 morning close). Report both halves of that figure; the lane
70 brief gave one of the two and the lane spent time hunting four tests that were skipped for a
missing scipy.

`e2e-phone/insights-links.test.ts:32` fails about 1 run in 5, identically on `61536a9f` and on
lane 70, with `expect(boundingBox().y).toBeGreaterThanOrEqual(0)` receiving `-0.0625` at `:46`.
Cause NOT ESTABLISHED. It is not this lane's doing; report it if it fires and do not chase it.

Ratchets: report every file whose ceiling moves, with the before and after figure.

## 9. What this brief could not establish

NOT ESTABLISHED beats a complete invented answer.

- Whether any site beyond the nine in section 4 prints the declared voice type while the values
  are a neighbour's. The desk grepped every reader of `AdaptedProfile.generic` in
  `apps/web/src` and found nine; a site that reaches the type by another route would not appear
  in that grep.
- The wording of the five items in section 6. They are Dann's to ratify and nobody else's.
- Whether the three borrowed-staff labels need their own Tier 2 handling in French beyond the
  three fills ratified in section 5 of the ruling.
- The ruling's own line citations for `stand-ins.ts` read `:58-66`, `:76`, and `:91-96`. The
  tree reads `:55-62`, `:73`, and `:89-96`. The tree wins (tether 3). The ruling's text is
  unaffected; only its citations drifted.

## 10. DESK DEFAULTS in this brief, Dann's to overrule

1. A singer with no voice type at all gets no starting profile (section 2).
2. `borrowedStaffLabel` lives beside `voiceTypePrint` and discards a Tier 2 label for the three
   borrowing types (section 3).
3. The ruling's section 3 lines are drawn by `placeholderLine`, on MELODY and INSIGHTS, and do
   not repeat the remedy (section 4.7).
4. `typed-none` and `calib.pane.typedNone` are removed rather than left unreachable
   (section 4.6).

## 11. Out of scope

`placeholder.line.many` and its siblings (`i18n.ts:2057`, `:2065`) say "through the DRAWER on
the left". That is directional language and the wrong surface name under Dann's rulings of
2026-11-18 22:35 and 23:41. It belongs to the directional census and the CONTROLS rename, not
to this lane. Change nothing about it here.
