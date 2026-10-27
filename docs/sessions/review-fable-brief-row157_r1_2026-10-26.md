# Fable review: brief for Code, QUEUE row 157 («бог» as ruled, the в look-through for a voiceless final, the retained-voicing blurb), r1 (2026-10-26)

Brief reviewed: `brief-code-row157-bog-v-lookthrough-retained-voicing-blurb_r1_2026-10-26.md`, md5 `cb17e690f2ee7b18cd45149155ac109e` (checked in `/root/review-row157/` 2026-10-26). Ratified strings: `ratified-retained-voicing-blurb_2026-10-26.md`, md5 `80e954f303c9bc427bf6aabfc107b62f`, two U+00A0 at offsets 1575 (before the colon) and 1829 (before the semicolon), one U+2019 in « d’un », read by code point; not changed. Repository read at `Shane` `54c01bc3` (N.198 shipped), working tree clean before and after. Every `path:line` below was read by Fable this session, or comes from a run made this session; NOT ESTABLISHED beats a complete invented answer.

What was run. (1) `pnpm test:phonology`: 9 files, 291 tests, green. `pnpm test:blurb`: 2 files, 145 tests, green. (2) A temporary vitest file under `apps/web/src/lib/` (deleted afterwards; `git status` clean) that loaded the real dictionary the way `ipa-corpus.approval.test.ts:75-99` does and ran `processText` on the brief's 21 step 0 lines and 54 more, first through the real `applyCrossWordAssimilation`, then through a copy of `engine.ts:2160-2253` carrying step 1 exactly as the brief words it (the «бог» pass after the final loop, in two variants: "begins with в" judged by the right word's surface, and by its letters), step 2 (the `continue` at `:2184` removed), step 3(a) (`retainedVoicing` set where `keepsVoicingAtBoundary4` keeps the voicing), and the two together. The copy was checked against the real method on every probe line and on the 40 corpus lines: 0 differences. For each line the probe recorded the display IPA, the engine's `ipaSurface`, the boundary, the branch taken, the last consonant entry of the transcription log with its features, and the blurb `buildDisplayLog` attaches. It also rendered the approval corpus under each configuration against `apps/web/src/lib/approval/__approved__/ipa-corpus.txt`, ran `formatCitations` on the ratified citations with each letter's identity citation, and printed the transcription logs of «сквозь», «любовь», «Бог», «вслед». Output: `/root/review-out/probe-row157.txt` (1826 lines) and `/root/review-out/probe-row157-steps.txt`. (3) Grayson read in the text layer supplied (`grayson-pp144-248-251-252_textlayer.txt`), with the N.198 review's font map: p. 144 prints «бог» as `/anw/`, that is /box/, once; pp. 248, 251, 252 as the N.198 review decoded them. Nothing new on «бог» there.

## Verdict: SEND WITH AMENDMENTS

The three rulings are built by the steps as worded: the probe gives [box] and [boɣ] in every position the ruling names, [lʲɛz] for «лес вдали», and `retainedVoicing` on exactly the words the blurb is for, with the corpus moving 0 lines under step 1, step 2, or both. What needs amending is the brief's picture of today (amendment 1: the singer already sees `ˈbox` for «Бог даст» and «Бог ли», so the failing-first set and the "[bog]" claim are wrong), one trigger step 3 fires on that the ratified sentence does not cover (amendment 2), a citation line that renders as "pp. 251, 251–252" (amendment 3), a test the brief does not know it must change (amendment 4), what step 2 reaches beyond the six pins (amendment 5), the mechanics step 1 leaves to Code (amendment 6), an Inspector gap step 2 widens (amendment 7), and cites (amendment 9).

### The cites, checked against `54c01bc3`

Hold: `engine.ts:2173`, `:2175-2176`, `:2183`, `:2184`, `:2185`, `:2186-2191`, `:2188`, `:2193-2220`, `:2223-2226`, `:2227-2230`, `:2231-2235`, `:2236-2243`, `:2248-2252`, `:1959-1983`, `:1964` (the p. 242 comment), `:1974-1978` (the log entry: `ipa = 'x'` at `:1976`, `bogException` `:1977`, `finalDevoicing = false` `:1978`), `:2138`, `:2145`, `:1301`, `:108-118`, `:1939`, `:1951`; `voicing-rule2.ts:45-48`, `:63-76`, `:85-88`; `pipeline.ts:851`, `:866-869`, `:823`, `:585`; `composer.ts:266-267`, `:330-368`, `:90-119`; `types.ts:60-91` (index signature at `:90`); `InspectorPanel.svelte:1382-1384`; `blurb-composer.json:1059-1118`, `:1309-1318`, `:1311`, `:1315`; `voicing-rule2.test.ts:134-146`; `consonants-clusters.test.ts:277`; `boundaries.ts:59`; `ratchets.json:13` (engine 2291, and `wc` gives 2291) and `:23` (pipeline 925, and `wc` gives 925); `LearnContent.svelte:3889`; the ratified file's md5.

Off: `engine.ts:2161` for "starts from `ipaUnderlying`": `:2161` is the comment, the assignment is `:2163`. `pipeline.ts:850-872`: the block closes at `:876`. `pipeline.ts:112-135` for `TranscribedWord`: the interface is `:108-142`. `composer.ts:219-224` for `deriveRule`'s order: `:218-223`, and the first test at `:218` is `silent`, before the five the brief lists. `pairings.ts:113` and `:124`: the `ipa: string` fields are `:114` and `:125`. `engine.test.ts:55-57`: the test is `:55-59`. The test that pins `ˈlʲɛs` for «лес вдали» (the brief could not locate it) is `packages/phonology/tests/voicing-rule2.test.ts:129-131`.

Answers to the brief's NOT READ lines, from the tree: `applyVoicingToFinal` (`:2138`) reads `crossWordVoicingMap` (`:2043-2053`), which maps `x → ɣ`, `xʲ → ɣʲ`, `k → ɡ`, `ts → dz`, `tʃʲ → dʒʲ`, and never `ɡ → ɣ`; `applyDevoicingToFinal` (`:2145`) reads `crossWordDevoicingMap` (`:2056-2064`), which has no `ɣ`; `voicedToVoiceless` (`:1301-1312`) has no `ɣ`, so `applyFinalDevoicing` (`:1493-1512`) returns a surface ending in `ɣ` unchanged and the block at `pipeline.ts:866-869` cannot mark `finalDevoicing` on it. The soft-final log entry of «сквозь» is `⟨з⟩ → [zʲ]` with the sign `⟨ь⟩ → []` as its own entry (probe); so "the last consonant entry" is the right thing to look for.

### The premise, measured (probe, real engine, `54c01bc3`)

The display is what `processText` returns as `ipaDisplay`; the surface is the engine's `ipaSurface` after the pass; the log is the word's last consonant entry.

| line | display today | surface today | log entry today | brief said |
|---|---|---|---|---|
| Бог | ˈbok | ˈbok (hard) | ⟨г⟩ → [x], `bogException` | ˈbok, agrees |
| Бог там | ˈbok ˈtɑm | ˈbok | ⟨г⟩ → [x], `bogException` | ˈbok, agrees |
| Бог мой | ˈbox ˈmoj | ˈbox | [x] | ˈbox, agrees |
| Бог один | ˈbox ɑˈdʲin | ˈbox | [x] | ˈbox, agrees |
| Бог даст | **ˈbox** ˈdɑst | ˈboɡ (skip) | [x] | ˈboɡ: wrong at the display |
| Бог ли | **ˈbox lʲi** ← | ˈboɡ (clitic) | [x] | ˈboɡ: wrong at the display |
| Бог в доме | **ˈbox** → ˈvdo mʲɪ | ˈboɡ (skip) | [x] | not run; same as «Бог даст» |
| Бог в траве | ˈbok → ftrɑ ˈvʲɛ | ˈbok (devoiced) | [x] | not run |
| небог | ɲɛ bok | ɲɛbok | ⟨г⟩ → [k], `finalDevoicing` | k, agrees |
| лес вдали | ˈlʲɛs vdɑ ˈlʲi | ˈlʲɛs | [s] | agrees |
| лес в доме | ˈlʲɛs → ˈvdo mʲɪ | ˈlʲɛs | [s] | agrees |
| лес в траве | ˈlʲɛs → ftrɑ ˈvʲɛ | ˈlʲɛs | [s] | agrees |
| лес вот | ˈlʲɛs ˈvot | ˈlʲɛs | [s] | agrees |
| лес в лесу | ˈlʲɛs → ˈvlʲɛ su | ˈlʲɛs | [s] | agrees |
| кот вдруг | ˈkot ˈvdruk | ˈkot | [t] | agrees |
| меж нас | → mʲɪʒ ˈnɑs | mʲɪʒ (clitic, skip) | ⟨ж⟩ → [ʒ], no feature | agrees |
| без Анны | → bʲɪz ˈɑn nɨ | bʲɪz (clitic, skip) | ⟨з⟩ → [z], no feature | agrees |
| если б мог | ˈjɛs lʲib ← ˈmok | б: b (soft, skip) | ⟨б⟩ → [b], no feature | agrees |
| сквозь нас | ˈskvozʲ ˈnɑs | ˈskvozʲ (soft, skip) | ⟨з⟩ → [zʲ], no feature | agrees |
| сад наш | ˈsɑt ˈnɑʃ | ˈsɑt | ⟨д⟩ → [t], `finalDevoicing` | agrees |
| муж дома | ˈmuʒ dɑ ˈmɑ | ˈmuʒ (skip, voiced before voiced) | ⟨ж⟩ → [ʒ], no feature | agrees |

Why «Бог даст» and «Бог ли» display `ˈbox` while the surface holds `ɡ`: `transcribe` rewrites the last syllable to `box` (`engine.ts:1969-1972`); the display is built from the syllables (`pipeline.ts:879-882`), and the syllable is rebuilt from `ipaSurface` only when the surface differs from `ipaUnderlying` (`:851`). For these two it does not differ (`ˈboɡ` both), so the syllable keeps its `x`. `ipaSurface` reaches a singer nowhere else: its only readers are `:851-859` and the vowelless-clitic branch at `:905-906` (grep of `apps/web/src` for `ipaSurface`: `pipeline.ts` only). So the "[bog] the ruling forbids" has never displayed; what displays today and the ruling forbids is `ˈbok` for «Бог» alone, «Бог там», «Бог в траве», and `ˈbox` where the ruling wants `ˈboɣ` («Бог даст», «Бог в доме», and also «Бог же», «Бог бы», «Бог был», «Бог знает»). Step 0's stop condition cannot fire: nothing ends in `ɣ` today. Also today, and the Inspector contradiction step 1 removes: «Бог» alone shows the IPA line `ˈbok` and the ribbon `⟨г⟩ → [x]` with the blurb "exceptionally pronounced as [x]" `(Grayson, pp. 145, 144)`.

### Step 1, step 2, and step 3(a) as worded, measured (probe, the copied method)

Step 1, every «бог» position: alone `ˈbox`; before punctuation («Бог.», «Бог, мой») `ˈbox`; last word («о Бог») `ˈbox`; vowel («Бог один», «Бог и я») `ˈbox`; sonorant («Бог мой») `ˈbox`; voiceless («Бог там», «Бог с нами») `ˈbox`; voiced obstruent («Бог даст», «Бог был», «Бог знает») `ˈboɣ`; clitic boundary before a sonorant («Бог ли») `ˈbox`; clitic boundary before a voiced obstruent («Бог же», «Бог бы») `ˈboɣ`; в + voiced («Бог в доме») `ˈboɣ`; в + voiceless («Бог в траве») `ˈbox`; в + sonorant («Бог в мае») `ˈbox`; «небог» `ɲɛ bok`; «Богом» unchanged. The two ways of judging "the right word begins with в" (surface after the loop, letters) give the same display on every probe line. Corpus: 0 of 40 lines move; «Как дай вам Бог любимой» keeps `ˈbox`. The existing tests: `engine.test.ts:55-59` and `consonants-clusters.test.ts:277-281` run `transcribe` and `transcribeWord` (the isolation path, untouched by step 1); `voicing-rule2.test.ts:134-146` and the pipeline «Бог» cases (`voicing-rule2.pipeline.test.ts:150-159`) assert `x` before sonorants and vowels and the corpus line: all stay green.

Step 2, as worded: «лес вдали» `ˈlʲɛz`, «лес в доме» `ˈlʲɛz`, «кот вдруг» `ˈkod`, «кот в доме» `ˈkod`, «нос вдали» `ˈnoz`, «глас вдали» `ˈɡɫɑz`; «лес в траве», «лес вот», «лес в лесу», «лес в мае», «лес в. доме» (hard after в) `ˈlʲɛs`; «сад вдали», «сад в доме» `ˈsɑd`, «сад в траве» `ˈsɑt`. Corpus: 0 of 40 move (the brief expected "small and not zero"; the grep for a voiceless final before в plus a voiced obstruent finds no corpus line). What else it reaches is amendment 5.

Step 3(a): `retainedVoicing` is set on «меж», «без», «б», «ж» («если ж он»), «сквозь», «вокруг», «близ», «из», «об», and on «под» in «под водой» (amendment 2); not on «сад» («сад наш», `finalDevoicing`), not on «муж» («муж дома», the voiced-before-voiced branch), not on «Бог». `keepsVoicingAtBoundary4` is called at `engine.ts:2187` and nowhere else (grep); `initialPastV` at `:2185` only; `restoreBogFinish` at `:2250` only; the import is `:15`. The object the engine mutates is the one `finishLine` reads: `applyCrossWordAssimilation(transcribedLines.flat())` (`pipeline.ts:329`) hands the engine the same word objects `finishLine(transcribedLines[i])` (`:330`) then reads (`flat()` copies references, not objects), and the display changes in the probe («сад наш» `ˈsɑt`) can reach `:851` by no other route. `deriveRule`'s order holds: `finalDevoicing` is set only at `pipeline.ts:869`, inside the block that runs when `ipaSurface !== ipaUnderlying` (`:851`), and the boundary #4 branch (`:2186-2190`) `continue`s without touching the surface, so a word with `retainedVoicing` has surface equal to underlying and `:869` never runs for it; the probe shows no word carrying both. `formatCitations(['p. 251', 'pp. 251–252'])` gives `(Grayson, pp. 251, 251–252)` (amendment 3). `packages/blurb/tests/french-parity.test.ts:28-30` pins the pair count at 209 (amendment 4); `blurb.test.ts` uses its own fixture data and enumerates nothing from the file; `sources.test.ts` scans the JSON for "Author Year" cites only.

## Amendments, ranked

### 1. Step 0 and step 1 describe a today that is not on the screen: «Бог даст» and «Бог ли» already display `ˈbox`

Evidence. The premise table above. `ipaSurface` holds `ˈboɡ` for both, and no singer-facing surface reads it: the display is built from the syllables (`pipeline.ts:879-882`), which `transcribe` already rewrote to `box` (`engine.ts:1969-1972`), and the rebuild from `ipaSurface` runs only when it differs from `ipaUnderlying` (`:851`). So the "failing first" list in step 1 is wrong in one entry («Бог ли» → `ˈbox` passes today through `processText`) and right by accident in another («Бог даст» → `ˈboɣ` fails today because the display is `ˈbox`, not `ˈboɡ`). The [bog] the ruling forbids has never displayed. What displays today against the ruling is `ˈbok` («Бог», «Бог там», «Бог в траве») and `ˈbox` where it wants `ˈboɣ` («Бог даст», «Бог в доме»).

Cost if not amended. Code reports a stop condition that cannot fire as checked, pins «Бог ли» as failing first and finds it passing, and the report's "before" column misstates the engine. Small in code, large in the record: the desk would carry "[bog] today" into OPEN.md.

Replace, in step 0, the sentence "Expected today, by reading: «Бог», «Бог там» `ˈbok`; «Бог даст», «Бог ли» `ˈboɡ`; «лес вдали», «лес в доме», «кот вдруг» voiceless finals. If «Бог даст» already ends in ɣ, STOP and report." with:

> Expected today (Fable's probe on `54c01bc3`, 2026-10-26): «Бог», «Бог там», «Бог в траве» display `ˈbok`; «Бог мой», «Бог один», «Бог даст», «Бог ли», «Бог в доме» display `ˈbox`; «лес вдали», «лес в доме», «кот вдруг» end in a voiceless consonant. Report the display (`ipaDisplay`) and, beside it, the engine's `ipaSurface` after the pass (`ˈboɡ` for «Бог даст», «Бог ли», «Бог в доме»; `pipeline.ts:879-882` builds the display from the syllables, and `:851` rebuilds the last syllable from `ipaSurface` only when it differs from `ipaUnderlying`, which is why the `ɡ` never shows). If any «бог» line displays `ɣ` or `ɡ` today, STOP and report. Also report that «Бог» alone today pairs the IPA line `ˈbok` with the ribbon `⟨г⟩ → [x]` and the blurb "exceptionally pronounced as [x]": that contradiction is what step 1 removes.

Replace, in step 1, "Show failing first: «Бог», «Бог там», «Бог даст», «Бог ли», «Бог в доме», «Бог в траве»." with:

> Show failing first through `processText`: «Бог» (`ˈbok` → `ˈbox`), «Бог там» (`ˈbok` → `ˈbox`), «Бог в траве» (`ˈbok` → `ˈbox`), «Бог даст» (`ˈbox` → `ˈboɣ`), «Бог в доме» (`ˈbox` → `ˈboɣ`). Regression guards (pass today): «Бог мой», «Бог один», «Бог ли» (`ˈbox lʲi`), «небог». At the engine level every hand-built «Бог» word with `ipaUnderlying: 'ˈboɡ'` fails first, since `ipaSurface` is what those tests read. Add the pins «Бог же» → `ˈboɣ ʒɨ` and «Бог бы» → `ˈboɣ bɨ` (clitic boundary before a voiced obstruent: the ruling's [boɣ] case at an enclitic), «Бог в мае» → `ˈbox`, «Бог был» → `ˈboɣ`, and «Бог, мой» → `ˈbox` (punctuation is a hard boundary, `boundaries.ts:66-68`, and the ruling says [box] there; today `ˈbok`).

### 2. Step 3(a) fires the retained-voicing blurb on a preposition before в plus a vowel, which the ratified sentence does not describe

Evidence. The branch at `engine.ts:2186-2190` is reached both when the right word begins with a vowel or sonorant and when it begins with в and the look-through finds a vowel or sonorant past it (`effInitial` null or sonorant at `:2186`). Probe under step 3(a) as worded: «под водой» carries `retainedVoicing` on «под» (display `→ pʌd vɑ ˈdoj`); «без вас», «из воды», «сквозь ветер» take the same path by the code. The blurb would read "When ⟨д⟩ ends a preposition ... and the next word begins with a vowel or a sonorant, it keeps its voicing as [d]" under a word that begins with в. Grayson p. 251 says в before a vowel "follows the rules of a sonorant", so the sentence is defensible to a reader of Grayson and false on its face to a singer looking at «водой».

Cost if not amended. A ratified sentence prints a claim the singer can see is not literally true, on a common line («под водой», «без вас»), with no sentence that says why в counts.

Add to step 3(a), DESK DEFAULT, Dann's to wave off:

> Set `retainedVoicing` only when the right word's own first segment is the vowel or sonorant, that is, when `viaV` is false. A preposition before в plus a vowel or sonorant («под водой», «без вас») keeps its voicing as today and gets no blurb, as today; list those lines in the report under leads (a в-specific sentence would be new text, Dann's). Pin: «под водой» → «под» ends in `d` and its ⟨д⟩ entry has no `retainedVoicing`.

The alternative, kept for the record: let it fire and cite p. 251's "follows the rules of a sonorant". Cost: the sentence contradicts what the singer reads on the page; the desk chose the default above because the ratified text names "a vowel or a sonorant" and not в.

### 3. The citation line renders as "pp. 251, 251–252"

Evidence. `formatCitations` (`composer.ts:90-119`) splits each citation on commas, strips `p.`/`pp.`, deduplicates whole page strings, and joins: run this session, `['p. 251', 'pp. 251–252']` gives `(Grayson, pp. 251, 251–252)`. The identity citation is joined in first (`:362-364`), so the full parenthetical on «меж нас» ⟨ж⟩ would be `(Grayson, pp. 165, 174, 251, 251–252)`; on ⟨з⟩ `(Grayson, pp. 143, 251, 251–252)`; ⟨б⟩ 144, ⟨в⟩ 152, ⟨г⟩ 145, ⟨д⟩ 146 likewise. With both lines at `pp. 251–252` the run gives `(Grayson, pp. 165, 174, 251–252)` and `(Grayson, pp. 143, 251–252)`. Dann ratified "the English and Fench text"; the per-line citations are the desk's draft note in the ratified file's header, so this is reversible and the desk's.

Cost if not amended. Every retained-voicing blurb ends in a parenthetical that reads as a typo.

Replace, in step 3(d), "`retained-voicing:<letter>` for б, в, г, д, ж, з in `processes` (citation `p. 251`) and `implications` (citation `pp. 251–252`)" with:

> `retained-voicing:<letter>` for б, в, г, д, ж, з in `processes` and in `implications`, citation `pp. 251–252` on both (DESK DEFAULT: `formatCitations` deduplicates whole page strings, so `p. 251` beside `pp. 251–252` prints "pp. 251, 251–252"; `french-parity.test.ts:41` requires the French citation to equal the English one within each pair). Pin the whole rendered citation per letter: ⟨ж⟩ `(Grayson, pp. 165, 174, 251–252)`, ⟨з⟩ `(Grayson, pp. 143, 251–252)`, ⟨б⟩ `(Grayson, pp. 144, 251–252)`, ⟨д⟩ `(Grayson, pp. 146, 251–252)`, ⟨г⟩ `(Grayson, pp. 145, 251–252)`; the identity citation comes first because `composer.ts:362-364` pushes it first.

And in the step 3 pins, replace "with citation `(Grayson, pp. 251–252)` (read what `formatCitations` makes of `p. 251` plus `pp. 251–252` and pin the actual string)" with "with the citation strings above".

### 4. `french-parity.test.ts` pins the template count at 209; step 3(d) raises it to 221

Evidence. `packages/blurb/tests/french-parity.test.ts:28-30`: `it('reads all 209 templates', () => { expect(all.length).toBe(209); })`, where `all` is every `{en, fr}` pair in the file except `citation_style` (`:18-26`). Six letters in `processes` plus six in `implications` is 12 new pairs. Gate 6 is green today at 145 (run this session) and goes red on this test the moment the strings are seated. The brief says "The French parity test ... covers the new keys; gate 6 moves only by tests you add, and says so", which is true of the three parity checks and false of the count.

Cost if not amended. Gate 6 red after step 3 with the brief saying it cannot be; Code either edits the number without being told it may, or stalls.

Add to step 3(d):

> `packages/blurb/tests/french-parity.test.ts:29-30` pins the pair count: change 209 to 221 in both lines in the same commit (12 new pairs: six letters in `processes`, six in `implications`), and say in the report that gate 6 moved by the tests you add and by this one changed count. The file already holds 52 literal U+00A0 and 154 U+2019 and no ASCII apostrophe in any French template (counted 2026-10-26); the ` ` escape parses to the same string, nothing regenerates the file (grep: `loader.ts:64` fetches it, `composer.ts` reads it, no writer), and « d’un » keeps its U+2019 as the ratified file has it.

### 5. Step 2 says "nothing else in the four branches changes", which is true, and leaves unsaid what the voicing branch now reaches

Evidence. With the `continue` at `:2184` gone, a voiceless left final before в plus a voiced obstruent goes to `:2223-2226`, whose `applyVoicingToFinal` maps by `crossWordVoicingMap` (`:2043-2053`): probe, «дух вдали» → `ˈduɣ`, «мех вдали» → `ˈmʲɛɣ`, «смех вдруг» → `ˈsʲmʲɛɣ` (х → ɣ, `:2050`); «отец вдали» → `ɑˈtʲɛdz` (ц → dz, `:2051`); «врач вдали» → `ˈvrɑdʒʲ` (ч → dʒʲ, `:2052`); «плащ вдали» → `ˈpɫɑʃʲʃʲ` unchanged (`ʃʲʃʲ` has no entry; `applyVoicingToFinal` returns the string and the branch still sets `skipFinalDevoicing`, harmless for a voiceless final). These are the allophones the same branch already produces without в («слух был → sɫuɣ bɨɫ», the comment at `:2224`), so step 2 adds no new mapping, only new lines that reach it. A left final в is not reached: `v` and `vʲ` sit in neither `crossWordVoicelessSet` (`:2067`) nor `crossWordVoicedObstruentSet` (`:2068`), so «кров вдали», «любовь вдали» fall through all four branches and the final loop devoices them to `f`, `fʲ`, as today.

Already wrong today, outside this row, to report and not change: the same fall-through devoices a final в before a voiced obstruent with no в in between, «любовь дала» → `lʲuˈbofʲ dɑˈɫɑ`, «кровь брата» → `ˈkrofʲ ˈbrɑtɑ` (probe), where p. 251 ("completely influenced by the phonemes around it") would keep [vʲ]. That is the fourth site of the number this brief changes, and the cross-site line (section 4) does not name it.

Add to step 2, after "Nothing else in the four branches changes":

> Report, with pins, what the branch now reaches through в: х → ɣ («дух вдали» → `ˈduɣ`), ц → dz («отец вдали» → `ɑˈtʲɛdz`), ч → dʒʲ («врач вдали» → `ˈvrɑdʒʲ`), щ unchanged («плащ вдали»), the allophones `crossWordVoicingMap` (`engine.ts:2043-2053`) already gives the same branch without в. A left final в is unchanged («кров вдали» → `ˈkrof`: `v` is in neither consonant set, `:2067-2068`, so it falls through to the final loop as today). Report as a lead, change nothing: «любовь дала» → `lʲuˈbofʲ` and «кровь брата» → `ˈkrofʲ` today, a final в devoiced before a voiced obstruent by the same fall-through; Dann's, under p. 251.

Add to section 4's first bullet: "`:2223-2243`'s fall-through for a left final в (neither set holds `v`, `:2067-2068`): the final loop devoices it before a voiced obstruent («любовь дала»); unchanged by this row, reported."

### 6. Step 1 leaves three mechanics to Code that cost a stall each

Evidence. (a) "Replace `restoreBogFinish` with a pass over the words after the final loop ... in `voicing-rule2.ts`": the final loop is `engine.ts:2248-2252` inside `applyCrossWordAssimilation`; a pass after it is one call line in `engine.ts`, which is at 2291 of 2291 (`ratchets.json:13`). Replacing the wrapper at `:2250` with `this.applyFinalDevoicing(word.ipaSurface)` keeps that line; the new call is one line more; the two-line comment at `:2246-2247` folds to one, as N.198 did (`report-code-n198_r1_2026-10-26.md`, section 1). The import at `:15` changes name. (b) "the effective right initial, computed as part A computes it (`initialPastV` where the right word begins with в)": after the final loop the bare proclitic «в» may already read `f` («Бог в траве»: the branch at `:2231-2235` devoiced it), so a test of "begins with в" on the right word's surface says no there; the probe shows the result is `ˈbox` by either route (the `f` is voiceless), and that the two routes agree on every line, so either is sound; the brief must pick one. (c) The pass needs the engine's `getInitialConsonant` and `isVoicedObstruent`; `initialPastV` already takes `initialOf` as a callback (`voicing-rule2.ts:63-67`), so the new function takes the same shape and imports nothing from the engine (the file's own rule, `:11-13`).

Replace, in step 1, "Replace `restoreBogFinish` with a pass over the words after the final loop (`engine.ts:2248-2252`), in `voicing-rule2.ts` (not in `engine.ts`, which is at 2291 of 2291, `ratchets.json:13`; a ceiling may be lowered, never raised): for every word whose letters are «бог» (`lettersOf`), whatever `skipFinalDevoicing` or its boundary says: if the effective right initial, computed as part A of N.198 computes it (`initialPastV` where the right word begins with в), is a voiced obstruent and the boundary is not hard, the final becomes `ɣ`; otherwise ... the final becomes `x`." with:

> Replace `restoreBogFinish` (`voicing-rule2.ts:78-88`) with `finishBog(words, initialOf, isVoicedObstruent)`, exported from the same file, importing nothing from the engine: for every word whose `lettersOf(cleanWord ?? cyrillic)` is «бог», whatever `skipFinalDevoicing` or its boundary says: if `rightBoundary` is `'hard'` or there is no next word, the final becomes `x`; else compute the effective right initial as `:2183-2185` do, with "begins with в" read from the right word's `ipaSurface` through `initialOf` and `isVPhoneme`'s two values `v`, `vʲ` (the bare «в» may already read `f` after `:2231-2235`, as in «Бог в траве»; `f` is voiceless and gives `x`, which is the ruling), then `initialPastV` when it does; if that initial is a voiced obstruent the final becomes `ɣ`, otherwise `x`. The final to replace is the word's last segment `ɡ`, `k`, or `x`. In `engine.ts`: the final loop's `:2250` becomes `word.ipaSurface = this.applyFinalDevoicing(word.ipaSurface);`, one call `finishBog(words, (ipa) => this.getInitialConsonant(ipa), (c) => this.isVoicedObstruent(c));` follows the loop, the comment at `:2246-2247` folds to one line so the file stays at 2291, and the import at `:15` names `finishBog`.

### 7. Step 2 widens an Inspector gap the brief could not establish; it is established now

Evidence. The cross-word branches set no log feature, and `finishLine`'s log loop (`pipeline.ts:862-874`) marks only a devoicing (`voicedToVoiceless[entry.ipa]`, `:866-869`). Probe, today: «кот бы» displays `ˈkod bɨ` and its ⟨т⟩ entry reads `[t]` with no feature, so the ribbon says `⟨т⟩ → [t]` under an IPA line ending in `d` and the blurb is the default "has no palatalizing agent nearby". Under step 2, «лес вдали» inherits it: display `ˈlʲɛz`, entry `⟨с⟩ → [s]`, default blurb. `regressive-voicing:с` (`blurb-composer.json:1289-1298`) has no `{trigger}`; only the six voiced-letter keys do (`:1181-1225`). So the brief's question ("whether `{trigger}` ... names the д past the в, or names the в") has the answer: the template never fires for a cross-word voicing, with or without в, and has no `{trigger}` to name anything.

Cost if not amended. Code spends tokens establishing what this review has, and the lead is reported without the two lines that show it predates the row.

Replace, in "What I could not establish", the `{trigger}` item with a line in step 2:

> The Inspector after a cross-word voicing is a known gap, not this row's: the branches at `:2223-2243` set no log feature and `pipeline.ts:866-869` marks devoicing only, so «кот бы» today shows `⟨т⟩ → [t]` under `ˈkod` with the default blurb (Fable's probe, 2026-10-26), and «лес вдали» will show `⟨с⟩ → [s]` under `ˈlʲɛz` the same way. `regressive-voicing:с` has no `{trigger}` (`blurb-composer.json:1289-1298`). Report both lines as the lead; build nothing for it here.

The option the desk may prefer instead, DESK DEFAULT either way: the module step 3(b) creates could carry the symmetric mark (when the surface's last consonant is `voicelessToVoiced[entry.ipa]`, `engine.ts:1315`, set `entry.ipa` and `features.voicingAssimilation`, `features.voiced`), which makes `regressive-voicing:<letter>` fire on «кот бы», «слух был», «лес вдали». Cost: about ten lines and three pins, and the Inspector changes on lines outside this row's rulings. Fable's recommendation is the lead, not the build, because the brief's three rulings are the row and the mark touches lines Dann has not seen.

### 8. The cross-site line (CONTRACT §4): two sites missing, one dependency unstated

Evidence. Section 4 names `engine.ts:1959-1983`, `:2173-2191`, `:2203-2220`, `:2223-2243`, `:2248-2252`, `voicing-rule2.ts`, `pipeline.ts:850-872`, `voicedToVoiceless`, the blurb sites, `boundaries.ts:59`, `pairings.ts`, Learn. Missing: `pipeline.ts:879-882`, the display built from the syllables, which is why `ipaSurface`'s `ɡ` never showed for «Бог даст» (amendment 1) and why a surface that equals the underlying can still display something else; `pipeline.ts:905-906`, the only other reader of `ipaSurface` (a vowelless clitic's `ipaContent`); `engine.ts:1926-1957`, the within-word log sync that sets `voicingAssimilation` and whose cross-word counterpart does not exist (amendment 7); and the left-final-в fall-through (amendment 5). The grep the task asked for: `applyFinalDevoicing` at `engine.ts:1493`, `:1981`, `:2250`; `skipFinalDevoicing` at `:115`, `:2164`, `:2188`, `:2218`, `:2226`, `:2230`, `:2235`, `:2242`, `:2249` and `pipeline.ts:134`, `:836`; `voicedToVoiceless` at `engine.ts:1301`, `:1483-1484`, `:1505`, `:1930-1936` and `pipeline.ts:866`; `finalDevoicing` set only at `engine.ts:1978` (false) and `pipeline.ts:869` (true); `bogException` at `engine.ts:1977`, `composer.ts:223`, `types.ts:79`; `restoreBogFinish` at `engine.ts:15`, `:2250`, `voicing-rule2.ts:85`. No consumer of `ipaSurface` outside `pipeline.ts`.

Add to section 4:

> `pipeline.ts:879-882` builds the display from the syllables, not from `ipaSurface`; `:851` is the one bridge between them, and `:905-906` the only other reader of `ipaSurface`. After step 1 the three must agree for «бог»: `ipaSurface`, the last syllable, and the log entry. `engine.ts:1926-1957` syncs the log to a within-word voicing; nothing syncs it to a cross-word one (amendment 7).

### 9. Cites and boundary facts to correct

- `engine.ts:2161` → `:2163` (the assignment; `:2161` is its comment).
- `pipeline.ts:850-872` → `:850-876`; `:112-135` → `:108-142`.
- `composer.ts:219-224` → `:218-223`, and `silent` (`:218`) precedes the five listed.
- `pairings.ts:113`, `:124` → `:114`, `:125`.
- `engine.test.ts:55-57` → `:55-59`.
- "find it (grep `лес вдали`)" → `packages/phonology/tests/voicing-rule2.test.ts:129-131`.
- Step 4: "`boundaries.ts:59` gives ... `'clitic'` to «без», «меж», «б», «в»": «б» is an enclitic, and `:54-55` and `:59` put the `'clitic'` on the word before an enclitic, so «если» gets `'clitic'` and «б» gets `'soft'` (probe: `если:[clitic] б:[soft]`; the N.198 review's amendment 4 and `voicing-rule2.test.ts:61-63` say the same). Replace «б» with «если» in that list, and keep «б» in the `'soft'` list.
- Section 2, bullet 1: "a voiceless left final before в is left untouched (`:2184`)" holds; add that `rightInitial` is narrowed to `string` by the `continue` at `:2186-2191`, which step 2 keeps, so removing `:2184` reopens no type error in the merger branch (`:2203`, `:2215`); the N.198 step 1 type errors came from a `continue` that no longer narrowed `rightInitial` (`report-code-n198_r1_2026-10-26.md`, section 4), and gate 3 is the check.
- Section 1, item 1: the «бог» ruling is also in the clone at `docs/memory/STATE.md:19` and `QUEUE.md:71`; `OPEN.md` in this clone has no "N.198 AND ROW 157" heading (grep), so the report's cite to it will be to a desk file the lane cannot see, as with row 156.

### 10. `Pairing.ipa` and the surface that re-seats

The brief's handling (report, change nothing) stands. One line to add so the report's "what a singer sees" names the thing that changes: a song seated before this ships keeps `ˈbok` for «Бог» alone on Markup while Text shows `ˈbox`; the N.198 report found no surface that re-seats without a text edit (`report-code-n198_r1_2026-10-26.md`, section 5). Nothing new established here.

## The approval corpus: what moves, and what the desk brings Dann

Measured (probe, the copied method against `apps/web/src/lib/approval/__approved__/ipa-corpus.txt`, 40 lines, every line found verbatim in the approved file at baseline): step 1 alone moves **0** lines; step 2 alone moves **0**; both together move **0**. The one corpus line holding «бог» («Как дай вам Бог любимой быть другим.») sits before a sonorant and keeps `ˈbox`. The grep the brief orders (a voiceless final before в plus a voiced obstruent, as two words or as a bare «в» plus a word) finds no corpus line. So there is nothing to re-approve and nothing from the corpus to bring Dann; the brief's "the desk expects the count under step 2 to be small and not zero" is answered: zero. What the desk brings Dann is the report's step 0 table, before and after, for the lines that are not in the corpus: «Бог» `ˈbok` → `ˈbox`, «Бог там» `ˈbok` → `ˈbox`, «Бог в траве» `ˈbok` → `ˈbox`, «Бог даст» `ˈbox` → `ˈboɣ`, «Бог в доме» `ˈbox` → `ˈboɣ`, «Бог же» and «Бог бы» `ˈbox` → `ˈboɣ`, «лес вдали» `ˈlʲɛs` → `ˈlʲɛz`, «лес в доме` `ˈlʲɛs` → `ˈlʲɛz`, «кот вдруг» `ˈkot` → `ˈkod`, and the х, ц, ч lines of amendment 5. Gate 4's pinned count in the ship script moves by the tests Code adds, as the brief's step 4 says.

## Where would this wall a singer in (the brief's own question, with what it missed)

The brief names three: «бог» as [ɣ] with the `bog-exception:г` template reading "[ɣ]"; a voiceless final voiced across a в the singer did not think of as transparent, and whether a blurb says so; a kept-voicing blurb on a word the singer did not know was a preposition. Add:

1. Today, before this row: «Бог» alone, the first word of a prayer or the last word of a line, sings `ˈbok` on the IPA line while the ribbon says `⟨г⟩ → [x]` "exceptionally pronounced as [x]" (probe). The two surfaces disagree and nothing says which to trust. Step 1 removes it; the report names it as the before.
2. After step 2, «лес вдали» displays `ˈlʲɛz`, the ribbon `⟨с⟩ → [s]` with "has no palatalizing agent nearby" (amendment 7). A singer who taps the letter to learn why it voiced is told it did not. The same wall stands today on «кот бы» and «слух был»; the row adds lines to it, and the lead is the way out.
3. Under step 3(a) as worded, «под водой» would show "the next word begins with a vowel or a sonorant" under «водой» (amendment 2).
4. The ratified blurb for Grayson's own examples sits on a proclitic («меж», «без») or a fused contraction («б»), whose word stack shows an arrow and whose IPA is fused into the host (`pipeline.ts:891-917`, probe display `→ mʲɪʒ ˈnɑs`). Whether the singer can open the ⟨ж⟩ ribbon of «меж» in the Drawer is NOT ESTABLISHED here (the app was not run); if a merged clitic's ribbon is not reachable, the sentence is built and never seen on the two lines Grayson prints, and seen only on «сквозь», «вокруг», «близ», «средь» (soft boundary, their own stack). The report says which.
5. After step 3, «сквозь нас» ⟨з⟩ loses its present blurb ("followed by a palatalizing agent", the `soft` rule) for the retained-voicing one, since `deriveRule` returns one rule (`composer.ts:214-235`); the `[zʲ]` in the sentence still shows the softness. Say so in the report; no change.
6. «любовь дала» sings `lʲuˈbofʲ` today, a final в devoiced before a voiced obstruent (amendment 5): the singer who knows Grayson's в rule meets it in the repertoire («любовь» before «моя» is right, before «была» is wrong) and no blurb says why; Dann's, as a lead.
7. A song seated before this ships keeps `ˈbok` on Markup while Text shows `ˈbox` (amendment 10).

## Questions for Dann

None. The three rulings in section 1 are his and are not reopened. Two DESK DEFAULTS are his to wave off and are marked where they sit: the retained-voicing blurb does not fire through в («под водой»; amendment 2), and both citation lines read `pp. 251–252` so the parenthetical does not print "251, 251–252" (amendment 3). No French arrives: the ratified strings are seated as ratified, by code point.

## What I could not establish

- Whether a merged proclitic's or enclitic's ribbon («меж», «без», «б») is reachable in the Drawer, so that the retained-voicing blurb is seen on Grayson's own p. 252 examples; the app was not run here.
- What Grayson prescribes for «бог» at a hard boundary, before a voiceless consonant, or before a voiced obstruent: p. 144 gives the citation form /box/ once (text layer read), and pp. 248 to 252 do not name the word; the ruling rests on Dann's general knowledge, as the brief says.
- Whether the х → ɣ, ц → dz, ч → dʒʲ allophones at a word boundary (`crossWordVoicingMap`, `:2043-2053`, with the comment "cross-boundary allophone") are Grayson's; they predate this row and step 2 only widens their reach.
- Whether `pipeline.ts` has headroom after row 152 merges; at `54c01bc3` it is at 925 of 925, so without that merge step 3(b) must move the `:850-876` block into the module first, as the brief already says.
- The effect of `applyNotationPreferences` on `ɣ` in the Inspector blurb text (`InspectorPanel.svelte:454`): not run; the engine already emits `ɣ` for «слух был», so the display path is not new.
- The eight gates after the steps: only `test:phonology` (291) and `test:blurb` (145) were run, at baseline; the probe did not run under gates 3 or 4.
- The exact text of `docs/memory/OPEN.md`'s "N.198 AND ROW 157" section: not in this clone (the ruling is in `STATE.md:19` and `QUEUE.md:71` here).
