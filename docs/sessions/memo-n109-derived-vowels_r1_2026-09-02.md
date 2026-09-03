# Memo: N.109, derived vowels reach the forecast

Written 2026-09-02 by Code, against your prompt of the same day. Floor:
`d22084c`, "N.107: the turning head counts its ledger lines". Item: **N.109**.

**Nothing here is committed and nothing is shipped.** The tree is edited and
the gates are run. The commit is yours.

```
SEQUENCE POSITION
item:        N.109, derived vowels reach the forecast
serves:      a singer whose roster shows an Estimated [ɨ], [ɪ] or [ʌ] now
             gets acoustic marks on those vowels in the score
blocked on:  nothing
done when:   the three derived vowels draw turning heads on a walked
             production build, and the derivation is gated under vitest
displaces:   nothing
```

**Gate 4 moves to `925 passed (925)`, so `ilya-ship.sh` line 79 must change.**
I did not edit that file. §6 gives the line.

---

## 1. The bug, stated once

`CalibrationWizard.svelte:1030` said the roster's derived preview was "computed
by the same derive() the analysis layer uses". It was not. The analysis
adapter's two loops read `formants` and nothing else, so a vowel the singer
never sang had no fR1, and `analyzeScore` omits every event whose vowel has no
fR1. A singer who sang [i] and [u] saw **410 Hz, Estimated** on the roster and
saw nothing at all on «быст» in the score.

The two sites now read one anchor table and one usability gate. The comment is
true, and it says so.

## 2. What changed

Four files. No user-facing string was added, changed, or removed. **No French
was coined.**

### `apps/web/src/lib/shane/engine/derivations.ts`

Three additions below the existing `derive`. Nothing above them moved.

| line | what |
| --- | --- |
| `:49-54` | `DERIVE_ANCHORS`, lifted from the wizard, with `a: ['ɑ']` added so the table's keys match `DERIV_SOURCE` exactly |
| `:77-93` | `usableAnchor`, lifted from the wizard and tightened: a positive `f1`, a positive `f2`, and `plausibility !== 'implausible'` |
| `:94-109` | `deriveFrom(vowel, sampled)`, the one entry point both readers call |

`deriveFrom` is the seam. It applies the table, the gate, and `derive` in one
place, so the roster and the forecast cannot apply them differently. It reads
only the sampled map handed to it, and no anchor is itself derivable, so
nothing chains off a derived value.

### `apps/web/src/lib/shane/analyze-score-adapter.ts`

`:187-197`, after both measured loops and before the characteristics block.
The loop is ten lines; the twenty-two lines above it are why.

```ts
for (const vowel of Object.keys(DERIV_SOURCE) as Vowel[]) {
  if (fR1[vowel] !== undefined && fR2[vowel] !== undefined) continue;
  const derived = deriveFrom(vowel, formants);
  if (!derived) continue;
  if (fR1[vowel] === undefined && typeof derived.f1 === 'number' && derived.f1 > 0) {
    fR1[vowel] = derived.f1;
  }
  if (fR2[vowel] === undefined && typeof derived.f2 === 'number' && derived.f2 > 0) {
    fR2[vowel] = derived.f2;
  }
}
```

**Nothing is written to the stored profile.** This runs per snapshot, on the
formants handed in. Your ruling of 2026-07-02 holds unchanged, and
`profileStore.ts:15-18` still says the store keeps only what was sung.

**A measured reading always wins.** Each channel is filled only where the loops
above left it empty.

The derived fR2 is gated as the measured fR2 loop is. The measured loop tests
`f2 > 0`, `f2Quality !== 'absent'` and `plausibility !== 'implausible'`; a
derived reading carries neither `f2Quality` nor `plausibility`, both of which
mean "not assessed" and pass, so the live condition is a positive number. That
is stated in the comment rather than left for a reader to work out.

### `apps/web/src/lib/shane/CalibrationWizard.svelte`

The local `DERIVE_ANCHORS`, the local `usableAnchor`, and the body of
`displayFormant` are gone; `displayFormant` is now one line calling
`deriveFrom`. The import changes from `derive` to `deriveFrom`. The roster
markup, `pacifierFormants`, and the return path that strips estimated entries
are untouched. **The comment that was wrong now says what N.109 did to make it
right.**

### `apps/web/src/lib/shane/analyze-score-adapter.test.ts`

Five new tests, and one existing test amended. See §5.

## 3. The two judgment calls inside the fix

**One: the shared gate is the stricter of the two.** The wizard's
`usableAnchor` tested only that `f2` was a number. The adapter's own §B.4 rule
excludes an implausible reading. A shared helper has to be one or the other,
and the point of sharing it is that the roster and the forecast agree, so it is
the stricter one: an anchor the plausibility guard rejected now derives nothing
at either site. Fit will not build a value, shown or forecast, on a number the
engine has already decided cannot be that vowel.

The visible consequence: a roster row that used to show an Estimated value
derived from an implausible anchor now shows an empty cell. That is the correct
cell. **DESK DEFAULT, yours to wave off.**

**Two: `a: ['ɑ']` is in the shared table.** `DERIV_SOURCE` has always listed
four derivable vowels; the wizard's private table listed three. Leaving [a] out
of the shared table would have put the disagreement back one level down, so it
is in.

This has one visible effect on the roster, and only for a singer who never sang
[a]: the [a] row, which used to be blank, now reads **≈ Estimated**. I walked
it, and §4 records the numbers. [a] is one of the seven the wizard prompts for,
so reaching that state means skipping a prompted vowel. **DESK DEFAULT, yours
to wave off.**

## 4. What I walked, and what I saw

Local production build, `pnpm --filter @ilya/web build`
(`stamp-sw: CACHE_VERSION is now ilya-1788382718619`), served by
`pnpm --filter @ilya/web preview --port 4173`, viewport 1400 × 900, on
`tools/e16-harness/output/mussorgsky---sunless-01---within-four-walls/repaired/score.repaired.musicxml`.
The page renders 96 vocal-line events over eight systems on two pages, six
systems on the first and two on the second.

**Read §4.4 before you read these numbers. The profile is fabricated.**

### 4.1 Before and after, on the same page

I built the bundle twice: once with the new loop iterating an empty array, once
with it as written. Same score, same profile, same browser, no other
difference.

| | turning noteheads |
| --- | --- |
| before | **85** of 96 events |
| after | **95** of 96 events |

**Ten events gained a turning head. None lost one.** Every one of the ten is a
[ɨ], [ɪ] or [ʌ], read off the page's own IPA row:

| event | syllable | IPA | vowel |
| --- | --- | --- | --- |
| `m6-3-4` | «ны» | nɨ | ɨ |
| `m9-1-4` | «быст» | bɨst | ɨ |
| `m9-1-2` | «рый» | rɨj | ɨ |
| `m11-5-4` | «ный» | nɨj | ɨ |
| `m3-1-4` | «не» | ɲɪ | ɪ |
| `m4-1-4` | «без» | bʲɪz | ɪ |
| `m13-0-1` | «е;» | jɪ | ɪ |
| `m9-5-4` | «за» | zʌ | ʌ |
| `m12-0-1` | «на» | nʌ | ʌ |
| `m12-5-4` | «ко» | kʌ | ʌ |

Four [ɨ], three [ɪ], three [ʌ]. Nothing else moved, on either side.

The five syllables you named are all in that table: «быст», «рый», «ный» for
[ɨ], «на» for [ʌ], «е» for [ɪ].

### 4.2 The three screenshots

Each is the page's own system layer cloned into a fixed overlay with a tight
viewBox at 3×, the instrument N.106 §4 used. **The overlay draws the nodes the
page draws.** No page source was changed to look at it, and the overlay was
removed afterwards.

| case | event | viewBox | what it shows |
| --- | --- | --- | --- |
| [ɨ] | `m9-1-4` «быст» | `384.74 63.50 40.98 93.50` | the lavender head one step above the sung head, at the same x, a lavender sharp leading it; inside the stave, no ledger |
| [ʌ] | `m12-0-1` «на» | `53.77 60.75 40.98 96.25` | the lavender head well above the stave on one lavender ledger line (N.107's work), lavender sharp leading it, the sung head and its stem below |
| [ɪ] | `m13-0-1` «е;» | `336.40 63.50 47.48 93.50` | the lavender head one step **below** the sung head, at the same x, lavender sharp leading it |

Read off the live DOM, all three turning units are `U+E0A4`, a black notehead,
preceded by `U+E262`, a sharp, and all three sit at the sung head's own x. None
of the three is a unison or a second, so N.106's displacement rule does not
engage on any of them.

Console errors across the whole walk: **none.**

### 4.3 The roster still says Estimated

With the same profile, the wizard's summary roster reads:

```
[i] cardinal-i    Captured   300 Hz   2100 Hz
[e] close-e       Captured   400 Hz   1900 Hz
[ɛ] open-e        Captured   500 Hz   1700 Hz
[a] bright-a      Captured   650 Hz   1250 Hz
[ɑ] dark-a        Captured   622 Hz   1100 Hz
[o] Russian-o     Captured   450 Hz    900 Hz
[u] cardinal-u    Captured   350 Hz    800 Hz
[ɨ] velar-i     ≈ Estimated  410 Hz   1229 Hz
[ɪ] smallcaps-i ≈ Estimated  413 Hz   1978 Hz
[ʌ] turned-v    ≈ Estimated  622 Hz   1412 Hz
```

**All three are still Estimated, and the numbers are the numbers the forecast
now uses.** 410 is 1.365 × 300 rounded for display; 413 is 1.0315 × 400; 622 is
[ɑ]'s own f1, which is what `derive` says [ʌ] takes.

Then I deleted the measured [a] and reloaded, to see §3's second call:

```
[a] bright-a    ≈ Estimated  715 Hz   1210 Hz
```

715 is 1.15 × 622 and 1210 is 1.10 × 1100, so the new table entry does what it
says. That row is blank on the old build.

### 4.4 What could make that walk lie

**The profile is fabricated and it is not a singer.** The document carries no
measured voice, so I wrote one into `localStorage` under `shane.profiles.v2`:
the demo bass fR1 values from `demo-fixture.ts:62` (a 650, o 450, u 350, i 300,
e 400, ɛ 500, ɑ 622), range C2 to E4, tessitura F2 to C3, passaggio A2 to D3.
**The seven fR2 values are mine, invented to plausible bass shapes** (i 2100,
e 1900, ɛ 1700, a 1250, ɑ 1100, o 900, u 800), because a derivation needs an
anchor's f2 and the demo fixture is an fR1-only snapshot. It was cleared when
the walk ended.

So the walk proves that the derivation fires on real notation and puts marks
where the vowels are. **It is not a claim about what any particular singer
sees**, and the derived Hz values above are only as good as the f2s I invented.

The before/after in §4.1 is the honest comparison: same fabricated profile both
times, and the only difference between the two builds is the loop.

## 5. The tests

Five new, in `analyze-score-adapter.test.ts`, in one describe block:

| case | what it asserts |
| --- | --- |
| i and u, no sung ɨ | `fR1.ɨ` is 409.5, which is 1.365 × 300, and `fR2.ɨ` is 1295.5; the anchors are untouched and `completeness.formants` is true |
| i without u | no `fR1.ɨ` and no `fR2.ɨ`; a missing anchor derives nothing |
| an implausible i | no `fR1.ɨ`, no `fR2.ɨ`, and §B.4 still drops the implausible reading itself |
| a sung ɨ | 430 and 1400 survive; the derived pair never displaces them |
| no anchors at all | the snapshot is byte-equal to what it was |

**One existing test was amended, and it is the interesting one.**
"keeps a marginal fR2, drops an absent one, and never guesses a missing f2"
feeds i, e, a and o. It asserted `fR2` equalled `{ i, e }`. It now also carries
`ɪ`, because [e] and [i] are [ɪ]'s anchors and this change derives it. The
assertion names the new entry, a comment says why it is there, and the test's
own subject is unharmed: [a]'s absent f2 and [o]'s missing one still contribute
nothing. I added an `fR1` assertion alongside it so the same fact is stated on
both channels.

**That amendment is the change's blast radius, stated plainly.** No other test
in the repository moved.

## 6. Gates

| gate | baseline | before | after |
| --- | --- | --- | --- |
| 1 phonology | `216 passed (216)` | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same | same |
| 4 web-test | `920 passed (920)` | `920 passed (920)` | **`925 passed (925)`** |
| 5 score-parser | `534 passed \| 5 skipped (539)` | same | same |

**Gate 4 moved, and it moved by exactly the five tests this item added.** 920
plus 5 is 925, the file count stays at 48, and nothing that was passing
stopped.

**Line 79 of `~/Downloads/ilya-ship.sh` must change** from

```
gate 4 web-test     "920 passed (920)"                          pnpm -C "$REPO" --filter @ilya/web test
```

to the same line with `925 passed (925)`. **I did not edit that file.** Until
it changes, the script reports gate 4 as `DEVIATED FROM BASELINE` and refuses
to stage anything.

Gate 3 is worth a note because it could have moved and did not. The wizard lost
two declarations and gained an import; `Vowel` and `CalibratedFormant` are both
still used there, so nothing went unused. The warning count is still 7.

## 7. Two things about shipping this, both yours

**The ship script refuses when untracked files exist, and five are already
there** before this memo makes a sixth. As of writing:

```
docs/sessions/drawing-n108-group-headers_r1_2026-09-02.png
docs/sessions/drawing-n108-three-choices_r1_2026-09-02.png
docs/sessions/n108-design-mockups_r1_2026-09-02.html
docs/sessions/n108-design-return_r1_2026-09-02.md
docs/sessions/n108-design-sources_r1_2026-09-02.md
```

They are the N.108 design session's, not mine, and I left them alone. The list
grew twice while I worked, so check it yourself rather than trusting this
paragraph. `sh ~/Downloads/ilya-ship.sh` will refuse at `ilya-ship.sh:45-51`,
before any gate runs, until every one of them is added or removed.

**`docs/memory/ENVIRONMENT.md` and `docs/memory/STATE.md` are modified in the
tree and neither change is mine.** ENVIRONMENT.md gains a "WHAT DESIGN CAN
READ" block dated today, from the N.108 design session; STATE.md was already
modified when I started and grew further while I worked. `git add -u` would
carry both into this commit. That is yours to decide, not mine to undo.

The commit message:

```
N.109: derived vowels reach the forecast
```

**I touched `.claude/launch.json` and put it back**, the same way N.105 did: a
preview entry to walk the production build, restored to its original bytes when
the walk ended. It should not appear in your diff. The command it ran:

```bash
pnpm --filter @ilya/web preview --port 4173
```

The score was staged into `apps/web/static/reader/` and
`apps/web/.svelte-kit/output/client/reader/`, both gitignored, and deleted
afterwards.

## 8. What I did not do

- **No user-facing string was added, changed, or removed. No French was
  coined.** The roster's Estimated label, its ≈ badge, and the broad-analysis
  legend are all untouched.
- **The stored profile shape is unchanged.** No migration, no new key, no
  derived value written anywhere.
- `derive`, `expectedF1`, and `DERIV_SOURCE` are byte-identical. The four
  formulae and the ratios that carry them were not touched.
- The overlay engine, `analyzeScore`, the plausibility guard, and
  `applyIghDivergence` are untouched.
- The roster markup, the pacifier chart's merged map, and the return path that
  strips estimated entries are untouched.
- No git was run. Nothing is staged, committed, or pushed.
- `docs/memory/STATE.md` is not updated. N.109 is not placed by you, so closing
  it is not mine to write.

## 9. NOT ESTABLISHED

- **What a walk on a real measured voice shows.** §4's profile is fabricated,
  and its seven fR2 values are mine. The ten events that gained a mark are the
  page's; the Hz on them are not a claim about anyone's voice. **A singer with
  a real capture may have anchors the plausibility guard rejects, and then
  those events go back to silence.** Nothing here measured how often that
  happens.
- **Whether a derived fR2 should fill in behind a sung vowel whose f2 read
  absent.** The loop is per channel, so a sung [ɨ] with no usable f2 now takes
  a derived fR2 while keeping its measured fR1. That is the literal reading of
  "a measured reading always wins over a derived one", applied to each channel,
  and it is what the roster cannot show you: the roster displays the direct
  sample whole and never mixes. It did not arise in the walk, because the
  fabricated anchors all carried f2. **If you want the two to agree there too,
  the fix is one condition and I will make it.**
- **Whether a derived value should be marked as derived in the forecast.** It
  is not. `VoiceProfileSnapshot` carries bare numbers per vowel with no
  provenance field, so the engine cannot tell a derived fR1 from a measured
  one, and a mark built on a derived vowel looks exactly like a mark built on a
  sung one. The roster says Estimated; **the score does not.** Nothing in the
  tree rules on whether it should, and I did not invent an answer.
- **Whether the broad-analysis legend should mention derivation.**
  `completenessOf` reads `formants: true` as soon as any fR1 exists, derived
  ones now included, so a singer who sang only [i] and [u] now gets a forecast
  the legend describes as resting on "your measured resonances"
  (`fit.broad.body`). That string is untouched and it is now slightly generous.
  It is a string change and a French coinage, so it is yours.
- **Whether [a] should derive on the roster.** §3's second call. It is one
  table entry, `derivations.ts:53`, and one line to remove.
- **How many singers this reaches.** NOT ESTABLISHED. Nothing in the tree
  records how many stored profiles are missing [ɨ], [ɪ] or [ʌ] while holding
  the anchors.

**NOT ESTABLISHED beats a complete invented answer.**
