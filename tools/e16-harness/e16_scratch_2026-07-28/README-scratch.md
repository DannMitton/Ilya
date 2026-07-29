# E.16 measurement scripts, session of 2026-07-28 (evening)

These are SCRATCH, not reader code. `verify_toolchain.py` does not pin them and
must not. They are preserved because the previous session lost twenty minutes
rewriting the substrate from the opener's spec, and because every figure in
handover v21 and in the three Fable rulings of 2026-07-28 was measured by them.

They expect the harness at `/home/claude/e16` and the reader modules copied to
`/home/claude`, exactly as opener v24 section 3 describes. `substrate.py` is the
instrument; everything else consumes it.

| file | what it measured | status |
|---|---|---|
| `substrate.py` | opener v24 section 5: SVG geometry, row runs, bridged runs, anchors, ratified membership | CURRENT |
| `gate02_legacy_p01p1.py` | Phase 0.2, piece 01 p1, with its negative control | CURRENT |
| `gate03_close_fixture.py` | Phase 0.3, the close reference, with its negative control | CURRENT |
| `gate04_metre_negctl.py` | Phase 0.4's negative control by module injection | CURRENT |
| `gate05_oracle.py` | Phase 0.5, 47 pages, with both negative controls | CURRENT |
| `phase1_substrate_check.py` | g, the site-1 threshold, and opener section 6's expected values | CURRENT |
| `phase1_derive_T.py` | the pixel-form T | SUPERSEDED by the structure-relative T_rel |
| `phase1_derive_K.py` | K as a clearance-derived discriminator | SUPERSEDED, struck under the annihilation lemma |
| `phase1_K_evidence.py` | the concentration populations that proved K undderivable | CURRENT |
| `phase1_at_battery.py` | AT-A, AT-B, AT-C, AT-D, AT-E, AT-DEN; derives T_rel and K_s | CURRENT |
| `phase1_atc_ate_evidence.py` | the two defective acceptance tests, with measurements | CURRENT |
| `phase2_at_att.py` | AT-ATT under horizontal containment | CURRENT |
| `phase2_rec_probe.py` | the AT-REC falsification on legacy sunless-05 p5 | CURRENT |

Two scripts are marked SUPERSEDED under the `scratch_status.py` convention: they
carry a banner in their first ten lines and refuse to run. Do not quote their
numbers. `T = 541.1885` and any value of K as a discriminator are both dead.
