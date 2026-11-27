# Slur sources: Finale, Sibelius, MuseScore source, SMuFL/Bravura (r1, 2026-11-27)

Extends memo-slur-engraving-sources_r1_2026-10-20.md. LilyPond, Verovio, Dorico and the MuseScore forum material were not re-read.

## F. Direct answer (first)

Yes, two engines state a saturation with numbers, and a third states a growth law.

- **Finale** gives a span-bucketed height table with defaults and units (table in C).
  - Heights saturate at 0.25 inch = 3.0 staff spaces from a 3 inch (36 space) span onward.
  - It is a control-point height, not the visible rise. Finale says the arc "approaches, but does not actually reach" it.
- **Sibelius** states the saturation in words: short slur (2 spaces long) is 1 space high, exponential approach to an asymptote, "never taller than four spaces with the default values".
  - Height scale 200% tends to 8 spaces, 50% tends to 2 spaces.
  - It does not publish the exponential's constants or the default Maximum height value.
- **MuseScore** has no cap. Control height = sqrt(L/4) staff spaces, so it grows without bound.
- **SMuFL/Bravura** say nothing about slur height. They give only thickness.

None gives a rise-to-span percentage. The Finale table is the only span-bucketed table.

## A. Sources found

1. Finale for Mac manual, "Slur Contour dialog box". https://usermanuals.finalemusic.com/FinaleMac/Content/Finale/SLURDEFN.htm. READ IN FULL.
2. Finale 2012 Mac manual, same page. https://usermanuals.finalemusic.com/Finale2012Mac/Content/Finale/SLURDEFN.htm. READ IN PART (first ~3,500 characters, identical default table to 1). An archived copy at web.pdx.edu (/~jnewton/assignments/043ft_finale_tutorials/finale_tutorials/Finale/SLURDEFN.htm) also carries the identical table. READ IN PART.
3. Finale for Windows manual, "Smart Slur Options dialog box". https://usermanuals.finalemusic.com/FinaleWin/Content/Finale/db-smart-slur-options.htm. READ IN FULL.
4. Finale for Mac manual, "Slurs" (includes the Engraver slurs section). https://usermanuals.finalemusic.com/FinaleMac/Content/Finale/Slurs.htm. READ IN FULL (first 6,000 characters in one pass, the rest in a second).
5. Finale for Mac manual, "Equivalents" (unit definitions). https://usermanuals.finalemusic.com/FinaleMac/Content/Finale/def-equivalents.htm. READ IN PART (the measurement-units paragraph and table; durational-units table not read).
6. Finale archived "Engraver slurs" page. https://web.pdx.edu/~jnewton/assignments/043ft_finale_tutorials/finale_tutorials/Finale/Engraver_slurs.htm. READ IN FULL. Third-party mirror of Finale documentation, version unstated.
7. Avid, Sibelius Reference Guide, version 2020.3, section 4.8 Slurs, printed p. 385 to 388 (PDF page 394 holds "Slur height"). https://resources.avid.com/SupportFiles/Sibelius/2020.3/Sibelius_Reference.pdf. Section 4.8 slur-handles, magnetic layout, thickness, shoulder and height subsections READ IN FULL. Rest of the 25,000-line guide not read.
8. MuseScore source, `src/engraving/rendering/score/slurtielayout.cpp`, repository musescore/MuseScore at commit bf76c748 (2026-11-26, shallow clone). READ IN PART: `computeBezier(SlurSegment*)` lines 2818 to 2955 and `computeShoulderHeight` lines 2958 to 2977 in full. `avoidCollisions` and `adjustEndPoints` NOT READ IN FULL (grep only).
9. MuseScore source, `src/engraving/style/styledef.cpp`. READ IN PART (grep of slur lines 601 to 627).
10. SMuFL specification, "engravingDefaults". https://w3c-cg.github.io/smufl/latest/specification/engravingdefaults.html. READ IN FULL (about 4,100 characters of text).
11. Bravura metadata, file `redist/Bravura.json` (fontVersion 1.482) in https://github.com/steinbergmedia/bravura, commit 37b1943. Parsed programmatically for engravingDefaults and every key containing "slur". READ IN PART (targeted queries, not the 1.2 MB file).

COULD NOT OPEN: the Finale manual host returned 403 for unlisted pages (for example `Equivalents.htm`; the correct filename `def-equivalents.htm` worked). raw.githubusercontent.com for Bravura returned 404 (file lives at `redist/Bravura.json` under a different name).

## B. What they say

### Height and rise
- Finale, source 1: "In general, slurs have varying heights, depending on the length of the slur." Four buckets (short, medium, long, extra long) each hold a height and an inset. Finale senses the length and applies a height from the settings. Between buckets it "finds a proportional height". Outside the range it applies the end bucket's height. The interpolation formula is not stated.
- Finale, source 1: the height and inset "combine to form a control point". "When a slur is drawn, its arc approaches, but does not actually reach, the height of the control point. So the visual height of the slur itself is actually somewhat less than the height of the control point." The amount is not given.
- Sibelius, source 7: "Sibelius by default draws slurs so that a short slur (defined as a slur of two spaces in length) will be one space high, and scales the height using an exponential function that approaches an asymptote as the slur lengthens; in practice, slurs will never be taller than four spaces with the default values, unless their height has to be increased to avoid collisions."
- Sibelius, source 7: Height scale 200% "produces slurs that tend towards eight spaces tall"; 50% "tend towards two spaces tall". So the asymptote is 4 spaces times Height scale / 100%.
- MuseScore, source 8, `computeShoulderHeight`: `shoulderH = sqrt(slurLengthInSp / 4) * spatium`, multiplied by 0.75 when the slur is over beams (`shoulderReduction = 0.75`). It is the y of both Bezier control points (`p3(c1, -shoulderH)`, `p4(c2, -shoulderH)`).

### Flattening of long slurs
- Finale: the table is the mechanism. Height stops growing at the Long bucket (3 inch).
- Sibelius: the asymptote is the mechanism. Optional "Limit height for long slurs" with "Maximum height n spaces" (default value not stated in the guide). The guide says the purpose is to stop slurs looking "loopy".
- Sibelius also: "Move ends if slur exceeds n spaces high" is the height beyond which it moves end points instead of increasing curvature to avoid a collision (default not stated). "Make ends level when slur is shorter than n spaces" (default not stated).
- Finale Engraver slurs, source 3: "Maximum Slur Angle in Degrees" (0 to 90). Note: "settings made in the Slur Contour dialog box will be ignored if this value is small." Also "Initial Adjustment: Maximum Stretch" (percentage of slur length or fixed amount) and "Maximum Lift". Defaults for these are not given in the manual pages read.
- MuseScore: no clamp on `shoulderH` in the code read. The tie code clamps (`tieMinShoulderHeight` and `tieMaxShoulderHeight`), the slur code does not. Collision avoidance (not fully read) may change height.

### Curve shape
- Finale: Inset (percentage of slur length) sets the end "bow" or "hook": low inset is "more rounded", high inset is "flatter" at the ends. Default inset values not stated in pages read.
- Sibelius: "shoulder" controls "the rate of onset of the slur's curvature", varied by length. "Longer slurs require a larger shoulder, so that they approach their full height more quickly." Options "Shoulder for short slurs n%" and "Shoulder for long slurs n%" (defaults not stated).
- MuseScore, source 8: cubic Bezier with both inner control points at the same height; shoulder width as a fraction of span: 0.60 if d<2, 0.5 if d<10, 0.6 if d<18, else 0.7 (d in staff spaces). Control points x at `c1 = (c - c*shoulderW)/2`, `c2 = c1 + c*shoulderW`.

### Endpoints and thickness
- Finale: Slur Tip Width; Tips Avoid Staff Lines By; System Start/End Adjustment; thickness left/right horizontal and vertical (source 3). No default values in pages read.
- Sibelius: "Outline width n spaces", "Middle thickness n spaces" (middle thickness is the extra over the minimum, so 0.5 gives just over half a space). Defaults not stated in the guide text read.
- MuseScore, source 9: `slurEndWidth 0.05_sp`, `slurMidWidth 0.21_sp`, `slurMinDistance 0.5_sp`.
- SMuFL/Bravura, sources 10 and 11: slurEndpointThickness 0.1 and slurMidpointThickness 0.22 staff spaces for Bravura. SMuFL says the values are "recommended defaults" with "all measurements expressed in staff spaces". There are no slur glyphs and no slur anchors in Bravura.json.

## C. Numbers

### Finale default heights (source 1, same table in source 2)

| Bucket | Span (as printed) | Height (as printed) | Span in staff spaces | Height in staff spaces | Height in EVPU | Height / span |
|---|---|---|---|---|---|---|
| Short | 1/8 inch or less | 0.04861 inch | 1.5 | 0.583 | 14 | 0.389 |
| Medium | 1 inch | 0.14583 inch | 12 | 1.75 | 42 | 0.146 |
| Long | 3 inches | 0.25 inch | 36 | 3.0 | 72 | 0.083 |
| Extra long | 4 inches or more | 0.25 inch | 48 | 3.0 | 72 | 0.063 |

Conversion (my arithmetic, from source 5): "Finale's default staff line spacing is 1/12 inch (24 EVPUs)"; 288 EVPU per inch; one space = 24 EVPU. The EVPU values come out as whole numbers (14, 42, 72), which supports the reading that these are the stored defaults. Caveat: the manual states the defaults in inches, and does not say whether inches scale with the document's staff size. The staff-space reading assumes the default 1/12 inch space. NOT ESTABLISHED for other staff sizes.

Finale values are control-point heights. Visible rise is "somewhat less" (source 1); amount not given.

### Finale interpolation at your three spans (my arithmetic, assuming linear interpolation between buckets; the manual says only "proportional")
These are control-point heights, so the visible rise is lower.

| Span (staff spaces) | Interpolated control height (staff spaces) | Your verdict |
|---|---|---|
| 2.65 | 0.71 | acceptable, not engraver-quality |
| 9.5 | 1.47 | beautiful |
| 22.6 | 2.30 | absurd (9.88 measured) |

### Sibelius defaults (source 7)
- Short slur, 2 spaces long: 1 space high (ratio 0.5).
- Asymptote 4 spaces at Height scale 100%; 8 at 200%; 2 at 50%.
- Not stated: the exponential's constants, default Limit height setting, default Maximum height, default Move ends threshold, default shoulder percentages.

### MuseScore (source 8)
- Control height = sqrt(L/4) staff spaces, no cap. The peak of a cubic with both inner control points at height h is 0.75 h (standard Bezier at t = 0.5; my arithmetic, not stated in the code). So peak rise = 0.375 sqrt(L), before collision adjustments, for a level slur:

| Span L | Control height | Peak rise |
|---|---|---|
| 2.65 | 0.81 | 0.61 |
| 9.5 | 1.54 | 1.16 |
| 22.6 | 2.38 | 1.78 |

(Ratio of peak rise to span: 0.23, 0.12, 0.079.) These do not match your measured table at any of the three spans; MuseScore sits below your "beautiful" value at 9.5.

### Thickness (all staff spaces)
- Bravura end 0.1, mid 0.22 (source 11, SMuFL source 10). MuseScore end 0.05, mid 0.21 (source 9).

## D. Could not establish
- Finale: how far below the control point the visible arc peaks; the interpolation formula; default inset values; default Smart Slur Options values (Maximum Slur Angle, symmetry, stretch, lift, thickness, tip width); whether the inch values scale with staff size; what Engraver slurs do numerically beyond the option names. The manual describes the dialog and gives no algorithm.
- Sibelius: the exponential's constants; default Engraving Rules values for the Slurs page (Limit height, Maximum height, Move ends, shoulder %, thickness). The Reference Guide describes options but does not list defaults. A reading of the dialog itself would be needed. Whether "n spaces high" means control height or peak rise: not stated.
- MuseScore: the effect of `avoidCollisions` on height (not read in full); whether older versions used different constants.
- Priority 5 (Ross, Read, Stone, Wanske, Chlapik): not attempted. No budget spent; no free hosting was known from the prior memo.
- Gould's published figures: not in scope here.

## E. Ranking for a renderer
1. **Sibelius Reference Guide, p. 388 (source 7).** It states the right shape, saturation with an asymptote, and a scale knob. The asymptote of 4 spaces is above your 1.8 to 2.0, but the 50% setting is 2 spaces, which matches your "beautiful" ceiling. It lacks the constants.
2. **Finale Slur Contour (sources 1, 5).** The only span-bucketed table with numbers. Convertible to staff spaces. Saturates at 3.0 control height. Use it as a shape reference, with the control-point caveat.
3. **MuseScore `slurtielayout.cpp` (source 8).** Open source, readable constants, but it grows without a cap, which is the behaviour your "absurd" verdict rejects.
4. **Finale Smart Slur Options (source 3).** Useful for which knobs exist (max angle, stretch, lift), no numbers.
5. **SMuFL/Bravura (sources 10, 11).** Thickness only. Use 0.1 end and 0.22 mid for rendering.

## Tool use
About 21 tool calls (searches, curl fetches, a pdftotext pass over the Sibelius guide, two shallow git clones, one Python parse). Token use is an estimate, about 90,000; no counter was available to me.
