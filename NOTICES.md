# Notices

## Scholarly Authority

Ilya's phonological engine implements the rules described in:

> Grayson, Craig M. "Russian Lyric Diction: A Practical Guide with Introduction
> and Annotations and a Bibliography with Annotations on Selected Sources."
> DMA diss., University of Washington, 2012.

Craig Grayson's dissertation is the sole phonological authority for Russian in
this software. All transcription rules, vowel reduction logic, palatalization
processes, and assimilation behaviour are derived from his work. Page references
throughout Ilya are to this dissertation.

## The Latin in Mussorgsky's «Семинарист» (The Seminarian)

Grayson does not treat Latin. The pronunciation of the thirty Latin words in
Mussorgsky's «Семинарист», both versions, follows:

> Richter, Laurence R. *Mussorgsky's Complete Song Texts.* Geneseo, NY:
> Leyerle Publications, 2002. ISBN 1-878617-31-1. Pp. xii, 43–49.

Richter's transcriptions are rendered here in Grayson's notation; the rendering
is Ilya's, and the pronunciation is Richter's. The one symbol outside Grayson's
inventory, [w], comes from Richter, who notes that it "occurs only in the Latin
words used in the text of the song *The Seminarian*" (p. xii). Cited for
scholarly and pedagogical purposes.

## Dictionary Data

The Russian dictionary with stress markings is derived from
[Kaikki.org](https://kaikki.org/) extractions of
[English Wiktionary](https://en.wiktionary.org/) and
[French Wiktionnaire](https://fr.wiktionary.org/).
Per kaikki.org, this data is made available under the same licences as
Wiktionary: the [Creative Commons Attribution-ShareAlike 4.0 International
License](https://creativecommons.org/licenses/by-sa/4.0/) and the
[GNU Free Documentation License](https://www.gnu.org/licenses/fdl-1.3.html).

Kaikki.org requests the following citation for use of its data:

Tatu Ylonen, "Wiktextract: Wiktionary as Machine-Readable Structured Data,"
*Proceedings of the 13th Conference on Language Resources and Evaluation
(LREC)*, Marseille, 20–25 June 2022, 1317–1325.

## Dependencies

Third-party dependency licences are listed here as they are added.

### The score reader for a scan

A scanned score (a PDF or a picture) is read by homr, run in the browser.
These are dependencies of the app. homr-web is a changed copy, installed from
the packed file in `third_party/homr-web/`, where its source is; the others
are installed from npm at the versions pinned in the lockfile, and their code
is not part of this repository.

- **homr-web** 0.2.0-ilya.4, a changed copy of homr-web 0.2.0 (upstream
  commit `cb333a5`), the browser port of homr, by its authors at
  <https://github.com/jymen/homr-web>. GNU Affero General Public License
  version 3 (AGPL-3.0-only). Changed by the Ilya project to read with homr's
  model 465 and the code of homr's main branch, and in three places to depart
  from it (the regrouping of a page's staffs, a system that leaves out the
  voice's staff, and a clef read inside a chord); it is not a release by its
  authors. The source of the changed copy is in `third_party/homr-web/`, and
  `third_party/homr-web/CHANGES-ilya.md` lists every change.
- **homr**, main branch at commit `560ca5c`, the optical music recognition
  engine, by Christian Liebhardt, <https://github.com/liebharc/homr>. GNU
  Affero General Public License version 3. The reader reads with homr's
  model 465. The five model files the reader downloads (segmentation model,
  model 465 transformer encoder in fp16 and fp32, model 465 transformer
  decoder) are homr's own release assets, served unchanged.
- **onnxruntime-web** 1.30.0, Microsoft, <https://github.com/microsoft/onnxruntime>.
  MIT License.
- **@techstark/opencv-js** 4.12.0-release.1, a build of OpenCV.js,
  <https://github.com/TechStark/opencv-js>. Apache License 2.0.
- **delaunator** 5.1.0, Mapbox, <https://github.com/mapbox/delaunator>. ISC
  License.
