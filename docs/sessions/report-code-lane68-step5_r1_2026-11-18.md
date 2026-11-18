# Report, lane 68, Step 5: pictures, `vercel.json`, the end gates

2026-11-18. Branch `cloud-lane-68`.

## 1. Pictures (`docs/sessions/report-code-lane68-pictures/`, 24 files)
Bass, voice seeded in `localStorage`, `?capture=stub`, the Mussorgsky fixture `sunless-01-engraved.musicxml`. Desktop 1440 by 900, phone 390 by 844, both at 2x. Sets: three stable core vowels ([i], [e], [u]); one vowel ([u]); [i] unstable with [e] and [u] stable (one unstable); [i] and [u] unstable (two).

Files: `pane-3core-`, `insights-3core-`, `insights-1core-` (amendment 10), `melody-3core-`, `summary-unstableOne-`, `summary-unstableTwo-`, each `{desk,phone}-{en,fr}.png`.

Looked at (by me, this session): pane 3core desk-en and phone-fr; insights 3core desk-en and phone-en; insights 1core desk-en and phone-fr; melody 3core desk-fr and phone-en (re-shot with the clef card dismissed; the first desk-en shot had the card over the line); summary one unstable desk-en and phone-fr; summary two unstable desk-en. **Not looked at:** the other 11 (pane 3core desk-fr and phone-en; insights 3core desk-fr and phone-fr; insights 1core desk-fr and phone-en; melody 3core desk-en and phone-fr; summary one unstable desk-fr and phone-en; summary two unstable desk-fr, phone-en, phone-fr). They come from the same script and strings.

What the ones I looked at show:
- The VOICE pane reads "You have sampled 3 of the 6 core vowels so far ([i], [e], and [u]). To complete your personal vowel space, Ilya needs at least 5 stable fry samples. Until you provide 2 more, unsampled vowels are assigned placeholder values." (French as ratified). The type name is no longer in it.
- INSIGHTS and MELODY show the ratified line under the title. INSIGHTS ends "drawn dashed", MELODY "hollow or dashed" (French « évidés ou en pointillé »). The generic lede ("placeholder values for a generic bass") does not show.
- INSIGHTS with one vowel sampled: "You have sampled 1 so far ([u]). Until you provide 4 more". The identity line reads "BASS · CALIBRATED 2026-11-01", which amendment 10 expects: a sampled voice reads as calibrated again.
- The unstable note with one vowel reads "This reading was unstable: [i] cardinal-i. Another try may help." with "Keep it" and "Re-take". With two: "These readings were unstable: ..." with "Keep them".
- Seen and not changed by this lane: on a phone the French pane line is six lines long; at 390 px the INSIGHTS line wraps beside the clef figure in a narrow column.

## 2. `vercel.json`
`cloud-lane-68` replaces `cloud-lane-67` in the build command and in `git.deploymentEnabled`, beside `Shane` and `main`. The file parses as JSON.

## 3. End gates, on the final tree
| Gate | Result |
|---|---|
| phonology | 462 passed (462) |
| dictionary | 248 passed (248) |
| svelte-check | 0 errors, 12 warnings, 5 files with problems |
| web | 6682 passed, 5 skipped (6687). No scipy here, so compare with the 6656 passed, 5 skipped (6661) baseline: 26 tests added, none removed |
| score-parser | 904 passed, 5 skipped (909) |
| blurb | 178 passed (178) |
| integration | 159 passed (159) |
| ratchets | OK |

Playwright, desktop (`--project=chromium`): `voice-pane voice-stations voice-links insights-links calibrate-new pages-without-gaps`: **120 passed (26.4 minutes)**. No expectation was changed in this lane. Phone: Step 4's report.

## NOT ESTABLISHED
- The 11 pictures not looked at, above.
- The two phone failures' cause and whether lane 67 introduced them (Step 4).
- `tools/n200-score/lane66-core.ts` and `lane67-core.ts` were not re-run.
- The with-scipy gate 4 count.
