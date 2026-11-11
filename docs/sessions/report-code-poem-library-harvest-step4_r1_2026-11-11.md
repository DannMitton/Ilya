Model: Sonnet 5.5 (claude-sonnet-5-5)

# Report: poem library harvest, step 4 (gates, the byte count, one browser check), 2026-11-11

Branch `cloud-lane-45` at the step 3 commit plus this report and the screenshots. `docs/memory/OPEN.md` and `docs/memory/INBOX.md` show as modified in the working tree; neither is mine (OPEN.md was dirty at the start; INBOX.md changed on disk during the lane). I did not touch or stage either.

## 1. The eight gates (Mac, working tree at the step 3 commit)

| gate | command | baseline (`a12ee171`) | now |
|---|---|---|---|
| 1 | `pnpm test:phonology` | 456 passed | 456 passed |
| 2 | `pnpm test:dictionary` | 248 passed | 248 passed |
| 3 | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings (5 files) | 0 errors, 12 warnings (5 files) |
| 4 | `pnpm --filter @ilya/web test` | 5189 passed, 1 skipped (280 files) | **5190 passed**, 1 skipped (280 files) |
| 5 | `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped | 785 passed, 5 skipped |
| 6 | `pnpm test:blurb` | 168 passed | 168 passed |
| 7 | `pnpm test:integration` | 151 passed | **155 passed** |
| 8 | `pnpm ratchets` | OK | OK (743 files) |

Gate 4 moved by +1: the one new test in `poem-library-strings.test.ts` (the three site names). Gate 7 moved by +4: the four tests of `tests/build-poem-library.test.ts` for the two build checks (the root vitest config). The ship script's baselines for gates 4 and 7 therefore move to 5190 and 155 at the ship; I did not edit the ship script. The new poem file is `data/dictionary.poems.d77d09cd.json` (the manifest's `poemHash` is `d77d09cd`; its dictionary `hash` `86d83340` is unchanged).

## 2. The byte count (the poem file, before and after)

Measured by Node's `zlib` on the files themselves: gzip level 9; brotli quality 11.

| | bytes | gzip -9 | brotli |
|---|---|---|---|
| before: `dictionary.poems.a7c468a0.json` (103 entries, from `git show a12ee171:`) | 552,855 | 120,071 | 86,527 |
| after: `dictionary.poems.d77d09cd.json` (327 entries) | 1,134,338 | 247,522 | 178,015 |

The review's own figures for 336 entries were 1,140,782; 250,873; 180,527 from 526,109; 115,834; 83,562. This run's "before" file is the 552,855-byte file committed at `a12ee171`, so its "before" is higher than the review's; the "after" is a little lower, as the brief expected for 224 poems. The file grows about 2.05 times raw and 2.06 times gzipped.

## 3. The browser check, on the built app

`pnpm --filter @ilya/web build` (done), served by `vite preview` on port 4173 (a fresh server, started after the build). A headless Chromium (Playwright's, 1440 x 900) pasted from the clipboard with Meta+V into LYRICS of an empty song, a new browser context each time. The first stanza of each (80 letters or more), in modern letters:

| poem | letters | what the card offered (EN) | FR |
|---|---|---|---|
| RVB `c77f0faedf` Tyutchev «Сей день, я помню, для меня…» | 195 | "Ilya found this poem for your song:" “«Сей день, я помню, для меня…»”, "a passage beginning" … From the Russian Virtual Library (rvb.ru). | « Tiré de la Bibliothèque virtuelle russe (rvb.ru). » |
| az.lib.ru `c1b2aeabcd` Pleshcheyev «О, если б знали вы, друзья моей весны…» | 129 | a passage beginning “О, если б знали вы, друзья моей весны”; From Maxim Moshkov’s Library (az.lib.ru). | « Tiré de la Bibliothèque de Maxime Mochkov (az.lib.ru). » |
| pre-reform `7f571e4227` Pleshcheyev «Странник» | 104 (modern) and 106 (as printed, pre-reform letters) | “Странник”, a passage beginning “Томит меня мой страннический путь”; From Russian Wikisource, in modern spelling. | « Tiré de Wikisource en russe, en orthographe moderne. » |

All three filled on the first paste; each card has "Not this poem" and "Keep this poem" in English and "Pas ce poème" and "Conserver ce poème" in French. The source link is the entry's own page (`rvb.ru/19vek/tyutchev/bp/poems/084.html`, `az.lib.ru/p/plesheew_a_n/text_0100-1.shtml`, the Wikisource revision). The pre-reform entry filled from either the modern stanza or the pre-reform stanza as printed (Томитъ меня мой странническій путь…). The three site names read as ratified, and the French source line takes no elision.

Screenshots (`docs/sessions/report-code-poem-library-harvest-step4_r1_2026-11-11/`): `<poem>-<modern|edition>-<en|fr>-card.png` (the card) and `…-page.png` (the whole page), four runs by two languages.

**A finding, not fixed here: the card prints the data's own guillemets inside its own quotes.** 65 of the 224 harvested titles begin with « (an incipit used as the title, as Wikisource and RVB print it: «Сей день, я помню, для меня…»), and none of the 14 first poems does. The card puts its own quotation marks around the title, so English reads “«Сей день, я помню, для меня…»” and French reads « «Сей день, я помню, для меня…» » (see `rvb-modern-fr-card.png`). `91a716b953`'s title «Нет, только тот, кто знал…», which step 1 gave the guillemets the brief shows, will print doubled the same way. The line below the title is correct (`cardLine` strips the data's quote marks). One more title, «(Кольцо)», starts with a parenthesis. Whether to strip the marks from the 65 titles in the data, or to strip them where the card prints, is the desk's call; I changed neither.

## 4. Playwright

- **`e2e/poem-library.test.ts`, chromium project: 4 passed, 17 failed.** All 17 fail at the first `toBeVisible` on the card: the spec pastes with Control+V, which does not paste in Chromium on a Mac (the brief's first known red). To check that this is the whole cause and not the library, I ran a scratch copy of the spec with Control+V replaced by Meta+V (`e2e/zz-poem-library-meta.test.ts`, removed afterwards, not committed): **21 of 21 passed**, including the French walk, the aria walk, fixture P filling whole, fixture S filling a passage, and "nothing leaves the device" (the poem file fetched once, by name).
- **`e2e-phone/poem-arias-time.test.ts`, phone project: 1 passed.** It reports (Chromium on this Mac, CPU throttle standing in for a phone, not a phone): CPU 1x, longest aria (2,268 letters) 146 ms against the 14 first poems and 426 ms against 327 entries; longest text (15,173 letters) 941 ms and 2,763 ms. CPU 4x: aria 570 ms and 1,768 ms; longest text 3,872 ms and 11,374 ms. The matcher runs on the main thread, so a 15,000-letter paste takes about 11 s at 4x throttle. The arias report of 2026-11-10 gave 299 ms and 1,088 ms (aria) and 2,011 ms and 6,287 ms (longest text) for the 14 poems and the 103 entries at 1x; its 14-poem figures are about twice today's, so the machine was slower then and the two sets are not comparable. I did not run the 103-entry library in this lane's browser.
- `e2e/singer-paths.test.ts` (the French title «…pour chanteurs», the brief's second known red): **not run**, since the brief names only the poem-library specs. No other red was met in the poem specs.

## What Code could not establish

- A real phone: the phone project is Chromium with a CPU throttle.
- Whether `/data/` is served compressed in production, so which byte figure a singer downloads: not read (Vercel config not opened).
- The other Playwright specs and the whole Playwright suite: only the poem-library specs were run, as the brief asks.
- Whether the pre-reform entry filled by the modern stanza and by the printed stanza for the same reason (the matcher folds ъ ѣ і); I read only that both filled the same entry.
- The three pasted stanzas were the first stanza of each poem, not a song's own Lyrics; no real song of the three was set against them.
- The stale-build trap (memory: Vite preview can serve an old build): the preview server was started after the build, and the card shows the ratified site names, which are only in this build.
