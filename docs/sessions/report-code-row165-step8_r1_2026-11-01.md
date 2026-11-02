# Report: row 165, step 8, the finding outline (r1, 2026-11-02)

Branch `cloud-lane-23` (tip before this commit `3f192be`; I did not merge the newer `origin/Shane`, since this step did not ask for it and the branch cannot fast-forward, having my step 7 report on it).

## The important finding: this component is not drawn anywhere in the app

`Tessituragram.svelte` has no user: `grep "<Tessituragram" apps/web/src` finds nothing, and the Insights page's live figure is `PitchSeconds.svelte` (the e2e test waits for `.pitch-seconds svg`). The project's own record says the same: `docs/memory/OPEN.md:3116-3117` (2026-10-11) says that since row 66 the pane draws `PitchSeconds`, not `Tessituragram`, and that `Tessituragram.svelte` "go[es] to the N.86 dead-code audit".

So **Dann's ruling is built as asked, and it changes nothing a singer can see today.** `PitchSeconds.svelte` is unchanged, as ruled, and it carries no finding cue at all (one `--rose-jewel` fill for every bar). I also owe a correction: my step 2, step 5, and step 7 reports described the finding-cue problem as live on INSIGHTS. It was only ever in this unmounted component. I should have checked that it was mounted before reporting it, and I did not. The 1.19:1 jewel-to-ink figure is still true of the two tokens; it just was not on screen.

Whether to put a finding cue on `PitchSeconds`, or to delete `Tessituragram.svelte` in the dead-code audit instead, is the desk's call. I did neither.

## What changed

`apps/web/src/lib/insights/Tessituragram.svelte`:

- The bars loop (`{#each L.rows ...}`, about line 166): every bar is `fill="var(--rose-jewel)"`; the old `r.dark ? 'var(--rose-ink)' : ...` is gone. A finding bar (`r.dark`) also gets `<rect class="finding-outline" ... fill="none" stroke="var(--rose-wash)" stroke-width={FINDING_STROKE}>` drawn at `x + 0.75`, `y + 0.75`, `width - 1.5`, `height - 1.5`, so the stroke lies wholly inside the bar and the bar's outer size and position do not change.
- New constants `FINDING_STROKE = 1.5` (DESK DEFAULT) and `FINDING_MIN = 4` beside `STAVE`. A finding bar under 4 px in either direction is drawn plain, with no other cue.
- Each bar carries `data-finding` when it is a finding bar (a hook I used to count them in the DOM).
- The header comment's colour roles (about lines 25 to 35) and the bars comment now say this; `--rose-ink` no longer names a bar.
- The finding's meaning in the accessible text is untouched: the figure is `aria-hidden`, and I changed no label or `aria-` text.

New test `apps/web/src/lib/insights/tessituragram-finding.test.ts` (3 tests, server-rendered): all three bars are `--rose-jewel` and none `--rose-ink`; exactly the one finding bar has an outline with `stroke="var(--rose-wash)"`, `fill="none"`, `stroke-width="1.5"`; the outline lies wholly inside its bar. No existing test pinned the old fill.

## Small bars

On the figure I could build, none falls under 4 px: 0 of 14 bars. That figure is the one from `tessituragram-layout.test.ts` (Tchaikovsky Op. 38 No. 3, Design's drawing lengths), laid out with the real `layoutTessituragram`: bars are 4.5 px tall (6 px at the lowest and highest rows) and between 8 px (the shortest, 3.8 quavers) and 320 px long. A bar would be under 4 px long only below about 1.2 percent of the longest bar's time. So I drew no fallback for any bar, because none needed one.

**NOT ESTABLISHED for the three fixture songs** (`sunless-01-engraved`, `sunless-01-finale-lone-v`, `tchaikovsky-op38-3-voice`): their real figures cannot be reached in the app, since the component is not mounted, and I did not build their models offline. I ran each of them in the live Insights page against four stored voices and found no `svg.tessituragram` at all, which is how I found the problem.

## Screenshot

`docs/sessions/row165-step8/finding-bar.png`. It is **not a song in the app**: it is `Tessituragram.svelte` server-rendered from the Tchaikovsky-shaped figure with three bars given findings (F♯3, C♯4, E4), placed on `--paper-cream` with `app.css` loaded, in Chromium. The three finding bars show the light `--rose-wash` outline inside the same jewel fill; the 4.5 px bars read as a thin dark core inside a light edge. It is visible but subtle at that height. That is what a 1.5 px inside stroke on a 4.5 px bar does, and I did not invent another cue.

## Gates

| Gate | Result |
|---|---|
| phonology | Tests  291 passed (291) |
| dictionary | Tests  248 passed (248) |
| web check | svelte-check found 0 errors and 12 warnings in 5 files |
| web test | Tests  3787 passed \| 1 skipped (3788) (the 3784 baseline plus this step's 3 tests) |
| score-parser | Tests  785 passed \| 5 skipped (790) |
| blurb | Tests  145 passed (145) |
| integration | Tests  55 passed (55) |
| `pnpm ratchets` | ratchets: OK. |

No French changes; nothing under `docs/memory/` edited.
