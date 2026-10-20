# Audit: requests Dann made that were dropped (r1, 2026-10-19)

Sources used: past chats through `conversation_search` and `read_conversation` (reachable only from 2026-09-12 on; nothing between 2026-08-19 and 2026-09-11 is listed), the memory files and `docs/sessions/` in the `lane11` checkout at `09ad698`, and the code in the same checkout; the Projects tool was not available in this session, so project knowledge was not read. Window: 2026-08-19 to 2026-10-19, with chats covering only 2026-09-12 to 2026-10-19 and memory files covering the whole window.

Method, in one paragraph. I searched chats globally and inside ten chats by ID, read the turns around each hit, then searched the memory files under two or three wordings for each ask, then searched the code. A failed search is reported as a search, not as proof. The known example (the clef, item 3) was found by this method before I looked at the brief's hint again: the chat quote, the `INBOX.md:226` line pointing at row 47, and the "As written" link that changes the octave only (`apps/web/src/lib/i18n.ts:1369-1370`).

## 1. Dropped

### 1. Insights explains a demand once, then points back by bar

**Dann's words**, 2026-10-14, about 14:13 (the time is from `docs/sessions/draft-markup-insights-one-set_r1_2026-10-14.md:40`; the chat shows no clock), chat https://claude.ai/chat/09ffdcb8-0ea2-4ae7-96b0-9b590f058797:

> "Six entries that each say "see above" read as canned too." Agreed. So why parse each instance and pair it with "see above: when we can take the reverse appraoch? Fully express the first challenge, explain and cite, and tack on to it (see also mm. x, y, and z)?
>
> Yesaboice is directional and refers to the Insights proise specifically, any other identifier will do: See point 1 (if we arrange Inishts in an ordinal list), etc.
>
> "and a later entry pointing back carries none." is misrrepresnting the referential grammar wer are trying to build. A later entry points back to the fully-realized entry with citations, this absolutely does not mean a change od ruling, I reject that. JOin me in expanding our function here: we are essentiually creating literary pointers to prose memory locations. You should instictively undertsnad this!

In his next turn, same chat: "We need some kind of sensitivity to an editing pass that humanizes Insights' text." It answers his 03:10 complaint of the same day, recorded at `docs/memory/INBOX.md:227` (the comments repeat advice; "One more observation" reveals a repeat).

**What was done with it.** Captured only in a session file, `docs/sessions/draft-markup-insights-one-set_r1_2026-10-14.md:39-40`. The close of that session says the day's rulings are "all in `PRODUCT.md` or `OPEN.md`" and lists "explain once, then "see also mm.", then pointers" among them (`docs/memory/STATE-archive.md:655`). That claim does not hold: the rulings around it were transcribed (two tiers at `docs/memory/PRODUCT.md:1198`, style rules as defaults at `:1201`), but this one was not. Searched `PRODUCT.md`, `OPEN.md`, `OWED.md`, `QUEUE.md`, `SCHEDULE.md`, and `STATE.md` for "explain once", "see also", "point back", "pointer", "prose memory", "first occurrence", and "returns at": no hit for this ruling. No QUEUE row and no brief carries it. N.173 (the curation rules, `STATE.md:123`) stays a living draft and its spec (`OPEN.md:414`) does not mention it.

**What the tree does today.** Nothing found. `apps/web/src/lib/i18n.ts` has no "see also" or « voir aussi » string. A recurrence is counted, not addressed by bar: "One further instance, in the score." and "{n} further instances, in the score." (`i18n.ts:1703-1704`). "One more observation" is still the label (`i18n.ts:1978`). The only repeat guard is that a closer that would repeat is dropped (`apps/web/src/lib/insights/comment-text.ts:204`). Searched `apps/web/src/lib/insights/*.ts` for "seeAlso", "recur", "returns", "also at", "same demand": nothing.

**Proposed `INBOX.md` line:** `- 2026-10-14 14:13, Dann: "Fully express the first challenge, explain and cite, and tack on to it (see also mm. x, y, and z)"; a later entry points back to the full entry with its citations ("literary pointers to prose memory locations"), and an editing pass humanizes the text. Ruled in chat, never transcribed (STATE-archive.md:655 says it was); not built.`

### 2. How Ilya draws a necessary hyphen, as distinct from a syllable hyphen

**Dann's words**, 2026-10-14, during his walk of «Средь шумного бала» (the chat shows no clock; the walk ran from about 01:4x to 02:4x by the INBOX and OPEN entries it produced), chat https://claude.ai/chat/0435b61a-6e38-4466-83be-0cd8a359b58e:

> MIssing necessary hyphen in "Люблю ли " This brings up my question: we hyphenate to syllabify, but how do we render a necessary hyphen? The score does this (snapshot).

Phrased as a question, not an instruction. Dann decides whether it is a request.

**What was done with it.** The desk answered that typing «Люблю-ли» keeps the hyphen on «Люблю-», and that "What I can't establish is whether Markup draws that hyphen so it reads differently from an ordinary syllable hyphen. Your placement will show us." After his placement it reported "bar 86 reads «лю-», «ли»", which is the form of an ordinary syllable break. The question of how the two hyphens differ on the page was not taken further. Never captured: searched `docs/memory/` and `docs/sessions/LOG.md` for "necessary hyphen", "lexical hyphen", "word-internal hyphen", "compound hyphen", "Люблю-ли", and "Люблю ли": no hits.

**What the tree does today.** The particle split keeps the hyphen on the host word as trailing punctuation "so the Paper faithfully renders the source text" (`apps/web/src/lib/typed-hyphens.ts:131-146`). Nothing found that draws a lexical hyphen differently from a syllable hyphen: searched `packages/score-parser/src/staff-renderer.ts` and `apps/web/src/lib/score/pairings.ts` for "lexical", "particle", "word hyphen", and "kept hyphen"; the only hit is a comment at `pairings.ts:197`.

**Proposed `INBOX.md` line:** `- 2026-10-14, Dann, on «Люблю ли»: "we hyphenate to syllabify, but how do we render a necessary hyphen? The score does this." Markup today draws «лю-», «ли», the same as a syllable break. Never captured.`

### 3. An effortless way to change the clef on the Paper (the known example, already recovered)

**Dann's words**, 2026-10-14 01:57, chat https://claude.ai/chat/0435b61a-6e38-4466-83be-0cd8a359b58e:

> Interesting. As a user I want an easy way to change the clef on Paper. Ilya has produced the Markup on nbass clef because of my voice, but the score is in treble. Comparing the tow is a biut of a mindfuck right now, so my instinct was to restire the treble clef. Can we wamke a note to figure our an effortless way to achieve this functional;ity? I'm sure other sures will feel likje I do.

**What was done with it.** Captured at `docs/memory/INBOX.md:226` with "Desk lead: QUEUE row 47 (READY) carries a one-tap return to the line as written". Row 47 shipped in `263aa48a` (`QUEUE.md:42`), and its "As written" link returns the octave, not the clef (`i18n.ts:1369-1370`). So the ask was pointed at a row that does not deliver it.

**What the tree does today.** The Markup clef is chosen from the reading (`chooseClef`, cited at `apps/web/src/lib/score/loupe-render-bundle.ts:9`); the voice-type clef rule reaches the note picker only (`apps/web/src/lib/voice/note-picker.ts:54-89`). No control restores the score's own clef.

**Status:** recovered tonight as QUEUE row 127, per the brief. This checkout is a few hours behind and its `QUEUE.md` ends at row 125, so I could not read row 127.

### 4. A wider net on IMSLP for scores with more varied metres

**Dann's words**, 2026-10-09, about midday (the chat shows no clock; the turn follows the desk's mention of an 11:21 commit "this morning"), chat https://claude.ai/chat/d0eb6646-1586-4000-bdda-b619bdd22da2:

> "printed time signatures. No 0, 1, 5, 7, or 9 appears in any of them, so a reader learning from them never sees those figures" Is it worthwhile casting a wider net on IMSLP to locate piano vocal scores with more variation in meter signature? It doesn't matter whether these new test peieces are Russian or not. We're trying to make the meter signature subroutines bulletproof. Critique?

The desk answered "Yes, a wider net is worth casting, but with three changes": hunt by period and publisher for 5/4, 7/4, 5/8, 7/8, 9/8, 12/8, 3/1, and 2/1; take labels from OpenScore Lieder encodings paired with their source scans; and note that better examples fix only half the fault.

**What was done with it.** Captured inside row 57's history: a Sonnet survey found Dann's own files add no old-plate 0, 1, 5, or 7, and "The local route is exhausted; the open-corpus route (OpenScore Lieder, IMSLP) waits." (`docs/memory/QUEUE-archive.md:87`). Row 57 then went on with rendered fonts and real songs (round 4 to round 6; `INBOX.md:211`) and closed with runs 1 to 4 committed (`QUEUE-archive.md:87`). The waiting open-corpus route left with the row. No ruling dropped it that I found. Searched `QUEUE.md`, `STATE.md`, `OPEN.md`, `OWED.md`, and `SCHEDULE.md` for "OpenScore", "wider net", "5/4", "7/8", "metre variety", and "0, 1, 5, 7": no open line. The related cardinal N.91 (OpenScore Lieder as an accuracy benchmark) lives only at `INBOX.md:38` (section 2).

**What the tree does today.** NOT ESTABLISHED whether the metre reader states a 5, 7, or 9 from an old plate correctly; the last measure in the record (row 57 run 4) is on the A to F songs and the six sealed songs, none of which is recorded as carrying those figures (`QUEUE-archive.md:87`, "A, B, C, E, F stated 4 ... G, H, I, J, N, O stated 7").

**Proposed `INBOX.md` line:** `- 2026-10-09, Dann: "Is it worthwhile casting a wider net on IMSLP to locate piano vocal scores with more variation in meter signature? ... We're trying to make the meter signature subroutines bulletproof." The desk said yes (OpenScore Lieder, 5/4 to 2/1); the route "waits" in row 57's archive and has no open line.`

## 2. Open but at risk

1. **"Dotted quarter" in the loupe's readout.** `INBOX.md:106` (2026-09-09), curated as D9 on 2026-10-01 (`docs/sessions/inbox-curated_r1_2026-10-01.md:38`), its French never shown to Dann; six weeks without a move. The tree still joins "Quarter · Dot" (`apps/web/src/routes/+page.svelte:1125-1126`), and `apps/web/src/lib/tempo/beat-glyph.ts:12-13` records that no "dotted" adjective exists in `i18n.ts`.
2. **Printed pages keep their on-screen colour.** Dann's words at `INBOX.md:194` (2026-09-24 15:35): *"It would be great if the pages could preserve their onscreen colouration."* Curated as D5 "(taste)" (`inbox-curated_r1_2026-10-01.md:34`); 25 days, no ruling. No `print-color-adjust` anywhere under `apps/web/src` (grep).
3. **Seven numbered cardinals with no tracker row.** N.90 (photograph tier), N.91 (piano-doubling witness, OpenScore benchmark), N.93 (easy text entry), N.98 (voice profile selector), N.99 (skew-tolerant staff detection), N.100 (PDF media box), N.101 (intake legibility) were numbered by Dann 2026-08-24 to 08-26 and live only in `INBOX.md:37-51`. The release sort put them in LATER (`docs/sessions/sort-release_r1_2026-09-16.md:93`), which Dann accepted by not objecting (`:12-13`). None has a row in `STATE.md`'s tracker, none is in `OPEN.md`, and none was in the 36-item keep-or-drop walk of 2026-10-14 (`docs/sessions/memo-open-work-decisions_r1_2026-10-14.md` names none of them). Some may be overtaken (photographs are now in THE TARGET, `STATE.md:65`; the intake was rebuilt as Poem and Lyrics); that is NOT ESTABLISHED item by item.
4. **N.116, Learn as the book.** Dann's ask of 2026-09-07 at `INBOX.md:95`; spec at `OPEN.md:311`, step 2 not started in six weeks; no tracker row; LATER at the sort. The separate ask to update Learn for the new design (`INBOX.md:94`, 2026-09-07) rides on N.84 as "Guide and Learn" at `OPEN.md:1465`, while N.84's line in `QUEUE.md:68` names the Guide alone.
5. **Naming files so a growing library stays organized.** `INBOX.md:124` and `:126` (2026-09-10): "The file-naming half of that line stays open." No other home (grep "file nam" finds only `STATE-archive.md`). Five weeks.
6. **The rest of the 2026-10-01 "these need you" list.** D1 transitions, D2 mobile navigation (Dann 2026-08-25: navigation on mobile "is abysmal", `INBOX.md:47`), D3 one piece at a time (`INBOX.md:68`), D8 barline verb, D10 phone verb, D11 the stray #, D12 [u] Provisional, D14 WCAG in the marketing list, D16 the held tether draft (`inbox-curated_r1_2026-10-01.md:30-45`). Searched the live memory files (`STATE`, `OPEN`, `OWED`, `PRODUCT`, `SCHEDULE`, `SEQUENCE`, `CONTRACT`, `QUEUE`) for each: none names D2, D3, D10, D11, D12, D14, or D16; no ruling recorded on any of the nine. Some may be met by later work (D3 by N.160 and the two views; D12 by the fry fixes of 2026-10-01); NOT ESTABLISHED.

## 3. Superseded

- Drawer placeholder text made consistent (`INBOX.md:24`, 2026-08-20): the drawer now has one intake field and then Poem and Lyrics, each with a ratified placeholder (`i18n.ts:733`, `:760`).
- Calibration rule recoloured lavender (`INBOX.md:27`, 2026-08-23): the pacifier follows Voice into rose (`INBOX.md:156`, 2026-09-13).
- Separate Transcribe and Continue actions (`INBOX.md:80`, 2026-09-04): "whenever text is present, the transcription exists" (`INBOX.md:87`, 2026-09-07).
- A squircle that alerts on the page (`INBOX.md:167`, 2026-09-15): the red squircle marks a notable coordination demand (`PRODUCT.md`, "What a red squircle marks", 2026-10-14).
- Running header Composer and Title (`INBOX.md:124`): already built (`INBOX.md:126`), and the running head was ruled again 2026-10-11 03:23 (`OPEN.md:3027`).
- Chinese translation (`INBOX.md:197`): abandoned 2026-10-14 22:20 (`INBOX.md:228`).
- N.115, moving a measure between systems: dropped 2026-10-15 00:39 (`STATE.md:81`).
- N.152 playback and N.175 videos: dropped 2026-10-14 22:26 (`STATE.md:80`).

## 4. Could not establish, and what I did not cover

- **Chats before 2026-09-12 and between 2026-09-13 and 2026-09-19 are not reachable**: `recent_chats` lists nothing in those spans, and global searches returned only chats outside the window. August and early September are covered from the memory files alone, so a request made in those chats and never written down cannot be found by this audit.
- **Chats searched inside by ID (10 of about 60 in reach):** `0435b61a`, `d0eb6646`, `bad41cce`, `d9505a2d`, `94b26ec4`, `24580dd8`, `7d472ac5`, `27dbab90`, `09ffdcb8`, `5167a095`. The others were reached only through global searches, which mostly return summaries rather than Dann's words. The thinnest coverage: 2026-09-20 to 2026-09-23, 2026-10-01 to 2026-10-07, and 2026-10-11.
- **Project knowledge was not read** (no Projects tool in this session), so the August handovers and rulings there were not checked.
- **Times.** The chat search prints no clock; every time I give comes from a memory file or a session file, or is bracketed from the turn's context and says so.
- **Not established, built or open:** whether the multi-song file question (`INBOX.md:203`, 2026-10-01 14:42) was answered; whether Further reading is consolidated by source (`INBOX.md:227`); whether a voice-profile selector (N.98) exists as a control.
- **Things checked and found built, so not listed as findings:** the loupe tap that only selects (`+page.svelte:742-744`, N.147); `intake.line` singular (`i18n.ts:790`); the hollow placeholder circle and its legend entries (`apps/web/src/lib/markup/legend.ts:30-31`, row 78b); Markup's squircle taking the Loupe's treatment (row 34, `fd1c86a`); bar numbers as the one address (`PRODUCT.md:1180-1181`); the voice-type clef in the note picker (`note-picker.ts:54-89`); the whole-bar rest on Markup (`packages/score-parser/src/staff-renderer.ts:2476`, `:2506`); hairpins captured as open work (`OWED.md:1039`, `SCHEDULE.md:81`).
- **Budget.** I stopped gathering near the stated limit, with the ten chats listed read in part.
