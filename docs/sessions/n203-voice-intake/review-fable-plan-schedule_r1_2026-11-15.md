# Fable review of the plan's section 12, the project schedule (N.203)

Filed verbatim by the desk. Reviewer: a fresh Fable 5.2 subagent, read only, launched 2026-11-15 23:5x America/Toronto at Dann's question of 23:48 ("Did Fabel review your schedule?"). Subject: `plan-voice-in-the-drawer_r3_2026-11-15.md`, md5 `8a9478a7`, section 12.

---

**OK WITH FIXES.** Monday's Block A is sound and can open as written once fixes 1 to 4 are in, but the schedule undercounts its reviews, leaves out about a day of release work that `SCHEDULE.md` already owes, and in my judgement its Wednesday-to-Friday half does not fit with every review and walk kept.

"Plan" is `/mnt/user-data/outputs/n203/plan-voice-in-the-drawer_r3_2026-11-15.md`; "memory" is `/home/claude/n202/ilya/docs/memory/`.

## Fixes, most serious first

1. **Where it breaks: lane 61 and Thursday.** Lane 61 holds slices 4, 5, and 6 (plan:436) and starts only when lane 60 is on `Shane` (plan:466), which sits behind lane 60's brief, its review, the build, the review as built, fixes, pictures, the walk, and the merge. That is Wednesday at the earliest, with the freeze Thursday 12:00 (plan:471). The half day after it also holds the GUIDE entries in two languages, S4, and everything in fix 3. Fix: section 12 says in one sentence that slices 4 and 6 and the GUIDE do not fit under this sequence, and puts the consequence to Dann (question 1 below). D10's default (b) cannot stand as a desk default: it defers ruled work to keep a date, against `CONTRACT.md:26`, and against D11 (plan:383).

2. **The review count is low.** Section 12 budgets six Fable reviews (plan:437). Lane 60 merges twice, the seam before slice 3 (plan:465; earlier review, risk 3), so it needs two reviews as built and two walks. Lane 58 has no review as built in the schedule and merges "when it reports clean" (plan:461), though the plan calls it unread (plan:421). Lanes 56 and 57 moved after their reviews (plan:421), and only the desk checks them (plan:451). Fix: count eight or nine reviews, about 3 million Fable tokens at the plan's own rates, and schedule each by name.

3. **Jobs missing entirely.** From `SCHEDULE.md`: Dann's walks of lanes 48, 50, 52, 54, and 55 ("none is walked", `:57`); the review packet and known-issues line (`:48`); the format walk, print walk, and N.83 in both languages (`:49`); the four Guide characters (`:43`); N.200's treble voice "before any singer sees it" (`:30`). From plan:365: who measures the gates on each merged tree and moves the ship script's baselines. Also missing: verifying each lane's fixes after its review, a French pass in each walk, and the walks of lanes 56 to 58. Fix: add each with an owner and a block; the gate measure and the fix check suit Sonnet.

4. **Fable limits and the ceiling are not respected in practice.** Block C runs two Fable reviews at once (plan:464), about 800k in one five-hour window, when one 270k review met the limit tonight (plan:423). Block B can hold three helpers at once: lane 60's brief review (plan:455), S2 (plan:458), and lane 61's brief review (plan:460). The desk's own model is unnamed, against `CONTRACT.md:34`. Fix: name the desk as Opus; run Fable reviews one at a time; write the helper count beside each step; add the Sonnet citation scout before each Fable review, which `CONTRACT.md:92` practice (1) already rules and which cuts each review's cost.

5. **Decisions come after the briefs they shape.** The desk writes lane 59's brief while Dann answers (plan:452), so a 370k review can cover a brief that his answer then changes. Fix: D8, D12, D13, and D17 before lane 59's brief goes to review; D1, D2, D5, D14, D15, and D16 before lane 60's. D1 is absent from the list at plan:452.

6. **S4 waits for no reason.** His 13 takes exist (plan:422), and `SCHEDULE.md:30` calls N.200 "at risk for the 20th if the measure does not hold". Thursday (plan:470) leaves no time to act on a bad result. Fix: S4 runs Monday in Block A, after S1.

7. **Lane 61 is overloaded and its start is ambiguous.** Slice 5 does not need the seam, and plan:335 already offers it to lane 59. Fix: slice 5 goes to lane 59's last step. Say whether lane 61 starts after slice 2 or slice 3: slices 2, 3, and 4 all edit `CalibrationWizard.svelte` (plan:332-334), which has one line of headroom (plan:302).

8. **Lane 58 merges after lanes 59 and 60 are cut** (plan:461), against plan:343, and it adds to `Drawer.svelte`, 9 lines under its ceiling (plan:302). Fix: S1 reports lane 58's line counts before lane 60 is cut, or lane 58 merges first.

9. **Dann is asked two things at once.** Pictures of lanes 56 and 57 arrive (plan:453) while his decisions run (plan:452). Fix: one ordered list of Dann's items for each block, one open at a time.

10. **Sections 7.3 and 12.2 disagree** on whether the words come before the briefs (plan:344, plan:458). Fix: say section 12 governs. The English sheet can go to him in Block A, because section 5's drafts exist (plan:242).

11. **Nights are unplanned.** `CONTRACT.md:35` allows no helper round while he sleeps unless he asked. Fix: say which reviews, if any, he permits overnight (question 3).

## Only Dann can decide

1. If lane 61 or the GUIDE is not walked by Thursday noon, the release date moves, yes or no?
2. About forty strings arrive as one English sheet and one French sheet, in place of one string in each message, yes or no?
3. A Fable review may run overnight while you sleep, yes or no?

## What I did not check

- The clone is at `fb9d829`, behind the plan's `2c07ab75`. QUEUE row 193 and lane 58 are absent from it, and rows 191 and 192 there read NOT STARTED.
- The weekly Fable allowance ("two resets in hand", plan:351), and the 370k and 400k rates.
- How a lane's build reaches his phone before its merge (plan:464): NOT ESTABLISHED.
- N.200's Steps 5 and 6, so whether S4 suits Sonnet.
- Sections 2 to 6 beyond the lines cited; no code was read and no test run.
- From memory: only the house style. No fact above rests on it.
