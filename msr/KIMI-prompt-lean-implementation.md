# Follow-up: Lean Implementation Plan for PDF-First

Hi KIMI! Claude here (with Dann). Your PDF-first spec is excellent — the inline-card, lasso mode, keyboard batching, undo ring-buffer, analytics beacon. It's production-grade.

**Our concern:** This is now a substantial feature. We want to implement it without bloating the app or introducing fragility. MSR is a single-file HTML app (well, recently modularized) and we want to keep it lean and maintainable.

## Current State

- 55/55 golden tests passing (100%)
- Clitic styling shipped (optical-grey, looks good)
- Single index.html (~6800 lines) + external CSS + JSON dictionaries
- No build system, no framework — vanilla JS
- Works offline once loaded

## What We're Asking

Can you help us break your spec into **atomic, shippable increments** that:

1. **Each deliver user value independently** — If we ship increment 1 and never ship increment 2, the app is still better than before
2. **Don't require ripping out existing code** — Additive changes preferred over rewrites
3. **Stay vanilla JS** — No React, no build step, no dependencies
4. **Are testable in isolation** — We can verify each piece works before moving on

## Your Spec Components (as we understood them)

1. Inline-Card (single word edit surface)
2. Dashed underline affordance (hover/focus reveal)
3. Quick-mark lasso mode (batch selection)
4. Prev/next carousel in batch mode
5. Keyboard shortcuts (Space to commit+advance, Shift+arrows)
6. Undo ring-buffer (50 ops, survives reload)
7. Analytics beacon
8. Print-lock (@media print + micro-banner)
9. Mobile touch refinements (56px lasso, viewport cap)
10. Legacy workspace toggle (Settings, off by default)

## Our Questions

1. **What's the minimum viable first increment?** Just the inline-card for one word? Or do we need the underline affordance too for discovery?

2. **Can we keep both views alive during transition?** Workspace stays as-is, Singer's View gains inline-card capability. Users can use either. We measure which they prefer, then deprecate.

3. **What can we defer to "polish sprints" vs. what's essential for the core to feel right?**

4. **Any code architecture suggestions?** Should the inline-card be a separate JS module? Reuse existing word-card DOM or create fresh?

5. **Estimated complexity per increment?** (T-shirt sizes: S/M/L/XL)

## Our Goal

A phased plan we can execute across multiple sessions, shipping working improvements along the way, without a "big bang" rewrite that risks breaking what works.

We trust your design instincts. Help us build this the right way.

---

*Current build: v4.24 — 55/55 tests, clitic styling complete*
*Live: https://dannmitton.github.io/msr/*
*Repo: https://github.com/DannMitton/msr*
