#!/usr/bin/env python3
"""N.204 step 1, deliverable 1 and 5: the frozen area map of base commit b2869772, and the
commit-log measure at the frozen grain.

Run with:  python3 -I n204-area-map_r1_2026-11-23.py map     TREE_DIR OUT.json [--tests unit]
           python3 -I n204-area-map_r1_2026-11-23.py commits GITLOG.txt TREE_DIR [--tests unit] [--json OUT.json]

Standard library only. It reads file NAMES under TREE_DIR (and never opens a file there);
it executes nothing from the tree.

Every placement is a function of the path alone, so the same rules place a path that
appears in the git log but no longer exists in the tree. Rules run in this order and the
first that matches wins. Each placement records the rule that made it.

Areas are the sixteen reading units of plan-code-audit-maintainability_r9, section 6:
a to o, plus t for the tests. The plan names folders, not files, for six units. The
splits it does not enumerate are DESK DEFAULTS made here and are listed in B_FILES,
C_FILES, E_PATTERN and AMBIGUOUS below, so a later desk can change one line and re-run.
"""
import json, os, re, sys, collections, statistics

BASE = "b2869772"

# --- unit b (parsers and analysis) and unit c (renderer and layout) of packages/score-parser/src.
# The plan says only "parsers and analysis" and "renderer and layout". Stems below are the
# basenames without .ts. A score-parser source file in neither list is reported UNPLACED.
B_FILES = set("""accidental-carry analysis-types break-mark clef-select conditions demo-fixture
diction-marks grace index key-change markings mnx-parser musicxml-parser notations
performance-order phonation pickup sustain tempo-lexicon tempo-seam tempo-terms tessitura
ties-and-slurs transposition types unfold verses vocal-octave""".split())
C_FILES = set("""arc-outline barline-geometry barline-style grace-draw modification-engine
overlay-engine page-layout placeholder-mark printed-marks render-score render-seam
ring-geometry smufl-metadata staff-renderer stem-legend tacet-run tuplet-bracket
underlay-widths""".split())
# Placed by judgement because the name does not settle the side. Listed in the JSON.
AMBIGUOUS = {
    "packages/score-parser/src/break-mark.ts": "b: could be a drawn mark (c)",
    "packages/score-parser/src/clef-select.ts": "b: a choice rule, but clefs are drawn (c)",
    "packages/score-parser/src/demo-fixture.ts": "b: a built-in demo score, only tests import it in this tree",
    "packages/score-parser/src/placeholder-mark.ts": "c: drawn placeholder",
    "packages/score-parser/src/printed-marks.ts": "c: could be parsed markings (b)",
    "packages/score-parser/src/tacet-run.ts": "c: a rest-run drawing rule",
    "packages/score-parser/src/tempo-seam.ts": "b: a seam between tempo text and layout",
    "packages/score-parser/src/render-seam.ts": "c: a seam, named for rendering",
    "packages/score-parser/src/modification-engine.ts": "c: edits the drawn result",
    "packages/score-parser/src/overlay-engine.ts": "c: overlay of drawn marks",
}
# Unit e (Loupe and correction) = score/ files whose basename starts with loupe or correction.
# Everything else under score/ is f. The plan gives no file list.
E_PATTERN = re.compile(r"^(loupe|correction)", re.I)

# Non-test support files and data that only test files reference (grep of basenames,
# 2026-11-23, see report). Placed in t.
TEST_ONLY_OVERRIDES = {
    "apps/web/src/lib/syntactic-break.support.ts",
    "apps/web/src/lib/score/row108.support.ts",
    "apps/web/src/lib/score/phrase-ends.today.json",
    "apps/web/src/lib/melody/strophic-byte-baseline.json",
}
T_DIRS = {"e2e", "e2e-phone", "tests", "__fixtures__", "fixtures", "__approved__", "__golden__", "approval"}
TEST_NAME = re.compile(r"\.(test|spec)\.|\.test-support\.")

L = "apps/web/src/lib/"


def is_test(p):
    segs = p.split("/")
    if TEST_NAME.search(segs[-1]):
        return True
    if p in TEST_ONLY_OVERRIDES:
        return True
    return any(s in T_DIRS for s in segs[:-1])


def dir_unit(p):
    """The unit by directory alone, ignoring test status. Returns (area, rule) or (None, reason)."""
    segs = p.split("/")
    base = segs[-1]
    if any(s.endswith(" 2") for s in segs[:-1]):
        return None, "Finder duplicate directory ('... 2'), not source"
    if base == ".DS_Store" or base.endswith(".tsbuildinfo"):
        return None, "OS or build artefact, not source"
    if base in (".env", ".env.example"):
        return None, "environment file, not read, not source"
    if "test-results" in segs[:-1]:
        return None, "Playwright output folder"
    if len(segs) == 1:
        return None, "workspace config at the repository root"
    if segs[0] == "scripts":
        return "o", "scripts/"
    if segs[0] == "packages" and len(segs) >= 3:
        pkg = segs[1]
        if pkg in ("phonology", "dictionary", "blurb"):
            if segs[2] in ("src", "tests"):
                return "a", "packages/%s" % pkg
            return None, "package config (package.json, tsconfig, vitest config)"
        if pkg == "score-parser":
            if segs[2] != "src":
                return None, "package config (package.json, tsconfig, vitest config)"
            stem = re.sub(r"\.(svelte\.ts|ts|js|mjs)$", "", base)
            if len(segs) == 4:
                if stem in B_FILES: return "b", "score-parser/src, B_FILES"
                if stem in C_FILES: return "c", "score-parser/src, C_FILES"
                return None, "score-parser/src file in neither B_FILES nor C_FILES"
            return None, "score-parser/src subfolder (fixtures, approval, vendor) with no unit rule"
        return None, "package not named by any unit"
    if segs[0] == "apps" and len(segs) >= 3 and segs[1] == "web":
        rest = "/".join(segs[2:])
        if segs[2] == "scripts":
            return "o", "apps/web/scripts/ (DESK DEFAULT: build scripts join unit o)"
        if segs[2] in ("e2e", "e2e-phone"):
            return None, "e2e"  # resolved to t by the test overlay
        if segs[2] in ("omr-metre", "omr-underlay"):
            return None, "model reference data under apps/web/, no unit names it"
        if len(segs) == 3:
            return None, "app build config at apps/web/"
        if segs[2] == "src":
            if len(segs) == 4:
                return None, "app shell file src/app.* (outside routes/ and lib/)"
            if segs[3] == "routes":
                return "d", "src/routes"
            if segs[3] == "lib":
                r = "/".join(segs[4:])
                if len(segs) == 5:
                    return "n", "lib/*.ts top level (unit n)"
                s4 = segs[4]
                if s4 == "components":
                    if len(segs) == 6:
                        return "h", "components/ loose files (unit h)"
                    s5 = segs[5]
                    if s5 == "Drawer": return "g", "components/Drawer"
                    if s5 in ("Paper", "Welcome", "Field"): return "h", "components/" + s5
                    if s5 == "Reading":
                        return None, "components/Reading/ is named by no unit in the plan (unit h's read notes it as a further 585,156 bytes)"
                    return None, "components subfolder named by no unit"
                if s4 == "score":
                    return ("e", "score/ Loupe and correction") if E_PATTERN.match(base) else ("f", "score/ the rest")
                if s4 == "voice":
                    if len(segs) > 6 and segs[5] in ("engine", "chart"):
                        return "i", "voice/" + segs[5]
                    return "j", "voice/ the rest"
                if s4 == "omr": return "k", "omr/"
                if s4 in ("insights", "analysis", "melody", "tempo"): return "l", s4 + "/"
                if s4 in ("library", "text"): return "m", s4 + "/"
                if s4 == "reader": return "n", "reader/"
                if s4 == "approval": return None, "approval/"  # tests only; t by overlay
                return None, "lib subfolder named by no unit"
            return None, "apps/web/src folder named by no unit"
        return None, "apps/web folder named by no unit"
    return None, "path outside apps, packages, scripts"


def place(p, tests_to="t"):
    """Return (area_or_None, rule_or_reason)."""
    area, rule = dir_unit(p)
    # artefacts and duplicates stay unplaced whatever their name
    if area is None and re.search(r"Finder duplicate|OS or build|environment file|Playwright output", rule):
        return None, rule
    if is_test(p):
        if tests_to == "t":
            return "t", "test overlay (tests, fixtures, approved data, e2e, test-only support)"
        # variant: a test follows the unit of the module it tests
        if area is not None:
            return area, rule + " (variant: test kept with its unit)"
        if p.startswith("apps/web/e2e") or p.startswith("apps/web/e2e-phone"):
            return "t", "e2e (variant: still t)"
        base = p.split("/")[-1]
        stem = re.split(r"\.(test|spec|test-support)\b", base)[0]
        if p.startswith("packages/score-parser/src/"):
            if stem in B_FILES: return "b", "variant: tests of a B_FILES module"
            if stem in C_FILES: return "c", "variant: tests of a C_FILES module"
        return None, "variant: test with no module to follow (" + rule + ")"
    return area, rule


def walk(tree):
    out = []
    for r, ds, fs in os.walk(tree):
        for n in fs:
            out.append(os.path.relpath(os.path.join(r, n), tree).replace(os.sep, "/"))
    return sorted(out)


def cmd_map(tree, out, tests_to):
    files = walk(tree)
    areas, unplaced = {}, {}
    for p in files:
        a, why = place(p, tests_to)
        if a is None: unplaced[p] = why
        else: areas[p] = {"area": a, "rule": why}
    counts = collections.Counter(v["area"] for v in areas.values())
    byreason = collections.Counter(unplaced.values())
    doc = {"base_commit": BASE, "tests_to": tests_to, "script": os.path.basename(__file__),
           "file_count": len(files), "placed": len(areas), "unplaced": len(unplaced),
           "files_per_area": dict(sorted(counts.items())), "unplaced_by_reason": dict(byreason.most_common()),
           "ambiguous_placements": AMBIGUOUS,
           "map": {p: v["area"] for p, v in areas.items()},
           "rules": {p: v["rule"] for p, v in areas.items()},
           "unplaced_files": unplaced}
    with open(out, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=1, sort_keys=True)
    print("files %d placed %d unplaced %d" % (len(files), len(areas), len(unplaced)))
    print(dict(sorted(counts.items())))


def unquote(line):
    """git quotes paths with non-ASCII bytes as "..." with octal escapes (core.quotepath)."""
    if len(line) >= 2 and line[0] == '"' and line[-1] == '"':
        body = line[1:-1]
        out = bytearray()
        i = 0
        while i < len(body):
            ch = body[i]
            if ch == "\\" and i + 1 < len(body):
                nx = body[i + 1]
                if nx.isdigit():
                    out.append(int(body[i + 1:i + 4], 8)); i += 4; continue
                out += {"n": b"\n", "t": b"\t", '"': b'"', "\\": b"\\"}.get(nx, nx.encode()); i += 2; continue
            out += ch.encode("utf-8"); i += 1
        return out.decode("utf-8", "replace")
    return line


def make_resolver(tree, tests_to):
    """Resolve a path from the log to (area, how). The log holds paths that no longer exist
    (lib/shane/ became lib/score/ on 2026-09-27; lib/markup/ became lib/melody/ on 2026-11-23).
    Order: a test goes to t when tests_to is t; a path in the base tree uses its own placement;
    a path absent from the base tree takes the area of the ONE base-tree file with the same
    basename, if exactly one exists; otherwise the path rules are tried on the old path."""
    files = walk(tree)
    fileset = set(files)
    idx = collections.defaultdict(list)
    for p in files: idx[p.split("/")[-1]].append(p)
    def resolve(p):
        if tests_to == "t" and is_test(p):
            return "t", "test"
        if p in fileset:
            a, _ = place(p, tests_to); return a, "in base tree"
        c = idx.get(p.split("/")[-1], [])
        if len(c) == 1:
            a, _ = place(c[0], tests_to)
            if a: return a, "successor by unique basename"
        a, _ = place(p, tests_to)
        if a: return a, "rule on the old path"
        return None, "unplaced"
    return resolve


def parse_log(path):
    commits, cur = [], None
    with open(path, encoding="utf-8", errors="replace") as f:
        for line in f:
            line = line.rstrip("\n")
            if line.startswith("COMMIT|"):
                parts = line.split("|", 3)
                cur = {"sha": parts[1], "date": parts[2], "subject": parts[3], "files": []}
                commits.append(cur)
            elif line and cur is not None:
                cur["files"].append(unquote(line))
    return commits


def dist(vals):
    c = collections.Counter(vals)
    n = len(vals)
    vs = sorted(vals)
    q = lambda f: vs[min(n - 1, int(f * n))]
    return {"n": n, "mean": round(sum(vals) / n, 3), "median": statistics.median(vals),
            "p75": q(.75), "p90": q(.90), "p95": q(.95), "max": max(vals),
            "histogram": {str(k): c[k] for k in sorted(c)}}


def cmd_commits(log, tree, tests_to, outjson):
    commits = parse_log(log)
    res = {"commits_in_log": len(commits)}
    empty = [c for c in commits if not c["files"]]
    res["commits_with_no_files_listed"] = len(empty)
    use = [c for c in commits if c["files"]]
    res["dates"] = [min(c["date"] for c in commits), max(c["date"] for c in commits)]
    resolvers = {"t": make_resolver(tree, "t"), "unit": make_resolver(tree, "unit")}
    how = collections.Counter()
    def measure(commits_, tests, count_unplaced, label):
        resolve = resolvers[tests]
        per, files_per, unp_only, big = [], [], 0, 0
        for c in commits_:
            areas, unp = set(), set()
            for p in set(c["files"]):
                a, h = resolve(p)
                if tests == tests_to and count_unplaced is False and label.startswith("tests in t, unplaced files ignored"): how[h] += 1
                if a: areas.add(a)
                else: unp.add(p)
            if count_unplaced and unp: areas.add("u")
            if not areas: unp_only += 1; continue
            per.append(len(areas)); files_per.append(len(set(c["files"])))
        return {"label": label, "commits_measured": len(per), "commits_touching_no_placed_area": unp_only,
                "areas_per_commit": dist(per), "files_per_commit": dist(files_per)}
    res["primary"] = measure(use, tests_to, False, "tests in t, unplaced files ignored")
    res["variants"] = [
        measure(use, tests_to, True, "tests in t, unplaced files counted as one extra area u"),
        measure(use, "unit", False, "tests kept with their unit, unplaced files ignored"),
        measure([c for c in use if len(set(c["files"])) < 100], tests_to, False,
                "tests in t, commits of 100 or more files removed"),
        measure([c for c in use if len(set(c["files"])) < 30], tests_to, False,
                "tests in t, commits of 30 or more files removed"),
    ]
    res["commits_of_100_or_more_files"] = sum(1 for c in use if len(set(c["files"])) >= 100)
    res["commits_of_30_or_more_files"] = sum(1 for c in use if len(set(c["files"])) >= 30)
    # log paths the rules cannot place, by reason
    res["log_file_touches_by_resolution"] = dict(how.most_common())
    unp = collections.Counter()
    r0 = resolvers[tests_to]
    for c in use:
        for p in set(c["files"]):
            a, h = r0(p)
            if a is None:
                unp[("/".join(p.split("/")[:5]) if p.startswith("apps/web/src/lib") else "/".join(p.split("/")[:3]))] += 1
    res["log_file_touches_unplaced_by_prefix"] = dict(unp.most_common(25))
    print(json.dumps(res, indent=1))
    if outjson:
        with open(outjson, "w") as f: json.dump(res, f, indent=1)


if __name__ == "__main__":
    a = sys.argv[1:]
    tests = "unit" if "--tests" in a and a[a.index("--tests") + 1] == "unit" else "t"
    if a and a[0] == "map":
        cmd_map(a[1], a[2], tests)
    elif a and a[0] == "commits":
        oj = a[a.index("--json") + 1] if "--json" in a else None
        cmd_commits(a[1], a[2], tests, oj)
    else:
        print(__doc__)
