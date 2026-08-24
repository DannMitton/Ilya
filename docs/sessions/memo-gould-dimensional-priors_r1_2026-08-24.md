# Gould dimensional priors for Ilya's OMR reader (r1, 2026-08-24)

Extracted for N.90/N.91 from `gould-vocal-engraving-rules_v7_2026-08-05.md` (rules 1 to 244) and `gould-beams-delta-pp16-25_2026-08-18.md` (rules 245 to 284, unmerged). No outside knowledge is used; a fact not in these two documents does not exist for this memo. Ties and slurs (rules 150 to 175) are not included: they do not fit any of the eight requested reader stages and are left for a future pass.

Governing constraint (Dann's ruling, 2026-08-18): a Gould prior may bound a dimension (thickness, length, spacing, angle, span, position). It may never decide a meaning (stem direction, notehead shape, anything a legend can redefine). Where a score carries a legend, the legend outranks Gould. Ilya's own scores use semantic stems, so stem direction is never evidence on Ilya's repertoire.

All values are in stave-spaces (rule 79's base unit) unless marked otherwise.

---

## 1. The prior table

### Staff geometry

| Prior | Value / bound | Source | Degradation note |
|---|---|---|---|
| Base unit | Stave-space; nearly every other bound below is expressed in it | r79, p.5 | — |
| Clef vertical centring | Treble winds around the G line, bass around the F line, dots either side | r80, pp.5,7 | — |
| Clef indent at system start | 1 stave-space, or slightly less | r81, p.6 | — |
| Mid-system clef change size | 2/3 of the opening clef's size | r82, pp.7,9 | smaller glyph, more vulnerable to fill-in |
| Header element order | Clef, then key signature, then time signature | r176, p.91 | order only; Ilya carries no key signature |
| Clef / key / time separation | 1 to 1.5 stave-spaces between each | r236, p.41 | low end of range sits near the collision floor (see §4) |

### Barlines

| Prior | Value / bound | Source | Degradation note |
|---|---|---|---|
| Thin double barline (section division) | ~0.75 stave-space between the two lines, ordinary barline weight | r96, p.39 | — |
| Final barline | Beam-thick line plus a thin line 0.5 stave-space before it | r96, p.39 | — |
| Barline weight vocabulary | Final double barline reserved for the *Fine* bar (movement end or functional end); a thin double barline marks mid-bar repetition/departure points and non-final section ends | r224, p.240, qualifies r96 | which meaning a double barline carries (Fine vs. section) is not decodable from weight alone |
| Stem-to-barline clearance | Never less than 1 stave-space | r98, p.43 | — |
| Repeat barline position | May fall anywhere in the bar; the beat-values on each side must sum to a whole bar | r202, p.233 | — |
| Barline placement tolerance | May sit at, or usually a little before, the position of the next beat | r232, p.41 | — |
| Barline-adjacent clearance | 1 stave-space each side of a barline mid-system; 1 stave-space allowance at end of stave before a barline | r242, p.42 | 1sp floor, tight but above the fill-in danger band |

### Stems and tails

| Prior | Value / bound | Source | Degradation note |
|---|---|---|---|
| Stem thickness | Thinner than a stave-line, but dark enough to reproduce | r84, p.13 (thickness clause only; direction clause is forbidden, see §3) | thin strokes are the first to lighten out under weak reproduction |
| Standard stem length | 3.5 stave-spaces (one octave) from notehead centre; ledger-line notes reach the middle stave-line; never below 2.5 stave-spaces; chord stem measured from the note nearest the open end | r86, pp.14–15 | — |
| Tail length | 2.5 to 3.25 stave-spaces, 3 to 3.25 the norm; up-stem tail ends opposite/just above the head, down-stem tail may curve to touch it | r87, p.15 | — |
| Short-stem / tail-length coupling | Stem shorter than 3sp is sized so the tail does not overshoot the notehead; stem ~2.75sp (reader 2) vs. ~2.5sp (reader 1) with a matching-length tail | r245, p.16 | **FLAGGED**, unresolved reader disagreement, self-flagged low-confidence |
| Semiquaver tail nesting | Sits inside the quaver tail's silhouette, under 1sp from it; combined tail ~0.25 to 0.5sp longer than the quaver tail alone | r246, p.16 | **FLAGGED**, table numerals low-confidence |
| Extra-tail extension | Each further tail is built out beyond the primary tail, lengthening the stem | r247, p.16 | qualitative only |
| Tail-to-ledger-line clearance | Tails are pulled back on ledger-lined notes so the outermost ledger line stays visible | r248, p.16 | the deliberate clearance is itself a narrow gap, watch under fill-in |
| Line-note stem length | ~3.25 stave-spaces (shortened relative to r86's 3.5) | r256, p.19 | **FLAGGED**, small-diagram numeral, re-verify |
| Added-beam clearance from notehead | Never closer than 2.5 stave-spaces (the semiquaver beam's correct position) | r257, p.19 | **FLAGGED**, diagram figures low-confidence |
| Stem length under beam correction | Target 3.5 stave-spaces for a space-note, nudged for beam spacing | r259, p.19 | unflagged, restates r86 |
| Shorter-stem floor in a beamed group | 3sp (a seventh) inside the stave, 2.5sp (a sixth) outside it | r264, p.20 or 21 | page citation contested between readers; content agreed |
| Tied-chord stem lengthening | Stems lengthen so tails and ties cannot collide | r154, p.61 | — |

### Beams

| Prior | Value / bound | Source | Degradation note |
|---|---|---|---|
| Beam thickness / inter-beam gap | Thickness 0.5sp; gap between adjacent beams 0.25sp | r249, p.17 | confirmed by both readers; the 0.25sp gap is the narrowest engineered gap in this table, see §4 |
| Inner beam span | Runs the full distance to the outer beam, touching every intermediate stem (not stopping at outer stems) | r250, p.17 | — |
| Fractional beam length | Drawn only as long as a notehead | r251, p.17 | — |
| Beam endpoint snap | Both ends of a beam land on a stave-line; a beam must not end, or sit, mid-space | r89 (p.20, v7), r252 (p.17), r266 (p.21) | primary degradation citation, three independent statements, see §4 |
| Two-beam anchor | Up-stem: outer beam hangs from or centres on a stave-line; down-stem: it sits on or centres on one | r253, p.18 | anchor choice is conditioned on stem direction, which is semantic in Ilya; treat the "snap to a line" fact as usable, the up/down conditioning as not |
| Three-beam outer placement | **CONTESTED. DO NOT IMPLEMENT** | r254, p.18 | reader 1 (line-anchored) contradicts reader 2 (space-centred); reader 2's own r252/r266 agree with reader 1, suggesting reader 2 mis-read this one, but unproven |
| Four-beam spacing | Beams spaced slightly further apart than normal so each still lands on a line; a beam left mid-space is acceptable only at high reproduction quality | r255, p.18 | explicitly conditional on print quality |
| Steep beam angle | Avoided; **no numeric threshold given** | r260, p.20 | unquantified, see §5 |
| Beam span across a group | Long group crosses 1, or at most ~2, stave-spaces; short group crosses no more than 1 | r88 (p.20, v7), r261, r262, p.20 | — |
| Close-pitch slope band | Notes pitched closer than ~3sp apart take only a quarter- or half-stave-space slope, regardless of actual interval | r263, p.20 | — |
| Third-beam forced slant | A third beam forces a whole stave-space of slant between anchors | r265, p.20 or 21 | page citation contested; content agreed |
| Outside-ledger-line slope | Quarter stave-space slope for a second, half for any wider interval | r267, p.21 | confirmed independently by both readers |
| Beam angle from outer notes | Slope follows the interval of the two outer notes, not the majority of inner notes; horizontal when start/end pitch match, a pattern repeats, or an inner note sits closer to the beam than either outer note | r90 (p.22, v7), r269–274, pp.22–23 | angle/pitch-contour geometry, not stem-direction meaning |
| Beam across a clef change | Follows notes' stave positions; stems lengthen so the beam clears the new clef | r275, p.23 | — |
| Chord beam angle | Set by the notehead closest to the beam | r276, p.24 | confirmed by both readers |
| Ledger-line clearance under a beam | One clear stave-line must remain between the innermost beam and the first ledger line | r258, p.19 | **FLAGGED**, diagram numerals low-confidence |

### Noteheads and ledger lines

| Prior | Value / bound | Source | Degradation note |
|---|---|---|---|
| Notehead shape (black) | Oval, diagonal slant rising away from the stem | r83, p.9 | pure shape geometry, not a meaning claim |
| Ledger line thickness / length | ~2x stave-line thickness; extends just over 2sp, slightly past the notehead each side; adjacent ledger lines never fuse, shortening slightly in cramped settings; grace-note ledger lines shorter and thinner | r94, p.26 | the "never fuse" guard is a narrow margin, first-order fusion risk, see §4 |
| Second-interval chord ledger width | Full width of both noteheads when the displaced note is on a line; last ledger line single-width when the displaced note is in a space | r95, p.27 | — |
| Second-interval offset | Lower notehead LEFT of stem, upper notehead RIGHT; diagonal preserved even when a repeated pitch swaps sides | r103, p.48 | fixed geometric direction, not stylistic |
| Stemless notehead placement | Positioned exactly as a stemmed version would be (unisons, seconds, clusters) | r104, p.50 | directly validates a stemless (turning) layer's offset geometry |
| Perfect unison in a chord | Two noteheads, one each side of the stem | r105, p.50 | — |
| Altered unison offset | Displaced notehead moves right, joined by a short diagonal stem clear of the second accidental; main stem extends past the join | r106, pp.50–51 | — |
| Cramped-alternative unison layout | Both accidentals placed before both notes, sharp-then-natural order | r107, p.51 | — |
| Cluster attachment threshold | Every notehead must physically attach to a stem; mere adjacency to an attached head does not count | r108, p.51 | directly usable OMR disambiguator for dense clusters |
| Two-part unison/second offset | Lower part offset RIGHT, upper part keeps system alignment | r109, p.53 | offset mechanics are physical; which part is "upper/lower" may be legend-dependent |
| Overlapping two-part offset | Down-stemmed part LEFT when pitch ranges cross | r110, pp.53–54 | same caveat as r109 |
| Shared ledger lines (overlapping parts) | Extended past all noteheads of both parts; a non-shared ledger line must not cut through the nearer part's stem | r67, p.27 | — |
| Stemless cluster grouping | Enclosed by a square bracket; second part aligns with the first notehead or the offset an adjacent-chord stem would occupy | r142, p.52 | — |
| Unison notehead sharing | Two stemmed parts in rhythmic unison may share one notehead; stemless parts never share, each takes its own head; black noteheads may share across black note-values, but semibreve/minim/black are never merged across their boundary | r144, p.52 | governs how a stemless (turning) layer must render at a melody unison |

### Dots and accidentals spacing

| Prior | Value / bound | Source | Degradation note |
|---|---|---|---|
| Duration dot size / clearance | ~2x the size of a staccato dot; sits ~0.5sp from the notehead, centred in the stave-space; a line-note's dot goes in the space above | r111, p.54 | 0.5sp clearance is inside the fill-in danger band, see §4 |
| Chord dot centring | Centred on the chord; print only as many dots as the chord's own stave-space span covers if a dot would otherwise land ≥2sp away | r112, p.56 | — |
| Two-part dot placement (one on a line) | Lower dotted note on a line: dot drops to the space below; upper dotted note on a line: dot may sit above the lower head, or the upper note shifts right | r113, pp.56–57 | — |
| Dot alignment invariant | A dot is never separated from its notehead by an adjacent note or a stem; both-dotted layout aligns the upper dot with the lower dot after both heads | r114, pp.56–57 | — |
| Dotted-note overlap rule | Both parts dotted may overlap; only one dotted must not | r115, p.57 | — |
| Dot-first layout | When only one of two adjacent parts is dotted, the dotted value may be written first so its dot stands between the noteheads; ledger lines then drawn separately | r145, p.60 | — |
| Cramped accidental/stem floor | Accidental or grace note may close to 0.5sp of a barline; a stem never comes closer than 1sp to a barline | r98, p.43 | 0.5sp floor is a fill-in risk zone |
| Cramped clef/accidental spacing | Reduced to 0.5sp around clefs and accidentals rather than widening the column | r99, p.43 | same risk zone |
| General accidental spacing | One accidental usually needs no adjustment; 2+ usually need extra space; never equalize note intervals to accommodate | r100–101, p.43 | — |
| Accidental order before a chord | Ordered by vertical position (no sharp/natural/flat hierarchy); evenly spaced; entirely right of the barline | r124, p.87 | — |
| Accidental stacking by interval | Octave+ apart: align vertically. 7th: usually aligns, else nudge lower left. 6th: aligns if top note is flat, else offset. Sharp/natural on top forces an offset so strokes cannot merge. 5th or less: upper nearest the chord, lower displaced left. Flat/natural a 4th–5th apart may overlap without touching | r125, p.88 | high-value lookup table for melody/turning-note accidental collisions |
| Accidental order, adjacent notes | Mirrored (descending right-to-left) for a single pair of seconds; conventional (outer nearest) preferred when accidentals are many | r126, p.90 | — |
| Two-part overlap accidental order | May reverse to mirror the actual left/right notehead arrangement | r146, p.91 | — |
| Unison accidental placement | Altered unison in two-part writing: each accidental sits beside its own part's head. Converged unison: one accidental placed once, before both heads | r147–148, p.91 | position rule; "which part" is a semantic input the reader supplies separately |
| Accidental-to-header clearance | Must stay far enough from a clef or key signature that it cannot be mistaken for part of it | r238, p.42 | — |
| Accidental floor | Never closer than 1sp to a preceding symbol (except where the accidental belongs to the first note itself) | r239, p.42 | — |
| Pre-first-note distance table | Clef only: 2.5 / 1.5 / 1sp (no / one / 2+ accidentals). Key signature: 2.5 / 1.5 / 1sp. Time signature: 2 / 1 / 1sp | r240, p.42 | **FLAGGED**, read from small table numerals, re-verify before implementation |
| Accidental close-up | Closes toward the following note or fellow accidental as far as possible without collision | r241, p.42 | — |

### The lyric band (text geometry below the stave)

| Prior | Value / bound | Source | Degradation note |
|---|---|---|---|
| Lyric x-height | ~1 stave-space | r12, p.438 | high-value physical anchor |
| Lyric baseline | Fixed at one vertical level for the entire system | r1, p.439 | — |
| Text-to-stave clearance | As close to the stave as possible without collision; full stops and hyphens must clear noteheads | r13, p.438 | — |
| Hyphen geometry | Short line, centred horizontally between syllables, **raised to mid lower-case (x-)height** | r26, p.448 | distinguishes hyphen from extender purely by vertical position |
| Extender vertical position | Sits level with the text **baseline**, unlike the raised hyphen | r39, p.447 | the key geometric discriminator the reader stage needs |
| Extender thickness | One stave-line's thickness | r34, p.447 | thin stroke, vulnerable to fading, not fusion (floats in open space) |
| Extender endpoint | Runs to the x-position of the last written notehead, never the full written duration | r35, p.447 | — |
| Hyphen repeat interval | Repeats at regular intervals across wide gaps; none directly under a notehead | r31, p.448 | — |
| Punctuation/extender order | Punctuation sits at the word's end, before the extender | r38, p.447 | positional sequence along the baseline |
| Lyric physical scale (derived) | At song rastral (~7 to 6mm stave), x-height ≈1.75mm | r12 + r189, pp.438, 482–483 | **FLAGGED**, depends on the unresolved rastral discrepancy below |

### System and page layout

| Prior | Value / bound | Source | Degradation note |
|---|---|---|---|
| Page size | A4 (297×210mm) conventional for piano/vocal and choral scores; A3 largest practical for any performance material | r185, p.481 | absolute mm, not normalized to stave-spaces |
| Margins | ≥15mm (half an inch) on every edge | r186, p.481 | unit mismatch: mm, not stave-spaces |
| Orientation | Portrait is the default; landscape is unsuited to singers, who must hold their copies | r187, p.482 | qualitative prior only |
| Stave-size consistency | One stave size throughout a piece, except a full score (density-varied) or a chamber/vocal score (two sizes, performer's own line largest) | r188, pp.482–483 | — |
| Rastral (stave height) table | Educational 9.2–7.9mm; song/piano rastral 3–5, 7–6mm; choral rastral 6–7, 5.5–4.8mm; full score down to 3.7mm | r189, pp.482–483 | **FLAGGED**, discrepancy: prose ties "rastral height" to one stave-space, the table's mm column is a full five-line height; the mm-to-stave-space conversion is unresolved |
| Pagination | Recto pages odd-numbered; opens on recto | r190, p.483 | — |
| Split-bar system break | Divides on a whole-beat boundary; no barline printed at the break; continuation system's bar number in parentheses | r178, p.490 | — |
| Inter-system gap sizing | Sized by contents: larger between instrumental sections than within one; widest gap where the most (tempo, rehearsal marks, high line) must fit | r184, p.520 | qualitative bound, no fixed stave-space figure given |
| Duration spacing, tempo-invariance | Notes of equal written duration take equal space for a whole system regardless of a tempo change within it | r230, p.40 | high-value OMR invariant: spacing answers to notation, never to performed speed |
| Duration spacing, monotonicity | A longer value takes at least as much space as its shorter neighbour, more is recommended | r229, p.40 | assertable as a hard floor |
| Duration spacing curve | Compressed, not strictly proportional; Gould's own labelled counter-example marks the linear/proportional layout as the wrong one | r227, p.40 | prior on expected spacing shape, not a fixed constant |
| Space-per-note-value | A per-system quantity, not a single global constant; may deliberately diverge between systems when density diverges | r231, p.40 | — |
| Whole-bar single note position | Sits just left of the bar's centre, not at the bar's start (when no other duration occupies the bar); such bars are usually narrower | r234, p.41 | high-value OMR prior: a centred lone notehead in a bar is normal, not evidence of an error |
| Stem-configuration spacing compensation | Spacing is nudged so back-to-back stems don't look too close and away-facing stems don't look too far apart | r233, p.41 | conditioned on stem direction, which is semantic in Ilya; usable only as a possible source of apparent spacing irregularity, not as direction evidence |
| Symbol clearance floor | Never closer than 0.5sp between any two symbols; no collision permitted | r235, p.41 | the tightest system-wide legal gap in this table, see §4 |
| Enlarged time signature (full-score option) | About stave height; must not obstruct ties, slurs, or hairpins; not stretched across staves | r182, pp.519–520 | not applicable to Ilya's single-stave, unconducted output |

---

## 2. Confidence flags, carried forward unsoftened

| Flag | Detail | Source |
|---|---|---|
| **DO NOT IMPLEMENT** | Three-beam outer placement: reader 1 says the outer beam hangs from/sits on a stave-line; reader 2 (rule 254) says it centres in a stave-space. Direct contradiction, unresolved. Reader 2's own rules 252 and 266 agree with reader 1, which suggests but does not prove a reader-2 mis-read | r254, p.18 |
| Low-confidence numeral | Stem/tail length ~2.75sp (reader 2) vs. ~2.5sp (reader 1), self-flagged by reader 2 | r245, p.16 |
| Low-confidence numeral | Semiquaver tail nesting distance and combined-length delta, self-flagged | r246, p.16 |
| Low-confidence numeral | Line-note stem ~3.25sp, read from a small diagram | r256, p.19 |
| Low-confidence numeral | Added-beam clearance 2.5sp, diagram figures self-flagged | r257, p.19 |
| Low-confidence numeral | Ledger-to-innermost-beam clearance, diagram numerals self-flagged | r258, p.19 |
| Flagged table, re-verify | Pre-first-note distance table by preceding symbol / accidental count; numerals are small in the source photograph | r240 (v7), p.42 |
| Page-attribution disagreement | Shorter-stem floor (r264) and third-beam whole-space slant (r265): reader 2 places both on p.20, reader 1 on p.21. Content agrees between readers; only the page citation is in doubt | r264, r265 |
| Unresolved discrepancy | "Rastral height" tied to one stave-space in the prose, but the mm table gives full five-line heights; not resolved, only recorded | r189 (v7), pp.482–483 |
| Unquantified threshold | "Short" vs. "long" rest, for whether an extender breaks: Gould gives no number | r36 (v7), p.447 |
| Unquantified threshold | "Steep" beam angle: no number given | r260, p.20 |
| Unquantified threshold | "No obvious case" for the down-stem default: no definition given (also forbidden as evidence, see §3) | r280, p.24 |
| Provenance limitation | Ground Rules pp.40–42 and index p.675 (rules 227–244) were read by a single reader only; the planned Sonnet cross-check failed twice server-side and was not retried | v7, changelog |
| Provenance limitation | Rules 245–284 as a whole: "no rule here has been verified against the printed page by a third party, and four numeric flags remain open" (delta's own closing line) | delta, closing note |

---

## 3. Forbidden as evidence

| Channel | Rules | Why it is forbidden |
|---|---|---|
| Stem direction, general default | 84, 85, 91 | Gould's own default (above/below the middle line decides direction) is a positional convention that vocal practice already treats as negotiable (rule 85 documents up-stem-only vocal editions); Ilya's stems encode timbre, not pitch position, so the default is simply the wrong channel on Ilya's repertoire |
| Stem direction, beamed groups | 279, and by extension 280–283 | The "furthest note from the centre dictates direction" rule (279, confirmed by both delta readers) and its corollaries (majority rules, minority exception, either-valid at equidistance) are all pitch-position inferences from direction; reading them backwards to infer pitch from Ilya's direction would be circular and wrong, since direction there means timbre |
| Stem direction, chords | 102 | Same class: "majority of noteheads decides" is a positional default Ilya's semantic stems override |
| Stem direction, two-part / shared-stave writing | 143, 134 | Upper part = up-stems, lower part = down-stems: direction already encodes *which voice*, not pitch, in Gould's own ensemble practice. This is the strongest textual precedent for the governing ruling, but it must not be read the other way, as evidence of voice from direction, on a score whose legend assigns direction to something else entirely |
| Notehead shape semantics | 59–65 (including 61's reassignment clause and 62's triangle = unspecified pitch) | Contrasting notehead shapes are explicitly legend-defined per piece to mark separate vocal deliveries, non-sung sounds, or falsetto; the same shape carries different meanings across different scores, so shape alone is never evidence of pitch, duration, or delivery without first reading the piece's own legend |
| Legend-redefinable channels generally | rule 61's principle | Any established meaning "cannot be silently reassigned; competing meanings force explicit redefinition." Where a legend exists, it outranks every Gould default above, per the governing ruling; a reader stage must check for a legend before applying any of the forbidden channels even descriptively |

---

## 4. Degraded-print tolerances

Gould documents ink fill-in of thin white gaps as an ordinary hazard of reproduction, independently, four times across the two documents:

- r89 (v7 canon, p.20): a beam ending mid-space leaves "a wedge of white [that] can fill in at small sizes or poor print."
- r252 (delta, p.17): a beam in the middle of a stave-space risks the white gap "disappearing at small stave sizes or with degraded reproduction, obscuring both beam and stave-line."
- r255 (delta, p.18): a four-beam mid-space compromise is acceptable "only if reproduction quality is high enough that the white space either side will not fill in."
- r266 (delta, p.21): a beam ending mid-space leaves "a thin wedge of white that risks filling in at small sizes or with degraded reproduction."

The delta's two readers found the last three of these independently, without being told what the other found (cross-check §6 of the delta). The delta also states its own limit honestly: "nothing on these ten pages addresses reading a photographed page as opposed to reading printed music." The relevance below is to the physics of ink fill-in, not to a tested method for scans specifically; treat everything past this line as an inference from Gould's printed-page remarks, extended, untested, to a photographed or multi-generation-scanned page.

**Which white gaps close first.** Ranking the engineered clearances in this table by size:

- Narrowest: the inter-beam gap, 0.25sp (r249), and any beam sitting in mid-space against a stave-line it should have snapped to (r89/252/255/266).
- Next: the 0.5sp family: duration-dot-to-notehead clearance (r111), cramped-condition accidental/clef/stem floors (r98, r99), and the system-wide symbol clearance floor (r235).
- Safer: the 1sp family: stem-to-barline (r98), accidental floor (r239), mid-system clearances (r242), clef/key/time separation at its low end (r236 at 1sp).

**Which measured features widen or merge on distressed ink, and the consequence:**

- Adjacent beams 0.25sp apart (r249) are the single most exposed feature: on distressed ink they can visually fuse into one thicker beam, understating the beam count and misreading a rhythm as coarser than written (a semiquaver read as a quaver, a quaver as a crotchet).
- A beam that should have snapped to a stave-line (r89/252/266) but sits, or reads as sitting, mid-space can fuse with a thickened stave-line, obscuring exactly which line it touches and inflating apparent beam or stave-line thickness.
- Duration dots at their ~0.5sp clearance (r111) risk fusing into the notehead's own ink, which can erase a dot (misreading a dotted note as plain) or, conversely, a print blemish at that same distance can read as a spurious dot.
- Ledger lines are designed to "never fuse," with only a "slight shortening in cramped settings" as the safety margin (r94); that margin is exactly the kind of narrow gap most likely to close under degraded ink, and a fused ledger-line count reads as a smaller pitch displacement than the source intends.
- Accidentals pushed to their cramped 0.5sp floors (r98, r99) sit in the same danger band as the dot and beam gaps, risking apparent fusion with the barline, clef, or notehead they were pressed against.

Nothing in either document quantifies how much ink spread corresponds to how much apparent gap loss; the ranking above is ordinal only.

---

## 5. Not established

- Notehead size (width/height in stave-spaces) beyond the shape description in rule 83. Pages 10 to 12 (notehead sizes and white noteheads) remain unphotographed; a core dimensional prior for the "noteheads and ledger lines" stage is simply absent from both documents.
- Rest geometry entirely: pp.34 to 38 are unphotographed, so no dimensional priors exist for rests at all.
- Octave-sign geometry: pp.28 to 33 unphotographed.
- The mm-to-stave-space conversion at any rastral size, because of the unresolved rastral-height discrepancy (rule 189). Any absolute physical-scale figure derived from it (including the x-height ≈1.75mm figure carried in the lyric-band table above) is provisional, not established.
- The numeric value of "steep" for beam angle (rule 260) and of "no obvious case" for the beamed-group down-stem default (rule 280): both explicitly left unquantified by Gould.
- The threshold between a "short" rest that does not break an extender and a "longer" one that does (rule 36): explicitly unquantified.
- The exact outer-beam position for three beams (rule 254): contested between the two delta readers, not established either way, and marked do not implement above.
- Whether "rastral height" in rule 189's prose means one stave-space or the full five-line stave height: unresolved, flagged not settled.
- Key-signature spacing geometry beyond header order (rule 176): rule 177 states accidental ordering (cycle of fifths) but gives no spacing dimension, and Ilya carries no key signature regardless.
- Enlarged time-signature exact sizing beyond "about stave height" (rule 182): no numeric bound given, and the feature does not apply to Ilya's unconducted output in any case.
- Any dimensional prior for tie and slur geometry: this exists in the source (rules 150 to 175) but was excluded from this table because it does not fit any of the eight requested reader stages, not because it is unquantified.
- Whether any of the degraded-print inferences in §4 hold for a photographed or scanned page specifically, as opposed to a printed one: the delta says explicitly that neither reading addressed this question.

NOT ESTABLISHED beats a complete invented answer.
