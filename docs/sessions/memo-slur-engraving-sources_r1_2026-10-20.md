# Memo: sources on engraving slurs and phrase marks, r1, 2026-10-20

Returned by a Sonnet helper at 15:5x, 116,884 tokens against a stated worst case of 300k, 49 tool uses, about 6 minutes. Asked for by Dann 2026-10-20 15:49 (`../memory/INBOX.md`); serves QUEUE row 145. Every statement below is the helper's report, not read by the desk in the sources themselves, except where marked.

## A. Sources found

1. LilyPond Internals, Slur grob and slur-interface (lilypond.org/doc/v2.24/Documentation/internals/slur, and v2.26 .../slur_002dinterface). READ IN FULL (rendered page). It gives property names and defaults.
2. LilyPond source, lily/slur-configuration.cc (raw.githubusercontent.com/lilypond/lilypond/master/lily/slur-configuration.cc). READ IN PART, through a summarizing fetcher, not verbatim code. It gives the curve construction and the height cap, but not the length-to-height function.
3. LilyPond source, lily/slur.cc and lily/lookup.cc. READ IN PART, same limit. They give how the crescent is built.
4. LilyPond source, lily/slur-scoring.cc. READ IN PART. It shows `ratio` and `height-limit` handed to the curve generator.
5. Nienhuys and Nieuwenhuizen, LilyPond essay (lilypond.org/doc/v2.24/Documentation/essay.pdf). READ IN PART. It has no slur rules; it credits Ross's book as the image source for a slur example.
6. Verovio Book, Toolkit options (book.verovio.org/toolkit-reference/toolkit-options.html). READ IN PART (the slur options). It lists seven slur parameters with defaults.
7. Verovio source, src/slur.cpp and src/view_slur.cpp (develop branch). READ IN PART. They give endpoint logic and thickness. The control-point maths (`BezierCurve`, `beziercurve.cpp`) COULD NOT BE OPENED.
8. Dorico Operation Manual, slur pages: height, shoulder offset, endpoint position, flat style, styles, engraving options (archive.steinberg.help, v1, v2, v3.5). READ IN PART. They give two numbers and some qualitative guidance.
9. MuseScore forum thread "Flat slurs" (musescore.org/en/node/56166). READ IN FULL as summarized. It is a user discussion, not an authority.
10. GeoGebra, "Bezier Slur: Adjust Taper, Flatten Top" (mat.geogebra.org/m/juqwspxn). READ IN FULL as summarized. It is a user-made model of MuseScore's control points.
11. Notat.io forum threads p=1876, p=9852, p=9156. READ IN PART. Posters paraphrase Ross pp. 139 to 143 and 141, Gould p. 110, and Henle, Breitkopf, and Boosey practice. These are secondary reports only.
12. Coulon, "Repository of music-notation mistakes" (ctan.ceremade.dauphine.fr/support/musixtex/doc/notationMistakes/sottieng.pdf). READ IN PART (section 3). It covers slur endpoints only.

## B. What the sources say

Height and rise: LilyPond caps slur height with `height-limit`, and longer slurs approach that cap [1, READ IN FULL]. `ratio` controls how quickly a slur reaches the cap [1]. The height calculation itself is a function of chord length, cap, and ratio, but the helper could not read it [2]. LilyPond clamps the height from above so the curve stays monotonic in its first half [2, summarized]. Verovio's `slurCurveFactor` scales roundness, and `slurMaxSlope` caps the slope [6].

Flattening: LilyPond has no separate flattening step. Long slurs come out flat because the cap is a ceiling [1, 2, DESK INFERENCE on the mechanism]. Dorico has separate project-wide height values for short, short flat, long, and long flat slurs. It says raising a long slur's height rounds it and uses more vertical space [8]. Dorico also says flat slurs are used by some publishers to save vertical space, are not the common default, and look odd on very short slurs [8]. In the MuseScore thread, posters name Henle, Breitkopf and Haertel, Baerenreiter, UE, and Peters as using flat slurs. A moderator calls flat slurs non-standard in MuseScore, and another poster notes that some examples are truly flat while others are only slightly curved [9, forum, not authoritative]. Verovio has no dedicated flattening step in `slur.cpp` [7].

Curve shape and thickness: LilyPond builds the slur from two cubic Beziers that share endpoints. Each curve's inner control points move by half the thickness along the chord normal, in opposite directions. The slur is therefore zero-width at the ends, and thickest at the middle of the parameter range, with the offset following a 3t(1-t) profile [3, summarized]. `eccentricity` shifts the control points sideways to make a slur asymmetrical [1, 2]. In Dorico, "shoulder offset" sets how shallow or steep the curve leaves its endpoints [8]. The GeoGebra model of MuseScore exposes "taper" and "flatten" parameters; flattening too far makes the curve bulge past its bounding box [10]. Posters report that Ross centres slurs on their tangent [11, secondary].

Ends and clearances: LilyPond keeps a slur about half a staff space from the notehead [3, `pure_height`, summarized] and avoids staff lines using the `gap-to-staffline` settings [1]. Dorico's default endpoint sits half a space above a notehead in a space, and a quarter space above one on a line [8]. Verovio chooses the endpoint from stem direction and stem length. It moves endpoints sideways for beams, flags, grace notes, and S-shaped slurs, pushes endpoints apart when they are too close, and adds a final vertical offset of 1.25 units [7]. Coulon says a slur starts and lands above or below the notehead centres [12]. Posters quote Gould p. 110 (ends as close as half a space from the centre) and Ross p. 141 (long slurs start and end over the centres) [11, secondary].

Phrase marks: LilyPond has a separate PhrasingSlur grob; the helper only found its listing and did not read it [search result only]. Nothing found on breaking long phrase marks at a system end.

Disagreement: LilyPond's documented default for `ratio` is 0.25 [1]. The source fetch reported 0.33 in `slur-scoring.cc` [4, summarized]. This is unresolved. Forum posters disagree on arch height: Ruggero calls Henle's arched slurs wasteful, and Spreadbury calls it largely a matter of taste [11].

## C. Numbers

- LilyPond `height-limit` 2.0 staff spaces; `ratio` 0.25; `thickness` 1.2 and `line-thickness` 0.8, both as multiples of staff-line thickness [1, READ IN FULL].
- LilyPond details: `max-slope` 1.1; `free-head-distance` 0.3; `free-slur-distance` 0.8; `gap-to-staffline-inside` 0.2 and `outside` 0.1; `close-to-edge-length` 2.5; `minimum-length` 1.5 [1].
- LilyPond: indent capped at chord length divided by 3.1; maximum height is the square root of (L^2/3 - 0.75*(indent + L/3)^2) [2, summarized].
- Crescent: each side offset 1.5*t(1-t)*thickness, so the total gap at mid-parameter is 0.75 of the `thickness` value [3, summarized].
- Verovio defaults: `slurCurveFactor` 1.0 (0.2 to 5.0); `slurEndpointThickness` 0.1 and `slurMidpointThickness` 0.6 (MEI units); `slurMargin` 1.0; `slurMaxSlope` 60 degrees; `slurSymmetry` 0.0 [6].
- Dorico: shoulder offset default 1/3, with 1.5 and -1/2 as examples [8]. Endpoint 1/2 space (notehead in a space) or 1/4 space (on a line) [8].

## D. Could not establish

- The LilyPond function mapping length, cap, and ratio to height and indent. It is defined outside the files the helper could read.
- Verovio's control-point maths; the fetch of `beziercurve.cpp` failed.
- Any printed rise-to-span ratio or stave-space cap for long slurs. Nothing read states one.
- Thickest-point placement toward the higher end.
- Ross, Read, Stone, Wanske, Gerou and Lusk, Heussenstamm, Chlapik: no freely hosted text found. Ross and Gould appear only as forum paraphrases.
- Henle, Baerenreiter, or Donemus guidelines; the one Henle PDF found was a critical commentary.
- MuseScore source and Finale or Sibelius contour documentation; SMuFL or Bravura on slurs.
- Phrase marks over many bars and breaking at system ends.
- Dorico PDF manual; the HTML height page carried no numbers.

## E. Three most useful sources (the helper's ranking)

1. LilyPond slur-configuration.cc and lookup.cc [2, 3]. The only readable, complete recipe: a chord-frame Bezier with a capped height, and a crescent whose ends taper to a point. Fetch the raw files directly to recover the missing height function.
2. LilyPond Slur grob page [1]. A ready parameter set (cap 2.0, ratio, thickness, clearances) to copy and tune.
3. Dorico Operation Manual slur pages [8]. Short, flat, and long variants, shoulder offset, and endpoint offsets are the controls a renderer needs, though the numbers are few.

DESK INFERENCE (the helper's): a saturating cap near 1 to 1.5 spaces, with the flat variant for long spans, matches what these sources describe. None of them gives that figure.
