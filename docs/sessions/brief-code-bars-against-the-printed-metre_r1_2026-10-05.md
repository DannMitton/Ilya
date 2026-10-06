# Brief: Ilya checks every bar against the metre printed on the page (r1, 2026-10-05)

Written by the desk (Opus) 2026-10-05 about 15:30. For Code on the Mac, on Sonnet, after QUEUE row 35. QUEUE row 37.

## What the singer needs

A singer who drops a scan sees which bars do not add up, before they sing from them, and the song's metre is the one printed on the page. Dann, 2026-10-05 15:16, on the Tchaikovsky song: Ilya drew 9/8 where the page prints 3/8, some bars hold a single eighth note, and nothing flagged it. *"We should have a sanity check in place; why isn't it working?"* It is not working because it is not built: QUEUE row 31 measured four checks on homr's output and built none into Ilya.

## Two facts the design rests on

1. homr never reads a time signature's top number; its writer sets it to the median bar length of the part on that page (`report-opus-the-checks-measured_r1_2026-10-05.md`, item 5 and section 4b). So a check against homr's own metre is circular: a wrong 9/8 passes it.
2. Ilya's own reader reads the printed numerals from the ink: `apps/web/static/reader/timesig.py` (template matching on the SMuFL digits, both numerals). The fill arithmetic and its words already exist: `measureFill` (`apps/web/src/lib/score/entry.ts:412`) and the Loupe's « short » / « over » tag (`apps/web/src/lib/score/Loupe.svelte:2160-2180`, ruled by Dann 2026-09-17), and Dann ruled that an unattended over-full measure IS flagged (`docs/memory/OPEN.md`, near `:1526`).

## Part A: measure first

1. Run `timesig.py` on the three Tchaikovsky pages and on every page of the five build songs. Report the metre it reads beside the printed one (the truth files under `tools/e16-harness/output/truth/` and `docs/sessions/truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json`), and where it abstains.
2. On the readings from row 35 (WebGPU and WebAssembly) and the five build songs' readings, count bars that do not add up to (a) homr's metre and (b) the printed metre. Report both counts and how many of each are real misreads against the truth.

## Part B: build, if Part A's read of the printed metre is right on every page it answers

1. Where `timesig.py` reads the page's metre, Ilya uses it in place of homr's invented numerator. Where it abstains, keep homr's and say so in the console.
2. Every bar whose written lengths do not add up to the metre in force is flagged on the page and in the Loupe, with the words that already exist. Read `docs/memory/OPEN.md` for how a flag on the page is ruled (the N.92 page flag for a measure left over; the over-full ruling near `:1526`) and build to that. If no page flag is specified, flag in the Loupe only and say so in the report; do not invent a mark.
3. Tests for both.

## Done when

On the Tchaikovsky PDF the metre drawn is 3/8, and the flagged bars are exactly the bars that differ from the truth in length, counted. Report the eight gates and any number that moved, at `docs/sessions/report-code-bars-against-the-printed-metre_r1_2026-10-05.md`, with a section for what you could not establish. NOT ESTABLISHED beats a complete invented answer. Do not commit or stage. Before you start a server, list what is listening (`lsof -nP -iTCP -sTCP:LISTEN | grep node`) and stop only what you started.

## Cost

Sonnet; 200,000 to 500,000 tokens, the desk's estimate. Stop and report at 500,000.
