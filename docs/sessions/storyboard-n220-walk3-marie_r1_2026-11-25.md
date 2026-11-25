# N.220 walk 3, Marie: read MELODY, and read INSIGHTS. Storyboard r1, partial

Walked by the desk 2026-11-25 01:2x to 01:4x in Dann's Chrome, on the READY Vercel build of `66dfb5f9` (N.221), viewport 1512 by 773 CSS px, desktop layout. Every beat read off the screen.

**Marie:** studio teacher, desktop, English. Road in: a file. She creates the student's voice herself from a declared type, reads MELODY and INSIGHTS, and transposes.

**PARTIAL.** The eight declared voice types against one song, and the strophic case, are not yet walked. What is below is the spine.

## The beats

1. **She drops a Finale `.musx`.** `Mussorgsky - Sunless 04 - Be bored.musx`, 63 kB. The INPUT receipt fills: SCORE with the file name and Clear and Replace; TEMPO, crotchet = 38, marked *printed*, with "Change the tempo"; CLEF, "As written"; and the line "Format: Finale .musx → MNX". A lavender notice follows: "Converted from Finale format by denigma. Lyric alignment and measure structure are preserved. Verify custom expressions or complex layouts if the score appears unusual." It carries a Dismiss.
2. **TEXT fills with the song's own words**, not a pasted poem, and the INPUT line changes to name what the score contributes: "The sung words come from your score; edit them in LYRICS."
3. **MELODY draws the song.** The running head reads "RESONANCE PROFILE: PLACEHOLDER VALUES FOR A GENERIC BASS, NOT YET YOUR OWN RESONANCES.", then a legend: stems up is close timbre, stems down is open timbre, and a hollow ring is the same reading resting on a placeholder value. The staves carry Russian and IPA under the notes.
4. **A card sits over the header on first arrival: "Voice line as written"**, with "Treble, sounding an octave lower", "Bass", and "As written". **This is the item lane 71's as-built review listed for Dann's eye on 2026-11-19 and it is still there.** It covered the header on every arrival in this walk, on three different scores.
5. **The crossings are dashed, and that is right.** Each crossing squircle on the stave is drawn with `stroke-dasharray` and `data-placeholder="true"` (read off the rendered SVG), because the student's profile is borrowed rather than measured. That is his ruling of 2026-11-24 00:33 and 00:37 working: a dashed squircle says verification is necessary.
6. **The loupe opens on a tap.** "m. 5 · system 2 of 9 / G#4 · beat 1 · Dotted quarter", the bar magnified, the syllables and IPA under it, and SYLLABLES and CORRECTIONS.
7. **INSIGHTS opens addressed to her student by name.** "INSIGHTS FOR WALK2 JAMES (DELETE AFTER) · BASS-BARITONE · NOT CALIBRATED", then "These findings use placeholder values for a generic bass, not your specific voice.", then the bass-baritone concession again, then the placeholder line, then the italic paragraph that ends "discuss anything Ilya suggests with your voice teacher." Then "HOW THIS KEY SITS FOR YOU": "This piece doesn't know your range yet. Add your range, and it can tell you whether this key suits you." Then "THE MEASURES BEHIND THESE REASONS": "Your vocal folds contact about 27,000 times as you sing this piece.", and the seconds-of-phonation-per-pitch chart.
8. **A second score raises a stop, and the stop is well built.** Dropping a different score onto a song that already has one opens "This is not the same music.": "This score is not the one this song was built on. 86 of your 108 syllable placements have no note in it. Continuing replaces the whole song, its title, its score file, and every placement. Ilya cannot undo that. Export this song first if you want to keep it." Three choices: "Replace this song" set as plain text, "Export this song first" and "Keep this song" as buttons. **The destructive choice is the quietest one on the card.**
9. **Ilya finds the poem by itself.** On the Tchaikovsky score, INPUT showed "Ilya found this poem for your song:" with «Средь шумного бала, случайно», Алексей Константинович Толстой, "From Russian Wikisource", "Coloured words in LYRICS now show where your song departs from this poem.", and "Not this poem" and "Keep this poem". On the Mussorgsky score it found «В четырёх стенах», "Комнатка тесная, тихая, милая", Арсений Аркадьевич Голенищев-Кутузов. **This is most of walk 4's comparison beat, happening without being asked.**
10. **The score's own header fills PIECE.** Title "Without Sun, no. 1: Within Four Walls" and composer "Modest Mussorgsky (1839–1881)", each marked *from score*, with "Revert to score header".
11. **Transposition.** The key line reads "Key: D major, as printed" with "Try another key". The ruler opens over the page: a row of key stops with the current one filled, a readout, Cancel and "Use this key". Moving to C reads "Down a whole tone · C major" and the staves redraw live under the ruler. "Use this key" closes it and the key line becomes "Key: C major, transposed" with an "As printed" pill to go back.

## What the walk found

### 1. The transposition ruler is unreachable on a score whose key signature carries no mode

**What was believed:** transposition is available on any score Ilya draws.

**What is now known:** it is available only when the file states the key's mode. `apps/web/src/lib/melody/transposition-ruler.ts:49-51` returns null unless `signature.mode` is set; `packages/score-parser/src/musicxml-parser.ts:434-436` sets that field only from an explicit `<mode>` element, and `types.ts:366` makes it optional. With no mode there is no key line (`PieceKeyLine.svelte:28`), and the only other route, "Try this key" from INSIGHTS, dies at the same `printed` value (`transposition-ruler-state.svelte.ts:101`). The file's own comment at `:97` already names the case: "no key (a source with no mode)".

**Measured, with a positive control:**

| file | `<mode>` in the file | key line on the page |
|---|---|---|
| `Mussorgsky - Sunless 04 - Be bored.musx`, via denigma | none that survived | absent |
| `tch-op38-3-from-scan_modern.musicxml` (Dann's own assembly, fifths 2) | 0 | absent |
| `Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml` | 2 | **"Key: D major, as printed", and the ruler works** |

**Reach:** none of the sixteen MusicXML fixtures in `packages/score-parser/src/fixtures/` carries a `<mode>`. MusicXML makes the element optional, so a publisher's export, a scan assembly, and a Finale conversion can all arrive without it.

**What it changes:** the coverage frame's "transposed" value cannot be covered by any walk on a score that lacks a mode, so moving transposition from Ted to Marie is not enough on its own. A row is owed. The cheapest repair the desk can see, and it is NOT yet briefed or ruled: infer the mode from the key signature and the piece's own first and last sounding pitches, and say on the key line that the mode was inferred. That is a design question with a singer-facing string in it, so it goes to Dann rather than straight to a lane.

### 2. Six singer-facing strings say the DRAWER is "on the left", and on a phone it is not

`apps/web/src/lib/i18n.ts:2051`, `:2052`, `:2059`, `:2060`, `:2061`, and `:2062` all read "through the DRAWER on the left" in English and « depuis le TIROIR de gauche » in French, pinned at `apps/web/src/lib/analysis/placeholder-line.test.ts:34`, `:39`, `:54`, and `:59`. On a phone the DRAWER rises from the foot of the screen and its bar is labelled DRAWER; the desk measured that in walks 1 and 2 at 606 px. So the sentence is false on a phone, and it is directional language, which `CONTRACT.md` section 6 bans. Both languages need Dann: the English to ratify, the French to rule.

### 3. The Finale conversion arrived with no title and no composer

The `.musx` left PIECE's title, opus, composer, poet, and translator fields empty, and MELODY printed "Aria or song title". The two MusicXML files filled title and composer from their own headers. **NOT ESTABLISHED** whether the `.musx` carries that metadata and denigma drops it, or the file never had it; the desk did not open the `.musx`.

### 4. The puck on the page edge is Vercel's, not Ilya's

The dark round control at the edge of every preview screenshot is the Vercel preview toolbar, injected into preview deployments. It does not appear on `ilya.dannmitton.com`. The desk hid it for the rest of this walk. Recorded so no later desk chases it as an Ilya control.

## State changed on Dann's machine

On the preview origin only: three songs now exist (one named `С` holding Ted's poem and the Mussorgsky `.musx`, one holding the Tchaikovsky scan assembly, one holding Sunless no. 1 transposed to C major), and the voice profile `walk2 James (delete after)`. The Vercel preview toolbar is hidden for that origin. Nothing on `ilya.dannmitton.com` was touched.
