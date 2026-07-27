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
eq("(3,2) in /8 -> [3/8]", M.grouping_to_boundaries((3, 2), 8), [F(3, 8)])
eq("(2,3) in /8 -> [1/4]", M.grouping_to_boundaries((2, 3), 8), [F(1, 4)])
eq("(2,2,3) in /8 -> [1/4, 1/2]", M.grouping_to_boundaries((2, 2, 3), 8),
   [F(1, 4), F(1, 2)])
eq("(3,2,2) in /8 -> [3/8, 5/8]", M.grouping_to_boundaries((3, 2, 2), 8),
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
eq("beats defaults to sum(grouping), which preserves every irregular call site",
   M.grouping_to_boundaries((3, 2), 8), M.grouping_to_boundaries((3, 2), 8, beats=5))
note("The 7/8 (2,2,3) and (3,2,2) boundaries reproduce fixture (b)'s recorded "
     "dotted-barline offsets exactly, with the fixture unread and unspent.")

print("\n== G. search step 3, narrow_by_duration_division, now LIVE on 5 and 7")
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
eq("15/8: onsets {0, 9/8} match (3,2)'s corrected boundary -> unique narrowing",
   M.narrow_by_duration_division(15, 8, [F(9, 8), F(3, 8)]), (3, 2))
eq("15/8: onsets {0, 3/4} match (2,3)'s corrected boundary -> unique narrowing",
   M.narrow_by_duration_division(15, 8, [F(3, 4), F(9, 8)]), (2, 3))
eq("a numerator with no sourced alternatives still returns None",
   (M.narrow_by_duration_division(8, 8, [F(1, 8)] * 8),
    M.narrow_by_duration_division(10, 8, [F(1, 8)] * 10)), (None, None))
note("8/8, 10/8, and 8/4 print 'or any other combination' on p. 155, confirmed "
     "on the page, so they carry no fixed alternative set by design.")

print("\n== H. the bound on step 3, recorded so a correct silence is not read as a defect")
# DEFECT, recorded as measured behaviour rather than as a passing test.
eq("7/8 printed 2+2+3 makes step 3 return (4,3): a CONFIDENT WRONG GROUPING",
   M.narrow_by_duration_division(7, 8, [F(1, 4), F(1, 4), F(3, 8)]), (4, 3))
eq("...and 7/8 printed 3+2+2 makes it return (3,4), also wrong",
   M.narrow_by_duration_division(7, 8, [F(3, 8), F(1, 4), F(1, 4)]), (3, 4))
eq("5/8 printed as crotchet + dotted crotchet (2+3) is read correctly, so the "
   "unsoundness is not universal",
   M.narrow_by_duration_division(5, 8, [F(1, 4), F(3, 8)]), (2, 3))
print("""
  DEFECT FOUND BY THIS SUITE, reported and NOT fixed here.

  narrow_by_duration_division's acceptance rule is `all(boundary in onsets)`,
  that is, it adopts an alternative when every one of that alternative's
  boundary positions coincides with some note onset, and no other alternative
  qualifies. Onset coincidence is NECESSARY but not SUFFICIENT. A bar printed
  2+2+3 in 7/8 has onsets {0, 1/4, 1/2}; the 4+3 alternative's only boundary
  is 1/2, which is present, and the 3+4 alternative's boundary 3/8 is not, so
  the rule narrows UNIQUELY to (4,3) and returns it CONFIDENTLY. The printed
  division is 2+2+3. A note beginning at 1/2 does not make 1/2 a group
  boundary.

  Gould's actual criterion, p. 178 (SOURCED via the verified memo), is bar
  division shown "by the particular division of longer notes and rests",
  meaning the note VALUES reveal the grouping, as a dotted crotchet followed
  by a crotchet does in 5/8. The implementation tests onset coincidence
  instead, which is a weaker and unsound proxy.

  CONTAINMENT, measured, so the severity is not overstated: on the corpus this
  is unreachable, since there are zero irregular metres across all 216
  measures. On A7 fixture (b) it is masked, because detect_irregular_grouping
  runs step 2, dotted barlines, BEFORE step 3, and fixture (b) prints dotted
  barlines. On fixture (c), five equal quavers in 5/8, step 3 correctly
  declines. So no currently-planned test would have caught it.

  This is a SPEC-LEVEL question, not a code tweak: what makes a division
  "revealed by note values" is Fable's to rule. It is reported, not fixed.
  metre.py's narrow_by_duration_division is unchanged.
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
