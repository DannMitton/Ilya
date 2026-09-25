# Brief for Code, r1: N.164, one line that offers the range instead of two that contradict

Written by the desk 2026-09-25, 13:25. **Ruled by Dann 13:14 to 13:22**; the account and every quoted ruling are in `docs/memory/OPEN.md` §N.164. Line numbers below were read at `ed2dde1`.

## What the singer sees now

With no range typed, Insights prints the verdict `insights.verdict.cannotSay` (`InsightsPane.svelte:598-607`, `i18n.ts:1498`) and then `insights.findings.none` (`InsightsPane.svelte:613-614`, `i18n.ts:1500`). The second line counts range checks that never ran.

## What the singer sees after

**Only when the verdict is `cannot-say`:**

1. The verdict line becomes one sentence with a link and a quiet decline:
   - EN: "This page doesn't know your range yet. **Add your range**, and it can tell you whether this key suits you." then **No thanks**.
   - FR: « Cette page ne connaît pas encore votre ambitus. **Indiquez votre ambitus**, et elle pourra vous dire si cette tonalité vous convient. » then « **Non merci** ».
   - Both ratified. Copy them exactly. Put each in `i18n.ts` as its own keys (sentence before the link, link text, sentence after, decline). Keep `insights.verdict.cannotSay` in the file, unrendered, with a comment naming N.164.
2. `insights.findings.none` does not print. **Findings that exist still print.** If the findings section would then be empty, hide the section and its heading.

## The link

- "Add your range" opens the calibration takeover (`+page.svelte:2288-2293`, `enterCalibration`) **directly on the `characteristics` phase** (`CalibrationWizard.svelte:116`, `:315`, `:1474`). Today that phase is reachable only from a secondary button on the summary (`:1111-1114`). Add a prop that sets the opening phase; default behaviour is unchanged.
- When the singer leaves the takeover, they are back on Insights, and with a range typed the verdict line reflects it.
- **Report, do not fix:** what the characteristics phase's Done does for a voice with no readings, since it returns to a summary that voice has never seen.

## No thanks

- Hides the line on **every song**, and **stays hidden across reloads**. Store it as one `localStorage` key, following the install prompt's decline (`InstallPrompt.svelte:62-67`), with the same private-browsing guard.
- A singer who ignores the line keeps seeing it. A singer who types a range never sees it.
- When hidden, the verdict line prints nothing in the `cannot-say` state. Do not replace it with other text.

## Print

Insights prints (`InsightsPane.svelte:1022`). **On paper, the sentence prints as plain text, with no link styling, and "No thanks" does not print.** A dismissed line does not print either. DESK DEFAULT, 13:25: the ruling of 2026-09-25 that "the tap is the footnote on screen" already puts taps on Insights; `CONTRACT.md` §6 "Do not put a control on the paper" is honoured by keeping both controls off the printed page.

## Done when

- All five gates at baseline.
- vitest: the `cannot-say` model renders the offer and no `findings.none`; any other verdict renders exactly as before; the decline key hides the offer and survives a remount.
- On the alias, in French and in English, with no range typed: the line reads as above; the link lands on the Range fields; after typing a range and leaving, the verdict changes; "Non merci" hides it on a second song and after a reload. **State your expectation before you measure**, per CONTRACT §5, THE CONTROL RULE.
- A memo of ten lines or fewer in `docs/sessions/`: the diff summary, the tests, what was walked, and a section titled "NOT ESTABLISHED". **NOT ESTABLISHED beats a complete invented answer.**

## Out of scope

The compass reading A3 to F♯6 and the tall empty region (`OPEN.md` §N.164) stay NOT ESTABLISHED. Do not touch them.
