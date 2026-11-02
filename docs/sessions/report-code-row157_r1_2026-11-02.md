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
