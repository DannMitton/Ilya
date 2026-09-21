# BRIEF — N.159. Score markup responds to the Notation toggles live

**Written 2026-09-21, 01:45, by the desk. For Claude Code, pointed at `~/Desktop/ilya-rewrite`, branch `Shane`.**
**Tree read for this brief at `b543620`.**

**Numbered N.159, DESK DEFAULT. Dann can renumber or wave it off with a word.**

**THIS BRIEF ASKS YOU TO PROPOSE, NOT TO BUILD.** Read section 7 before you write a line
of application code. Dann wants to confer on the design before it is built, and the seam
this touches is one he has already ruled on twice.

Read `docs/memory/CONTRACT.md` in full before you start.

---

## 1. THE RULING. Dann, 2026-09-21, 01:37

> *"as I experiment with Ilya's interface I notice that while Transcription responds in
> realtime to toggles, Score Markup does not. This must change. We must have Score Markup
> respond instantaneously to the Notation toggles just like Transcription does."*

And earlier the same night, on the stress acutes specifically: *"We want these to update in
real time."*

---

## 2. THE CAUSE. One fact, not four defects

**The two documents are built on opposite principles.**

**Transcription** renders `WordStackData` straight from `lines`, which `processText`
rebuilds on every change, and applies the notation preferences **at draw time**, per word,
per render: `WordStack.svelte:23` (`reconActive`), `:32-51` (`displayIpa`), `:55-77`
(`displayCyrillic`). Every toggle is live by construction.

**Score markup** renders `Pairing.cyrillic` and `Pairing.ipa`, which are **stored strings
in the singer's library**. They are refreshed only when `refreshPairings` finds the
matching queue slot's text differs (`pairings.ts:468`), and that queue is
`buildSlotQueue(lines)` over **raw** lines (`+page.svelte:385`), with no preference
applied. **There is no draw-time preference step on the score at all.**

**The four preferences that do reach the score arrive by one accident.**
`applyNotationPreferences` (`packages/phonology/src/engine.ts:155-179`) is four regex
substitutions on an IPA string, so they survive being baked into stored text. It reads
`reducedVowel`, `shcha`, `palatalNasal` and `geminate`, and nothing else.

### Every symptom falls out of that

| symptom | why |
|---|---|
| **Open syllables** never reach the score (N.136) | It changes syllable boundaries, and `buildSlotQueue` runs over raw `lines`, never `effectiveLines`. That is deliberate and ruled (`+page.svelte:4836-4839`, `vowel-resolver.ts:389-395`, Dann's N.10 of 7 August), because the score's resolver applies its own. |
| **Reconstitution** never reaches the score (N.158) | It produces `ipaReconstituted`, a different string. `Slot` (`pairings.ts:107-115`) carries `cyrillic`, `ipa`, `vowel` and `origin`, and nothing else. |
| **Stress acutes** miss some notes (N.119b) | The acute needs word-level provenance, which `Slot` does not carry, so `stressAcutedCyrillic` reaches back into the poem at `pairings.ts:844` and fails wherever the origin cannot resolve. |
| **A hand-assigned stress** did not follow | Fixed in `b543620` by widening `refreshPairings` to compare `ipa` as well as `cyrillic`. That is a patch on this same seam. |

---

## 3. WHAT MUST NOT BREAK. All of these are ruled

1. **A seat can outlive the poem it came from.** `reseat.ts:186-196`: *"A SEAT THIS DIFF
   CANNOT SPEAK FOR IS LEFT EXACTLY AS IT IS... Before this test they were re-keyed by
   POSITION, which silently reinterpreted a score coordinate as a poem coordinate. That is
   the defect Dann walked on `b191867`."* **The pairing must keep holding the singer's
   placement independently of the poem.**
2. **N.112, the text is authoritative**, shipped 2026-09-07. Do not undo its diff or its
   re-keying.
3. **The score takes raw `lines`, never `effectiveLines`.** Dann's N.10, 7 August.
4. **`CONTRACT.md` §6:** do not put a mark on the page to say Ilya is unsure. A mark that
   appears on everything says nothing.
5. **Do not change `VocalLineEvent`**, and do not rebuild anything in
   `apps/web/src/lib/shane/reconciliation/`.

---

## 4. WHAT THE AUDITS ALREADY ESTABLISHED. Do not re-derive these

Two read-only audits ran 2026-09-21. Their findings, with the citations, so you start from
them rather than repeating them.

### 4.1 `SlotOrigin` has exactly one constructor

`pairings.ts:243`, inside `buildSlotQueue`. Every other writer copies an existing origin
verbatim: `pairings.ts:474-480` (`firstPass`), `:1176-1183` (`placeSyllable`),
`score-seat.ts:117`, `clitic-seat.ts:382`, `reseat.ts:216-221` and `:307-313`.
`refreshPairings` and `mergeOnUpload` never construct or mutate one.

### 4.2 Two different texts feed `buildSlotQueue`, and their coordinates collide

The live poem (`+page.svelte:385`), and the score's own words re-transcribed
(`clitic-seat.ts:465-479`, `readScoreText`), which is **always exactly one line**
(`clitic-seat.ts:475` returns `null` if `lines.length > 1`). So score-derived seats carry
`lineIndex 0` and a running `wordIndex`, indistinguishable from a poem's line 0.

### 4.3 The type says `word: string`; the runtime treats it as optional

`pairings.ts:95` declares it required. `reseat.ts:163` and `pairings.ts:444-446` both test
`o.word !== undefined`, for pairings stored before the field existed. **Report which you
build to.**

### 4.4 Storing word facts on the `Pairing` would go stale immediately

**This refutes the desk's own first instinct, and it is why this brief does not propose
it.** `handleStressAssign` (`+page.svelte:2679-2691`), `handleStressRevert` (`:2694-2700`),
`handleYoCharToggle` (`:2703-2714`) and `handleReset` (`:2774-2817`) all call
`runPipeline()` only. `runPipeline` (`:2317-2335`) reassigns `lines` and **never writes
`doc.pairings`**. And `refreshPairings` compares text equality (`pairings.ts:468`), so a
provenance change that leaves `cyrillic` and `ipa` identical passes unnoticed.

### 4.5 The persisted schema has no migration path

`library/types.ts:71` and `:123`: `schema: 1`, the only schema ever shipped.
`library.ts:126-128` refuses a newer schema but never upgrades an older one.
`library.ts:173-174` validates `pairings` only as "an object with string keys" and never
inspects a `Pairing`'s shape. **A required new field on `Pairing` would type-lie on every
stored song.** The house pattern is an optional field plus explicit `undefined` handling at
every read site (`pairings.ts:441-443`), not a migration pass.

### 4.6 The silent failures, measured

`pairings.ts:845` is a bare `continue` with no counter and no log. So are
`reseat.ts:268` and `+page.svelte:2757-2771` (`keepSurvivingGlosses`, which drops a
singer's gloss override without saying so).

**Measured on Dann's own library, through the branch alias, 2026-09-21:** his Sunless song
holds 96 pairings. **25 carry an `origin.lineIndex` that does not exist** in the current
one-line poem, and **8 of those carry a stress mark**, so eight acutes are withheld
invisibly. Four origin words are absent from the poem entirely: «Тень», «непроглядная»,
«безответная», «Дума».

---

## 5. WHAT IS IN SCOPE

**Every Notation toggle takes effect on Score markup on the render after it is flipped, the
way Transcription does.** That includes the ones that do not reach it at all today:
`openSyllabification` (N.136) and `reconstitution` (N.158). If your design closes those by
construction rather than one at a time, say so; that is the outcome Dann's ruling asks for.

---

## 6. WHAT IS NOT IN SCOPE

- **The 25 seats the poem cannot speak for.** A seat with no live word has no word-level
  facts to read, and inventing them is worse than withholding them. **Say what your design
  does for those seats, but do not solve it here.**
- **Word repair, text curation, OCR, and line reconstruction.** All separate.
- **The engraver's word division** («не» carries `syllabic=single` in the MusicXML, so
  Ilya is honouring one authority over the poet's orthography). A product ruling of Dann's,
  not a defect, and not this item.

---

## 7. WHAT TO DO. PROPOSE FIRST

**Write a design memo. Write no application code until Dann has ruled on it.**

The memo carries:

1. **Where the draw-time step goes**, with `path:line` for every seam you would touch.
2. **What `Pairing` keeps and what becomes derived.** Dann's framing, and test your design
   against it: the pairing should hold **what the singer placed**, and the **rendered form**
   should be computed on every render. State whether you agree, and if not, why.
3. **How the derived form gets the word-level facts** without storing them (4.4) and
   without reaching into the poem for seats it cannot speak for (3.1).
4. **What it costs.** Render cost per frame at 97 notes, and what it does to
   `refreshPairings` and `reseatByDiff`.
5. **What it breaks.** Name every caller and every test that would change, and every ruling
   in section 3 you would come close to.
6. **The alternative you rejected**, and why. Dann has been given one recommendation
   tonight that an audit then refuted; he is better served by seeing the option you
   discarded.
7. **The seats without a word.** What your design does for those 25, and what it would take
   to make that visible instead of silent. A count in the console is not visible; a mark on
   every affected note is what `CONTRACT.md` §6 forbids. **Do not decide this. Frame it for
   Dann.**

**Read before you propose, and cite what you read:** `WordStack.svelte` in full,
`VoiceProfilePane.svelte`'s derived chain from `:568` to `:650`, `pairings.ts`'s
`buildSlotQueue`, `refreshPairings` and `stressAcutedCyrillic`, `reseat.ts` in full, and
`engine.ts:155-179`.

---

## 8. WHAT YOU COULD NOT ESTABLISH

Fill it. **NOT ESTABLISHED beats a complete invented answer.**

Two the audits left open and you may be able to close:
- whether `stressSource` ever actually takes the literal `'clitic'`, which
  `pairings.ts:847` and `WordStack.svelte:105` both test for and no assignment site sets;
- whether anything downstream reads `ReseatResult`'s `kept` / `removed` / `seated` /
  `unseated` counts, or whether they are reported in name only.

---

## 9. RETURN MEMO

`docs/sessions/memo-n159-score-markup-responds-live_r1_2026-09-21.md`. A design memo, no
code. Sections 7.1 to 7.7, then section 8.
