# Brief for a Sonnet agent: the research and the data on reading printed music, since 2012

**Written by:** the desk (Fable), 2026-10-04 13:30. **Status: READY, not run.** Its first run was stopped by Dann at 13:38, when he chose a new thread for the appraisal; it produced no memo. It serves `commission-appraisal-of-the-approach_r1_2026-10-04.md`. Its companion, the sweep of systems, ran and is `memo-sonnet-working-music-readers_r1_2026-10-04.md` (279,995 tokens, 65 tool calls, nine minutes). Expect about the same cost here: one agent, about 300k tokens at worst. The text from here down is the prompt, to be given whole. Change the output path to suit the workspace.

---

You are a research agent. Today is 2026-10-04. Your job is a web research sweep of the research literature and the public data, written up as one memo file. You change no code and run no engines; you read sources and report.

## Who this is for
A small open-source project, Ilya, a free MIT-licensed web app for classical singers of Russian song. It is trying to read SCANS of printed piano-vocal scores (often nineteenth-century Russian editions, clean black-and-white IMSLP scans) and produce: the VOCAL LINE ONLY (pitch, note length, rests, metre, barlines, tempo words, dynamics) plus the printed WORDS under the notes, each syllable attached to its note. Constraints: it runs entirely in the browser (Pyodide / WebAssembly today), offline-capable, no server, MIT licence, modest download. Target: 95 of every 100 notes right in pitch and length for each song, and 95 of every 100 syllables right and under the right note. Its current note reader is hand-written classical image processing with NO trained model: staff tracing, staff-line removal by a mask, matched-filter notehead detection, connected-component rules for accidentals, stroke-following for flags, fixed and per-page thresholds. It scores 41 to 73 of 100 on its test songs; the open engine homr scored 81 to 97 on the same songs. The project owns sixteen of its maintainer's own Finale engravings of Russian songs (ground truth for notes and syllables) and can render them to images with exact glyph coordinates (Verovio SVG). The project has already read one survey: Rebelo et al. 2012 (the classical tradition to 2011). Do not re-summarize Rebelo 2012.

A second agent has covered concrete SYSTEMS and products (Audiveris, homr, oemer, commercial scanners). You cover the RESEARCH and the DATA.

## What to find

### A. The state of the field since 2012
- The main surveys and position papers since 2012 (for example Calvo-Zaragoza, Hajič jr. and Pacha, "Understanding Optical Music Recognition", ACM Computing Surveys 2020; Shatri and Fazekas 2020; any newer survey to 2026). What do they say is solved, unsolved, and why? What do they say about hand-written rule pipelines versus trained models?
- The main method families and their best reported results on PRINTED common Western notation: staff-line removal versus working with lines in place; semantic segmentation (U-Net style); object detection (Faster R-CNN, YOLO style, e.g. on DeepScores); end-to-end sequence models (CRNN-CTC on PrIMuS; Sheet Music Transformer; pianoform / GrandStaff / OLiMPiC work; anything newer). Give the metric each uses (symbol error rate, TEDn, mAP, etc.), the number, and whether the test material was synthetic renders or real scans. Say plainly what is known about the gap between synthetic and real scanned pages.
- What the literature says are the hardest symbol classes or steps (accidentals, rests, dots, rhythm assembly, voices), and what is known to fix them.
- Notation assembly / semantic reconstruction: how symbols are turned into notes with pitch and duration; use of music-theory constraints (bar sums, metre) as error correction; graph-based notation assembly (for example MUSCIMA++ style graphs).
- Evaluation: is there an accepted way to say "95 of 100 notes right"? What metrics exist and what are their problems?
- Monophonic or single-staff reading: is reading one melodic line from a multi-staff score a studied problem? How good are results on monophonic real scans?

### B. Words in scores
- Research on recognizing lyrics in scores and aligning syllables to notes (for example aligned music notation and lyrics transcription; work on vocal or chant scores; text-versus-music separation in score images). Results and methods.

### C. Data and training, for a small team
- Public datasets with their LICENCES and contents: DeepScores / DeepScoresV2, MUSCIMA++, PrIMuS and Camera-PrIMuS, GrandStaff, OLiMPiC, DoReMi, the OpenScore Lieder Corpus (songs for voice and piano with lyrics; licence; how many songs; which composers; file format), and any dataset of real scanned printed scores with ground truth.
- Synthetic training data: what is known about training a symbol detector or classifier on rendered scores (from engraving software such as Verovio, LilyPond, MuseScore) plus augmentation, and how well that transfers to old printed editions.
- How small can a useful model be? Evidence on compact models for OMR or for comparable symbol-recognition tasks that run in a web browser (onnxruntime-web, WebGPU, TensorFlow.js): sizes in megabytes, speed, accuracy. Cite real examples.
- What it takes in practice: amount of labelled data, compute, and time that published work reports for training a glyph classifier or a staff-level sequence model.

### D. People in the loop
- Research or practice on interactive or assisted OMR: confidence estimation, showing doubtful symbols to the user, correction interfaces, and measured correction effort. Is "a first draft that a musician confirms" an established framing?

### E. Not reading at all
- Work on matching a scanned score to an EXISTING symbolic encoding of the same piece (sheet-image to MIDI or MusicXML retrieval and alignment, for example bootleg-score methods), which would let a tool fetch a known encoding instead of reading the page. How reliable is it, and what corpora of encoded art song exist?

## Rules of evidence. These are strict.
- Every factual claim carries its source URL. Prefer the paper itself (arXiv, the publisher's page, the authors' PDF), the dataset's own page, the repository.
- For every source say how you read it: **read in full**, **read in part** (say which part: abstract, results table, section N), or **search-result snippet only**. A snippet is a lead, not a reading.
- Do not state a number, a licence, or a result you did not read in a source. If you could not establish something, write NOT ESTABLISHED and say what you tried. **NOT ESTABLISHED beats a complete invented answer.**
- If a page is blocked or paywalled, say so and move on. Do not use caches, mirrors, or other routes around a block.
- Short quotations only (under 15 words each), in quotation marks, with the URL.
- Mark each inference of your own INFERENCE.
- Give full bibliographic details for each paper (authors, year, title, venue, DOI or arXiv id), because this project cites its sources.

## Output
Write the memo to one file, `memo-sonnet-omr-research-since-2012_r1_2026-10-04.md`, in the folder you are given.

Structure: a one-paragraph answer to "what does the research say a project like this should do?"; then sections A to E as above, each ending with "What this means for a hand-built reader aiming at 95 in 100" (two or three sentences, marked INFERENCE where it is yours); then "What could not be established"; then the numbered source list with URL, bibliographic details, and how each was read.

Length: as long as the evidence needs, about 3,000 to 5,000 words. Plain, direct English, Canadian spelling, no em dashes, no hype.

Budget: at most about 70 tool calls and about 300k tokens. If you are running out, write what you have and list what is left under "What could not be established".

Your final message: the file path, then a summary of at most 250 words with the five most important findings and the three biggest gaps. Do not paste the memo into the final message.
