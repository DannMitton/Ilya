# Brief: draft the voice-line truth of scanned song pages (row 114's set), one page at a time

You are drafting ground truth for a measurement set: the voice line of Russian songs (Mussorgsky, Музыка, Москва, 1967) as printed on scanned pages. Every page you finish gets a proof sheet that a musician (Dann) checks against the print, so the deliverable is a careful draft with every doubt marked, not a confident guess. **NOT ESTABLISHED beats a complete invented answer.** Do not use any OMR other than the one in this kit, and do not look for these songs on the web: the pages are a sealed test set.

Working directory root: `/tmp/claude-0/-home-claude/71d82959-ea9c-5f01-b569-c0b1b985316b/scratchpad` (call it ROOT). Everything below is relative to ROOT.

## What exists for each page `<stem>` (f1-001 … f1-020, f2-000 … f2-023)

A background job runs `python3 -I truthkit/prep.py <stem>` on every page. When `cp-out/<stem>/staves.txt` exists, the page is prepared:

- `cp-pages/src/<stem>.png`: the whole scanned page.
- `cp-out/<stem>/staves.txt`: the staves found, grouped into systems; the first staff of each group is taken as the voice.
- `cp-pages/<stem>-v<k>.png`: one crop per voice staff, lyrics included.
- `cp-out/<stem>/v<k>-heads.txt`: every notehead the second instrument (Audiveris) found on that crop, as `x:Pitch`, left to right, with `s` for a small (grace) head and `o` for a hollow head; plus barline x positions, flags, dots, tuplet marks. **Pitch is by staff position only: the key signature and accidentals are NOT applied.** The letter is reliable; the octave is reliable; whether it is sharp or flat is yours to read from the key signature and the accidentals on the page.
- `cp-out/<stem>/v<k>.mxl`: Audiveris's own rhythmic reading of the crop (often incomplete or wrong; a hint, never an answer).
- `cp-pages/zoom/<stem>-v<k>-<1|2|3>.png`: three overlapping zoomed pieces of each crop. Read these with the Read tool.
- `truthkit/pages/<stem>.txt`: a skeleton to fill.

If a page is not prepared yet, run `python3 -I truthkit/prep.py <stem>` yourself (about 75 s).

## How to draft a page

1. Read `cp-pages/src/<stem>.png` once (it is large; the Read tool shows it scaled) to see the page: title, poet, printed page number, key signature, time signature, clef, how many systems, whether the voice is silent on some system, whether a system is a piano-only interlude (then it has no voice staff: say so in a comment and give it no bars), and whether the page starts mid-song (then its first bar may be a continuation; number bars from 1 within the page anyway and say `// page starts mid-song` in a comment).
2. For each voice staff k, read the three zoom pieces. Read the rhythm (beams, flags, dots, rests, tuplets, ties) and the words by eye. Take the pitches from `v<k>-heads.txt`, matched left to right to the notes you see; apply the key signature and any accidental printed on the page; where a head is missing from the list or the list has an extra, trust the page and say so in a comment.
3. Write the bars into `truthkit/pages/<stem>.txt` in the kit's notation (format below). Mark every doubt with a trailing `// CHECK: <what you are unsure of>`.
4. Run `sh truthkit/build.sh <stem> <number of voice staves>`. It prints `CHECK bar N: sums to …` for any bar that does not add up to the metre (the first bar of a song that is an anacrusis and the last bar on a page are exempt). A bar that does not add up means a misread: go back to the zoom pieces and fix it, or leave it with a `// CHECK` comment saying what you see.
5. Read `truthkit/pages/<stem>-proof.png`: each printed system above your draft of it. Compare pair by pair: same number of notes, same rhythm, same contour, same words. Fix what differs. Build again.
6. Report, for the page: printed page number, song title, systems, bars, notes, syllables, and every `CHECK` you left, one line each.

Then take the next page. Pages are independent; the two of you split them as your spawner says. Do not touch another agent's pages.

## The kit's notation (truthkit/truth.py)

```
title: 1. Где ты, звёздочка? (Песня), words N. Grekov; Mussorgsky; Музыка, Москва, 1967, printed page 2
page: f1-000
key: 3          // fifths: 3 = three sharps, -2 = two flats
time: 4/4
clef: G2        // G2 treble; F4 bass (rare for a voice part)
anacrusis: yes  // the song's first bar is a partial bar
// system 1
b1: r/4
b4: r/2 | A4/4 "Где" | F4/4 "ты,"
b5: C5/4 "звез-" | B4/16 "доч" | C5/16 - | t3[ B4/32 - | A4/32 - | B4/32 - ] | A4/32 - | B4/32 - | C5/8 "ка?"
b6 3/4: ...     // a time signature after the bar number changes the metre from this bar on
```

- A note: pitch letter, accidental as printed or implied by the key (`#`, `b`, `n` for a natural that cancels the key), octave (C4 is middle C), `/`, written value (1 2 4 8 16 32 64), dots as `.`. So `F#4/8.` is a dotted eighth F sharp. **Write the sharp or flat every time the sounding pitch has one, including those the key signature supplies.** The kit applies the key signature to a bare letter as a fallback, but an explicit accidental is what Dann checks.
- A rest: `r/4`.
- A syllable in double quotes after the note: `"Где"`; a syllable that continues into the next note ends with a hyphen inside the quotes: `"звез-"`. A note that carries the previous syllable (a melisma) takes `-` instead of a quoted syllable. Keep the print's punctuation and capitals inside the quotes.
- A grace note: `g:` before the note, e.g. `g:C#5/16`. Grace notes are drawn and never counted in the bar's sum.
- A tuplet: `t3[ ... ]` for three in the time of two; `t5[ ... ]`, `t7[ ... ]` for five or seven in the time of four; `t3:2[ ... ]` to state both numbers. Every event inside is written at its printed value.
- A tie: `~` after the first note's value: `A4/4~ "ты" | A4/8 -`. The second note carries no syllable.
- Separate events with `|`. One bar per line. Comments after `//`.

## What counts

The scorer later compares, per note: pitch, written length, position in the bar, and the syllable under it. So the order of events, their values, and the syllable boundaries matter as much as the pitches. A fermata, a dynamic, a slur, a tempo word, and an ossia (a small alternative note above a note) are not recorded in the truth; an ossia gets a `// CHECK: ossia` comment. A breath mark or a comma over the staff is not recorded. Where two verses of text sit under the notes, record the first (upper) line only and note `// two verses` on that system.

## Pitfalls seen on page 2

- The voice's first bar was an anacrusis of one beat (a quarter rest) while the piano had two eighths: read the voice staff, not the piano.
- Grace notes are smaller heads with their own small beams; a pair of grace sixteenths in beat 2 of bar 6 made the bar look short until they were left out of the sum.
- A hollow small head in Audiveris's list (`o`) was a grace note, not a half note.
- The staff lines are curved by the book's spine; Audiveris's head pitches follow the curve, your eye may not. Trust the head list for the octave and the letter.
- The Soviet print joins syllables with a short underscore and hyphenates words across notes; keep the print's division.
