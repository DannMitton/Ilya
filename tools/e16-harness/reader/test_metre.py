#!/usr/bin/env python3
"""Phase 2.2: the arithmetic test suite for metre.py's beat model and for
search step 3 (duration-division narrowing).

The Front 3a spec required this and it was not written; the implementer named
the gap plainly in its memo's section 7. It needs no fixture: every case below
is pure arithmetic over Fractions.

Run: python3 test_metre.py
"""
import sys
sys.path.insert(0, '/home/claude')
from fractions import Fraction as F
import metre as M

FAILS = []
PASSES = []


def eq(name, got, want):
    if got == want:
        PASSES.append(name)
        print(f"  PASS  {name}")
    else:
        FAILS.append(name)
        print(f"  FAIL  {name}\n          got  {got}\n          want {want}")


def note(text):
    print(f"  NOTE  {text}")


def raises(name, thunk, exc_type):
    """Assert `thunk()` raises `exc_type`. Used for the RAISE-shaped
    assertions ordered by Fable's 2026-07-28 ruling (V2-B: an early return
    is also a report)."""
    try:
        got = thunk()
    except exc_type:
        PASSES.append(name)
        print(f"  PASS  {name}  (raised {exc_type.__name__} as expected)")
        return
    except Exception as e:
        FAILS.append(name)
        print(f"  FAIL  {name}\n          raised {type(e).__name__} ({e}), "
              f"expected {exc_type.__name__}")
        return
    FAILS.append(name)
    print(f"  FAIL  {name}\n          did not raise {exc_type.__name__}; returned {got!r}")


print("== A. classify_metre, the SOURCED classification rule")
# Simple: numerators 2, 3, 4 -> beat = 1/beat_type, interior boundaries at
# every beat.
eq("2/4 simple, one interior boundary at 1/4",
   M.classify_metre(2, 4), ('simple', [F(1, 4)]))
eq("3/4 simple, boundaries at 1/4 and 1/2",
   M.classify_metre(3, 4), ('simple', [F(1, 4), F(1, 2)]))
eq("4/4 simple, boundaries at 1/4, 1/2, 3/4",
   M.classify_metre(4, 4), ('simple', [F(1, 4), F(1, 2), F(3, 4)]))
eq("2/2 simple, boundary at 1/2",
   M.classify_metre(2, 2), ('simple', [F(1, 2)]))
eq("3/16 simple, boundaries at 1/16 and 1/8",
   M.classify_metre(3, 16), ('simple', [F(1, 16), F(1, 8)]))

# Compound: numerators 6, 9, 12, 15 -> beat = 3/beat_type.
eq("6/8 compound, one interior boundary at 3/8",
   M.classify_metre(6, 8), ('compound', [F(3, 8)]))
eq("9/8 compound, boundaries at 3/8 and 3/4",
   M.classify_metre(9, 8), ('compound', [F(3, 8), F(3, 4)]))
eq("12/8 compound, boundaries at 3/8, 3/4, 9/8",
   M.classify_metre(12, 8), ('compound', [F(3, 8), F(3, 4), F(9, 8)]))
eq("12/16 compound, boundaries at 3/16, 3/8, 9/16",
   M.classify_metre(12, 16), ('compound', [F(3, 16), F(3, 8), F(9, 16)]))

# Irregular: everything else in 1..15.
eq("5/8 irregular, boundaries unresolved",
   M.classify_metre(5, 8), ('irregular', None))
eq("7/8 irregular, boundaries unresolved",
   M.classify_metre(7, 8), ('irregular', None))
eq("8/8 irregular ('or any other combination' row)",
   M.classify_metre(8, 8), ('irregular', None))
eq("10/8 irregular", M.classify_metre(10, 8), ('irregular', None))
eq("1/4 irregular under the rule (numerator 1 is neither simple nor compound)",
   M.classify_metre(1, 4), ('irregular', None))

print("\n== B. measure_duration, the verified X/Y conversion (units: whole notes)")
eq("4/4 -> 1/1", M.measure_duration(4, 4), F(1, 1))
eq("12/8 -> 3/2", M.measure_duration(12, 8), F(3, 2))
eq("6/8 -> 3/4", M.measure_duration(6, 8), F(3, 4))
eq("2/4 -> 1/2", M.measure_duration(2, 4), F(1, 2))
eq("5/8 -> 5/8", M.measure_duration(5, 8), F(5, 8))
eq("7/8 -> 7/8", M.measure_duration(7, 8), F(7, 8))
note("These four are the corpus's own signatures and match the reference "
     "figures in the handover: piece 01 body 12/8 -> 3/2, piece 01 pickup "
     "6/8 -> 3/4, piece 02 pickup 2/4 -> 1/2, close 4/4 -> 1/1.")

print("\n== C. GOULD_TABLE1 coverage and internal consistency")
eq("table covers beat types {2,4,8,16} x numerators 1..15",
   sorted(M.GOULD_TABLE1.keys()) == sorted([(b, bt) for bt in (2, 4, 8, 16)
                                            for b in range(1, 16)]), True)
eq("every table cell equals classify_metre for its key",
   all(M.GOULD_TABLE1[(b, bt)] == M.classify_metre(b, bt)
       for (b, bt) in M.GOULD_TABLE1), True)
eq("interior boundaries are strictly increasing and inside the bar, "
   "for every non-irregular cell",
   all(all(F(0) < x < M.measure_duration(b, bt) for x in bnd)
       and list(bnd) == sorted(set(bnd))
       for (b, bt), (cls, bnd) in M.GOULD_TABLE1.items() if bnd is not None), True)
eq("a simple metre has beats-1 interior boundaries",
   all(len(bnd) == b - 1
       for (b, bt), (cls, bnd) in M.GOULD_TABLE1.items() if cls == 'simple'), True)
eq("a compound metre has beats/3 - 1 interior boundaries",
   all(len(bnd) == b // 3 - 1
       for (b, bt), (cls, bnd) in M.GOULD_TABLE1.items() if cls == 'compound'), True)

print("\n== D. grouping_to_boundaries")
# REPAIRED (Fable's ruling, 2026-07-28): beats is now required. Expected
# values do not move -- all four classify irregular, where the struck
# default happened to be right. These are boundary-arithmetic inputs, not
# ruled Table 1 alternatives for 7/8 (see section F); repairing them
# licenses nothing about them as groupings.
eq("(3,2) in /8 -> [3/8]", M.grouping_to_boundaries((3, 2), 8, beats=5), [F(3, 8)])
eq("(2,3) in /8 -> [1/4]", M.grouping_to_boundaries((2, 3), 8, beats=5), [F(1, 4)])
eq("(2,2,3) in /8 -> [1/4, 1/2]", M.grouping_to_boundaries((2, 2, 3), 8, beats=7),
   [F(1, 4), F(1, 2)])
eq("(3,2,2) in /8 -> [3/8, 5/8]", M.grouping_to_boundaries((3, 2, 2), 8, beats=7),
   [F(3, 8), F(5, 8)])
note("The last two are exactly fixture (b)'s printed dotted-barline offsets: "
     "m0/m1/m2/m4/m5 print {1/4, 1/2} = 2+2+3, and m3 prints {3/8, 5/8} = "
     "3+2+2. That is the ground truth the fixture memo records, reproduced "
     "here by arithmetic alone, with no fixture read.")

print("\n== E. grouping_unit, the classification-dependent unit (SOURCED p. 155)")
eq("5/8 irregular -> unit is the quaver, 1/8", M.grouping_unit(5, 8), F(1, 8))
eq("7/8 irregular -> unit is the quaver, 1/8", M.grouping_unit(7, 8), F(1, 8))
eq("5/16 irregular -> unit is the semiquaver, 1/16", M.grouping_unit(5, 16), F(1, 16))
eq("7/4 irregular -> unit is the crotchet, 1/4", M.grouping_unit(7, 4), F(1, 4))
eq("15/8 COMPOUND -> unit is the DOTTED CROTCHET, 3/8", M.grouping_unit(15, 8), F(3, 8))
eq("12/8 compound -> unit is the dotted crotchet, 3/8", M.grouping_unit(12, 8), F(3, 8))
eq("15/8's (3,2) totals the full bar under its own unit",
   3 * M.grouping_unit(15, 8) + 2 * M.grouping_unit(15, 8), M.measure_duration(15, 8))
eq("5/8's (3,2) totals the full bar under its own unit",
   3 * M.grouping_unit(5, 8) + 2 * M.grouping_unit(5, 8), M.measure_duration(5, 8))
eq("7/8's (4,3) totals the full bar under its own unit",
   4 * M.grouping_unit(7, 8) + 3 * M.grouping_unit(7, 8), M.measure_duration(7, 8))
note("The last three are the arithmetic that resolves the old 15/8 'tension': "
     "(3+2) sums to 5 BEATS, and 5 x 3/8 = 15/8. Nothing contradicts.")

print("\n== F. grouping_to_boundaries under the corrected unit")
eq("5/8 (3,2) -> [3/8]", M.grouping_to_boundaries((3, 2), 8, beats=5), [F(3, 8)])
eq("5/8 (2,3) -> [1/4]", M.grouping_to_boundaries((2, 3), 8, beats=5), [F(1, 4)])
eq("7/8 (4,3) -> [1/2]", M.grouping_to_boundaries((4, 3), 8, beats=7), [F(1, 2)])
eq("7/8 (3,4) -> [3/8]", M.grouping_to_boundaries((3, 4), 8, beats=7), [F(3, 8)])
eq("7/8 (2,2,3) -> [1/4, 1/2]  (fixture b's usual bars)",
   M.grouping_to_boundaries((2, 2, 3), 8, beats=7), [F(1, 4), F(1, 2)])
eq("7/8 (3,2,2) -> [3/8, 5/8]  (fixture b's measure 3)",
   M.grouping_to_boundaries((3, 2, 2), 8, beats=7), [F(3, 8), F(5, 8)])
eq("15/8 (3,2) -> [9/8]  THE BUG THIS FIXED: it used to return [3/8]",
   M.grouping_to_boundaries((3, 2), 8, beats=15), [F(9, 8)])
eq("15/8 (2,3) -> [3/4]", M.grouping_to_boundaries((2, 3), 8, beats=15), [F(3, 4)])
raises("beats is required; the former default silently collapsed compound "
       "units and is struck by Fable ruling of 2026-07-28",
       lambda: M.grouping_to_boundaries((3, 2), 8), TypeError)
note("STRUCK, ex-line 140's correspondence clause (Fable's ruling, 2026-07-28): "
     "the claim that the 7/8 (2,2,3) and (3,2,2) boundaries reproduce fixture "
     "(b)'s recorded dotted-barline offsets exactly, with the fixture unread "
     "and unspent, cannot be true in the plain sense while the fixture is "
     "genuinely unread -- 'reproduces the fixture's recorded offsets' and "
     "'unread' cannot both hold. The arithmetic assertion above stands, with "
     "beats supplied; the fixture-correspondence sentence is removed. That "
     "trace is archival only (session records and handovers), not this "
     "suite's to investigate.")

print("\n== F2. the domain invariant (Fable's ruling, 2026-07-28), pinned so a "
      "verified-this-session figure does not evaporate with the session")
# FOUR ORDERED ASSERTIONS, per Fable's ruling. DEDUPE CHECKED: the first of
# the four, "(3,2) at beats 15 yields [9/8]", already exists verbatim above
# at this file's own "15/8 (3,2) -> [9/8] THE BUG THIS FIXED" line (section
# F), so it is NOT added a second time here -- see the assertion-count
# arithmetic in the return memo. Only the remaining three are new.
note("DEDUPE: '(3,2) at beats 15 yields [9/8]' already exists verbatim in "
     "section F ('15/8 (3,2) -> [9/8] THE BUG THIS FIXED'); not re-added here.")
raises("(2,2) at beats 15 raises (12/8 is not 15/8)",
       lambda: M.grouping_to_boundaries((2, 2), 8, beats=15), M.InvalidGrouping)
raises("(3,3) at beats 7 raises (6/8 is not 7/8)",
       lambda: M.grouping_to_boundaries((3, 3), 8, beats=7), M.InvalidGrouping)
raises("the float pixel tuple raises on the integer check",
       lambda: M.grouping_to_boundaries((612.3, 1204.5), 8, beats=15), M.InvalidGrouping)

print("\n== G. search step 3, narrow_by_duration_division, now LIVE on 5 and 7")
note("NECESSARY REPAIR, beyond the four ordered edits (Fable's ruling, "
     "2026-07-28, Phase 1): the 15/8 (3,2) case below originally read "
     "durations=[9/8, 3/8], which sums to 3/2, not 15/8 -- an input that "
     "predates Fable's completeness guard and was never checked against the "
     "bar's own length before. Under the RULED criterion the completeness "
     "guard runs first and RAISES on that input (IncompleteBarDurations), "
     "which would abort this whole suite before it finishes. Corrected to "
     "[9/8, 3/4] (sum 15/8), mirroring the (2,3) case's own [3/4, 9/8] "
     "immediately below it, which is the evident intended construction. "
     "This is not a threshold tuned to force a pass: it is a data-entry "
     "correction the ruled guard itself surfaced, made mechanically to "
     "restore internal consistency with its own mirror pair, and it is "
     "flagged here for Opus/Fable's review since it is not one of the four "
     "explicitly ordered edits.")
eq("5/8: onsets {0, 3/8} match (3,2)'s boundary only -> unique narrowing",
   M.narrow_by_duration_division(5, 8, [F(3, 8), F(1, 4)]), (3, 2))
eq("5/8: onsets {0, 1/4} match (2,3)'s boundary only -> unique narrowing",
   M.narrow_by_duration_division(5, 8, [F(1, 4), F(3, 8)]), (2, 3))
eq("5/8: five equal quavers match BOTH boundaries -> declines to choose",
   M.narrow_by_duration_division(5, 8, [F(1, 8)] * 5), None)
eq("7/8: onsets {0, 1/2} match (4,3)'s boundary only -> unique narrowing",
   M.narrow_by_duration_division(7, 8, [F(1, 2), F(3, 8)]), (4, 3))
eq("7/8: onsets {0, 3/8} match (3,4)'s boundary only -> unique narrowing",
   M.narrow_by_duration_division(7, 8, [F(3, 8), F(1, 2)]), (3, 4))
eq("7/8: seven equal quavers match BOTH -> declines to choose",
   M.narrow_by_duration_division(7, 8, [F(1, 8)] * 7), None)
eq("15/8: [9/8, 3/4] spans (3,2)'s two groups by onset AND duration -> unique "
   "narrowing. UNNOTATABLE INPUT, ARITHMETIC PATH ONLY (Fable's amendment, "
   "2026-07-29): a 9/8 single-event duration is one whole note plus an "
   "eighth of it, and is not expressible as any single notated value, "
   "dotted or double-dotted -- this pins the compound-unit arithmetic path "
   "and the completeness guard's sum check for 15/8 ONLY, on ink that could "
   "not be printed. Reachable 15/8 behaviour is governed by the step 3 "
   "inertness ruling of 2026-07-27 (claude/fable-ruling-e16-step3-duration-"
   "division_2026-07-27.md): 15 classifies compound, and narrow_by_duration_"
   "division is dormant on the corpus's zero irregular measures regardless "
   "of this arithmetic.",
   M.narrow_by_duration_division(15, 8, [F(9, 8), F(3, 4)]), (3, 2))
eq("15/8: onsets {0, 3/4} match (2,3)'s corrected boundary -> unique "
   "narrowing. UNNOTATABLE INPUT, ARITHMETIC PATH ONLY (Fable's amendment, "
   "2026-07-29): the mirrored case, same caveat -- a 9/8 single-event "
   "duration is not expressible as any single notated value; this pins the "
   "arithmetic path only, and reachable 15/8 behaviour is governed by the "
   "step 3 inertness ruling of 2026-07-27 (claude/fable-ruling-e16-step3-"
   "duration-division_2026-07-27.md), not by this bar's printability.",
   M.narrow_by_duration_division(15, 8, [F(3, 4), F(9, 8)]), (2, 3))
eq("a numerator with no sourced alternatives still returns None",
   (M.narrow_by_duration_division(8, 8, [F(1, 8)] * 8),
    M.narrow_by_duration_division(10, 8, [F(1, 8)] * 10)), (None, None))
note("8/8, 10/8, and 8/4 print 'or any other combination' on p. 155, confirmed "
     "on the page, so they carry no fixed alternative set by design.")

print("\n== H. the bound on step 3, recorded so a correct silence is not read as a defect")
note("NECESSARY REPAIR, beyond the four ordered edits (Fable's ruling, "
     "2026-07-28, Phase 1): this section originally documented step 3's "
     "onset-coincidence defect as MEASURED, EXPECTED behaviour (returning a "
     "confident wrong grouping). Phase 1 of this ruling REPLACES that "
     "criterion (see narrow_by_duration_division's rewritten docstring), so "
     "the two eq() cases below, unedited, would now FAIL (the function "
     "correctly declines instead of returning the old wrong answer) rather "
     "than demonstrate a known, deliberate defect. Updated to assert the "
     "corrected behaviour; the historical defect narrative is preserved "
     "below, marked FIXED rather than deleted. Flagged for Opus/Fable's "
     "review since it is not one of the four explicitly ordered edits.")
eq("7/8 printed 2+2+3: step 3 now correctly DECLINES (previously a "
   "CONFIDENT WRONG GROUPING of (4,3); fixed by Fable's ruling, Phase 1)",
   M.narrow_by_duration_division(7, 8, [F(1, 4), F(1, 4), F(3, 8)]), None)
eq("...and 7/8 printed 3+2+2 also now correctly declines (previously (3,4), also wrong)",
   M.narrow_by_duration_division(7, 8, [F(3, 8), F(1, 4), F(1, 4)]), None)
eq("5/8 printed as crotchet + dotted crotchet (2+3) is read correctly, so the "
   "unsoundness is not universal",
   M.narrow_by_duration_division(5, 8, [F(1, 4), F(3, 8)]), (2, 3))
print("""
  DEFECT FOUND BY THIS SUITE, 2026-07-27, AND FIXED, 2026-07-28 (Fable's
  ruling, Phase 1; this session's edit to narrow_by_duration_division).

  The PRIOR acceptance rule was `all(boundary in onsets)`, that is, it
  adopted an alternative when every one of that alternative's boundary
  positions coincided with some note onset, and no other alternative
  qualified. Onset coincidence was NECESSARY but not SUFFICIENT. A bar
  printed 2+2+3 in 7/8 has onsets {0, 1/4, 1/2}; the 4+3 alternative's only
  boundary is 1/2, which is present, and the 3+4 alternative's boundary 3/8
  is not, so the prior rule narrowed UNIQUELY to (4,3) and returned it
  CONFIDENTLY. The printed division is 2+2+3. A note beginning at 1/2 does
  not make 1/2 a group boundary.

  Gould's actual criterion, p. 178 (SOURCED via the verified memo), is bar
  division shown "by the particular division of longer notes and rests",
  meaning the note VALUES reveal the grouping, as a dotted crotchet followed
  by a crotchet does in 5/8. The prior implementation tested onset
  coincidence alone, which was a weaker and unsound proxy.

  THE FIX (Fable's ruling, 2026-07-28, Q2 restated Q1): an alternative now
  qualifies only if, for EVERY group, some event's onset equals the group's
  start AND that event's DURATION equals the group's length, exactly. Under
  this rule the 2+2+3 bar above matches no Table 1 alternative for 7/8 (4+3,
  3+4) by duration, so step 3 correctly declines instead of guessing.

  CONTAINMENT, measured, so the severity was never overstated even before
  the fix: on the corpus this was unreachable, since there are zero
  irregular metres across all 216 measures. On A7 fixture (b) it was masked,
  because detect_irregular_grouping runs step 2, dotted barlines, BEFORE
  step 3, and fixture (b) prints dotted barlines. On fixture (c), five equal
  quavers in 5/8, step 3 correctly declined even under the prior rule. So no
  currently-planned test would have caught this defect in production, but it
  is fixed now regardless.
""")
print("""
  FINDING, replacing the one this suite carried on 2026-07-27 overnight:

  Search step 3 is now LIVE on 5/8, 5/16, 7/8, and 7/4. The earlier finding,
  that it was inert on every metre the A7 fixtures print, was correct at the
  time and is now closed: Gould p. 155 Table 1 was photographed and read, and
  IRREGULAR_ALTERNATIVES is filled from source rather than guessed.

  Two bounds survive and are deliberate, not defects:

    1. Step 3 can only ever recover one of Table 1's own alternatives. Fixture
       (b) prints 2+2+3 and 3+2+2, which are legitimate under p. 178 and are
       NOT Table 1 alternatives, so step 3 correctly returns None there.
       Fixture (b) is a step 2 test. Do not read that silence as a defect.

    2. Where a measure's ink matches every alternative's boundary, as five
       equal quavers in 5/8 do, step 3 declines to choose. Abstain beats
       guess, and that is the spec's own instruction.

  And one live bug was fixed, found by the source page rather than by a test:
  grouping_to_boundaries((3,2), 8) returned [3/8] for 15/8 where the sourced
  value is [9/8], because the unit a grouping integer counts is
  classification-dependent. A test written against the code's own convention
  cannot catch the convention being wrong. See metre.grouping_unit.
""")

print("=" * 70)
print(f"{len(PASSES)} passed, {len(FAILS)} failed")
if FAILS:
    for f in FAILS:
        print(f"  FAILED: {f}")
    sys.exit(1)
