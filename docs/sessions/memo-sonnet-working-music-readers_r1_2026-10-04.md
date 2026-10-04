# Working music readers: what has been built, how it works, and whether it works

Research sweep of systems (not the literature in general), written 2026-10-04. Source numbers in square brackets point to section 7. "Read in full / in part / snippet" is stated there. INFERENCE marks my own reasoning. NOT ESTABLISHED means I looked and could not confirm.

## 1. Short answer

Nobody has built, in a form I could find, a system whose stated purpose is to pull the vocal line plus its lyrics out of a piano-vocal score, and nothing I found is aimed at Russian or Cyrillic song. What does exist falls into three groups. First, whole-score readers that also read lyrics and attach each syllable to a note: SmartScore, PhotoScore, Soundslice and Opuscan are closed products that say they read lyrics, and Audiveris does it as open source with Tesseract OCR [11][13][25][26][27][31]. Second, trained neural readers (homr, Zeus, SMT, Legato) that read notes well on clean material but do not read lyrics at all; the two research benchmarks built on art songs (OLiMPiC and the Legato Lieder test) remove or mask the vocal staff [15][16][18][19]. Third, one research paper that formalizes "aligned music notation and lyrics transcription", tested only on Gregorian chant [22]. Does it work? For notes, the trained systems clearly beat the hand-built ones on the only head-to-head table I found (Audiveris 71.5 against Legato 2 at 34.2 error on 32 IMSLP piano pages, a page-level metric from the Legato authors) [19]. Nobody reports note-level pitch-and-length accuracy of 95 or better on real nineteenth-century scans. The best independent-style numbers are error rates of 17 to 18 per cent on flatbed scans of Lieder piano parts (Zeus) [16]. For lyrics, only vendor claims exist, and they are unmeasured. The only OMR I can show running entirely in a browser is a new third-party port of homr (homr-web, AGPL-3.0) [6], plus a research web app, MusicDocs, whose abstract says it can run ONNX models in the browser [23].

## 2. Comparison table

Accuracy cells give the best figure I read, who made it, and the metric. Metrics differ and cannot be compared across rows. "Lower is better" for error metrics.

| System | Open / closed | Licence (code / weights) | Method | Trained / hand-built | Reads lyrics | Cyrillic lyrics | Browser / on-device | Best accuracy figure and source |
|---|---|---|---|---|---|---|---|---|
| Audiveris 5.x | Open | AGPL-3.0 / NOT ESTABLISHED separately (pre-trained classifier ships) [11][12][13] | Morphology, templates, small neural classifier | Mostly hand-built, one trained classifier | Yes (Tesseract, optional) [13] | Partly: Tesseract has a `rus` file; not tested by anyone I found [13][33] | No (Java desktop) | Page-level OMR-NED 71.5 on 32 IMSLP piano pages, from Legato authors [19]; no vendor figure |
| oemer 0.1.x | Open | MIT / NOT ESTABLISHED; trained on CvcMuscima-Distortions and DeepScores-extended [9][10] | Two U-Nets, SVMs, rules | Hybrid | Not documented | No | ONNX Runtime in Python; no browser build found | None published; the brief's own test gave about 28 of 97 on one song |
| homr 0.7.0 | Open | AGPL-3.0 / NOT ESTABLISHED separately [1][2][3] | U-Net, staff rules, transformer | Hybrid: trained models, hand-written staff logic | No (OCR for title only) [4][5] | No | Yes, via third-party homr-web (WebGPU/WASM) [6]; Android via Andromr [8] | None in README; the brief's own tests gave 81 to 97 of 100 |
| homr-web 0.1.0 | Open | AGPL-3.0 / same models as homr [6][7] | Port of homr to TypeScript | Trained | Chord text above staff only [6] | No | Yes: onnxruntime-web, 134 MB (WebGPU) or 189 MB (WASM) [6] | Output identical to homr on three test pages (author's claim) [6] |
| Polyphonic-TrOMR | Open | Apache-2.0 / NOT ESTABLISHED [21] | Transformer, end to end | Trained | No | No | No | Abstract claims it beats earlier methods; no figure read [21] |
| SMT / SMT++ | Open | MIT / NOT ESTABLISHED (Hugging Face collection not read) [14] | Image-to-sequence transformer | Trained | No (not documented) | No | No (PyTorch) | SER 5.1 GrandStaff ideal, 6.2 camera, 1.4 quartets, by authors [14] |
| Zeus / OLiMPiC | Open | Code MIT; weights CC BY-SA (2024), CC BY-NC-SA (2026 solo-staff); dataset CC BY-SA [15][17] | CNN, BiLSTM, attention decoder | Trained | No | No | No (TensorFlow 2.12, Python 3.10) [17] | TEDn 18.4 %, SER 17.7 % on scanned Lieder piano parts, by authors [16] |
| Legato / Legato 2 | Evaluation set "publicly available in our codebase"; weights page gated [18][20] | NOT ESTABLISHED (paper is CC BY 4.0) [18][19] | Frozen Llama vision encoder, small decoder | Trained | No (lyrics excluded) [18][19] | No | No (INFERENCE: 836M-parameter encoder) | OMR-NED 34.2 on 32 IMSLP piano pages, by authors [19] |
| Mozart, cadenCV | Open | Mozart Apache-2.0; cadenCV no licence file found [24] | Staff removal, templates | Hand-built | No | No | No | None read |
| Moonlight (Google, experimental) | Open | Apache-2.0 / NOT ESTABLISHED [24] | NOT ESTABLISHED | NOT ESTABLISHED | No (outputs notes) | No | No | None read |
| MusicDocs | Web app, licence NOT ESTABLISHED | NOT ESTABLISHED | Models run in browser via ONNX (abstract) [23] | NOT ESTABLISHED | NOT ESTABLISHED | NOT ESTABLISHED | Yes, per abstract [23] | None |
| PhotoScore / NotateMe Ultimate | Closed | Proprietary | "Dual-engine" (unpublished) | NOT ESTABLISHED | Yes, 120 languages [25] | NOT ESTABLISHED | Desktop | Vendor: "over 99.5% accurate on most PDFs and originals" [25] |
| SmartScore 64 | Closed | Proprietary | Unpublished | NOT ESTABLISHED | Yes, auto-attaches syllables [26] | NOT ESTABLISHED | Desktop | Vendor claim "99+%" quoted by a reviewer, no metric [28] |
| ScanScore | Closed | Proprietary | Unpublished | NOT ESTABLISHED | Partly ("hit-or-miss", 2021 review) [28] | NOT ESTABLISHED | Desktop | None |
| PlayScore 2 | Closed | Proprietary | Unpublished | NOT ESTABLISHED | No MusicXML lyrics (2021 review) [28] | No | Phone app; on-device processing NOT ESTABLISHED | None |
| Soundslice scanner | Closed | Proprietary | Fine-tuned detection models | Trained | Yes, 20+ languages [27] | Non-Latin scripts claimed; Cyrillic not named [27] | Server-side (GPU) | Reviewer: "most accurate scan" on one test page, no number [28] |
| Newzik LiveScore / Maestria | Closed | Proprietary | "Machine learning" | Trained | NOT ESTABLISHED | NOT ESTABLISHED | Server-side, minutes per page [28] | None |
| Opuscan (Tutteo) | Closed | Proprietary | In-house deep-learning model | Trained | Yes, attaches to notes (vendor) [31] | Yes, user selects language (vendor) [31] | Page capture on-device; recognition location NOT ESTABLISHED | None |
| MuseScore NoteVision | Closed | Proprietary | "Own OMR engine" | NOT ESTABLISHED | NOT ESTABLISHED | NOT ESTABLISHED | Server | Vendor: "around 95%", metric undefined [32] |
| Klangio Scan2Notes | Closed | Proprietary | "AI" | NOT ESTABLISHED | NOT ESTABLISHED | NOT ESTABLISHED | Server | None [30] |

## 3. System by system

### 3.1 Audiveris (open, AGPL-3.0)

1. **Method.** The README describes it as "ad-hoc methods for lines", morphological closing for beams, external OCR for text, "template matching for heads, neural network for all other fixed-size shapes" [11]. The GRID step finds staves and systems from black runs, long horizontal filaments and projections, and outputs a "no-staff image" [13], so staff lines are removed for later steps. The HEADS step runs template matching for black, void and whole heads on a copy of the binary image where staff lines, ledgers, barlines and stem seeds are erased and marked "ignore" in a distance table [13]. Reading accidentals, rests, dots and rhythm: the TEXTS and RHYTHMS step pages say "Documentation not yet provided" [13], so I cannot report how bars are checked against the metre. The handbook lists known limits (opposed stems, tuplets other than triplets and 6-tuplets) [13].
2. **Words.** Text goes to the Tesseract OCR library, run in its legacy mode; lyrics and chord names are explicit options in the book parameters, and lyrics are assumed to be below the staff unless a second option is set [13]. Each syllable is "usually linked to a related chord", and the user can drag a syllable to another chord to relink it [13]. Since 5.10, verse numbers are filtered out of the lyric line and isolated punctuation (as in French) is joined to the preceding syllable [13]. Hyphen and extender handling: an older release note says the user could "enter extension sign" manually [13]; automatic extender detection NOT ESTABLISHED. Languages: the handbook says 100+ Tesseract languages can be installed on demand, and the language is set per book or sheet [13]. The `rus.traineddata` file exists in the tessdata repository [33], but I found no report of anyone running Audiveris on Cyrillic scores. Old typefaces or pre-1918 spelling: NOT ESTABLISHED (I looked for `rus_old` and `chu` data in two Tesseract repositories and found none [33]).
3. **Vocal / piano-vocal.** The handbook discusses mapping systems' staves to logical parts [13]; I read only the first lines of that page, so whether one staff can be excluded cleanly is NOT ESTABLISHED.
4. **Accuracy.** The README says "a 100% recognition ratio is simply out of reach in many cases" [11]. No vendor figure. The Legato 2 authors report page-level OMR-NED error for Audiveris of 56.3 to 85.8 across six datasets, 71.5 on 32 IMSLP piano pages, and say Audiveris needed input preprocessing [19]. That is a competitor's measurement and a different metric from note accuracy.
5. **Licence.** Code AGPL-3.0 [12]. Pre-trained classifier weights: NOT ESTABLISHED separately.
6. **Size and runtime.** Java application with a bundled JRE and a native Tesseract library [11][13]. No browser version found. Per-page speed: NOT ESTABLISHED.
7. **Correction.** Strong: an integrated editor, and the classifier board shows the top five shapes with grades [11][13].

**History of the classifier.** The documentation I read says the glyph classifier is a neural network, trained by the project, with hyperparameters exposed in the trainer dialog; 5.11 (July 2026) added L2 regularization [13]. The 4.0 notes say a music font is used "to build artificial symbols used for initial training of the neural network" [13]. The 4.2 notes say Hu moments were replaced by ART moments as the network's main input [13]. I found no page that dates a move from a hand-built classifier to a neural one. NOT ESTABLISHED for anything before 4.0. Heads are still template matched, not neural [11].

### 3.2 oemer (open, MIT)

1. **Method.** Two U-Net segmentation models, one for staff lines versus everything else, one for noteheads, clefs and accidentals, and stems and rests [9]. The image is first dewarped. Staff lines are found by summing positive pixels per row and picking peaks, working on the predicted map rather than removing lines; the key quantity is `unit_size` (staff-line interval) [9]. Noteheads are cleaned by morphology, split using unit size, and hollow heads are told from whole notes by a coverage ratio [9]. Clefs, accidentals and rest types go to three SVM classifiers trained on DeepScores-extended crops [9]. Dots are found by a pixel-ratio threshold; beams and flags are counted by scanning a region around each note group [9]. Rhythm check: a "Symbol Alignment / Beat Adjustment" step assumes notes at the same horizontal position across tracks share a beat position, and at checkpoints "the accumulated difference should be zero", otherwise it adjusts rhythm types or inserts rests [9]. That is a music-theory correction.
2. **Words.** The README describes no text or lyric step (I read lines 1 to about 400 and 450 to 490) [9]. No Cyrillic.
3. **Vocal / piano-vocal.** Tracks and groups are inferred from barlines, designed for two-hand piano scores [9]. No single-staff option documented.
4. **Accuracy.** None published. Training data licences (CvcMuscima-Distortions, DeepScores-extended) not read.
5. **Licence.** Code MIT [10]. Weights: NOT ESTABLISHED.
6. **Runtime.** ONNX Runtime by default, TensorFlow optional; "around 3~5 minutes" with a GPU, and the first download "may take up to 10 minutes" [9]. File sizes NOT ESTABLISHED. No browser build found.
7. **Correction.** None documented. The README itself points to homr as an "awesome improved version" [9].

### 3.3 homr 0.7.0, homr-web, Andromr (open, AGPL-3.0)

1. **Method.** README: UNet segmentation models adapted from oemer find staff-line fragments, noteheads, stems, rests, barlines and clefs; "staff anchors" (clefs and barlines) locate staves, unit size is estimated per staff, five lines are reconstructed around each anchor, and braces and brackets merge grand staves [1]. Each staff is dewarped and passed to a transformer based on Polyphonic-TrOMR that outputs rhythm, pitch with accidentals, articulation and dynamics tokens [1]. The transformer gives no coordinates; homr writes attention centres into the MusicXML as rough `imgpos` comments [1]. The same README also states that the implementation neglects "dynamics, articulation, double sharps/flats" and works on treble or bass clef only [1]; the two statements conflict and I did not test which is right. Bar-versus-metre checking: NOT ESTABLISHED.
2. **Words.** The only OCR in homr is RapidOCR for the title [4][5]. homr-web also reads text above each staff (built for chord symbols) with RapidOCR 3.9.2 models (PP-OCRv6 small), noting that chords come out misread (`F♯m` read as `7#m`) [6]. No lyrics, no syllable attachment, Cyrillic not mentioned.
3. **Vocal / piano-vocal.** Grand-staff merging is supported [1]. homr-web returns each staff's rectangle and a `readTextStrips` call for given staves [6]. INFERENCE: because the transformer reads one dewarped staff at a time [1], a vocal staff could be fed alone; no source says this is supported.
4. **Accuracy.** No figure in the README [1]. homr-web says its MusicXML "equals the file homr 0.7.0 writes" on three public test pages [6].
5. **Licence.** AGPL-3.0 for homr [1][2][3] and for homr-web, whose README says an app serving it to browsers "must offer its source" [6][7]. Andromr is AGPL 3.0 [8]. Weights licence and training-data licences: NOT ESTABLISHED. INFERENCE: AGPL is not compatible with shipping inside an MIT project without relicensing.
6. **Size and runtime.** homr depends on ONNX Runtime, OpenCV, RapidOCR and pypdfium2 [2]. homr-web lists nine files: WebGPU set about 134 MB, WASM set about 189 MB, OCR 32 MB included; one page takes 7 to 9 seconds on an Apple M-series laptop with WebGPU, about 55 seconds on one WASM thread under Node; WASM threads need cross-origin isolation headers [6]. I did not run it. The authors of homr-web date their configuration check 2026-10-04, so it is very new [6]. Andromr runs the segmentation and encoder in LiteRT and the decoder in ONNX Runtime and says "around 30 seconds" per page on recent phones [8]. This is the one browser-capable and phone-capable route I could document.
7. **Correction.** `imgpos` hints only [1]. No confidence output documented.

### 3.4 Zeus and OLiMPiC (Charles University, open)

1. **Method.** Encoder-decoder: convolutional layers reduce the image width 16 times, bidirectional LSTM layers contextualize it, and a decoder emits Linearized MusicXML (LMX) tokens with Bahdanau attention [17]. Fixed input height: 192 px (`grand24`), 128 px (`solo26`) [17]. No explicit staff-line removal or hand-written symbol stage; staves or grand staves are cropped beforehand (the Musicorpus "Staves", "Grandstaves", "Systems" subdivisions) [17].
2. **Words.** None. LMX is derived from MusicXML notation; no lyrics step is documented [15][17].
3. **Vocal / piano-vocal.** This is the most relevant detail. OLiMPiC is built on the OpenScore Lieder corpus (German and French songs) and the authors extracted the piano parts from the MusicXML [16]; the Legato paper confirms the vocal staff is masked with white boxes "similar to" OLiMPiC [18]. Zeus 2026 snapshots can declare `input_subdivisions: Staves`, meaning solo-staff models exist [17]. What those solo-staff models were trained on (Dolores, OLiMPiC, OmniOMR) I could not establish, and whether any saw sung lines is NOT ESTABLISHED.
4. **Accuracy.** Authors' figures: on flatbed scans of IMSLP Lieder piano systems, TEDn 18.4 % (full MusicXML) and SER 17.72 % with augmentation; 44.41 % TEDn without augmentation; on synthetic renderings (without augmentation) TEDn 13.74 % and SER 11.29 % [16]. The authors say flatbed scans do not model phone photos [16]. The repository itself says "how much that costs has not been measured" about one distortion, and that nothing in it can tell musical correctness [17].
5. **Licence.** Code MIT; 2024 grand-staff weights and datasets CC BY-SA; 2026 solo-staff snapshots CC BY-NC-SA [15][17]. INFERENCE: the non-commercial clause is awkward for an MIT project.
6. **Size and runtime.** TensorFlow 2.12 and Python 3.10 pinned; a `grand24` snapshot "just under 30MB" [17]. No browser build.
7. **Correction.** None; evaluation is by SER, with a visual comparison tool [17].

### 3.5 SMT and SMT++ (open, MIT code)

1. **Method.** Image-to-sequence transformer; SMT++ reads full pages directly, trained by curriculum learning from synthetic system-level data to real pages [14]. The SMT++ repository has been merged into the SMT repository [14].
2. **Words.** None documented. 3. **Vocal.** No handling documented. 4. **Accuracy.** Authors' table for the "SMT NeXt" model: GrandStaff ideal CER 3.9, SER 5.1; camera 5.3 and 6.2; string quartets SER 1.4 [14]. The Legato authors report that on their Camera and Rendered test sets 92.9 % and 88.8 % of SMT++ outputs "cannot be converted to MusicXML" [18]. 5. **Licence.** Code MIT [14]; weights on Hugging Face, licence not read. 6. **Runtime.** PyTorch and Lightning; no browser build [14]. 7. **Correction.** None.

### 3.6 Legato and Legato 2 (research, 2025 and 2026)

1. **Method.** Legato: frozen pre-trained vision encoder from Llama-3.2-11B-Vision (836M parameters) plus a 101M decoder trained from scratch on a 214K-image dataset, emitting ABC notation; also a small variant [18]. Legato 2: a YOLOv8-medium model (26M parameters) segments systems, then the vision-language model reads one system at a time [19].
2. **Words.** Legato says it focuses "on the recognition of musical notation rather than textual features" [18]. Legato 2 adds titles and annotations but says "We continue to exclude lyrics from our corpus" and suggests existing OCR tools could be adapted later [19]. It reports that Audiveris is "the sole prior system" with embedded text and that Legato 2 beat Audiveris and PaddleOCR on title, composer and other text on string quartets (figures not read) [19].
3. **Vocal.** Both evaluate OpenScore Lieder with the vocal staff masked [18][19].
4. **Accuracy.** Page-level OMR-NED error, authors' own: Legato 2 43.6 (camera Lieder), 34.2 (32 IMSLP piano pages), against Audiveris 85.8 and 71.5 and Gemini 3.1 Pro 91.7 and 89.1 [19]. These are tree-based page metrics, not per-note.
5. **Licence.** Paper CC BY 4.0 [18][19]; code and weights: NOT ESTABLISHED (the Hugging Face page returned a gated-access message [20]).
6. **Size.** Heavy (11B-class encoder); INFERENCE: not a browser candidate.
7. **Correction.** None documented.

### 3.7 Polyphonic-TrOMR (NetEase, Apache-2.0)

Transformer reader trained end to end; the README says the code was used in the paper and "training code will be open source later" [21]. It is the base of homr's transformer [1]. Lyrics, vocal handling and numbers: not in what I read. Weights licence NOT ESTABLISHED.

### 3.8 Older and small open readers

Mozart (Apache-2.0) follows a classical sequence: noise filtering, binarization, segmentation, staff-line detection and removal, rebuilding the staff, symbol recognition [24]. cadenCV restricts itself to monophonic high-resolution printed music, uses template matching for primitives, and retroactively corrects eighth notes by checking for flags or beams; it outputs MIDI, and I found no licence file [24]. Moonlight (Google, Apache-2.0) calls itself "experimental" and "not an officially supported Google product"; I did not read its method or repository activity [24]. No lyrics in any of these.

### 3.9 Research on notation plus lyrics: AMNLT and MusicDocs

The paper "Aligned Music Notation and Lyrics Transcription" says vocal-score digitization needs the alignment between notes and lyrics preserved, formalizes the task, compares divide-and-conquer (separate OMR and OCR plus alignment) with end-to-end methods, and tests on four Gregorian chant datasets [22]. Its abstract says end-to-end approaches generally outperform heuristic methods on alignment (the abstract was truncated in what I read) [22]. It names two heuristic tools, OMMR4All and the Cantus Analysis Tool, that align music and lyrics with object detection plus hand-written rules [22]. No Russian, no piano-vocal.
MusicDocs (ISMIR 2025 late-breaking demo) says it supports inference "both on server-side and client-side, including in-browser execution via" ONNX [23]. I read only the abstract; models, licence, lyrics and accuracy NOT ESTABLISHED.

### 3.10 PhotoScore and NotateMe Ultimate (Neuratron, closed)

Method unpublished beyond marketing: an "OmniScore dual-engine recognition system" [25]; the v5 page says it combines "the two most accurate printed music scanning engines" (vendor wording) [25]. Text: the change log says the text engine was upgraded to iDRS with "120 languages possible" and later cites "OCR world leaders IRIS" [25]; the product page says it reads text "in 120 different languages" [25]. Whether Cyrillic is among them: NOT ESTABLISHED. A reviewer found PhotoScore read lyrics and chords "largely complete" but not 100 % accurate, with a text-style editor and search-and-replace for repeated syllable errors [28][25]. Accuracy: vendor says "over 99.5% accurate on most PDFs and originals" with no test set [25]. Desktop only; Sibelius-style editor.

### 3.11 SmartScore 64 (Musitek, closed)

Method unpublished. The Pro and Songbook editions recognize lyrics; the help says "SmartScore automatically attaches each syllable block" to a note or rest, and the editor handles hyphens and melismas [26]. The $49 Scan & Play edition has no lyric recognition [26]. A reviewer quotes the vendor's "99+% accuracy" claim and says the product lived up to it in his tests, without a metric [28]. Languages and Cyrillic: NOT ESTABLISHED. Piano-vocal: the vendor lists piano/vocal arrangements [26].

### 3.12 Soundslice scanner (closed)

The founder writes that the system uses fine-tuned off-the-shelf architectures and a hand-labelled dataset, that each prediction carries a confidence value, and that low-confidence cases are put to the user as questions [27]. The product page repeats: "It asks you for help" [27]. Lyrics: "We detect lyrics in over 20 languages, including those using non-Latin scripts" and they are editable after the scan; above-staff lyrics were added later [27]. Cyrillic is not named. Speed: vendor "about a minute per page" [27]; a 2024 review says 10 to 30 seconds and calls it "the most accurate scan of any service on this example" [28]. Server-side. No accuracy number.

### 3.13 Others (closed)

- **ScanScore:** the 2021 review found it "hit-or-miss on lyrics" and had trouble with staves that appear partway through a piece, such as a vocal staff added above piano [28]. Vendor pages failed to load for me.
- **PlayScore 2:** the 2021 review says its MusicXML export has no lyrics or chords and that a lyric was once read as a trill [28]. Vendor pages returned an empty response.
- **Newzik LiveScore / Maestria:** machine learning, "a few minutes" per page, with no lyric statement for the OMR output [28][29].
- **Opuscan (Tutteo):** "in-house deep-learning model"; vendor says it attaches lyrics to the right notes, and for "Japanese, Korean, Chinese, and Cyrillic-script languages" the user selects the language before scanning [31]. It lists piano and grand-staff music, up to seven staves, and says it does not accept handwritten music [31]. No numbers. This is the only product page I found that names Cyrillic lyrics.
- **MuseScore NoteVision:** "own Optical Music Recognition engine"; quality "reaches around 95%" with no metric or test set [32]. The musescore.org pages returned HTTP 403.
- **Klangio Scan2Notes:** "state-of-the-art AI"; the accuracy FAQ gives no figure [30].
- **Sheet Music Scanner:** vendor site returned HTTP 406; NOT ESTABLISHED.

## 4. Direct answers

**Is there any system whose stated purpose is the vocal line with its lyrics from piano-vocal scores? Any for Russian or Cyrillic?** No for both, as far as I could find. The nearest items are the AMNLT research task (chant only) [22]; general products that read lyrics and attach syllables (SmartScore, PhotoScore, Soundslice, Opuscan, Audiveris) [11][25][26][27][31]; and neural research systems that delete the vocal line on purpose [15][16][18]. For Cyrillic specifically: Opuscan states Cyrillic-script lyrics are supported by choosing the language [31]; Soundslice says non-Latin scripts [27]; PhotoScore says 120 languages [25]; Audiveris can load Tesseract language files [13]. None publishes a Russian test, and none addresses pre-1918 orthography.

**Which are hand-built and which are trained? What happened to the hand-built ones?** Hand-built: Mozart, cadenCV [24]; Audiveris is mostly rules and templates with one trained classifier [11]. Hybrid: oemer (trained segmentation, SVMs, rules) and homr (trained segmentation and transformer, rule-based staff reconstruction) [1][9]. Fully trained: Zeus, SMT, Legato, TrOMR [14][17][18][21]; Soundslice, Newzik, Opuscan describe themselves as trained [27][28][31]. Hand-built engines are still maintained (Audiveris 5.11 is dated July 2026) but score worse on the one table I found [13][19]. The Soundslice founder says classic OMR relied on heuristics and that fine-tuned ML beat them in his experience (a vendor claim) [27]. oemer's own README sends users to its successor, homr [9]. On Audiveris, the documentation says what is quoted in 3.1: a neural glyph classifier is documented from 4.0 onward, with no dated "move" found [13].

**What single design choices do the best-performing systems share?** See section 5.

## 5. What the best systems share

1. **Trained neural recognition of symbols instead of hand-written rules.** homr, Zeus, SMT, Legato and Soundslice are trained; the one rule-based engine in the Legato table scores worst of the open systems there [1][14][17][19][27].
2. **A staff or system is cropped and normalized before reading.** homr dewarps each staff [1]; Zeus fixes input height at 192 or 128 px [17]; Legato 2 segments systems with YOLOv8 first and says system-level reading raises effective resolution [19]; oemer and Audiveris scale everything by staff-line spacing [9][13].
3. **Staff geometry comes first and the scale unit is the staff-line interval.** Audiveris GRID and SCALE, oemer `unit_size`, homr unit size [1][9][13].
4. **Synthetic training data plus heavy augmentation, then a small real set.** Augmentation took Zeus's scanned-test TEDn from 44.4 to 18.4 [16]; SMT++ uses synthetic curriculum [14]; Legato uses 214K images [18]; Soundslice hand-labelled "thousands of scores" [27].
5. **Output as a linear token grammar that converts to MusicXML.** LMX, ABC, TrOMR tokens [1][16][18]. Conversion failure is a real cost: 88.8 to 92.9 % of SMT++ outputs did not convert on the Legato test sets [18].
6. **Text is read by a separate step or separate OCR engine**, not by the note model: Tesseract in Audiveris, iDRS in PhotoScore, RapidOCR in homr for titles, PaddleOCR as the Legato 2 baseline [4][13][19][25]. Legato 2's text-aware tokenizer reads titles and annotations but not lyrics [19].
7. **A way to see doubt and fix it.** Audiveris editor and classifier grades; Soundslice confidence and clarifying questions; PhotoScore and SmartScore editors [13][26][27][28]. The trained open readers expose almost nothing (homr's rough image positions only) [1].
8. **Music-theory correction is rare in the documentation.** Only oemer's beat-adjustment step is described in what I read [9]. NOT ESTABLISHED for homr, Zeus and Soundslice.

## 6. What could not be established

- Any note-level accuracy (right pitch and length per note) on real nineteenth-century scans for any system. The closest figures are SER and TEDn on Lieder piano parts, with the vocal staff removed [16].
- Whether any system reads Russian lyrics, pre-1918 orthography, or Cyrillic in an old typeface. No test found; no source for Tesseract on old orthography [33].
- Weights licences for homr, oemer, SMT, Legato, TrOMR and Audiveris; training-data licences for homr, oemer, and Zeus 2026 data (Dolores, OmniOMR not read).
- homr's own published accuracy (the README gives none). homr-web's GitHub release page returned HTTP 403, so I could not read it.
- oemer model file sizes; Audiveris per-page speed; SMT model sizes.
- How Audiveris checks bars against the metre (RHYTHMS page unwritten) and whether one staff can be excluded.
- Whether the Zeus solo-staff models (2026) have seen sung lines, and their accuracy.
- Methods, lyric support and Cyrillic for PhotoScore, SmartScore, ScanScore, PlayScore 2, Newzik Maestria, Klangio, MuseScore NoteVision and Sheet Music Scanner beyond marketing. ScanScore and PlayScore vendor pages did not load; musescore.org and Sheet Music Scanner returned errors.
- MusicDocs models, licence and accuracy (abstract only). Moonlight's method and whether it is maintained.
- I could not run any system; every number above is from a document.
- Not covered for budget: Flat's OMR help page, TrOMR full-paper numbers, the Legato 2 text-recognition table values, the Audiveris Samples and Fonts pages.

## 7. Sources

Raw GitHub file URLs were fetched with curl (no summarizing model). Handbook and vendor pages were fetched as HTML and converted to text.

1. homr README, https://raw.githubusercontent.com/liebharc/homr/main/README.md. Read in full.
2. homr pyproject.toml, https://raw.githubusercontent.com/liebharc/homr/main/pyproject.toml. Read in part (first 80 lines).
3. homr LICENSE, https://raw.githubusercontent.com/liebharc/homr/main/LICENSE. Read in part (header, AGPL v3).
4. homr main.py, https://raw.githubusercontent.com/liebharc/homr/main/homr/main.py. Read in part (lines mentioning OCR, title, downloads).
5. homr title_detection.py, https://raw.githubusercontent.com/liebharc/homr/main/homr/title_detection.py. Read in part (first 80 lines).
6. homr-web README, https://raw.githubusercontent.com/jymen/homr-web/main/README.md. Read in full.
7. homr-web LICENSE, https://raw.githubusercontent.com/jymen/homr-web/main/LICENSE. Read in part (header, AGPL v3).
8. Andromr README and LICENSE, https://raw.githubusercontent.com/aicelen/Andromr/main/README.md and .../LICENSE. README read in full; licence header only.
9. oemer README, https://raw.githubusercontent.com/BreezeWhite/oemer/main/README.md. Read in part (lines 1 to about 400 and 450 to 490).
10. oemer LICENSE, https://raw.githubusercontent.com/BreezeWhite/oemer/main/LICENSE. Read in part (MIT header).
11. Audiveris README, https://raw.githubusercontent.com/Audiveris/audiveris/master/README.md. Read in full.
12. Audiveris LICENSE, https://raw.githubusercontent.com/Audiveris/audiveris/master/LICENSE. Read in part (header, AGPL v3).
13. Audiveris handbook, https://audiveris.github.io/audiveris/ , pages under `_pages/`: guides/main/pipeline, guides/main/languages, reference/limitations, guides/advanced/training (read in full); guides/ui/ui_tools/text (read in part: intro, TEXTS step, lyric line); explanation/steps/grid and heads (first 30 lines); reference/updates (read in part: entries 4.0, 4.1, 4.2, 5.2, 5.3, 5.11 and lyric items); reference/boards/classifier (first lines); guides/specific/logical_parts (first 14 lines only); explanation/steps/texts and rhythms ("Documentation not yet provided").
14. SMT README, https://raw.githubusercontent.com/antoniorv6/SMT/master/README.md (read in part: head and tail); SMT++ README, https://raw.githubusercontent.com/antoniorv6/SMT-plusplus/master/README.md (read in part: first 3,500 characters); both LICENSE files, MIT (headers).
15. OLiMPiC README, https://raw.githubusercontent.com/ufal/olimpic-icdar24/master/README.md. Read in part (first 90 non-blank lines).
16. Mayer et al., Practical End-to-End OMR for Pianoform Music, http://ufal.mff.cuni.cz/biblio/attachments/2024-mayer-m6741385360515472301.pdf. Read in part (abstract, dataset description, Tables 2 and 3, results text).
17. Zeus, https://raw.githubusercontent.com/OmniOMR/zeus/main/README.md (read in full) and docs/model-architecture.md, docs/model-snapshots.md, docs/rough-edges.md (read in full), LICENSE (header, MIT).
18. Legato, https://arxiv.org/abs/2506.19065 (abstract read) and https://arxiv.org/html/2506.19065v1 (read in part: model, evaluation sections 6.3 and 6.4, lyric statements).
19. Legato 2, https://arxiv.org/abs/2607.05769 (abstract read) and https://arxiv.org/html/2607.05769 (read in part: method, baselines, Table 1 values extracted, text and appendix passages).
20. Legato Hugging Face card, https://huggingface.co/guangyangmusic/legato/raw/main/README.md. Blocked: HTTP 401, gated.
21. Polyphonic-TrOMR, https://raw.githubusercontent.com/NetEase/Polyphonic-TrOMR/master/README.md (read in part), LICENSE (Apache-2.0 header); paper abstract https://arxiv.org/abs/2308.09370 (abstract read).
22. Aligned Music Notation and Lyrics Transcription, https://arxiv.org/abs/2412.04217 (abstract, truncated) and https://arxiv.org/html/2412.04217 (read in part: introduction, related work, approaches, datasets).
23. MusicDocs, https://ismir2025program.ismir.net/lbd_407.html. Read in full (abstract only).
24. Mozart, https://raw.githubusercontent.com/aashrafh/Mozart/main/README.md (read in part: headings only, text under them is images) and LICENSE (Apache-2.0 header); cadenCV, https://raw.githubusercontent.com/afikanyati/cadenCV/master/README.md (read in part; no LICENSE file at raw main or master); Moonlight, https://raw.githubusercontent.com/tensorflow/moonlight/master/README.md (read in part: first 40 lines) and LICENSE (Apache-2.0 header).
25. Neuratron, https://www.neuratron.com/photoscore.htm and https://www.neuratron.com/v5.htm (read in part), https://www.neuratron.com/changes.htm (read in part: lines on text, lyrics, languages).
26. Musitek, https://www.musitek.com/ (read in part: edition descriptions), https://www.musitek.com/smartscore-online-help/songbook/modes/lyric_text.php (read in part), https://www.musitek.com/smartscore-online-help/professional/getting_started/welcome_to_smartscore.php (read in part).
27. Soundslice, https://www.soundslice.com/sheet-music-scanner/ (read in part, most of the page); Holovaty, https://www.holovaty.com/writing/machine-learning-thoughts/ (read in part: method and confidence passages; date not seen).
28. Scoring Notes, https://www.scoringnotes.com/reviews/a-review-of-optical-music-recognition-software/ (2021 review, read in part) and https://www.scoringnotes.com/reviews/scanning-the-current-omr-landscape/ (Dec 2024 review, read in part: Newzik and Soundslice sections).
29. Newzik, https://newzik.com/en/. Read in part (feature headings only).
30. Klangio, https://klang.io/scan2notes/. Read in part (accuracy FAQ).
31. Opuscan, https://www.opuscan.com/omr/. Read in full (vendor page).
32. Muse Group, https://www.mu.se/posts/ai-powered-score-converter. Read in full (vendor news post, 2025-11-06).
33. Tesseract tessdata, https://raw.githubusercontent.com/tesseract-ocr/tessdata/main/rus.traineddata. HTTP HEAD only (status 200; contents not read). Same check for rus_old and chu in tessdata and tessdata_contrib returned 404.
34. Blocked or failed, not used: api.github.com and github.com HTML pages (403), https://github.com/jymen/homr-web/releases (403), https://musescore.org (403), https://scan-score.com (no connection), https://www.playscore.co (empty response), https://www.sheetmusicscanner.com (406). Search-result lists also named Flat's OMR help page and Opuscan; not otherwise read.
