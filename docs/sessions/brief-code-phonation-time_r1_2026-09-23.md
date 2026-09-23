# CODE BRIEF. Phonation time in Insights (N.123, first figure)

**Written by the desk 2026-09-23 01:15. For Claude Code, working in `~/Desktop/ilya-rewrite` on branch `Shane`.**

**Serves N.123** (the aggregation layer's figures, IN the release, `OPEN.md` N.123: "per-pitch and per-vowel phonation time in seconds" is the first figure). Dann's instruction, 2026-09-22 23:34: *"We need to wire up total phonation time and seat it in Insights."* Every string and design choice below is ruled or marked DESK DEFAULT; the full record is `docs/sessions/insights-phonation-time_r1_2026-09-22.md`.

**NOT ESTABLISHED beats a complete invented answer.** Where this brief cites a `path:line`, re-read it before relying on it; the tree wins over this brief.

## Rules of the house

- Do not commit, stage, or run any git command that writes. Dann ships with `sh ~/Downloads/ilya-ship.sh "N.123: ..."`. Tell him which new files need `git add` first.
- Run all five gates and report each against its baseline.
- `WRITTEN` is not `DONE`: report the build as written; it is done when Dann walks it.
- Canadian spelling, no em dashes, in comments and in your report.

## What exists (desk reading, 2026-09-22/23)

- `scoreMetrics` (`apps/web/src/lib/shane/score-metrics.ts:118-124`) returns phonation totals, Pacheco's tessitura, the resolved tempo, `seconds` (from `secondsFor`, `packages/score-parser/src/phonation.ts:444`), and fold cycles. **`VoiceProfilePane.svelte:734-766` computes it and deliberately does not render it** (`:751-757`), waiting on signed-off wording. The wording is now signed off.
- `aggregatePhonation` (`phonation.ts:298`) sums sounding time per pitch (`byPitch`), per vowel (`byVowel`, only with a resolver), and in total, in quaver-equivalents; rests are counted and excluded (`:211-212`, `:360-361`). Untrusted bars are reported, not dropped (`PhonationTrust`, `:221-236`).
- `secondsFor` returns `undefined` when the score states no tempo, and a `secondsRange` when the tempo is inferred (`phonation.ts:411-427`, `:444-499`). **Never print a point where it gives a range; never invent a tempo.**
- Insights reads the performance-order score and one voice snapshot (`insights.ts:111-118`); `profile.passaggio` gives `primo` and `secondo` as `Pitch` (`insights.ts:180-188`).
- **Caveat to check:** `VoiceProfilePane.svelte:758-760` says the per-vowel split is provisional while `#` occupies a syllable slot. Establish whether that is still true and report it. If it is, the per-vowel list carries a one-line caveat or waits; say which you did.

## What to build

### 1. A "Phonation time" section in Insights (Dann's option 1, ruled 2026-09-22 23:45)

Three parts, in this order:

1. **The headline sentence** (string 2 or 3 or 4, by tempo state). `{phonation}` is total sounding time in seconds; `{length}` is the piece's **elapsed** time at the same tempo, **rests included** (not computed today; add it beside the phonation total, same trust handling). Format minutes and seconds as `2 min 40 s`. `{tempo}` as the resolved tempo is shown elsewhere in Ilya, for example `♩ = 72`.
2. **One horizontal bar in three zones, by the singer's own passaggi:** below the primo, between, above the secondo, each labelled (strings 5 to 7) with its share of phonation time as a percentage. **DESK DEFAULT for boundaries:** below means MIDI < primo; above means MIDI > secondo; between is everything else, both passaggi included. State this in a code comment. **If either passaggio is missing,** draw no bar and print the existing string `insights.fit.crossingsUncounted` ("Not counted without both passaggi") or its nearest equivalent; do not invent passaggi.
3. **Time per vowel**, most phonation time first (heading string 8), in seconds, IPA as the resolver gives it. **Mark the vowels that carry a finding**; DESK DEFAULT: the same mark the findings list uses for its vowel tag, or bold if none exists. Report what you chose.

**Placement:** Insights page one is fixed at one page. Propose where the section sits (after the fit table is the desk's guess), and if page one cannot hold it, put it at the top of page two and say so. Do not shrink anything else to make room.

### 2. Seconds inside each finding (Dann's option 2, "only as a complement to option 1's claims")

Each finding already carries `massQuavers` summed over its instances (`insights.ts:99`). Convert with `secondsFor` and append string 9 after the finding's instance line. Same tempo states: a range when inferred; omit the clause when there is no tempo.

### 3. Strings. EN and FR, all RATIFIED by Dann 2026-09-23 unless marked

Add under the `insights.phonation.*` prefix (DESK DEFAULT names; rename if the file's conventions say otherwise). **French typography:** narrow no-break space (U+202F) before `;`, `:`, `?`, `!`, as the file already does (for example `i18n.ts:1502`, ` :`; match whichever the file uses).

| # | purpose | English | French |
|---|---|---|---|
| 1 | heading | Phonation time | Temps de phonation |
| 2 | headline, encoded or singer tempo | You phonate for about {phonation} of this {length} piece, at {tempo}. | Votre phonation occupe environ {phonation} des {length} de la pièce, à {tempo}. |
| 3 | headline, inferred tempo | Your phonation takes about {low} to {high} of this piece, at the speed {tempoWord} usually means. | Votre phonation occupe environ {low} à {high} de la pièce, au tempo qu'indique habituellement {tempoWord}. |
| 4 | no tempo | This score states no tempo, so phonation time cannot be given in seconds. | Cette partition n'indique aucun tempo ; le temps de phonation ne peut donc pas être donné en secondes. |
| 5 | zone | Above your secondo passaggio | Au-dessus de votre secondo passaggio |
| 6 | zone | Between your passaggi | Entre vos passaggi |
| 7 | zone | Below your primo passaggio | Au-dessous de votre primo passaggio |
| 8 | per-vowel heading | By vowel, most phonation time first *(English DESK DEFAULT mirror)* | Par voyelle, par temps de phonation décroissant |
| 9 | inside a finding | {n} instances, {seconds} of phonation in all. | {n} occurrences, {seconds} de phonation en tout. |

**Written now, NOT SHOWN:** the tempo pointer, *"You may assign tempi manually using the Loupe."* / « Vous pouvez indiquer vos tempi vous-même dans la loupe. » (French proposed, not ratified). Add the key, render it nowhere, and leave a comment: it shows only once the Loupe carries a tempo control (N.120, ruled 2026-09-23 to live in the Loupe). **Printing it now would send a singer to a control that does not exist.**

Row 3's `{low}`/`{high}` apply to the phonation figure; if `{length}` is also a range, DESK DEFAULT: drop "of this {length} piece" from the inferred form, as written. Row 4 replaces the whole section's numbers; the zone bar and per-vowel list may still print as SHARES and ORDER without seconds (percentages and ranking do not need a tempo). Report what you did.

## Done when

- Gates at baseline.
- A report listing: every file touched with `path:line`; the `#` caveat's status; the placement; the three tempo states each observed on a real score (encoded, inferred, none) with what printed; the untrusted-bar case; a score with no typed passaggi.
- Dann walks it in both languages on the alias.

## Return

A memo of at most 300 words with the list above and **a section headed "NOT ESTABLISHED"**. Save it as `docs/sessions/memo-code-phonation-time_r1_<date>.md`.
