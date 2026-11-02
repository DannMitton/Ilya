# Report: QUEUE row 157, N.198's leftovers (Code, r1, 2026-11-02)

Brief: `docs/sessions/brief-code-row157-bog-v-lookthrough-retained-voicing-blurb_r2_2026-10-26.md`, with the ratified text `docs/sessions/ratified-retained-voicing-blurb_2026-10-26.md`. Branch **`cloud-lane-29`** (the session's prompt names it; the brief says a lane cut after row 152, which has merged). One report file; one commit per step; this file grows by a section per step. The brief's `path:line` citations predate row 175's rewrite of `engine.ts` (2291 to 2051 lines); every one is re-located below by name and by the line it has now.

---

## Step 0: measure, change nothing

### State

`cloud-lane-29` at `930ba192` (rows 172 and 71 on it, neither touches phonology, the pipeline's `finishLine`, or the blurb). Working tree clean. Nothing under `docs/memory/`. The measurement ran as a throwaway test through `processText` with the real dictionary (the pattern of `apps/web/src/lib/approval/ipa-corpus.approval.test.ts`), with a spy on `GraysonEngine.applyCrossWordAssimilation` to read each word's `ipaSurface` after the pass; the test was deleted, not committed.

### Baseline gates (before step 1)

| # | Command | Result |
|---|---|---|
| 1 | `pnpm --filter @ilya/phonology test` | 407 passed (13 files) |
| 2 | `pnpm --filter @ilya/dictionary test` | 248 passed (4 files) |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings |
| 4 | `pnpm --filter @ilya/web test` | 3895 passed, 1 skipped (3896) |
| 5 | `pnpm test:integration` | 98 passed (6 files) |
| 6 | `pnpm --filter @ilya/blurb test` | 148 passed (2 files) |
| 7 | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped (790) |
| 8 | `pnpm ratchets` | OK, nothing offered |

(The brief quotes Fable's older counts, 291 and 145 for gates 1 and 6; rows since have moved them. The gate numbering is inferred, as in rows 172 and 71.)

### Citations on this cut (brief's number to now)

| What | Brief | Now |
|---|---|---|
| `applyCrossWordAssimilation` | `engine.ts` around `:2160` | `engine.ts:1920` |
| hard boundary skipped | `:2173` | `:1932` |
| `viaV` | `:2183` | `:1943` |
| voiceless left final before в left untouched | `:2184` | `:1944` |
| `effInitial` through `initialPastV` | `:2185` | `:1945` |
| boundary #4 (`keepsVoicingAtBoundary4`, `skipFinalDevoicing = true`) | `:2186-2191` / `:2188` | `:1946-1951` / `:1948` |
| sibilant mergers | `:2193-2220` | `:1953-1980` |
| the four branches | `:2223-2243` | `:1982-2003` (voices `:1983-1986`, devoices `:1987-1991`, в devoices `:1991-1995`, voiced before voiced `:1996-2003`) |
| the final loop and `restoreBogFinish` | `:2248-2252` | `:2006-2012` |
| `transcribe`'s «бог» exception | `:1964-1979` | `:1725-1745` (its comment still says p. 242, at `:1726`) |
| `isVPhoneme`, `getInitialConsonant`, `isVoicedObstruent` | n/a | `:1893`, `:1859`, `:1883` |
| `BoundaryWord` | `:108-118` | `:108-120` (`cleanWord?: string; isProclitic?: boolean;` on one line, `:119`) |
| `engine.ts` import of `voicing-rule2` | `:15` | `:19` |
| `engine.ts` ceiling | 2291 | **2051** (file is 2051; the ceiling is `scripts/ratchets.json:13`) |
| `voicing-rule2.ts` | `:45-48`, `:63-76`, `:78-88` | `keepsVoicingAtBoundary4` `:45-48`, `initialPastV` `:63-76`, `restoreBogFinish` `:85-88` |
| `pipeline.ts` devoicing mark | `:850-876` | `:850-876` (holds; `finishLine` `:846`) |
| `pipeline.ts` ceiling | 925 | 925 of 925 (holds): the file has no headroom |
| `TranscribedWord` | `:108-142` | `:108-142` (holds; `isProclitic` `:117`, `skipFinalDevoicing` `:134`) |
| `pipeline.ts` cross-word call | `:329-330` | `:329` |
| tests pinning today | `voicing-rule2.test.ts:134-146`, `:129-131` | `:134-146`, `:128-131` (hold) |

### What the page shows today, before step 1

`ipaDisplay` is what Text draws (`pipeline.ts:879-882` builds it from the syllables); `ipaSurface` is the engine's word after the pass (`|` then `ipaUnderlying`); the ribbon is the last consonant of the word's `displayLog`.

| Phrase | Display today | `ipaSurface` after the pass | Ribbon, word 1's last consonant |
|---|---|---|---|
| Бог | `ˈbok` | `ˈbok` (hard) | ⟨г⟩ → [x], `bogException` |
| Бог там | `ˈbok ˈtɑm` | `ˈbok` | ⟨г⟩ → [x] |
| Бог мой | `ˈbox ˈmoj` | `ˈbox` | ⟨г⟩ → [x] |
| Бог один | `ˈbox ɑ ˈdʲin` | `ˈbox` | ⟨г⟩ → [x] |
| Бог даст | `ˈbox ˈdɑst` | **`ˈboɡ`** | ⟨г⟩ → [x] |
| Бог ли | `ˈbox lʲi ←` | **`ˈboɡ`** (clitic boundary) | ⟨г⟩ → [x] |
| Бог в доме | `ˈbox → ˈvdo mʲɪ` | **`ˈboɡ`** | ⟨г⟩ → [x] |
| Бог в траве | `ˈbok → ftrɑ ˈvʲɛ` | `ˈbok` (the bare в reads `f`) | ⟨г⟩ → [x] |
| небог | `ɲɛ bok` | `ɲɛbok` | ⟨г⟩ → [k], `finalDevoicing` |
| лес вдали | `ˈlʲɛs vdɑ ˈlʲi` | `ˈlʲɛs` | ⟨с⟩ → [s] ("stays [s]") |
| лес в доме | `ˈlʲɛs → ˈvdo mʲɪ` | `ˈlʲɛs` | ⟨с⟩ → [s] |
| лес в траве | `ˈlʲɛs → ftrɑ ˈvʲɛ` | `ˈlʲɛs` | ⟨с⟩ → [s] |
| лес вот | `ˈlʲɛs ˈvot` | `ˈlʲɛs` | ⟨с⟩ → [s] |
| лес в лесу | `ˈlʲɛs → ˈvlʲɛ su` | `ˈlʲɛs` | ⟨с⟩ → [s] |
| кот вдруг | `ˈkot ˈvdruk` | `ˈkot` | ⟨т⟩ → [t] |
| меж нас | `→ mʲɪʒ ˈnɑs` | `mʲɪʒ` | ⟨ж⟩ → [ʒ] (identity blurb only) |
| без Анны | `→ bʲɪz ˈɑn nɨ` | `bʲɪz` | ⟨з⟩ → [z] ("stays [z]", p. 206) |
| если б мог | `ˈjesʲ lʲib ← ˈmok` | `б`: `b` | (the б is its own word; «мог» → `ˈmok`, hard boundary) |
| сквозь нас | `ˈskvozʲ ˈnɑs` | `ˈskvozʲ` | ⟨з⟩ → [zʲ] ("softens before ⟨ь⟩", p. 169) |
| сад наш | `ˈsɑt ˈnɑʃ` | `ˈsɑt` | ⟨д⟩ → [t], `finalDevoicing`, `final-devoicing:д` blurb |
| Бог же | `ˈbox ʒɨ ←` | `ˈboɡ` | ⟨г⟩ → [x] |
| Бог бы | `ˈbox bɨ ←` | `ˈboɡ` | ⟨г⟩ → [x] |
| Бог в мае | `ˈbox → ˈvmɑ jɪ` | `ˈbox` | ⟨г⟩ → [x] |
| Бог был | `ˈbox ˈbɨɫ` | **`ˈboɡ`** (voiced before voiced) | ⟨г⟩ → [x] |
| Бог, мой | `ˈbok ˈmoj` | `ˈbok` (hard) | ⟨г⟩ → [x] |
| под водой | `→ pʌd vɑ ˈdoj` | `pʌd` | ⟨д⟩ → [d] ("stays [d]") |
| муж дома | `ˈmuʒ dɑ ˈmɑ` | `ˈmuʒ` | ⟨ж⟩ → [ʒ] (identity blurb only) |
| вокруг нас | `vɑk ˈruɡ ˈnɑs` | `vɑkˈruɡ` | ⟨г⟩ → [ɡ] ("stays [ɡ]") |

**What matches the brief's expectation exactly:** «Бог», «Бог там», «Бог в траве» display `ˈbok`; «Бог мой», «Бог один», «Бог даст», «Бог ли», «Бог в доме» display `ˈbox`; «лес вдали», «лес в доме», «кот вдруг» end in a voiceless consonant; «Бог даст», «Бог ли», «Бог в доме» have `ˈboɡ` as surface, which the display hides (`pipeline.ts:851` rebuilds the last syllable from the surface only when it differs from the underlying, and here it does not). **No «бог» line displays `ɣ` or `ɡ` today, so the brief's stop condition does not fire.**

**The contradiction step 1 removes, confirmed:** «Бог» alone pairs the IPA line `ˈbok` with the ribbon ⟨г⟩ → [x] and the blurb "In the word бог, ⟨г⟩ is exceptionally pronounced as [x]." (citation `(Grayson, pp. 145, 1…`; the page numbers run on). «Бог там» and «Бог в траве» do the same.

**The blurbs today** on the four words step 3 is for: «меж нас» shows the ⟨ж⟩ identity blurb only; «без Анны» ⟨з⟩ "stays [z]: the sound right after it is not soft"; «сквозь нас» ⟨з⟩ "softens to [zʲ] before the soft sign ⟨ь⟩" (the sign ⟨ь⟩ is its own entry after it, as the brief says); «если б мог»: the word before is «если», whose last consonant entry is ⟨л⟩. No blurb says why the voicing is kept.

### The approval corpus

`ipa-corpus.approval.test.ts` holds 47 lines (by the quoted-Cyrillic scan I ran; the file's own count is the authority). **One holds «бог»**: «Как дай вам Бог любимой быть другим.» → `ˈkɑɡ ˈdɑj ˈvɑm ˈbox lʲu ˈbʲi mʌj ˈbɨdʲ dru ˈɡʲim` (the N.198 report's one line). **No line holds a voiceless final before в plus a voiced obstruent**, by two patterns: a word ending п, ф, к, т, ш, с, х, ц, ч, щ before a word beginning вб, вг, вд, вж, вз, and the same before a bare «в» then б, г, д, ж, з. This confirms Fable's count of 0 lines moving under step 1, step 2, or both (confirmed before the change; the change itself is measured in steps 1 and 2).

### Where tests pin today's reading (to be rewritten, each shown failing first)

- `packages/phonology/tests/voicing-rule2.test.ts:134-146`: «Бог мой», «Бог один» → `ˈbox` (regression guards); «небог» → `ˈbok`.
- `packages/phonology/tests/voicing-rule2.test.ts:128-131`: «лес вдали» → `ˈlʲɛs`, to be rewritten in step 2.
- `packages/phonology/tests/engine.test.ts:55-59` and `consonants-clusters.test.ts:277-281`: «бог» alone through `transcribe` → `ˈbox` (the isolation path).
- `apps/web/src/lib/voicing-rule2.pipeline.test.ts`: the «Бог» pipeline lines, to be read before step 1.

### Not established in this step

- The eight gates' names (inferred).
- Whether a merged proclitic's or enclitic's ribbon can be opened in the Drawer (the brief's Fable question): answered in step 3, from a run.

---

## Step 1: «бог» as ruled

### What changed

- `packages/phonology/src/voicing-rule2.ts`: `restoreBogFinish` (`:85-88`) is replaced by **`finishBog(words, initialOf, isVoicedObstruent)`**, exported from the same file and importing nothing from the engine. For every word whose `lettersOf(cleanWord ?? cyrillic)` is «бог», whatever `skipFinalDevoicing` or its boundary says: a hard boundary, or no next word, makes the final `x`; otherwise the effective right initial is read as the pass reads it (the right word's own `ipaSurface` through `initialOf`; when it is `v` or `vʲ`, `initialPastV`), and a voiced obstruent there makes the final `ɣ`, anything else `x`. The segment it replaces is the word's last `ɡ`, `k`, or `x` (written as `[ɡkx]`, so no literal `ɡ` is typed into the regex). The old function's doc comment, which said "Only inside a line: before a hard boundary «бог» stays as it was", is replaced by the ruling's.
- `packages/phonology/src/engine.ts` (2051 to 2049 lines): the import at `:19` names `finishBog`; the final loop at `:2006-2010` calls `applyFinalDevoicing` alone, and one call `finishBog(words, (ipa) => this.getInitialConsonant(ipa), (c) => this.isVoicedObstruent(c));` follows it; the two-line comment folded to one. The comment at `:1726` says p. 144, not p. 242 (the word is not on p. 242; p. 144 gives the citation form). `applyVoicingToFinal` and `applyDevoicingToFinal` are not used (their maps have no ɡ to ɣ and no ɣ).
- **`apps/web/src/lib/voicing-log.ts` (new, 62 lines)** and `pipeline.ts` (925 to 901 lines): the brief says to put the log fix in the module step 3 creates and, if `pipeline.ts` has no headroom, "move the `:850-872` block into the module first and say so". `pipeline.ts` is at 925 of 925, so I moved it now: the block that rebuilds the last syllable from the surface and marks a devoiced final in the log (`pipeline.ts:850-876`) is `writeSurfaceToWord`, moved verbatim, and `finishLine` calls it in one line. Then the log fix: `followBogFinal` sets the `bogException` entry's `ipa` to the surface's final `x` or `ɣ`. So the Inspector's ⟨г⟩ → [ɣ] matches the IPA line, and the `bog-exception:г` template prints "[ɣ]" through its `{ipa}` (`data/blurb-composer.json`: "In the word бог, ⟨{char}⟩ is exceptionally pronounced as [{ipa}]."). `voicedToVoiceless` has no ɣ, so the devoicing mark cannot land on it; a test pins it.
- `scripts/ratchets.json`: `engine.ts` 2051 to 2049, `pipeline.ts` 925 to 901.

### Tests, each shown failing first or marked as a guard

`packages/phonology/tests/voicing-rule2.test.ts` (12 tests added, on hand-built words with `ipaUnderlying: 'ˈboɡ'`): 9 failed first against the unchanged engine: «Бог» alone (hard, nothing after), «Бог, мой», «Бог там», «Бог даст» and «Бог был» (one test), «Бог ли», «Бог же» and «Бог бы», «Бог в доме», «Бог в траве», and the `cleanWord` case. They pass as guards before the change: «Бог мой» and «Бог один», «Бог в мае» (the surface already said `ˈbox`), and the two «небог» pins. Hand-built «Бог» words fail first, as the brief predicted, because those tests read `ipaSurface`. «Бог ли» (clitic boundary before a sonorant, `ˈboɡ` before) failed first at engine level; the brief calls it a guard at the display level, where the syllables already said `x`.

`apps/web/src/lib/voicing-rule2.pipeline.test.ts` (15 tests added, through `processText` with the real dictionary): failing first, from the first run: «Бог», «Бог там», «Бог в траве», «Бог, мой», «Бог даст», «Бог в доме», «Бог был», and the Inspector ribbon test. My first expectations for «Бог ли», «Бог же», and «Бог бы» were `ˈbox`, `ˈboɣ`, `ˈboɣ` and failed for a reason of mine, not the code's: an enclitic shows inside its host's display (`ˈbox lʲi`, `ˈbox ʒɨ`), so I corrected the strings to `ˈbox lʲi`, `ˈboɣ ʒɨ`, `ˈboɣ bɨ` (the brief's own wording) and did not re-run those three against the unchanged code; step 0's table shows today's displays for them (`ˈbox lʲi ←`, `ˈbox ʒɨ ←`, `ˈbox bɨ ←`), so «Бог ли» is a guard and «Бог же», «Бог бы» change. Guards that pass before: «Бог мой», «Бог один», «Бог в мае», «небог» (`ɲɛ bok`).

The brief asks for pins on «Бог же» → `ˈboɣ ʒɨ`, «Бог бы» → `ˈboɣ bɨ`, «Бог в мае» → `ˈbox`, «Бог был» → `ˈboɣ`, and «Бог, мой» → `ˈbox`: all pinned.

### The approval corpus

`ipa-corpus.approval.test.ts` passes unchanged: **0 corpus lines move.** The one line holding «бог» («Как дай вам Бог любимой быть другим.») still ends its «Бог» in `ˈbox` (the next word begins with a sonorant).

### What a singer sees now, from the tests above

«Бог», «Бог там», «Бог, мой», «Бог в траве» now read `ˈbox`; «Бог даст», «Бог был», «Бог в доме», and an enclitic before a voiced obstruent («Бог же», «Бог бы») read `ˈboɣ`; «Бог ли» and «Бог в мае» stay `ˈbox`. The ribbon follows (`[x]` or `[ɣ]`) and the blurb says "[ɣ]" or "[x]" through `{ipa}`.

### Cross-site check (CONTRACT section 4)

Same number computed elsewhere: `transcribe`'s isolation path (`engine.ts:1725-1745`) writes [x] and is unchanged; after this step it agrees with the pass's finish in every position. `pipeline.ts`: the surface (`ipaSurface`), the last syllable, and the log entry now agree for «бог» (the three that the brief names). The only other reader of `ipaSurface` in `apps/web/src` is the merged-clitic branch of `finishLine` (`pipeline.ts:905-906` before the move, now earlier), which takes the surface for a host and its clitic; it reads the word's final as `ˈboɣ` or `ˈbox` as the pass left it. No reader the brief does not name.

### Gates, after step 1

| # | Result |
|---|---|
| 1 phonology | 419 passed (+12, `voicing-rule2.test.ts`) |
| 2 dictionary | 248 passed |
| 3 check | 0 errors, 12 warnings |
| 4 web unit | 3910 passed, 1 skipped (3911) (+15, `voicing-rule2.pipeline.test.ts`) |
| 5 root integration | 98 passed |
| 6 blurb | 148 passed |
| 7 score-parser | 785 passed, 5 skipped (790) |
| 8 ratchets | OK; `engine.ts` 2051 to 2049 and `pipeline.ts` 925 to 901, both taken |

---

## Step 2: the в look-through for a voiceless final

### What changed

- `packages/phonology/src/engine.ts:1944` (the brief's `:2184`): the line `if (viaV && !this.isVoicedObstruent(leftFinal)) continue;` is gone, and its sentence in the comment above now says "for a voiceless final too (row 157)". A voiceless left final before в is no longer skipped; its effective initial comes from `initialPastV` (`:1944`) as a voiced one's does, and the existing voicing branch (`:1983-1986`) voices it when that initial is a voiced obstruent. Nothing else in the four branches changed. `engine.ts` is 2048 lines (ceiling lowered from 2049).
- Removing the line reopened no type error (gate 3: 0 errors): `rightInitial` stays narrowed by the `continue` that ends the boundary #4 block (`:1946-1951`), which stays.

### Pins, each shown failing first

`packages/phonology/tests/voicing-rule2.test.ts`: the pin at `:128-131` ("a voiceless final before в + voiced obstruent is unchanged (decided in N.198: not extended)", «лес вдали» → `ˈlʲɛs`) is rewritten to the new reading, citing p. 251: «лес вдали» → `ˈlʲɛz`. Nine tests added. **Failed first against the unchanged engine** (four of the ten): «лес вдали» (the rewritten pin), «лес в доме», «кот вдруг», and the test of what the branch reaches through в. Pass before and after (guards): «лес в траве», a voiceless letter after the word's own в, «лес вот», «лес в лесу», «лес в мае», «лес в. доме» (a hard boundary after the bare в), «сад вдали», «слух был», «кров вдали».

`apps/web/src/lib/voicing-rule2.pipeline.test.ts` (through `processText` with the real dictionary), seven `it.each` rows: «лес вдали» → `ˈlʲɛz`, «лес в доме» → `ˈlʲɛz`, «кот вдруг» → `ˈkod` (failed first); «лес в траве», «лес вот», «лес в лесу» → `ˈlʲɛs`, «сад вдали» → `ˈsɑd` (guards).

### What the branch now reaches through в (pinned at engine level; the brief asks)

| Phrase | The first word, after | Reading |
|---|---|---|
| дух вдали | `ˈduɣ` | х to ɣ, the allophone `crossWordVoicingMap` already gives without в |
| отец вдали | `ɑˈtʲɛdz` | ц to dz |
| врач вдали | `ˈvrɑdʒʲ` | ч to dʒʲ |
| плащ вдали | `ˈplɑʃʲʃʲ` | щ unchanged (no entry in the map) |
| слух был | `ˈsɫuɣ` | the same allophone without в (the comment at the voicing branch) |
| кров вдали | `ˈkrof` | a left final в is unchanged: `v` is in neither consonant set, so it falls through to the final loop as before |

Whether the х to ɣ, ц to dz, ч to dʒʲ allophones at a word boundary are Grayson's: NOT ESTABLISHED; they predate this row.

### The approval corpus

**0 lines move.** `ipa-corpus.approval.test.ts` passes unchanged in gate 4, so no corpus line holds a voiceless final before в plus a voiced obstruent (step 0 found none by pattern; the test confirms it by output). The corpus is not re-approved.

### Leads, measured on this cut; nothing built (the brief's order)

- **A final в before a voiced obstruent still devoices:** «любовь дала» → `lʲu ˈbofʲ` and «кровь брата» → `ˈkrofʲ` (the final loop devoices the в as before; the ribbon says ⟨в⟩ → [fʲ] with the final-devoicing blurb). Dann's, under p. 251.
- **The Inspector after a cross-word voicing is a known gap, confirmed by run:** «кот бы» shows `⟨т⟩ → [t]` ("stays [t]") under `ˈkod`; «лес вдали» now shows `⟨с⟩ → [s]` ("stays [s]") under `ˈlʲɛz`; so do «лес в доме» (`ˈlʲɛz`), «кот вдруг» (`ˈkod`), and «дух вдали» (`⟨х⟩ → [x]` under `ˈduɣ`). The branches at `:1983-2003` set no log feature and the mark in `voicing-log.ts` (the block moved from `pipeline.ts:866-869`) marks devoicing only. `regressive-voicing:с` has no `{trigger}` in the template data. The symmetric mark, about ten lines, waits for Dann to see these lines.

### Gates, after step 2

| # | Result |
|---|---|
| 1 phonology | 428 passed (+9) |
| 2 dictionary | 248 passed |
| 3 check | 0 errors, 12 warnings |
| 4 web unit | 3917 passed, 1 skipped (3918) (+7) |
| 5 root integration | 98 passed |
| 6 blurb | 148 passed |
| 7 score-parser | 785 passed, 5 skipped (790) |
| 8 ratchets | OK; `engine.ts` 2049 to 2048, taken |

---

## Step 3: the blurb for a kept voicing

### What changed

- **(a) The engine marks the word** (`packages/phonology/src/engine.ts`, 2048 lines, unchanged by this step): at the boundary #4 branch (`:1946-1949`, where `keepsVoicingAtBoundary4` keeps the voicing and sets `skipFinalDevoicing`, `:1947`), `if (!viaV) leftWord.retainedVoicing = true;` on the same line; so the field is set in that one place only, and only when the right word's own first segment is the vowel or the sonorant (the brief's amendment 2). The pass starts every word clean (`word.skipFinalDevoicing = word.retainedVoicing = false;`, `:1924`), so a mark does not survive a second run on the same objects (a test pins it). `BoundaryWord` declares `retainedVoicing?: boolean` beside `isProclitic` (`:120`, one line). Both edits are line-neutral, because `engine.ts` has no headroom. `pipeline.ts`'s `TranscribedWord` gains the same optional field on the `isVowellessClitic` line (`:141`; 901 lines, unchanged).
- **(b) The log** (`apps/web/src/lib/voicing-log.ts`, now 81 lines): `markRetainedVoicing` finds the word's last consonant entry and sets `features.retainedVoicing = true`; `writeSurfaceToWord` (step 1) calls it. The module's header says why: such a word's surface equals its underlying one, so the block that marks a surface change skips it.
- **(c) The blurb package**: `packages/blurb/src/types.ts` gains `retainedVoicing?: boolean`; `packages/blurb/src/composer.ts` `deriveRule` returns `'retained-voicing'` after `silent`, `regressive-devoicing`, and `regressive-voicing`, and before `final-devoicing`, `genitive`, and `bog-exception` (`:248`). A word cannot carry both `retainedVoicing` and `finalDevoicing`: the pipeline test on «меж нас» shows its ⟨ж⟩ entry has `retainedVoicing` and neither `finalDevoicing` nor `voicingAssimilation`.
- **(d) `data/blurb-composer.json`**: twelve pairs, `retained-voicing:<letter>` for б, в, г, д, ж, з, in `processes` and in `implications` (inserted after each section's `final-devoicing:з`), citation `pp. 251–252` on both, the four ratified strings verbatim in both languages, the two French no-break spaces written as the six characters ` ` (never a literal), « d’un » with its U+2019. The test file reads them by code point. The file's existing 68 lines with a literal U+00A0 are untouched (the diff is 120 insertions and nothing else). **Static-data byte count (CONTRACT: say when something ships into `static/`): `data/blurb-composer.json`, which `apps/web/static/data/` links to, goes from 78,876 to 85,020 bytes (+6,144).** Whether an app already installed picks the new file up on its next online start is the loader's N.195 behaviour (it keeps the last good copy of each small file, `loader.ts` `BLURB_STORE_KEY`): NOT RUN.
- **The counts that moved**: `packages/blurb/tests/french-parity.test.ts` reads all templates (the brief says 209 to 221; row 175 had moved the count to 181, so it is **181 to 193**, the same 12 new pairs), and `tests/palatalization-comments.test.ts:151` pins the number of implications (41 after row 175; **47** with the six new ones). Gate 5 held the second one red until I read it; it is a count, not a reading, so I moved it with a comment.
- `data/blurb-composer.json`'s `bog-exception:г` template is untouched.

### Tests (each shown failing first)

- `packages/blurb/tests/retained-voicing.test.ts` (new, 16 tests): the 12 pairs verbatim and by code point; the rule order (`silent`, the two `regressive-*`, then `retained-voicing` before `final-devoicing` and `bog-exception`); each letter's composed blurb with the whole citation: ⟨ж⟩ `(Grayson, pp. 165, 174, 251–252)`, ⟨з⟩ `(Grayson, pp. 143, 251–252)`, ⟨б⟩ `(Grayson, pp. 144, 251–252)`, ⟨д⟩ `(Grayson, pp. 146, 251–252)`, ⟨г⟩ `(Grayson, pp. 145, 251–252)`, ⟨в⟩ `(Grayson, pp. 152, 251–252)`. Failed first: the 12-pair data, the code-point test, the rule-order test, and the six composed blurbs (all but the one that asserts a non-retained entry still derives `final-devoicing`, a guard).
- `packages/phonology/tests/voicing-rule2.test.ts` (7 added, engine level, hand-built words): marked, failing first: «меж нас», «без Анны», «сквозь нас» (one test), «если б мог», and the stale-run test. Guards (pass before): «сад наш» and «Бог мой» not marked; «под водой» and «без вас» not marked (through в) and «под водой» keeps `pʌd`; «муж дома» not marked; «меж. нас» (hard boundary) not marked.
- `apps/web/src/lib/voicing-rule2.pipeline.test.ts` (10 added, through `processText` with the real dictionary and the real blurb data): failing first: «меж нас», «без Анны», «если б мог» (the ⟨б⟩ entry, word 2), «сквозь нас», «вокруг нас» (each marked, the blurb says "it keeps its voicing as [ʒ|z|b|zʲ|ɡ]", the citation whole), the «меж нас» one-rule test, and the «сквозь нас» loses-its-soft-blurb test. Guards: «сад наш» keeps `final-devoicing:д` ("devoices to [t]"); «муж дома» keeps `regressive-voicing` and is not marked; «под водой» is not marked. An `en()` helper reads the blurb's English because `BlurbResult.blurb` is `BilingualBlurb | string` in the type (my first version failed gate 3 on it).

### Things the brief asks me to say

- **«сквозь нас»:** the ⟨з⟩ entry loses its present `soft` blurb ("softens to [zʲ] before the soft sign ⟨ь⟩") for the retained-voicing one, since `deriveRule` returns one rule. Confirmed by the pipeline test above. The sign ⟨ь⟩ is its own entry after it; the singer who taps it still gets the soft-sign blurb.
- **Lines that keep their voicing through в and get no blurb** (the brief's amendment 2, left as the brief says; a в-specific sentence would be new text, Dann's): «под водой» (measured: the ⟨д⟩ entry has no `retainedVoicing`), «без вас» (same, pinned at engine level), and, by the same rule, «из воды», «об воде» and any preposition or contraction directly before a в-word. The ratified sentence says "the next word begins with a vowel or a sonorant", and the singer sees «водой».
- **Reachable in the Drawer, from a run (the brief's Fable question):** yes, a merged proclitic's or enclitic's own ribbon opens. I ran the real page (Playwright, desk project, throwaway spec, not committed): for each of «меж нас», «без Анны», «если б мог», «сквозь нас», «вокруг нас», «близ нас», «средь нас» I clicked each word stack and opened the Analysis station. «меж» and «без» (shown "→ меж", "→ без") and «б» (shown "← б") each have their own stack and their own ribbon, and tapping ⟨ж⟩, ⟨з⟩, ⟨б⟩ there shows the retained-voicing blurb ("When ⟨ж⟩ ends a preposition or a particle like it does here, and the next word begins with a vowel or a sonorant, it keeps its voicing as [ʒ]. An ordinary word…"). «сквозь», «вокруг», «близ», «средь» show it on their own stack too. The host's stack (the stack of «нас», «Анны», «мог», and «если») shows no such blurb. So the blurb IS seen on Grayson's own p. 252 lines («меж нас», «без Анны», «если б мог»), not only on the four prepositions with their own stack.

### Cross-site line (CONTRACT section 4)

`deriveRule`'s order (`composer.ts:248`) is the one place the new rule is ranked; `data/blurb-composer.json` is the only data; `french-parity.test.ts` covers the new keys with its three checks (a French for each, the same placeholders and citation, no em dash). The merged proclitic and enclitic display (`pipeline.ts` `finishLine`, the clitic merge) reads `ipaSurface` and `rightBoundary`, neither of which this step changes. `boundaries.ts` is untouched.

### Gates, after step 3

| # | Result |
|---|---|
| 1 phonology | 435 passed (+7) |
| 2 dictionary | 248 passed |
| 3 check | 0 errors, 12 warnings |
| 4 web unit | 3927 passed, 1 skipped (3928) (+10) |
| 5 root integration | 98 passed (the implications pin 41 to 47, same count of tests) |
| 6 blurb | 164 passed (+16: the new file's 16; `french-parity.test.ts`'s count changed 181 to 193, same number of tests) |
| 7 score-parser | 785 passed, 5 skipped (790) |
| 8 ratchets | OK, nothing offered |

---

## Step 4: tests, gates, and what is left

No code changed in this step: it is the proof and the answers the brief asks for.

### The eight gates, before row 157 and after step 3 (the tree this report describes)

| # | Gate | Before (step 0) | After (step 3) | Moved by |
|---|---|---|---|---|
| 1 | `pnpm --filter @ilya/phonology test` | 407 | 435 | +12 `voicing-rule2.test.ts` (step 1), +9 (step 2), +7 (step 3) |
| 2 | `pnpm --filter @ilya/dictionary test` | 248 | 248 | unmoved |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings | 0 errors, 12 warnings | unmoved |
| 4 | `pnpm --filter @ilya/web test` | 3895 passed, 1 skipped | 3927 passed, 1 skipped | +15 (step 1), +7 (step 2), +10 (step 3), all in `voicing-rule2.pipeline.test.ts` |
| 5 | `pnpm test:integration` | 98 | 98 | unmoved: one pin's number changed, `tests/palatalization-comments.test.ts:151`, 41 to 47 |
| 6 | `pnpm --filter @ilya/blurb test` | 148 | 164 | +16, `packages/blurb/tests/retained-voicing.test.ts` (new); `french-parity.test.ts`'s count 181 to 193 moves no test |
| 7 | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped | 785 passed, 5 skipped | unmoved |
| 8 | `pnpm ratchets` | OK | OK | `engine.ts` 2051 to 2048, `pipeline.ts` 925 to 901, both lowered |

The brief expected gates 2, 3, 5, 7, 8 not to move and 1, 4, 6 to move. Gate 5's count of tests did not move; the one number it pins did. That is the second place where an existing test knew a count the new pairs change; the first is `french-parity.test.ts`, which the brief names (its 209 to 221, here 181 to 193). Gate numbers are inferred, as in rows 172 and 71.

**Playwright, desk project:** `core-loop` and `typed-hyphens` pass (22 tests, including the Inspector's ribbon tests). The throwaway run in step 3 opened the real Inspector on seven phrases. The failures that exist on the cut independently of this row (`glue-typed-marks`, `insights-page:95`, `loupe-header:47`, `print-pages:20`, `singer-paths:169`, the HEIC spec, `input-views:134` on the phone project, and `relining:95` which row 172 raised) are named in row 172's reports and were not touched.

### What a singer sees on an already-seated song (the brief's section 4, `Pairing.ipa`)

The Markup page does not read `doc.pairings` as stored. It reads `shownPairings = refreshPairings(doc.pairings, slotQueue)` (`+page.svelte:491`, the same function at `:2478` when phrase ends change). `refreshPairings` (`pairings.ts:448-480`) compares a stored syllable pairing with the slot the engine now gives for the same word: where `origin.word` is the same and the IPA differs, the shown IPA is the slot's (N.119b). I checked that function directly with a throwaway test (not committed): a «Бог» pairing stored as `ˈbok` with `origin.word` set shows `ˈbox` against the new slot; **a pairing stored without `origin.word` keeps `ˈbok`**, "left exactly as it was stored" (`pairings.ts:444-446`, deliberate). So for a song seated before this ships, Markup shows the new reading wherever the stored pairing carries `origin.word`, and the old one where it does not, until the singer reseats; Text shows the new reading at once. NOT RUN in the browser: which stored songs carry `origin.word` (I did not open one); `pairings.ts` is lane 28's, and I read it and changed nothing.

### Learn and the Guide

I grepped `LearnContent.svelte`, `GuideContent.svelte`, and `i18n.ts` for «бог», `[box]`, `boɣ`, and "retain": no sentence about «бог» or a kept voicing exists in the Guide or in `i18n.ts`; the hits for "retain" are other verbs (a hardness that is retained, a session's work retained). Learn's rule 2 sentence (`LearnContent.svelte:3899`) already states the kept voicing ("sonorants and vowels beginning the next word allow a…"), and still reads right after this row. No Learn or Guide sentence was changed (strings are Dann's).

### The leads, for the desk to take to Dann (nothing built for any of them)

1. A final в before a voiced obstruent still devoices («любовь дала» `lʲu ˈbofʲ`, «кровь брата» `ˈkrofʲ`), under p. 251.
2. The Inspector after a cross-word voicing says nothing: «кот бы», «лес вдали», «лес в доме», «кот вдруг», «дух вдали» show the unvoiced letter's "stays [x]" blurb under the voiced sound. The symmetric mark, about ten lines, waits for Dann to see these lines.
3. Prepositions before в plus a vowel or a sonorant keep their voicing with no blurb («под водой», «без вас», «из воды»); a в-specific sentence would be new text.
4. The x to ɣ, ц to dz, ч to dʒʲ allophones at a word boundary: Grayson's or not, NOT ESTABLISHED.
5. «Бог» in Grayson beyond p. 144's citation form: NOT ESTABLISHED; the ruling rests on Dann's general knowledge of Russian orthoepy.

### Where would this wall a singer in? (Fable's question, answered from the runs)

- **«бог» sounding as unexpected with no blurb to say why.** [boɣ] before a voiced obstruent: the IPA line says `ˈboɣ` and the ribbon says ⟨г⟩ → [ɣ], and the existing blurb prints "In the word бог, ⟨г⟩ is exceptionally pronounced as [ɣ]." It states the fact and does not say why the sound changed before this next word; the reason is Dann's ruling on general orthoepy, and no source line is cited beyond p. 144. This is the case where a singer would most likely wonder.
- **«лес вдали» voiced across в with the ribbon still saying `⟨с⟩ → [s]`.** Yes, confirmed by run (step 2's leads): the line sings `ˈlʲɛz` and the ribbon and blurb still say [s] and "stays [s]".
- **A kept-voicing blurb on a word the singer did not know was a preposition.** «сквозь», «вокруг», «близ», «средь» show "When ⟨з⟩ ends a preposition or a particle like it does here…" on a word whose preposition-hood the singer may not know; the sentence tells them, which is its purpose. «сквозь» also loses its "softens before ⟨ь⟩" sentence for that blurb (the sign's own entry still has its own).
- **Whether a merged proclitic's or enclitic's ribbon opens:** it does, from a run (step 3): «меж», «без», «б» each have their own stack and ribbon, so the blurb is seen on Grayson's own p. 252 lines.

### What I could not establish

- The eight gates' names and the ship script's order (inferred).
- Which stored songs carry `origin.word` (so which keep `ˈbok` on Markup).
- Whether an installed app fetches the larger `blurb-composer.json` on its next online start (N.195's loader; not run).
- A browser walk of «Бог даст» to see `ˈboɣ` and the ribbon: the pipeline test pins the log entry, and the throwaway browser run covered the kept-voicing blurbs, not the [ɣ] ribbon.
- What Grayson prescribes for «бог» beyond p. 144; the allophones' source (above).

### Commits on `cloud-lane-29` for this row

Step 0 `c16b9b81`, step 1 `9a2548c5`, step 2 `d1f54ab1`, step 3 `c7e95cf6`, step 4 (this commit).
