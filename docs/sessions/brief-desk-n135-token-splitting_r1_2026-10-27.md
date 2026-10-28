# Brief: what the 232 token-splitting losses are (desk helper, measure only, r1)

Desk (Opus 5.5), 2026-10-27 23:3x. Started as a Sonnet helper in the desk's workspace and STOPPED unfinished at the close of the thread (its workspace does not carry over). The next desk re-runs it in its own workspace after staging `~/Downloads/_desk-2026-10-27/desk-measure-scripts_2026-10-27.tgz` (md5 `7490b94056c839a53b0dda7ae33ddc73`), `desk-measure-scripts-2_2026-10-27.tgz` (md5 `aaeba2e9244d8545128d3e892f035556`), and `~/Downloads/_desk-n135/desk-crops2-wordlists.tgz`. Cap 180k tokens, Sonnet. Measure only.

## The question

On the 18 build songs (2,538 printed syllables), the framed configuration (deskew, closing 3 by 3, ink to 32 px, paper-tone padding; reader `rus_prereform_r2` float) reads 2,086 right. Row 117 attributed the 452 lost to stages: letter recognition 190, token splitting 232, row cutting 17, unattributed 13 (`report-desk-row117-image-cleaning_r1_2026-10-27.md:420-450`; the Mac's reproduction gave 191 and 231). Token splitting is the largest stage. What are those losses, by kind, with counts that sum to the stage's total?

1. Read how `score117.py` assigns a syllable to "token splitting" and state its rule with file:line.
2. Classify each such syllable, for example: two printed words read as one token; one word read as two; a syllable hyphen read as a letter or dropped; a hyphen or extender read where none is printed; punctuation glued or split; other. Derive the categories from the data; three real examples of each (truth and reading).
3. For each kind, which fix could address it and whether the scorer would count it read right: seating-side (the C2 hybrid already cuts two-vowel tokens with the engine), a tokenizer rule on Tesseract's box geometry, or the reader. Simulate one simple tokenizer rule on the existing readings if cheap, scorer unchanged, measure only.

## Controls

`controls-before-measure.md`, timestamped before any run: reproduce 2,086 and the stage total first, stop if not; write the expectation and likeliest failure.

## Output

`report-desk-n135-token-splitting_r1_<date>.md`: a table of kinds summing to the total, examples, the fix map with any simulated number, departures, and "What I could not establish" with: NOT ESTABLISHED beats a complete invented answer. Copy it to the Mac (`docs/sessions/`) the moment it lands.
