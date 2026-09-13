You are Claude Code, working in ~/Desktop/ilya-rewrite on branch Shane.

Read docs/memory/CONTRACT.md in full before you touch anything. It is short and
it governs this task. Then read docs/sessions/brief-colour-token-rename_r1_2026-09-13.md,
which is the brief. This message carries three corrections to that brief; where
they disagree, this message is later and wins.

## The task: colour story stage 3a. A pure rename.

--dusty-rose       becomes  --rose
--deeper-lavender  becomes  --lavender
--quiet-cobalt     becomes  --cobalt

--sage is already a one-word name and does not move.

NO HEX VALUE CHANGES ANYWHERE. If a value moves, you have done something this
task did not ask for. Stop and say so.

## Correction 1: the brief's counts include generated output. Use these.

The brief says 25 / 49 / 21 sites across 12 / 22 / 15 files. Those numbers
count matches inside apps/web/.svelte-kit and apps/web/build, which are
generated and must not be edited.

Counted by the desk on 2026-09-13 over apps/web/src and packages/*/src only:

--dusty-rose        19 sites across 6 files
--deeper-lavender   43 sites across 13 files
--quiet-cobalt      12 sites across 6 files

Confirm these yourself before you start and report what you find. Do not trust
either set of numbers. Edit nothing under .svelte-kit, build, dist, or
node_modules: those regenerate from source.

## Correction 2: one site the brief does not name.

apps/web/src/app.css:160 reads

	--lang-chip-guide: var(--quiet-cobalt);  /* the band itself, undarkened */

so it is a rename site. Cobalt's chip is an alias of its band rather than a
separate value. apps/web/src/lib/components/HeaderBar.svelte:219 writes
var(--lang-chip-guide, #5C739E); the token name there does not change and
neither does the fallback hex.

## Correction 3: the brief's reason for leaving two tokens alone is stale.

Brief section 2 says --muted-lavender and --light-lavender stay, and gives as
its reason "Dann has not opposed it". He has since ruled on them. On 2026-09-13
he ruled both for DELETION (see docs/memory/STATE.md, THE ONE THING, RULED 3 OF 4).

They still do not move in this pass. The deletion belongs to a later stage and
carries a companion edit to contrast.ts and contrast.test.ts. So: leave both
exactly as they are, and do not act on the brief's stale rationale in either
direction.

## How to edit

Edit by anchor, per CONTRACT section 5. Assert every anchor before you write it.
Refuse on anything but exactly one match unless you can say in advance why two.
Do not run a blind find-and-replace across the repository.

A var() fallback carries the old name in some places: the token name changes,
the fallback hex does not.

Comments in app.css explain how each chip was derived from its band by hand.
Update the token names inside that prose so the comment still tells the truth,
and change nothing else about it.

Nothing in docs/ is rewritten. The record says what it said at the time.

## The control rule, and it applies here

State your expectation in the message BEFORE you run the gates, and name your
likeliest failure mode. docs/memory/ENVIRONMENT.md records that a CSS-only
change moves no gate, confirmed twice in E.51, and the tests assert hex literals
rather than token names. So the expected result is that no gate moves at all.
Report against that prediction.

Run all five gates yourself. In Claude Code they run in about a minute in one
command. Do not ask Dann to paste output back to you.

~/Downloads/ilya-ship.sh is the instrument for the baselines; ENVIRONMENT.md's
table follows the script and may lag it. Read the script rather than trusting
the table, and if a gate number differs from the script, say so and stop rather
than editing the script.

## Definition of done

1. grep -rn -- "--dusty-rose\|--deeper-lavender\|--quiet-cobalt" over
   apps/web/src and packages/*/src returns nothing.
2. The same grep over docs/ is untouched. Say how many hits remain there so the
   number is on the record.
3. All five gates at their baselines, and gate 4 has not moved.
4. At 1400 px, open each of the four documents and confirm the desk, the band
   and the language chip are the colours they were. State the expectation before
   you look. WRITTEN is not DONE: this step is what makes it done.

## What you must not do

NO GIT COMMANDS THAT WRITE. No add, no commit, no push, no checkout, no reset,
no restore, no stash, no rm, no mv, no merge, no rebase, no tag. No agent
commits, ever, and no agent stages. Read-only git is allowed: status, log, diff,
show, ls-files, check-ignore.

Do not ship. Do not deploy. Ask Dann to commit when you are done.

## The return memo

Write docs/sessions/memo-colour-token-rename_r1_<today's date>.md containing:
the confirmed counts against the desk's, every file touched, the grep results
from the definition of done, the five gate numbers against your stated
prediction, and a section headed WHAT I COULD NOT ESTABLISH.

NOT ESTABLISHED beats a complete invented answer.
