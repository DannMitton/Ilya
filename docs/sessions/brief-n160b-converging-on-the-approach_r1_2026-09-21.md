# BRIEF — N.160b. Converging on the approach

**Written 2026-09-21, 02:40, by the desk. For Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**
**Answers `memo-n160-the-work-and-its-views_r1_2026-09-21.md`, read in full by the desk.**

**STILL NO APPLICATION CODE.** This brief settles the disagreements and asks for one
converged plan. Dann's instruction: *"devise an approach that works for the user as well as
for the system."* Both halves, explicitly, at every step.

---

## 1. WHAT THE DESK ACCEPTS. Do not re-argue these

**Your root cause beats the desk's.** The desk said the problem is two copies of the text.
You showed it is narrower and more precise: a seat's link to its word survives only as long
as the session remembers the PREVIOUS text, because the diff compares against
`transcribedGrid`, which is never stored (`+page.svelte:2926`), and a Clear, a song switch,
or a reload empties it while Clear leaves the seats in place (`:2552-2562`). **That is the
finding this work is built on.**

**Your correction to the desk's shape is accepted.** "Store the decision, not the text" was
wrong. Once an address is dead, the stored letters are the only thing that can find the word
again, and `SlotOrigin.word` is already ruled to be exactly that discriminator
(`pairings.ts:81-93`, Dann 2026-08-13). The anchor stays. The address becomes a cache.

**The joined-run rule is adopted.** An old word matching a run of adjacent current words
whose letters join to the same thing, so «непроглядная» finds «не» + «проглядная». **This
replaces an entire text-curation subsystem the desk was drifting toward and should not
build.** The engraver's split stops being a corruption to repair and becomes a match to
recognize. Say so plainly in the converged plan, because it is the strongest argument in it.

**Your §4.2 answer is accepted:** the score's lyric becomes the work's text, and
`reseat.ts:186-196` then has nothing left to protect.

---

## 2. THREE CORRECTIONS

### 2.1 "A seat whose word has left the text draws nothing" is NOT a desk default

**Take it out of the defaults and put it to Dann as a ruling.**

Your memo says this is your reading of his *"irrelevant … the poem they arrive with now."*
His sentence was about not surfacing history to the singer. **Blanking a note is a different
act: it removes something the singer can currently see, on the page that goes on the music
stand.**

**And its blast radius is unmeasured.** Under the joined-run rule, all 25 of his notes should
recover, so nobody knows how often this would actually fire on a real song. **Do not ship a
visible deletion whose frequency is NOT ESTABLISHED.**

**Instead: instrument it.** Steps 1 and 2 should count how many seats end up unresolved on
his library, so the ruling is made against a number rather than a hypothesis.

### 2.2 Unresolved means KEEP WHAT YOU HAD, never erase

**This is the safety rule that governs everything in this item, and it must be stated in the
plan.**

Your guard against a spurious match on «и», «в» or «не» is sound. The memo does not say what
happens when the guard **rejects** a match. If rejection blanks the note, a cautious guard
becomes a destructive one, and every false negative costs the singer visible work.

**A seat that cannot be resolved keeps its stored text and is counted.** That is the
behaviour until Dann rules otherwise under 2.1.

### 2.3 Drop the "nobody has reported it" justification

You defend the spurious-match exposure by noting the same risk exists today for the stress
and gloss overrides and nobody has reported it. **Nobody reported Dann's 25 frozen notes
either, for weeks, and he found them by accident tonight.** In a one-singer beta, silence is
not evidence. The guard is still right; the argument for it is not.

---

## 3. ONE QUESTION TO ANSWER BEFORE THE PLAN

**You found that the missing thing is the stored previous text. Why not store it?**

Persisting `transcribedGrid` with the song record would close every FUTURE case of this
fault with no matching, no heuristic, and no guard. It would not heal the seats already
frozen, which is why anchor re-finding is still needed for those.

**Answer with `path:line`:** what it would cost in the record, whether it makes step 2
smaller or larger, and whether the two together are belt and braces or whether one makes the
other unnecessary. **If re-finding by anchor makes stored text redundant, say so and the
question closes.**

---

## 4. WHAT THE CONVERGED PLAN MUST CONTAIN

One memo. For **every** step, both halves, in this order:

1. **What the singer gets.** What changes on their screen, in words a singer would use.
   Dann has corrected the desk twice tonight for leading with code.
2. **What the system gets.** What retires, what simplifies, what stops being possible to get
   wrong. Name the functions that go away.
3. **What it costs**, and what is NOT ESTABLISHED about that cost.
4. **How it is walked**, and by whom.

And across the whole plan:

- **The first shippable step**, which the desk reads as your drawing step, since it is the
  only one a singer sees immediately.
- **The step that unfreezes Dann's song**, and a walk of it **on his own library**, because
  his is the only copy that carries the fault.
- **A phone walk.** Your 8 to 30 ms click-to-paint is headless desktop Chromium on a dev
  build. Ilya's singer is on a phone. **This is a walk at step 1, not more benchmarking.**
- **What ships before 2026-10-30 and what does not.** `SCHEDULE.md` has weeks 2 to 7
  already committed. Say what this displaces.
- **The one ruling left for Dann**, isolated and stated in a singer's terms, not the code's.

---

## 5. WHAT MUST NOT BE TAKEN FROM THE SINGER

Unchanged from `brief-n160-the-work-and-its-views_r1_2026-09-21.md` §6, plus:

5. **Nothing a singer can currently see disappears without their ruling.** §2.1 and §2.2.

---

## 6. WHAT YOU COULD NOT ESTABLISH

Fill it. **NOT ESTABLISHED beats a complete invented answer.**

---

## 7. RETURN MEMO

`docs/sessions/memo-n160b-the-approach_r1_2026-09-21.md`. The converged plan, no code.
