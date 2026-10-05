# OMR research and data since 2012: what a small project reading scanned Russian songs can learn

**Provenance, added by the desk (Fable), 2026-10-04 about 14:45.** Returned by a Sonnet subagent the desk spawned at about 14:08 from `brief-sonnet-sweep-omr-research-since-2012_r1_2026-10-04.md`, with four amendments (the output path; section F on open weights; notes on tools; report any disagreement with July). Saved verbatim under this paragraph. **The desk read this memo in full.** Of its sources the desk itself read in full homr's `README.md` and `Training.md` [S17] and the `homr-web` README [S19]; every other reading is the agent's, and each is a lead until the desk opens the source. Cost: 326,674 tokens, 89 tool uses, 14.1 minutes.

Run: 2026-10-04, one agent, about 65 tool calls. Commissioned by the desk (Fable) as `brief-sonnet-sweep-omr-research-since-2012_r1_2026-10-04.md`, with the 14:45 amendments (output path, section F, tool notes, July disagreements).

How to read the citations. `[S#]` points to the numbered source list at the end, which gives the URL, the bibliographic details, and how I read each source. "Read in part" means I fetched the raw text or PDF and read the sections named; it never means I read a whole paper. Lower is better for every error figure below unless I say otherwise. INFERENCE marks my own reasoning. NOT ESTABLISHED marks something I looked for and could not confirm.

---

## Answer: what does the research say a project like this should do?

Three things stand out. First, nobody in the sources I read reports 95 in 100 on real scans of old printed songs with an open model small enough for a browser. The best real-scan figures are far from 5% error: Zeus on flatbed scans of IMSLP piano systems scores 18.4% TEDn [S6]; the full-page SMT++ scores 14.1% and 25.8% symbol error only after fine-tuning on other pieces from the same corpus it is tested on [S5]; Legato scores 43.8 to 58.3 OMR-NED on its own real-scan tests [S11], and Transcoda's authors measure 63.97 for Transcoda and 86.73 for Legato on real Polish scans [S13]. The one figure above 95 is a single-staff, phone-photo result (97.10% pitch accuracy, 94.40% note accuracy) from a model trained partly on real photographed staves [S21], and the maintainer of homr reports 4.0% symbol error, but only on a private test set [S17]. Second, the field treats staff-line removal and symbol detection as largely solved by deep learning and names semantic reconstruction by hand-crafted heuristics as the weak, poorly studied step [S1]. Third, what moved real-scan accuracy in every paper that measured it was training data that looks like the target (augmentation, real-scan fine-tuning), not a different architecture [S6][S13][S21]. INFERENCE: the research points to a hybrid for Ilya. Keep the project's rule-based assembly (bar sums, metre, syllable attachment) because the literature has no good replacement for it. Replace or back up the weakest visual steps (notehead, accidental and flag decisions) with a small trained model, and train it on renders of the maintainer's sixteen engravings plus the CC0 OpenScore Lieder corpus, with scan-like degradation. Present the result as a first draft a musician confirms, since that framing is established [S1][S35]. Measure on real scans with a per-note metric, because no published model has been benchmarked on the voice staff of a voice-and-piano song.

### The July 2026 list, verified from its own sources

| Item | What I verified | Test material | Licence as I read it |
|---|---|---|---|
| SMT (2402.07596) | Single-system pianoform transformer. SER 5.1 on GrandStaff, 6.2 on Camera GrandStaff, 1.4 on Quartets [S4] | Synthetic renders; "Camera" is distorted renders, not real scans [S4] | Code MIT [S23]; weights MIT, 85,544,056 bytes [S23] |
| SMT++ (2405.12105) | Full-page. Real-scan SER 38.9 and 65.4 zero-shot, 14.1 and 25.8 fine-tuned [S5] | Mozarteum 101 pages, Polish 117 pages [S5] | Weights MIT, 43,689,404 bytes [S23] |
| OLiMPiC and Zeus (ICDAR 2024) | Scanned TEDn 44.41 without augmentation, 18.40 with [S6] | 200 scored IMSLP scans, piano parts only [S6] | Data CC BY-SA; 2024 weights CC BY-SA; code MIT [S7][S8] |
| Legato (2506.19065) | Camera OpenScore Lieder TEDn 42.0, OMR-NED 49.0 [S11] | 64 real pages, vocal staff masked white [S11] | Code MIT badge [S12]; weights on a gated page, not readable [S12] |
| Transcoda (2605.10835) | 63.97 OMR-NED on real Polish scans, 18.46 on synthetic [S13] | 102 Polish scans [S14] | Code AGPL-3.0; weights CC BY 4.0 [S14] |
| Polyphonic-TrOMR | Paper figures on MuseScore renders and photographs of printed renders [S9] | Not historical editions [S9] | Repository Apache-2.0; no weights or data licence stated [S10] |
| AMNLT (2412.04217) | Lyrics and notes jointly, but on Gregorian chant, not common Western notation [S16] | Four chant corpora, three real, one hybrid [S16] | NOT ESTABLISHED |
| Sheet Music Benchmark (2506.10488) | 685 pages, 4,039 regions, from KernScores [S15] | Real public-domain scans [S15] | Hugging Face page gated, NOT ESTABLISHED [S15] |
| Camera-PrIMuS (2018) | 87,678 incipits rendered with Verovio, then distorted [S22] | Synthetic plus distortion | No licence on the page; a third party lists "Unknown" [S22][S29] |
| 2023 stave-aware paper | Liu et al., Applied Sciences 13(16):9360 [S21] | 600 phone-photo test lines [S21] | NOT ESTABLISHED |

Where the July scan and what I read disagree: I found no contradiction of a specific July claim, because the July scan gave titles and identifiers without figures. Three cautions belong with it. AMNLT is about chant, not common notation. SMT++ and Legato read full pages, not systems or staves. The Legato arXiv version I read (v3, 27 Sep 2026) states that it "uses an updated evaluation pipeline" and that some scores differ from the ICLR version [S11], so any Legato figure copied from an earlier source may not match.

---

## A. The state of the field since 2012

### Surveys and what they say is solved

The main survey is Calvo-Zaragoza, Hajič jr. and Pacha, ACM Computing Surveys 2020 [S1]. It says some traditional sub-steps have moved from "hard" to “close to solved” (staff detection and symbol classification in particular), and that deep models can detect music objects "without having to remove staff lines at all" [S1]. On the weak point it says semantic reconstruction is traditionally done with “hand-crafted heuristics that either hardly generalize” and that learning it is "an unexplored line of research" [S1]. It also says structured-encoding research that reconstructs the full structure is scarce [S1]. Shatri and Fazekas 2020 [S2] say low-quality images, complex scores and handwriting are still hard, that most work is on monophonic scores, that class imbalance is a major problem for deep models, and that the field lacks a large labelled dataset with varied image quality and balanced classes [S2]. A 2025 TechRxiv review, "Deep Learning for Optical Music Recognition: A Review", and a Springer 2023 chapter, "Optical Music Recognition: Recent Advances, Current Challenges, and Future Directions", appeared in search results. The TechRxiv page returned a challenge page to my fetch, so I did not read it and did not look for another route [S38]. I did not read the Springer chapter [S38]. So I have no 2025 or 2026 survey read in full, only the 2020 pair.

On rule pipelines versus trained models: the 2020 survey describes the classical pipeline as preprocessing, object detection, notation assembly and encoding, and says deep learning made several stages "obsolete or collapse into a single (bigger) stage" [S1]. The 2026 Transcoda paper repeats the common view that hand-built stages were "fragile on handwritten or degraded documents" with errors cascading between them [S13], though the sentence it cites for that is about handwriting and degraded sources, not clean printed songs.

### Method families and best reported results on printed notation

All figures are errors, lower is better. "Synthetic" means rendered by software, "real" means scanned or photographed pages.

- **Staff-line removal then symbol classification.** The survey calls staff removal solved or clearly solvable [S1]. homr and oemer instead use U-Net segmentation maps and keep the lines in view (see C) [S17].
- **Object detection.** DeepScores V1 gave 300,000 rendered pages, 123 classes, 400 dpi, for detecting tiny objects [S25]. On the handwritten MUSCIMA++ set, the detector in the notation-graph paper reached 69.5% mAP [S31]. I did not read a printed-notation detection mAP table, so I give none.
- **Staff-level detector plus rule for pitch.** Liu et al. 2023 detect staves and noteheads and compute pitch from position; on DeepScoresV2 the reported pitch accuracy is 99.23% (read through a model summary of the page, so treat the table as a lead) [S21].
- **CRNN-CTC on single staves.** The Camera-PrIMuS line of work [S22]. In the Liu study a CRNN-CTC trained on PrIMuS alone scored 44.23% pitch accuracy on real phone photos [S21].
- **Sequence transformers.** SMT: SER 5.1 on GrandStaff, 6.2 on Camera GrandStaff, 1.4 on Quartets; the CRNN baseline scored 7.3, 9.9 and 22.5 [S4]. Zeus: SER 2.77 on GrandStaff, 3.03 on Camera GrandStaff [S6]. These test sets are synthetic or distorted renders.
- **Full-page transformers.** SMT++ [S5], Legato [S11], Transcoda [S13]. Details in the tables below.

### The gap between synthetic and real pages

This is the clearest result in the literature, and five independent measurements agree:

| Study | Synthetic or render | Real scan or photo | Source |
|---|---|---|---|
| Zeus on OLiMPiC, SER | 11.29 | 59.90 without augmentation, 17.72 with | [S6] |
| Zeus on OLiMPiC, TEDn | 13.74 | 44.41 without, 18.40 with | [S6] |
| Legato, OpenScore Lieder, TEDn | 26.8 (rendered) | 42.0 (camera) | [S11] |
| Transcoda, OMR-NED | 18.46 (Verovio) | 63.97 (Polish scans) | [S13] |
| TrOMR, pitch SER, trained on MuseScore renders only, tested on screen photographs of renders | not in this table | 0.467; 0.022 when camera data is in training (photographs of renders, not old editions) | [S9] |

The OLiMPiC authors state that their scanned test set is flatbed scans with little lighting trouble and "does not provide yet a good model for images taken with phones" [S6]. Transcoda's ablation shows what closes part of the gap: removing visual degradation raises real-scan OMR-NED from 65.76 to 76.95, removing asymmetric augmentation to 78.99, removing score concatenation to 80.10 [S13]. A 2026 study of handwritten monophonic pages concludes that synthetic pretraining helps mostly by teaching "structural layout conventions" rather than by visual similarity (abstract only) [S37]. A 2023 ISMIR study (abstract only) says OMR works well only when the target is close to the training examples in musical context and appearance [S36].

### Full-page real-scan results in one place

| System | Test | Error | Source |
|---|---|---|---|
| SMT++ zero-shot | Mozarteum 101 pages, SER | 38.9 | [S5] |
| SMT++ zero-shot | Polish 117 pages, SER | 65.4 | [S5] |
| SMT++ fine-tuned on 5-fold of the same corpus | Mozarteum, Polish, SER | 14.1, 25.8 | [S5] |
| SoundSlice | Mozarteum, Polish, SER | 34.5, 54.9 | [S5] |
| PhotoScore | same | 70.3, 83.3 | [S5] |
| Audiveris | same | 94.6, 94.9 | [S5] |
| oemer | same | 90.3, 75.2 | [S5] |
| Legato | IMSLP piano, 32 pages, TEDn / OMR-NED | 29.5 / 43.8 | [S11] |
| Legato | OpenScore Lieder camera, 64 pages, TEDn / OMR-NED | 42.0 / 49.0 | [S11] |
| Transcoda | Polish scans, OMR-NED | 63.97 (SMT++ 80.16, Legato 86.73) | [S13] |

Two cautions. The Legato Lieder test masks the vocal staff with white boxes so the piano-only baseline can compete, which means it measures the piano part, not the voice [S11]. And homr's author logs OMR-NED of 17.52 on "Polish scores" and 13.84 on "SMB scores" in run 465, with the metric named only in the earlier run 426 entry [S17]. That is far below Transcoda's 63.97 on Polish scans. INFERENCE: the splits, the pipelines and the filtering differ (Transcoda uses a filtered 102-page split [S14]; I did not read how homr builds its "Polish" and "SMB" sets), so I do not treat the two as comparable.

### Hardest symbol classes and steps

- **Accidentals and naturals.** homr's training log is the most direct evidence. Run 70 notes the author removed a dataset called CPMS because it is "impossible to reliably tell if a natural is in an image" [S17]. INFERENCE: this is probably the Camera Printed Music Staves set of Liu et al. [S21], but the log does not say so. Earlier runs record a training set that contained no naturals at all, and a note that focal loss "doesn't help" lift detection [S17]. Transcoda's error discussion lists omitted courtesy accidentals [S13]. The TrOMR paper finds the "merge" error (pitch and rhythm together) is higher than either alone [S9].
- **Rhythm assembly.** homr added a separate decoder branch for triplets and dots and found it "too eager to detect triplets"; a later entry records "triplet correction" being added [S17]. Slur and tie handling cost several discarded runs [S17].
- **Voices and structure.** For dense pianoform, Transcoda reports that the dominant real-scan failure is hallucinated voice splits and merges that derail the rest of the page [S13]. This does not apply to one vocal line, which is monophonic apart from rare divisi.
- **What fixes them, as reported.** More and varied training data that includes the failing case (naturals added to the data in homr's run 76 [S17]), real-photo fine-tuning (Liu: 89.77% to 97.10% pitch accuracy with real photographed lines added [S21]), and canonical target encodings (Transcoda: removing target normalization raises synthetic OMR-NED from 18.71 to 82.51 [S13]).

### Notation assembly and semantic reconstruction

The MUSCIMA++ dataset defines a notation graph: 140 handwritten pages, 91,255 symbols and 82,261 explicit relationships between symbols [S27]. A learned edge classifier on that graph reached 95.2% precision, 96.0% recall and F 95.6% on ground-truth objects, and 93.2% precision, 91.5% recall and F 92.3% when objects came from a detector [S31]. Transcoda cites a jointly trained assembly model on imperfect YOLOv8 detections as one way to limit cascade errors [S13], but I did not read that paper. Pitch-from-position and duration-from-flags-and-beams assembly in printed work remain heuristics in the systems I read (homr's triplet correction is one example) [S17]. I looked for published work that uses bar sums or metre as error correction on OMR output and found no primary source in the time available. NOT ESTABLISHED. TrOMR adds a "consistency loss" tying pitch, rhythm and merged branches together, which is an in-model version of that idea [S9].

### Evaluation: is there an accepted way to say "95 of 100 notes right"?

No. SER counts every symbol equally, so a missing articulation mark costs as much as a wrong pitch, and the OLiMPiC authors say “interpreting the SER numbers is not straightforward” [S6]. They also note that the choice of linearization adds artifacts and use TEDn (tree edit distance on MusicXML) as an encoding-independent alternative, which is expensive to compute and whose behaviour relative to SER they say is not yet understood [S6]. The Sheet Music Benchmark argues that OMR “still lacks a comprehensive, high-quality benchmark corpus” and introduces OMR-NED, a normalized edit distance with per-category scores for pitch, accidental, tie, note head, flags and beams, dots, articulations, dynamics, clefs, key and time signatures, slurs and lyrics (one symbol per lyric character) [S15]. The closest published match to Ilya's own metric is Liu et al., who report pitch accuracy, type (duration) accuracy and "note accuracy" (both right) on 600 real photographed lines [S21]. INFERENCE: report a note-level pitch-and-length rate and a syllable-attachment rate, and add OMR-NED pitch and lyric categories for comparability.

### Monophonic and single-staff reading

Reading one melodic line is well studied for incipits (PrIMuS, Camera-PrIMuS) [S22] and for single-staff phone photos [S21]. SMB's monophonic subset is the hardest case in its baseline, but that baseline trained a transformer from scratch on the benchmark's own folds: monophony OMR-NED 94.1 ± 5.0 and SER 57.1 ± 0.8, which the authors attribute to too little data for a transformer [S15]. A September 2026 paper studies full-page handwritten monophonic scores (abstract only; no figures read) [S37]. Reading only the vocal staff of a voice-and-piano page is not, in anything I read, a benchmarked task. OLiMPiC keeps only the piano part [S6]; Legato masks the voice [S11]; SMB tags a "PianoAndVoice" texture but has too few samples to report it separately, merging it into "Other" [S15].

### What this means for a hand-built reader aiming at 95 in 100

INFERENCE. The literature gives no evidence that rules alone reach 95 on varied old scans, and none that trained models reach it on the voice staff of real scans either; the honest benchmark for Ilya is its own sixteen songs on real IMSLP scans. The cheapest published lever is scan-like degradation applied to clean renders (it cut real-scan TEDn from 44.41 to 18.40 in one study [S6]), and Ilya can already render its engravings with exact glyph coordinates. Treat accidentals and naturals as the step most likely to need a learned component, since three independent sources single them out.

---

## B. Words in scores

The one direct treatment is AMNLT, which formalizes Aligned Music Notation and Lyrics Transcription and compares divide-and-conquer pipelines (music and lyrics read separately, then paired) with end-to-end models [S16]. It is on Gregorian chant: GregoSynth (126,579 hybrid systems), Solesmes (854 real systems), Einsiedeln (1,816) and Salzinnes (2,965) [S16]. The findings I could read cleanly: separate recognizers transcribe best but align worst; end-to-end approaches align better; the authors say the language-model approach does best "when sufficient training data is available" [S16]. The numbers show the data effect: the SMT-style model reaches music error 2.26 and syllable error 15.82 on GregoSynth, but on the 854 real Solesmes systems syllable error is 91.00 [S16]. The paper's alignment metrics are AMLER and AlER, and the authors warn that alignment error must be read alongside transcription quality because a method can score well on alignment while dropping content [S16].

Common-notation song scores are not covered by AMNLT. SMB's OMR-NED counts a lyric as one symbol per character plus a verse identifier [S15], and Legato's introduction lists lyrics among the text a general system must face [S11], but none of the full-page papers I read reports lyric or syllable-attachment accuracy separately [S11][S13][S5]. I did not find, in one search, work on text-versus-music separation for modern song scores; the search returned only AMNLT and a 2015 ISMIR paper on lyric extraction from early music sources, which I did not read [S38]. NOT ESTABLISHED.

### What this means for a hand-built reader aiming at 95 in 100

INFERENCE. The only evidence on alignment says that reading words and notes in one learned pass is hard without a lot of data (91% syllable error on 854 real systems), and that pairing separate readers fails mostly at the pairing step. That fits Ilya's design: read the words with an OCR step, attach each syllable to a note by horizontal position, and treat the pairing rule, which the project can test on its sixteen songs, as the part to engineer.

---

## C. Data and training for a small team

### Datasets, contents and licences

| Dataset | Contents | Licence as I read it | Source |
|---|---|---|---|
| DeepScores V1 | 300,000 rendered pages, 123 classes, 400 dpi | NOT ESTABLISHED | [S25] |
| DeepScoresV2 | Dense subset 741,814,529 bytes; complete set 80,925,561,304 bytes; published 2020-09-02 | CC BY 4.0 (Zenodo metadata) | [S26] |
| MUSCIMA++ v0.9 | 140 handwritten pages, 91,255 symbols, 82,261 relationships | The paper says "an open license"; the README says "permissive"; a third party lists CC BY-NC-SA 4.0; images not redistributed | [S27][S29] |
| CVC-MUSCIMA | 1,000 handwritten images (staff removal, writer ID) | The MUSCIMA++ paper mentions sharing it under a CC BY-NC licence (the line is cut off in my text extraction); a third party lists CC BY-NC-SA 4.0 | [S27][S29] |
| PrIMuS, Camera-PrIMuS | 87,678 incipits, single staff, rendered with Verovio; Camera version adds distortions | No licence on the page; third party lists "Unknown" | [S22][S29] |
| GrandStaff | 7,000 original scores plus 46,882 augmented samples; HF split 41,598 / 4,623 / 7,661 | HF mirror labelled MIT; upstream Humdrum source licence NOT ESTABLISHED | [S4][S23] |
| OLiMPiC | 17,945 synthetic systems from OpenScore Lieder, 182 tokens; 200 scanned IMSLP scores (dev and test only) | CC BY-SA | [S6][S7] |
| DoReMi | About 6,432 printed images with MIDI, MEI, MusicXML and PNG | Paper does not say; third party lists "Unknown" | [S28][S29] |
| OpenScore Lieder | 1,454 scores, 143 composers (82 male, 61 female), 316 sets; paper abstract says "over 1,200" | CC0 | [S30] |
| SMB | 685 pages, 4,039 regions, `**kern`, scans from KernScores | NOT ESTABLISHED (gated) | [S15] |
| Polish scores (PRAIG) | 83 train, 10 val, 24 test pages | Gated; asks users to agree to non-commercial use only | [S24] |
| Mozarteum | 101 pages of a Mozart re-edition | Publicly available through the MoVi tool; licence NOT ESTABLISHED | [S5] |
| Legato's 32 IMSLP piano pages | Manually annotated | "Publicly available in our codebase" per the paper; licence NOT ESTABLISHED | [S11] |

OpenScore Lieder detail, since it is the one corpus of voice-and-piano songs with lyrics: files are MuseScore `.mscx`, convertible to MusicXML, PDF and MIDI through MuseScore.com; the score entries I inspected (the first several in `scores.yaml`) carry an IMSLP reference and a LiederNet text id; entries are tagged by language as DE 776, EN 335 and FR 319 lines, and none is tagged RU; Mussorgsky is among the composers [S30]. The OLiMPiC authors report that OpenScore transcriptions share the layout of their IMSLP sources (same measures per system and systems per page), which is what let them box systems on the original scans [S6]. Real scanned printed pages with ground truth are scarce: OLiMPiC scanned (200 scores), the Polish and Mozarteum pages, SMB, and Legato's 32 pages are what I found [S6][S5][S15][S11]. Transcoda's abstract states the bottleneck as “a lack of large-scale, annotated datasets of real scans” [S13].

### Training on renders, and transfer to old editions

Everything recent trains on renders. Legato: PDMX-Synth, over 214,000 images from PDMX with varied rendering and visual augmentation [S11]. Transcoda: 310,554 synthetic examples from PDMX, GrandStaff, OpenScore Lieder and Quartets, rendered with Verovio plus degradation [S14][S13]. SMT++: a synthetic generator with curriculum from one system to full pages [S5]. Zeus: OpenScore Lieder renders with augmentation [S6]. Transfer to real editions is partial in every case (table in A). Transcoda reports that its worst real scans have extreme density, bleed-through and handwritten annotations [S13]. No source I read measures transfer specifically to nineteenth-century Russian editions. NOT ESTABLISHED.

### How small can a useful model be?

| Model | Size | Speed or note | Source |
|---|---|---|---|
| Zeus grand24 snapshot | "just under 30MB" on disk | Not stated | [S8] |
| SMT++ weights | 43,689,404 bytes | Full page, MIT | [S23] |
| SMT weights | 85,544,056 bytes | Single system, MIT | [S23] |
| TrOMR checkpoint | 86,254,711 bytes | Repository file | [S10] |
| Transcoda | 58.8M parameters | Trained in about 6 hours on one RTX 5090 | [S13] |
| Legato-small | 8.5M decoder plus 2.5M projector, on a frozen 836M encoder | Full page | [S11] |
| homr in a browser (homr-web) | Segmentation 28,667,207 bytes fp16 or 57,311,361 fp32; encoder 26,466,256 fp16 or 52,861,122 fp32; all six models about 134 MB on WebGPU and 189 MB on WebAssembly, OCR's 32 MB included | 7 to 9 seconds a page on an Apple M-series laptop with WebGPU; about 55 seconds a page on one WebAssembly thread under Node; AGPL-3.0 | [S19] |
| Andromr (homr on Android) | Not stated | About 30 seconds a page on recent phones; AGPL-3.0 | [S20] |

homr-web is the one real example I found of a full OMR pipeline running in a browser through onnxruntime-web [S19]. Its figures come from its own README, not from a measurement of mine. I found no source reporting a browser-run single-staff CRNN size or accuracy. NOT ESTABLISHED.

### What it takes in practice

- homr's transformer: 190,722 training files (the log's count), 2 to 4 days of training on one GPU, a 12 GB dataset; the segmentation net trains in about an hour [S17]. Its segmentation training script runs 3 epochs on DeepScoresV2 Dense with batch size 32 [S18].
- Transcoda: 310,554 examples, 6 hours, one RTX 5090 [S13][S14].
- SMB baseline: 400 epochs on one RTX 4080, with poor results because the folds were small [S15].
- Liu et al.: 910 real photographed training lines were enough to move pitch accuracy from 89.77% to 97.10% [S21].
- A published account of the labelled data and time needed to train a standalone glyph classifier (as opposed to a sequence model) is NOT ESTABLISHED; I did not find one.

### What this means for a hand-built reader aiming at 95 in 100

INFERENCE. A useful trained component can be 30 to 90 MB and train in hours to days on one GPU; a full pipeline in a browser has been shown at about 134 MB with WebGPU. The Liu result suggests that a few hundred real labelled staves can matter more than millions of renders; Ilya has sixteen engravings and could scan printed editions of the same songs to make exactly that kind of set. OpenScore Lieder (CC0) is the safest large source of extra notes and lyrics, but it holds no Russian-tagged songs, so the vocabulary of Russian-edition engraving (spacing, fonts) would have to come from the project's own engravings.

---

## D. People in the loop

The 2020 survey says outright that interactive systems are necessary if errors cannot be tolerated, and that they change the goal: the system is “no longer improving accuracy but reducing the effort” the user spends, usually measured as time [S1]. It cites Chen and Raphael's human-in-the-loop system, where users add or remove constraints and re-recognize one measure at a time, and notes that showing results superimposed on the source image lets errors be spotted quickly [S1]. It adds that the problem still needs reformulating around user effort, including the human-computer interface [S1]. So yes, "a first draft that a musician confirms" is an established framing, but the survey presents it as open research, not a settled design.

Measured effort: Alfaro-Contreras et al. (ISMIR 2021) timed manual transcription against OMR-assisted transcription of early prints with the MuRET tool and conclude that OMR "remarkably reduces" user effort even when its performance is imperfect (my paraphrase of the abstract); they also estimate that a from-scratch model trained on six pages or more beats the pre-built OMR scenario on transcription time [S35]. I read the abstract and parts of the method and results, not every table, so I give no per-page minute figures for manual transcription. That study is mensural notation, not common notation. Confidence estimation and ranking doubtful symbols for the user: NOT ESTABLISHED; I found no paper on it in this sweep. A practical hook exists in homr, which writes the attention centre of each note into the MusicXML as an `imgpos` comment, "rough positions" that point at or near the symbol [S17].

### What this means for a hand-built reader aiming at 95 in 100

INFERENCE. The research supports designing the product around correction time, not raw accuracy. Because Ilya's own pipeline already knows where each notehead came from, showing doubtful notes on the scan is cheap for it, and the one measured study says assisted work pays even when recognition is imperfect. What nobody has published is a confidence signal good enough to rank which notes to show first, so Ilya would be inventing that part.

---

## E. Not reading at all: matching a scan to an existing encoding

The strongest result is Yang et al. (ISMIR 2019): a "bootleg score" built from deterministic rules and classical image processing, with no trainable weights and about 30 hyperparameters, retrieves a MIDI passage from a phone picture of a page with F measure .869 on 1,000 pictures of 100 piano scores, and beats baselines built on commercial OMR [S32]. Tsai (2020) scales the idea: on 5,000 piano scores with 55,000 sheet images the system reaches mean reciprocal rank 0.84 with average retrieval time 25.4 seconds [S33]. A later TISMIR article adds dynamic N-gram fingerprinting and reports a chosen setting with average runtime 6.4 seconds; I did not read its accuracy figures or even its author list from the page [S34]. All three treat piano music with two staves; voice-and-piano songs are not tested in what I read.

Corpora of encoded art song: OpenScore Lieder is the one I could verify (CC0, 1,454 scores, IMSLP ids on every entry, LiederNet text ids) [S30]. Its language tags show no Russian [S30]. SMB draws on KernScores, which pairs public-domain scans with `**kern`, but I did not establish how many songs it holds [S15].

### What this means for a hand-built reader aiming at 95 in 100

INFERENCE. For a song that is already in OpenScore Lieder, the lookup key is the IMSLP id, so no image matching is needed and the vocal line and lyrics come out essentially exact; this would be a CC0, no-recognition path for those songs. Coverage is the limit: nothing I read shows Russian songs in an encoded corpus, so this helps only the fraction of the repertoire that happens to be there, and it cannot be the main route. Bootleg-style matching would only matter if a scan has to be matched to an encoding by image, and no one has tested it on songs.

---

## F. Open weights: three facts to pin down from primary sources (desk amendment)

### F1. homr: what it was trained on, under what licences, and its own accuracy

Read from the repository's own files [S17][S18]:

- **Code licence.** GNU Affero General Public License v3 (LICENSE file, header read) [S18]. The README asks users to cite oemer and Polyphonic-TrOMR [S17].
- **Segmentation model.** `training/train.py segnet` calls `download_deep_scores()` and `train_segnet()`; the download is DeepScoresV2 Dense from Zenodo record 4012193; the segmentation script's main block builds `D2DenseDataset`, batch size 32, `max_epochs=3` [S18]. DeepScoresV2 is CC BY 4.0 on Zenodo [S26]. The README says the U-Net models are adapted from oemer [S17]. The repository also defines a `CvcMuscimaDataset` class and a `download_cvs_musicma()` function for the CVC-MUSCIMA staff-removal set (CC BY-NC-SA per [S27][S29]), but the training entry I read does not call it [S18]. I read only part of `training/segmentation/train.py`.
- **Transformer.** `training/transformer/train.py` lists five training indexes: Lieder, GrandStaff, PrIMuS, PDMX and MuseTrainer [S18]. Run 426's log line says it trained with "lieder+grandstaff+primux+pdmx+musetrainer" [S17]. The Lieder converter downloads OpenScore Lieder and OpenScore StringQuartets from GitHub and renders with MuseScore 4.6.5 [S18]. The GrandStaff converter downloads from `grfia.dlsi.ua.es/musicdocs/grandstaff.tgz`; the PrIMuS converter downloads Camera-PrIMuS from `grfia.dlsi.ua.es`; the PDMX converter downloads from Zenodo record 15571083 and keeps only rows where `subset:no_license_conflict` is true, at most two tracks, complexity at most 2, about 500 target files; the MuseTrainer converter downloads `github.com/musetrainer/library` [S18]. The log says the training set is "190722" files, takes 2 to 4 days, and the dataset is 12 GB [S17]. The log also lists the original paper's weights as "Run 0", and says a dataset called CPMS was removed at run 70 [S17].
- **Licence of each transformer dataset.** OpenScore Lieder: CC0 [S30]. GrandStaff: no licence in homr's files; the Hugging Face mirror card says MIT, the upstream Humdrum source licence NOT ESTABLISHED [S23]. Camera-PrIMuS: none stated on the dataset page [S22]. PDMX: not read; homr's own filter implies the set contains rows with licence conflicts [S18]. MuseTrainer library: not read, NOT ESTABLISHED.
- **Weights.** homr downloads ONNX checkpoints from the GitHub release `onnx_checkpoints` (`homr/main.py`) [S18]. I found no separate weights licence in the README, Training.md or LICENSE [S17][S18]. NOT ESTABLISHED beyond the repository's AGPL-3.0.
- **Accuracy as the author reports it.** The test set used for "system level" results "cannot be published due to copyright restrictions" and "is subject to change over time" [S17]. Run 465 (26 September 2026): transformer smoke test 5%; system level "5.1 diffs, SER: 4.0%"; "Polish scores: 17.52%"; "SMB scores: 13.84%" [S17]. The run 426 entry labels the Polish and SMB figures as OMR-NED (24.30 and 22.06, then 18.1 and 14.5 after PR-112) [S17]. These are the author's own figures; I measured nothing. The README itself says the current implementation focuses on pitch and rhythm on bass or treble clef, neglecting dynamics and articulation [S17].

### F2. Polyphonic-TrOMR and Zeus

**Polyphonic-TrOMR** [S10][S9]. The repository licence is Apache-2.0 (LICENSE header read). The checkpoint is a file in the repository, `tromr/workspace/checkpoints/img2score_epoch47.pth`, named by `config.yaml`; a request for it returned 86,254,711 bytes. The README states no separate licence for the weights. Training data: the README describes MSD (clean electronic sheet music), CMSD-P (printed and photographed) and CMSD-S (photographed on a screen) and says "The training code will be open source later" [S10]; the paper says the datasets are built from MuseScore renders and that the code and datasets "will be made available" [S9]. I found no dataset link or licence for MSD or CMSD. Weights licence: NOT ESTABLISHED. Training data licence: NOT ESTABLISHED, and I could not list the repository tree because the GitHub API refused, so I cannot rule out a dataset inside it.

**Zeus** [S8][S7]. Code: MIT (full text read). Weights, as the README lists them:

- 2026 solo-staff snapshots, all "CC BY-NC-SA license": `ayce-2026-08-03` trained on Dolores, OLiMPiC and OmniOMR; `zod-bw-auth-ft-2026-07-20` trained on Dolores, finetuned on OmniOMR; `zod-bw-auth-2026-07-13` trained on Dolores.
- Original 2024 grandstaff models, "CC BY-SA licenses": trained on Camera GrandStaff, GrandStaff, or OLiMPiC. The OLiMPiC repository confirms the trained model and the datasets are CC BY-SA and the code is MIT [S7].
- Size: one `grand24` snapshot is "just under 30MB"; the 2026 `solo26` architecture uses a 128-pixel image height; its snapshot size is not stated [S8]. Licences of the Dolores and OmniOMR datasets: not fetched, NOT ESTABLISHED. Accuracy of the 2026 solo-staff models: NOT ESTABLISHED (the release page is on github.com HTML, which I did not try to reach after the API refusal). The 2024 model's accuracy is in A [S6].
- INFERENCE: the 2026 solo-staff weights are the closest published match to Ilya's task (one staff at a time), but a non-commercial, share-alike licence does not fit shipping them inside an MIT app.

### F3. A permissive reader of one staff or one system

I found none for which code, weights and training data are all verified permissive and a real-scan accuracy is reported.

What I checked, each against the five permitted licences (MIT, Apache-2.0, BSD, CC BY, CC0):

| Reader | Code | Weights | Training data | Size | Real-scan accuracy | Verdict |
|---|---|---|---|---|---|---|
| SMT (single system) | MIT [S23] | MIT (HF card) [S23] | GrandStaff, HF mirror labelled MIT; upstream NOT ESTABLISHED [S23] | 85,544,056 bytes [S23] | None; SER 5.1 and 6.2 on synthetic and distorted renders [S4] | Nearest candidate; fails on evidence of real-scan accuracy and on upstream data licence |
| SMT++ (full page) | MIT [S23] | MIT [S23] | FP-GrandStaff mirror labelled MIT [S23] | 43,689,404 bytes [S23] | SER 14.1 and 25.8 only after fine-tuning on other pieces of the test corpus [S5] | Full page, not a staff |
| Legato (full page) | MIT badge [S12] | gated, not readable [S12] | PDMX-Synth, licence not read [S11] | Not read | TEDn 42.0 on Lieder camera [S11] | Cannot verify |
| Transcoda (full page) | AGPL-3.0 [S14] | CC BY 4.0 [S14] | Mixed corpora [S13] | 58.8M parameters; file size not read [S13] | 63.97 OMR-NED on Polish scans [S13] | Code licence fails |
| homr | AGPL-3.0 [S18] | not separately stated [S17] | Mixed, partly unlicensed [S18] | See C [S19] | Private set only [S17] | Fails |
| Zeus 2024 | MIT [S8] | CC BY-SA [S8] | CC BY-SA [S7] | "just under 30MB" [S8] | 17.72 SER, 18.40 TEDn on scanned piano systems [S6] | Share-alike, outside the permitted list |
| Zeus 2026 solo-staff | MIT [S8] | CC BY-NC-SA [S8] | Dolores, OmniOMR not read [S8] | Not stated | NOT ESTABLISHED | Fails |
| Polyphonic-TrOMR | Apache-2.0 [S10] | not stated [S10] | not released as far as I found [S10] | 86,254,711 bytes [S10] | Photographs of printed renders only [S9] | Cannot verify |

I did not check oemer's licences or models, nor the CRNN code of the Camera-PrIMuS paper, nor whether Liu et al. released code or weights, so those are not ruled out. INFERENCE: if Ilya wants permissive weights it will have to train its own, using Zeus's MIT code or similar, on CC0 OpenScore Lieder renders and its own engravings; the published reader that comes closest to being free to ship (SMT, 85.5 MB) has no real-scan evidence.

---

## What could not be established

1. A 2025 or 2026 survey read in full. The TechRxiv review's page returned a challenge page to my fetch and I did not look for another route [S3].
2. Camera-PrIMuS's own error figures. I read the dataset page, not the 2018 paper; the MDPI page appeared only in search results [S22][S38].
3. The licence of SMB, the Polish-scores dataset beyond its non-commercial checkbox, Legato's weights, DeepScores V1, DoReMi, PrIMuS, the original GrandStaff source scores, PDMX, MuseTrainer, Dolores and OmniOMR. Reasons: gated pages, no statement on the page, or not fetched.
4. Any source on bar-sum or metre constraints as OMR error correction, on confidence-ranked display of doubtful symbols, on lyric and syllable-attachment accuracy for common-notation scans, on text-versus-music separation for modern songs, and on glyph-classifier training effort. I searched or grepped for each and found nothing usable.
5. Any browser-run single-staff reader's size, speed and accuracy. homr-web is the only browser example I found, for a full pipeline [S19].
6. The voice-and-piano case. No benchmark in the sources I read reports accuracy on the vocal staff of real scans.
7. Accuracy of the 2026 Zeus solo-staff models, and whether Russian-language songs appear in OpenScore Lieder beyond the absence of a "RU" tag.
8. Full-text reading. Many sources were read in part (abstract, results table, named sections). The Liu et al. figures come from a model summary of the MDPI page. The ISMIR 2021 user-study minute figures were not extracted.
9. Whether homr's "Polish" and "SMB" test sets match the public ones used by Transcoda and SMB.
10. Search-result leads I did not open: arXiv 2512.14758 (title not seen), the Musigraph paper (object detection plus graph neural network), the Springer 2023 OMR chapter [S38].

---

## Sources

Each entry: URL, bibliographic details, how I read it. "Raw" means the file's raw text fetched with curl from the host named.

**S1.** Calvo-Zaragoza, J., Hajič jr., J., Pacha, A. (2020). Understanding Optical Music Recognition. *ACM Computing Surveys* 53(4), Article 77. DOI 10.1145/3397499. URL: https://alexanderpacha.com/wp-content/uploads/2020/11/understanding-optical-music-recognition-final.pdf. Read in part (abstract, introduction, pipeline section, applications and conclusions on interactive systems and semantic reconstruction), full PDF text.

**S2.** Shatri, E., Fazekas, G. (2020). Optical Music Recognition: State of the Art and Major Challenges. arXiv:2006.07885 (v2, 22 Jun 2020). URL: https://arxiv.org/pdf/2006.07885. Read in part (abstract, section 8 on open issues).

**S3.** (Title only) Deep Learning for Optical Music Recognition: A Review. TechRxiv, 28 Feb 2025, DOI 10.36227/techrxiv.174077177.78767136. URL: https://www.techrxiv.org/doi/pdf/10.36227/techrxiv.174077177.78767136. Blocked: returned a 5,560-byte challenge page. Not read.

**S4.** Ríos-Vila, A., Calvo-Zaragoza, J., Paquet, T. (2024). Sheet Music Transformer: End-To-End Optical Music Recognition Beyond Monophonic Transcription. ICDAR 2024; arXiv:2402.07596. URL: https://arxiv.org/pdf/2402.07596. Read in part (dataset section, architecture, Table 1).

**S5.** Ríos-Vila, A., Calvo-Zaragoza, J., Rizo, D., Paquet, T. (2024, journal version 2025). End-to-End Full-Page Optical Music Recognition for Pianoform Sheet Music. arXiv:2405.12105 (PDF as served 2026-10-04); a journal version is listed at https://dl.acm.org/doi/10.1007/s11263-025-02654-6 (listing only, not read). URL: https://arxiv.org/pdf/2405.12105. Read in part (abstract, section 6.2 and Table 6).

**S6.** Mayer, J., Straka, M., Hajič jr., J., Pecina, P. (2024). Practical End-to-End Optical Music Recognition for Pianoform Music. ICDAR 2024, pp. 55-73. DOI 10.1007/978-3-031-70552-6_4; arXiv:2403.13763. URL: https://arxiv.org/pdf/2403.13763. Read in part (dataset construction, evaluation discussion, Tables 2 and 3).

**S7.** ufal/olimpic-icdar24 repository README and licences section. URL: https://raw.githubusercontent.com/ufal/olimpic-icdar24/master/README.md. Read in full (raw).

**S8.** OmniOMR/zeus repository: README, LICENSE, docs/model-snapshots.md, docs/model-architecture.md. URLs: https://raw.githubusercontent.com/OmniOMR/zeus/main/README.md, .../main/LICENSE, .../main/docs/model-snapshots.md, .../main/docs/model-architecture.md. README, LICENSE and the two docs read in full (raw).

**S9.** Li, Y., Liu, H., Jin, Q., Cai, M., Li, P. (2023). TrOMR: Transformer-Based Polyphonic Optical Music Recognition. arXiv:2308.09370. URL: https://arxiv.org/pdf/2308.09370. Read in part (dataset description, Tables 1 to 3, consistency discussion).

**S10.** NetEase/Polyphonic-TrOMR repository: README.md, LICENSE, tromr/inference.py, tromr/workspace/config.yaml, and the checkpoint file's headers. URLs: https://raw.githubusercontent.com/NetEase/Polyphonic-TrOMR/master/README.md, .../master/LICENSE, .../master/tromr/inference.py, .../master/tromr/workspace/config.yaml, .../master/tromr/workspace/checkpoints/img2score_epoch47.pth (headers only: 86,254,711 bytes). README, inference.py and config.yaml (top) read in full; LICENSE header only.

**S11.** Yang, G., Ebert, V., Tamer, N. C., Zheng, B. S., Pozzobon, L. A., Smith, N. A. (2025, arXiv v3 27 Sep 2026). LEGATO: Large-Scale End-to-End Generalizable Approach to Typeset OMR. arXiv:2506.19065. URL: https://arxiv.org/pdf/2506.19065. Read in part (abstract, sections on data, models, evaluation, Table 1, appendix on SMT++ comparison).

**S12.** guang-yng/legato repository README and LICENSE.md. URLs: https://raw.githubusercontent.com/guang-yng/legato/main/README.md, .../main/LICENSE.md. README read in part (grep for licence, checkpoints, datasets); LICENSE.md header (MIT). The Hugging Face model page `guangyangmusic/legato` returned 401 (restricted); not read.

**S13.** Dratschuk, D., Swoboda, P. (2026). Transcoda: End-to-End Zero-Shot Optical Music Recognition via Data-Centric Synthetic Training. arXiv:2605.10835 (v1, 11 May 2026). URL: https://arxiv.org/pdf/2605.10835. Read in part (abstract, related work, data section, results, Table 3, error discussion).

**S14.** btrkeks/transcoda repository and Hugging Face cards. URLs: https://raw.githubusercontent.com/btrkeks/transcoda/main/README.md, .../main/LICENSE (AGPL-3.0 header), https://huggingface.co/btrkeks/transcoda-59M-zeroshot-v1 (card front matter: CC BY 4.0), https://huggingface.co/datasets/btrkeks/polish-scores (licence "other, see PRAIG upstream"), https://huggingface.co/datasets/btrkeks/verovio-synth-omr (CC BY 4.0). README read in part; cards read in part (front matter and first paragraphs).

**S15.** Martinez-Sevilla, J. C., Cerveto-Serrano, J., Luna, N., Chapman, G., Sapp, C., Rizo, D., Calvo-Zaragoza, J. (2025, arXiv v3 1 Jul 2026). Sheet Music Benchmark: Standardized Optical Music Recognition Evaluation. arXiv:2506.10488. URL: https://arxiv.org/pdf/2506.10488. Read in part (abstract, sections 2 to 4, Table 2). Dataset page https://huggingface.co/datasets/PRAIG/SMB returned 401; not read.

**S16.** Fuentes-Martínez, E., Ríos-Vila, A., Martinez-Sevilla, J. C., Rizo, D., Calvo-Zaragoza, J. (2024). Aligned Music Notation and Lyrics Transcription. arXiv:2412.04217 (v1, 5 Dec 2024; preprint for *Pattern Recognition*). URL: https://arxiv.org/pdf/2412.04217. Read in part (abstract, dataset section, metrics, Table 2 and result discussion). Authors as printed on the PDF's first page and in its correspondence list; not checked against a publisher page.

**S17.** liebharc/homr repository docs. URLs: https://raw.githubusercontent.com/liebharc/homr/main/README.md (read in full), https://raw.githubusercontent.com/liebharc/homr/main/Training.md (read in full).

**S18.** liebharc/homr repository code and licence. URLs under https://raw.githubusercontent.com/liebharc/homr/main/: LICENSE (header only), training/train.py (full), training/download.py (full), training/segmentation/train.py (grep, main block), training/omr_datasets/convert_primus.py, convert_grandstaff.py, convert_lieder.py, convert_pdmx.py, convert_musetrainer.py (grep for sources and filters), training/transformer/train.py (grep), homr/main.py (grep for the weights download URL). `api.github.com` returned 403, so I could not list the tree.

**S19.** jymen/homr-web (browser port of homr), README. URL: https://raw.githubusercontent.com/jymen/homr-web/main/README.md. Read in part (grep for models, sizes, timings, licence). Found through search result https://github.com/jymen/homr-web.

**S20.** aicelen/Andromr README. URL: https://raw.githubusercontent.com/aicelen/Andromr/main/README.md. Read in part.

**S21.** Liu, Y., Wu, R., Wu, Y., Luo, L., Xu, W. (2023). A Stave-Aware Optical Music Recognition on Monophonic Scores for Camera-Based Scenarios. *Applied Sciences* 13(16), 9360. DOI 10.3390/app13169360. URL: https://www.mdpi.com/2076-3417/13/16/9360. Read in part, through a model summary returned by WebFetch (not the page text). A direct PDF request returned an "Access Denied" page; I did not pursue another route.

**S22.** Calvo-Zaragoza, J., Rizo, D. PrIMuS and Camera-PrIMuS dataset page. URL: https://grfia.dlsi.ua.es/primus/. Read in part (descriptions, no licence statement found). The 2018 papers it cites are Calvo-Zaragoza, J., Rizo, D., End-to-End Neural Optical Music Recognition of Monophonic Scores, *Applied Sciences* 8(4), 606 (https://www.mdpi.com/2076-3417/8/4/606, search-result snippet only) and Camera-PrIMuS, ISMIR 2018 (cited on the page; not read).

**S23.** SMT repository and Hugging Face cards. URLs: https://raw.githubusercontent.com/antoniorv6/SMT/master/README.md (read in part) and .../master/LICENSE (MIT); https://huggingface.co/PRAIG/smt-fp-grandstaff/raw/main/README.md (read in full: front matter `license: mit`); https://huggingface.co/antoniorv6/smt-grandstaff/raw/main/README.md and https://huggingface.co/antoniorv6/smt-camera-grandstaff/raw/main/README.md (front matter read); https://huggingface.co/datasets/antoniorv6/grandstaff/raw/main/README.md and https://huggingface.co/datasets/PRAIG/FP-GrandStaff/raw/main/README.md (front matter: `license: mit`); file sizes from https://huggingface.co/api/models/PRAIG/smt-fp-grandstaff?blobs=true and the same endpoint for `antoniorv6/smt-grandstaff` and `antoniorv6/smt-camera-grandstaff` (the last two list identical sizes).

**S24.** PRAIG/polish-scores dataset card. URL: https://huggingface.co/datasets/PRAIG/polish-scores/raw/main/README.md. Read in full (front matter only: splits 83, 10, 24; gating form with a non-commercial checkbox).

**S25.** Tuggener, L., Elezi, I., Schmidhuber, J., Pelillo, M., Stadelmann, T. (2018). DeepScores: A Dataset for Segmentation, Detection and Classification of Tiny Objects. arXiv:1804.00525; venue not stated in the text I read. URL: https://arxiv.org/pdf/1804.00525. Read in part (abstract, introduction). Authors as printed on the PDF's first page.

**S26.** DeepScoresV2, Zenodo record 4012193. URL: https://zenodo.org/api/records/4012193. Read (metadata JSON: title, licence `cc-by-4.0`, publication date, file sizes).

**S27.** Hajič jr., J., Pecina, P. (2017). In Search of a Dataset for Handwritten Optical Music Recognition: Introducing MUSCIMA++. arXiv:1703.04824. URL: https://arxiv.org/pdf/1703.04824. Read in part (abstract, notation graph section). Also OMR-Research/muscima-pp README: https://raw.githubusercontent.com/OMR-Research/muscima-pp/master/README.md, read in part.

**S28.** Shatri, E., Fazekas, G. (2021). DoReMi: First glance at a universal OMR dataset. arXiv:2107.07786. URL: https://arxiv.org/pdf/2107.07786. Read in part (abstract, introduction).

**S29.** apacha/OMR-Datasets README (a third-party index, used only for licence badges and counts). URL: https://raw.githubusercontent.com/apacha/OMR-Datasets/master/README.md. Read in part (grep).

**S30.** OpenScore/Lieder repository: README, data/corpus.yaml, data/scores.yaml, data/composers.yaml. URLs: https://raw.githubusercontent.com/OpenScore/Lieder/main/README.md (read in part), .../main/data/corpus.yaml (read in full), .../main/data/scores.yaml (counted by field), .../main/data/composers.yaml (searched for composer names). The README says CC0 and refers to LICENSE.txt, which I did not fetch. Paper: Gotham, M., Jonas, P. (2022). The OpenScore Lieder Corpus. Music Encoding Conference, pp. 131-136, DOI 10.17613/1my2-dm23 (cited by [S6][S30]; abstract line read in the README).

**S31.** Calvo-Zaragoza, J., Hajič jr., J., Pacha, A. (2019). Learning Notation Graph Construction for Full-Pipeline Optical Music Recognition. ISMIR 2019 (author order as extracted from the PDF header, which may differ from the printed order). URL: https://archives.ismir.net/ismir2019/paper/000006.pdf. Read in part (abstract, results).

**S32.** Yang, D., Tanprasert, T., Jenrungrot, T., Shan, M., Tsai, T. J. (2019). MIDI Passage Retrieval Using Cell Phone Pictures of Sheet Music. ISMIR 2019; arXiv:2004.10347 (posted 21 Apr 2020). URL: https://arxiv.org/pdf/2004.10347. Read in part (abstract, introduction, evaluation measures).

**S33.** Tsai, T. J. (2020). Towards Linking the Lakh and IMSLP Datasets. arXiv:2004.10391 (22 Apr 2020); venue not stated in the text I read. URL: https://arxiv.org/pdf/2004.10391. Read in part (abstract, method outline).

**S34.** Piano Sheet Music Identification Using Dynamic N-gram Fingerprinting. *Transactions of the International Society for Music Information Retrieval*, DOI 10.5334/tismir.70. URL: https://transactions.ismir.net/articles/10.5334/tismir.70. Read in part (abstract and method paragraphs through the page text). Authors not confirmed from the page.

**S35.** Alfaro-Contreras, M., Rizo, D., Iñesta, J. M., Calvo-Zaragoza, J. (2021). OMR-Assisted Transcription: A Case Study with Early Prints. ISMIR 2021. URL: https://archives.ismir.net/ismir2021/paper/000003.pdf. Read in part (abstract, method, parts of results).

**S36.** Martinez-Sevilla, J. C., Rosello, A., Rizo, D., Calvo-Zaragoza, J. (2023). On the Performance of Optical Music Recognition in the Absence of Specific Training Data. ISMIR 2023. URL: https://archives.ismir.net/ismir2023/paper/000037.pdf. Abstract and introduction only.

**S37.** Rosello, A., Ríos-Vila, A., Rizo, D., Calvo-Zaragoza, J. (2026). Full-Page Optical Music Recognition of Handwritten Monophonic Scores. arXiv:2609.05662 (v1, 4 Sep 2026). URL: https://arxiv.org/pdf/2609.05662. Abstract only.

**S38.** Search-result leads, not opened: https://link.springer.com/chapter/10.1007/978-3-031-41498-5_7 (Optical Music Recognition: Recent Advances, Current Challenges, and Future Directions); https://arxiv.org/pdf/2512.14758v1; https://www.researchgate.net/publication/365741326_Musigraph_Optical_Music_Recognition_Through_Object_Detection_and_Graph_Neural_Network; https://www.researchgate.net/publication/277297348_Lyric_extraction_and_recognition_on_digital_images_of_early_music_sources_ISMIR. Search-result snippet only for each; no claim above rests on them except that they exist.
