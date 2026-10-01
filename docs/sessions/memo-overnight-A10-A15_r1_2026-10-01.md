# Memo to the desk: A10 and A15. Overnight agent, 2026-10-01

Read only. HEAD `740dfe7`. Every code claim carries a `path:line` read this run. Web claims carry a URL in the Sources list.

## A10. Gradual tempo changes in notation software, and what they would do to Ilya's figures

### The question
Dann, 2026-09-10: review how Finale handles tempo, with special attention to gradual text cues (ritardando, rallentando, and the rest) that imply a smooth rate change rather than a binary flip; Ilya should plan for it.

### What the four programs do

**Finale.** Two layers. An expression can carry a playback definition of type Tempo, which sets an absolute bpm at a point and overrides the Playback Controls tempo [S1]. Gradual words are not modelled there; they are read by Human Playback, which recognises a dictionary of terms (rit, ritard, rall, allarg, calando, morendo, accel, stringendo, stretto, zurückhaltend, breiter, cédez, en pressant, a tempo, and so on; dots, spaces, parentheses ignored; modifiers poco a poco, sempre, molto, un poco) [S3]. Human Playback "uses linear model for tempo changes"; the span is taken from a Smart Shape (hairpin-style line) when there is one, otherwise it is estimated from context (end of movement, nearby fermata, nearby tempo expression, nearby "a tempo", nearby rall or accel) and is "generally not more than 2 measures"; the depth depends on the starting tempo ("slowing down from Presto is not the same thing as from Andante") and on the Rubato slider [S2]. The computation is made on the fly at playback; Finale does not write it into its tempo map unless the user applies Human Playback to MIDI, and manual tempo-map edits break Human Playback's reading of later rit/accel [S4]. So Finale has no stored target tempo for a rit.; it has a heuristic that exists only at playback time.

**MuseScore 4.** A gradual tempo change is a line object with a range ("The tempo changes along the object's anchored range"), an Amount ("Target tempo as a percentage of original tempo"), and an Easing method: Normal (linear), Ease in, Ease out. Defaults: accel. to 133 %, rall./rit./allarg. to 75 %. "a tempo" restores the pre-change tempo; "tempo primo" restores the first marking [S5]. A user report finds the playback realises the ramp as four abrupt steps across the span [S6]. On MusicXML import, rit./rall. words become plain staff text with no tempo effect; a 2023 proposal to map them onto the ritardando line is open [S7].

**Dorico.** A gradual tempo change spans from its start to the end of its continuation line, and has a "Final tempo %" property, "expressed as a percentage of the tempo at the start of the gradual tempo change" (20 on a 100 bpm start ends at 20 bpm; 120 ends at 120 bpm) [S8][S9]. At the end the tempo stays at the end rate until a fresh immediate tempo ("doesn't revert, it stays at whatever the end tempo of the gradual tempo was, unless you input a fresh immediate tempo", Lillie Harris, Steinberg) [S10]. The Dorico default percentage: NOT ESTABLISHED from the pages I could reach.

**Sibelius.** A rit. line plays "a linear slowing of the tempo to 75% of the starting tempo" by default; the Inspector lets you set the end as a percentage or an absolute bpm, and change the curve from Linear so the change happens earlier or later in the line [S11].

**Common model.** Three of four store the same four facts: start position, end position (a line's extent), an end tempo relative to the start (75 % slow, about 133 % fast), and a curve (linear default; easing options in MuseScore and Sibelius). The tempo stays at the new rate after the line ends until a fresh mark. Finale alone stores nothing and guesses a span of at most about two bars at playback.

### What MusicXML carries
`<sound tempo="…">` is "expressed in quarter notes per minute" and is a point value; the element has no attribute for a ramp, a target, or an end position [S12]. `<metronome>` is likewise a point. A rit. travels as `<direction><words>rit.</words>` with no playback meaning, which is why MuseScore imports it as inert text [S7]. Whether Finale, Dorico or Sibelius write a trailing `<sound tempo>` at the END of a rit. line on export: NOT ESTABLISHED. The MusicXML 4.0 spec page at w3.org was blocked by the fetch permission; the musicxml.com mirror [S12] is what I read.

### What Ilya does today (code read this run)
- The parser keeps two layers: `tempoMarkings` from `<metronome per-minute>` or, failing that, `<sound tempo>` rounded to an integer (`packages/score-parser/src/musicxml-parser.ts:972-999`), and `tempoWords` from every `<direction>` with words (`musicxml-parser.ts:501`).
- The seam `resolveTempo` returns ONE tempo for the whole piece: the singer's override, else the FIRST encoded mark (`firstEncoded`, `packages/score-parser/src/tempo-seam.ts:374-377`, used at `:427`), else the first steady word resolved to a Quantz tier band. Gradual words are classified into `gradualCues` as `ramp` (rit, rall, allargando, slentando, accel, stringendo, affrettando, stretto) or `step` (`tempo-seam.ts:146-147`, `:396-405`) and attached to the resolution.
- A SECOND encoded mark later in the piece is counted (`steadyMarkingCount`, `tempo-seam.ts:407-409`) but never used for arithmetic: `firstEncoded` is `markings.find(...)`.
- `rampSeconds(beats, t0, t1)` is the closed form for a linear ramp, exported (`tempo-seam.ts:173-180`, re-exported `packages/score-parser/src/index.ts:198`). Nothing outside the seam and its test calls it, and nothing outside the seam reads `gradualCues` (grep over `apps/web/src` and `packages/score-parser/src`, this run: only `index.ts:198`).
- `secondsFor` converts quavers to seconds at that single tempo (`packages/score-parser/src/phonation.ts:455-485`). Insights prices the whole page from ONE call for one quaver and multiplies: `secondsPerQuaver` (`apps/web/src/lib/insights/insights.ts:453-463`), used by the phonation section, the per-vowel figures and the cycle dose (`:488`, `:584`, `:719`; `singing-measures.ts:116-135`). So every seconds figure and the fold-cycle count assume one constant tempo from first bar to last.
- The seam's own header records a measurement: a ±25 % ramp over an ENTIRE piece moves the total by 10.7 %, which is below the 70 % band an inferred tempo already declares, so the ramp caveat is emitted only for encoded or user-set tempi (`tempo-seam.ts:49-57`).
- The N.120 tempo control is not built: Markup passes no override and the comment says so (`apps/web/src/lib/markup/MarkupPane.svelte:728-730`).

### What a gradual change would alter in Ilya's figures
Ilya's figures are totals and per-vowel or per-pitch sums of seconds. A ramp changes the seconds of only the notes inside its span, by the integral of the rate across the span. With the notation programs' default (rit. to 75 % of the start, linear), a span of n beats takes `rampSeconds(n, t0, 0.75 t0)` seconds, which is 1.151 times the constant-tempo seconds for those beats (60·ln(1/0.75)/(1−0.75) ÷ 60 = 1.1507). If, as in Dorico and MuseScore, the tempo then STAYS at 75 % until an "a tempo", every bar after the rit. costs 1.333 times its constant-tempo seconds. For a song where a two-bar rit. closes a 24-bar piece: the total moves by about 1.3 %. For a mid-song rit. with no "a tempo" over the remaining half: about 16 %. The first is below any band Ilya prints; the second is material for an ENCODED tempo, and also shifts the per-vowel split toward whatever vowels sit in the slow half. The cycle dose moves by the same proportions, weighted by the pitches in the slowed span.

What Ilya lacks is not arithmetic but the two inputs every program stores and MusicXML does not carry: where the ramp ENDS, and what it ends AT. A `<words>rit.</words>` gives a start bar only (`tempoWords[].measureIndex`, `musicxml-parser.ts:501`).

### Verdict: NEEDS DANN
One question. When a rit. or accel. word has no encoded target, should Ilya (a) keep abstaining on the ramp and keep pricing the whole piece at one tempo, saying so where the tempo is encoded, which is what it does today; or (b) adopt the notation programs' convention as a labelled default, linear to 75 % (rit., rall., allarg.) or 133 % (accel., stringendo) over a span that ends at the next tempo word, "a tempo", fermata, or two bars, whichever is first, and holding the end rate until "a tempo" or a new mark, with the figure shown as a range between the two readings?

Recommendation: (b), with the range. The seam already has the classifier, the measure index and the closed form; the convention has three vendors behind it (75 % in MuseScore and Sibelius; Dorico's percentage model; Finale's two-bar span); and showing it as a range keeps faith with the 2026-07-17 ruling that a tempo figure is "a sensible, sourced, overridable default", not "correct". Cost of (b): one new function in the seam that walks `tempoWords` and `tempoMarkings` in order and returns a piecewise rate, plus `secondsPerQuaver` giving way to a per-event pricing in `insights.ts:453-463` and the three callers, plus the cycle dose summing per event rather than per row. That changes the shape of a public seam, so it is not a brief; it waits on the ruling and belongs with N.120's Tempo station. Cost of (a): nothing now; figures silently assume one tempo on any song that slows and stays slow.

## A15. Can a smartwatch capture formant readings and relay them to Ilya?

### The question
Dann, 2026-08-24: can a smartwatch capture formant readings and relay them to Ilya on a phone or laptop?

### What Ilya needs from a capture
Ilya opens the microphone itself through `getUserMedia` with echo cancellation, noise suppression and automatic gain off, one channel (`apps/web/src/lib/voice/engine/live.ts:339-346`), in an `AudioContext` at 48 000 Hz (`live.ts:103`, `:362`), and feeds an `AudioWorklet` tap (`live.ts:143`). The resonance estimate works on a band of 150 to 3000 Hz (`apps/web/src/lib/voice/engine/extract.ts:114`) with an LPC fallback of order 18 (`extract.ts:70`), and the closed-phase path decimates to 8 000 Hz (`apps/web/src/lib/voice/engine/closed-phase.ts:33`). So any capture that delivers mono PCM at 16 kHz or better, unprocessed, covering roughly 150 to 3000 Hz, is enough for the maths. The question is whether a watch can produce that and hand it to a browser.

### Apple Watch
- No web path at all. WebKit is not available on watchOS: "WebKit is only available on iOS, iPadOS, and macOS" (Apple frameworks engineer, 2022-01) [S13]. There is no Safari, no WKWebView, and therefore no `getUserMedia` and no PWA. Ilya cannot run on the watch.
- Native path exists. A third-party watchOS app can read live microphone PCM through `AVAudioEngine`'s input tap; one published implementation reports the Apple Watch input at 44 100 Hz, mono, Int16, in 3 200-frame buffers, and streams it over a WebSocket [S14]. The high-level `presentAudioRecorderController` offers presets at 8, 16 and 44.1 kHz [S15].
- Background limits. Recording must be started by the user in the foreground; it can continue in the background with the audio background mode and `.playAndRecord`, including with the wrist down, but any interruption (call, Siri) stops it and it cannot be resumed from the background [S16]. For a fry capture of a few seconds this is tolerable.
- Relay. The native app would send PCM to the phone with WatchConnectivity, or to any host over the network as in [S14]. Ilya in Safari on the phone or Mac cannot receive it directly; it would need a receiver (a companion iOS app or a local or hosted relay) and a new input seam in `live.ts` beside `getUserMedia`. Two paid-developer-account apps, store review, and a relay service, for a microphone that is on the singer's wrist rather than at the singer's mouth.

### Wear OS
- Native recording exists (Google's own WearSpeakerSample "Demonstrates audio recording and playback if the wearable device has a speaker") [S17]. The sample's exact sample rate and API: NOT ESTABLISHED, the raw file fetch was blocked.
- Web path: NOT ESTABLISHED. I found no evidence of a Wear OS browser that exposes `getUserMedia`, and Google ships no Chrome for Wear OS. Treat as absent until shown otherwise.

### Frequency response
The published frequency response of the Apple Watch or any Wear OS microphone: NOT ESTABLISHED. Apple documents the Noise app's A-weighted level metering but not the capsule's response [S18]. What the physics says: the resonance estimate reads the spectral envelope between about 150 and 3000 Hz, not the fry pulse rate (30 to 80 Hz), so a voice-band MEMS microphone with a roll-off below 100 Hz would not by itself defeat the measurement. What would: the watch's own voice processing. The native APIs expose a session mode, but whether the Apple Watch input is delivered raw or already noise-suppressed, and whether the Wear OS path can disable processing, is NOT ESTABLISHED. Ilya turns those off on purpose (`live.ts:341-344`).

### Verdict: CLOSE as not feasible for Ilya as a web app; NEEDS DANN only if he wants the native route costed
A watch cannot run Ilya and cannot hand audio to a browser. The only route is a native watch app plus a relay plus a new input seam, which is a second product. The plain answer to the 2026-08-24 question: no for the browser; yes in principle for a native app, at a cost of two native apps and a relay, with the microphone's suitability unmeasured. Recommendation: close the item and record that a phone or laptop microphone held near the mouth remains the capture path. If Dann wants the native route costed, the one question is whether he would accept an App Store app as a dependency of a free open-source web tool.

## What I could not establish
- Dorico's default "Final tempo %" (likely 75 % by analogy, but no page I reached states it).
- Whether Finale, Dorico or Sibelius write a trailing `<sound tempo>` at the end of a rit. line on MusicXML export. This decides whether an exported score ever carries a usable target.
- MusicXML 4.0's own `<sound>` page at w3.org (fetch blocked); read the musicxml.com mirror instead.
- Wear OS: the recording API and sample rate in Google's sample (raw file fetch blocked); whether any Wear OS browser exposes `getUserMedia`.
- The frequency response of any smartwatch microphone, and whether its raw input is delivered unprocessed to third-party apps.

## Sources
- S1 Finale, Tempo: https://usermanuals.finalemusic.com/Finale2014Mac/Content/Finale/Tempo.htm
- S2 Finale, Human Playback Custom Style dialog box: https://usermanuals.finalemusic.com/FinaleMac/Content/Finale/Human_Playback_Custom_Style.htm
- S3 Finale, Human Playback Dictionary: https://usermanuals.finalemusic.com/FinaleMac/Content/Finale/Human_Playback_Dictionary.htm
- S4 Scoring Notes, Using Finale's tempo map: https://www.scoringnotes.com/tutorials/using-finales-tempo-map/
- S5 MuseScore 4 handbook, Tempo markings: https://handbook.musescore.org/text/tempo-markings
- S6 MuseScore forum, Ritardandos and accelerandos always consist of 4 evenly spaced abrupt tempo changes: https://musescore.org/en/node/339747
- S7 MuseScore GitHub issue 17069, Gradually slowing tempo modifiers in MusicXML imports: https://github.com/musescore/MuseScore/issues/17069
- S8 Dorico 1 manual, Changing the final tempo at the end of gradual tempo changes: https://archive.steinberg.help/dorico/v1/en/dorico/topics/notation_reference/notation_reference_tempo_playback_final_tempo_changing_t.html
- S9 Dorico 2 manual, Gradual tempo changes: https://archive.steinberg.help/dorico/v2/en/dorico/topics/notation_reference/notation_reference_tempo_gradual_c.html
- S10 Steinberg forums, Gradual tempo change end: https://forums.steinberg.net/t/gradual-tempo-change-end/769053
- S11 John Hinchey, Sibelius 7 playback tips: tweaking ritard and accelerando lines: https://hincheymusic.com/sibelius-7-playback-tips-tweaking-ritard-and-accelerando-lines/
- S12 MusicXML reference (musicxml.com), Element: sound: https://usermanuals.musicxml.com/MusicXML/Content/EL-MusicXML-sound.htm
- S13 Apple Developer Forums, Is WebKit available on watchOS?: https://developer.apple.com/forums/thread/698287
- S14 AmiVoice tech blog, Real-time speech recognition on Apple Watch using WebSocket + AVAudioEngine: https://acp.amivoice.com/en/blog/2021-06-14-123000/
- S15 Kodeco, Audio recording in watchOS tutorial: https://www.kodeco.com/345-audio-recording-in-watchos-tutorial/page/2
- S16 Apple Developer Forums, watchOS: resume recording from AudioInterruption in background mode: https://developer.apple.com/forums/thread/750432
- S17 Google, wear-os-samples README (WearSpeakerSample): https://github.com/android/wear-os-samples
- S18 Apple Support, Measure noise levels with Apple Watch: https://support.apple.com/guide/watch/noise-apd00a43a9cb/watchos
