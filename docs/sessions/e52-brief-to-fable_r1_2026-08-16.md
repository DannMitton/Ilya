# BRIEF TO FABLE — design Ilya's SAVE function

**From:** Dann Mitton, via Claude (Opus 5), session E.52, 16 August 2026
**Repository:** `~/Desktop/ilya-rewrite`, branch `Shane`, HEAD `fd1f628`, tree clean
**You have full read access to the repository. Use it. Verify anything below.**

---

## 0. WHAT YOU ARE BEING ASKED FOR

Design a bespoke SAVE function for Ilya, modelled on best practices current
today. You choose the encoding, the storage, the access pattern, the archive
format, and any library. Optimise for **lightness** against a footprint that is
already growing, but use whatever is genuinely necessary to make the save
**stable, reliable, useful, and excellent** for the way this app actually works.

**Deliverable: a design document, not code.** Architecture, the shape of a saved
song, the migration path off what exists today, failure handling, and a build
order a coding session can execute without coming back to you.

**Dann's words, verbatim, because the framing is his:**

> *"I need it to be stable and robust, and capable of holding hundreds of songs
> (or, the correspondence between a song's lyrics and its notes). I feel like
> this has literally been built hundreds of thousands of times for other
> applications. We can search for best practices... Ask Fable to optimize for
> lightness (try not to add too much bulk to the app's growing footprint) but
> also to use what is necessary to build a stable, reliable, useful, excellent
> SAVE for this app in the way the app needs to function."*

---

## 1. WHAT ILYA IS, IN ONE PARAGRAPH

Ilya is a diction tool for classical singers working in Russian. A singer types
or pastes a Russian poem; Ilya transcribes it to IPA, syllabifies it, marks
stress, and glosses it. Separately, the singer drops in a score (Finale `.musx`,
MusicXML, `.mxl`, MNX, MuseScore, or a photograph run through OMR). Ilya parses
the score, and where the score carries no lyric underlay the singer assigns
syllables to notes by hand, one click at a time. The output is a printable study
sheet: the melody with the singer's own syllable placement and IPA beneath it.
It is a SvelteKit app, client-only, static-adapter, SSR off, deployed on Vercel.
**It transmits nothing.** Everything happens in the browser.

Dann is a classical singer and a musical academic. He is not a programmer.
Write for him as well as for the coding session that will execute you.

---

## 2. THE NEWS — WHAT HAPPENED IN THIS CONVERSATION, AND WHY YOU ARE BEING ASKED

The session opened on an unrelated defect, numbered **N.68**. Its content:

`apps/web/src/routes/+page.svelte:1147-1152`. On every accepted score upload,
the singer's entire syllable-placement map is replaced unconditionally. If the
uploaded score carries no lyrics, it is replaced by a fresh automatic first pass;
if it does carry lyrics, it is replaced by an empty object. Either way the
previous map is gone, and the save effect at `:177-181` writes that to storage
immediately. There is no undo. Since the score itself is never persisted,
re-uploading is the ordinary way back into the app after a page reload, so this
fires on the normal path, not on an edge case.

Diagnosis: the note identifiers are positional and deterministic,
`` `m${measureIndex}-${position.numerator}-${position.denominator}` ``
(`packages/score-parser/src/musicxml-parser.ts:701`, and identically
`mnx-parser.ts:899`). The same file re-parsed yields the same keys, which is what
makes restoration possible at all. But those keys are not unique across songs:
every piece has a bar 1, beat 1. And Ilya stores the placement map under a single
browser key with no record of which score it was made for
(`apps/web/src/lib/shane/pairings.ts:62`, `:390-406`).

**Dann's response was to reject the patch and ask for the real thing.** His
position, which is correct and which this brief exists to serve: Ilya has one
storage slot where it needs a filing system. Patching the slot to know which song
it holds is work that gets thrown away the moment a proper save exists. He also
proposed, unprompted and correctly, that a song record should carry a header with
its identifying information and pointers into it, rather than repeating that
information per note.

**He wants the save function built now, ahead of the two remaining beta
blockers.** That is his ruling and it is not open for you to re-litigate.

---

## 3. WHAT IS ALREADY TRUE IN THE TREE — VERIFIED THIS SESSION

Every item below was read or measured on 16 August 2026 in the working tree.
Where I am reporting someone else's number rather than my own measurement, I say
so.

### 3.1 There is already an IndexedDB in this app

**This corrects the prior N.67 document, which recommended IndexedDB as though it
were new.** `apps/web/src/lib/loader.ts:103-115` opens database **`ilya-data`**,
version **1**, object store **`cache`**. It stores the vendored Russian
dictionary as chunked NDJSON, keyed `dict-{hash}-chunk-N` with a `-meta` count,
in transactions the file's own comment sizes at about 240 KB each and justifies
against mobile IndexedDB limits (`loader.ts:116-126`).

**A song store must either share this database and bump its version, or open its
own beside it. That choice is yours, and the version-1 schema and its upgrade
handler are the constraint to design around.**

### 3.2 Everything else is in localStorage, across three files

Eleven keys under the `ilya:` prefix, all written and read in
`apps/web/src/routes/+page.svelte` except where noted:

| key | holds | site |
|---|---|---|
| `ilya:inputText` | the poem | `:451`, `:677`, `:911` |
| `ilya:language` | UI language, routes glosses | `:686`, `:902` |
| `ilya:metadata` | title, composer, poet, translator, opus, transcriber | `:710`, `:915` |
| `ilya:metadataFromScore` | which metadata fields came from the score header | `:722` |
| `ilya:pairings` | **the syllable-to-note map** | `lib/shane/pairings.ts:62` |
| `ilya:glossOverrides` | gloss text plus the word each was written for | `:595`, `:947` |
| `ilya:openSyllabification` | syllabification preference | `:504`, `:930` |
| `ilya:notationPrefs` | notation display prefs | `:486`, `:906` |
| `ilya:showStressDiacritics` | display toggle | `:494`, `:926` |
| `ilya:activeTab` | which tab was open | `:471`, `:782`, `:938` |
| `ilya:drawerCollapsed` | drawer state | `:769`, `:934` |

Plus, separately: `shane.profiles.v2` with a v1 migration path
(`apps/web/src/lib/shane/profileStore.ts:65-66`, migration at `:173-205`), which
holds **the singer's own voice measurements**, and a session-scoped
`ilya-ios-hint-shown` (`lib/components/InstallPrompt.svelte:52`).

**Note what this list does and does not contain.** It holds one poem, one
metadata set, and one placement map. Not one per song. Opening a second song
overwrites the first. That is the whole defect Dann is asking you to design away.

**And note that `+page.svelte` is 74,413 bytes and is where almost all of this
lives.** Any design that adds storage logic to that file rather than extracting
it is making an existing problem worse.

### 3.3 Two failure modes already in the code, one of which is a standing rule

- **`profileStore.ts:216-224` swallows its quota failure silently.** `saveStore`
  catches and returns; the singer is told nothing. This is numbered **N.27** and
  is open. The project carries a standing prohibition, verbatim: *"Do not add a
  second silent save site while N.27 is open."*
- **`pairings.ts:390-422` does the opposite and is the model.** `savePairings`
  returns an outcome with a reason rather than throwing, `loadPairings` likewise,
  and the interface surfaces both (`+page.svelte:1186-1194`). **A filing system
  that loses a recital in silence is worse than one that refuses to save.**

### 3.4 Storage eviction, which is live on the build running today

Safari deletes all data from an origin that has had no user interaction for seven
days, when cross-site tracking prevention is on, and eviction is all-or-nothing:
IndexedDB, Cache API, and localStorage go together. Dann's voice measurements are
in localStorage. **On iOS this reaches him even though he uses Chrome, because
Apple requires every iOS browser to use WebKit underneath.** *(That last clause
is from my general knowledge, not read from the tree and not verified on the web
this session. Verify it.)*

**`navigator.storage.persist()` has never been called.** I searched `apps` and
`packages`: zero occurrences. Neither has `navigator.storage.estimate()`, so the
real quota on Dann's devices has never been read. This closes an item the prior
N.67 document listed as unestablished.

### 3.5 Sizes, measured, and this corrects the prior document

The prior N.67 document estimated Dann's median score at 66 KB and "15 to 25 KB
compressed." **Both halves are wrong.**

Measured in `~/Downloads` on 16 August:

| file | bytes |
|---|---|
| Kabalevsky, Shakespeare T09 `.musx` | 145,513 |
| Kabalevsky, Shakespeare T05 `.musx` | 142,732 |
| Sharp Excerpt `.fin27.mnx` | 87,483 |
| Sharp Excerpt `.fin27.musx` | 86,918 |
| Mussorgsky, Sunless 04 `.musx` | 64,286 |
| `no-lyrics-control.musicxml` (test fixture) | 1,757 |

**And `.musx` does not compress.** gzip -9 on the Kabalevsky returns 145,526
bytes, thirteen bytes *larger* than the original, because Finale's container is
already a zip. Same result on the Mussorgsky: 64,286 in, 64,314 out.

**So the realistic figure is roughly 65 to 150 KB per source file, uncompressed
and staying that way, not 15 to 25 KB.** A hundred songs of sources alone is
therefore closer to **10 MB** than to the 4 to 9 MB the prior document projected
for sources plus everything else. Design against the measured number.

### 3.6 The current footprint, for the lightness constraint

Runtime dependencies (`apps/web/package.json`): `bits-ui`, `tesseract.js`,
`webmscore`, plus four workspace packages. **Ilya vendors its own dictionary
rather than taking a dependency, and that is the house style.** Adding a
dependency is Dann's call, not yours, but you should recommend.

`apps/web/static` is **8.0 MB**, of which `denigma_wasm_mnx.wasm` is 4.4 MB and
fonts are 2.0 MB. There is no build output in the tree, so **the shipped JS
bundle size is NOT ESTABLISHED**; run the build if you want the number.

**Give lightness a number to hold itself against, not an adjective.** If your
design adds a dependency, quote its minified-and-gzipped weight and its licence
from the registry, not from a search-result title.

---

## 4. DANN'S STANDING RULINGS. THESE BIND YOU

These are his, not mine, and they are not open questions.

1. **Store what a human supplied. Derive everything else on open.**
2. **The score file the singer dropped in IS what the human supplied.** Keep it.
   The extracted melody is derived, by an extractor this project knows is
   fallible (`packages/score-parser/src/types.ts:175` grades its own output down
   to `'medium-low'` for photographs and scans; `:181-188` names seven source
   paths). Discard the source and every song is frozen at the error the extractor
   made the day it was imported, with nothing to re-run against when the
   extractor improves.
3. **Never store derived analysis.** `packages/score-parser/src/analysis-types.ts:122-124`:
   every field of the per-note forecast is derived from the voice profile. If it
   is stored and the singer recalibrates, the stored analysis is silently wrong.
   Hydration is a correctness requirement here, not an optimisation. The single
   ruled exception in the whole project is R8's vowel glyph.
4. **Do not invent an Ilya melody format.** MusicXML and MNX already are the
   format and the parser reads both. A new melody format is a second parser, and
   that shape is prohibited. **The correction layer is the new object, not the
   melody.**
5. **Both doors are in scope:** the in-browser library (open Ilya, your songs are
   there) and an exportable archive file that survives a browser wipe, a lost
   phone, or a new machine. The archive is separately numbered N.28; you design
   the object, N.28 ships the door.
6. **Ilya transmits nothing.** No cloud integration, no sync service. The user's
   own Files app is their cloud.

---

## 5. WHAT YOU ARE FREE TO OVERRULE

**`claude/e45-n67-storage-architecture_2026-08-13.md` in the project knowledge is
prior art, not doctrine.** It was written by Opus on 13 August. Sections 3 and 5
recommend IndexedDB, a zip-based `.ilya` export on the `.mxl` precedent, plain
IndexedDB or the `idb` wrapper over Dexie, and `navigator.storage.persist()`.
**Two of its factual claims are corrected above: it did not know Ilya already
uses IndexedDB, and its file-size and compression figures are wrong.** Its own
§3.1 admits it read search-result titles only for the wrapper comparison and did
not verify bundle sizes, licences, or maintenance. Treat all of it as a
hypothesis to test.

**No recommendation of mine is in this brief as a recommendation.** Dann has
withdrawn his confidence in my judgement on this question and asked for yours.
Where I have stated a fact, it carries a path or a measurement so you can check
it. Where I could not establish something, it says so.

### 5.1 Dann's first thoughts, offered and not imposed

Dann raised these in conversation and has since asked, in his own words, that
they **not** be carried to you as requirements: *"this was just the first thought
that came into my mind. Making it a requirement is overreaching. If Fable has a
superior solution let's hear it."*

They are recorded because they are the shape of the problem as the person who
uses this app perceives it, which is worth knowing even where the engineering
answer is different. **Overrule any of them freely, and say why.**

- **A song's name generated automatically from its metadata**, something on the
  order of composer plus title plus user, editable by the singer, with a number
  appended when two names collide.
- **A separate invisible identifier running in parallel**, by which Ilya
  recognises whether this particular song has been registered before.
- **A header at the top of a song record carrying its identifying information,
  with pointers into it**, rather than that information repeating per note.

The problem each of these is reaching for is real and is documented in §2: today
the placement map has no record of which score it belongs to, and the note keys
alone cannot supply one. **The requirement is that the singer's work survives and
is findable. How, is yours.**

---

## 6. THE QUESTIONS TO ANSWER

1. **Where does a song live?** Share `ilya-data` and bump its version, or a
   separate database? What object stores, what keys, what indices?
2. **What exactly is a saved song?** Name every field. Mark each one *supplied by
   a human* or *derived*, and justify anything derived that you nonetheless keep.
3. **How does Ilya know it is looking at a song it has seen before?** Whatever
   answers this has to survive a re-export of the same music from Finale, has to
   stop matching when the music genuinely changes, and must not collide across a
   hundred songs. Whether that is a derived identifier, a user-visible name, both,
   or something else entirely is your call. **Note the trap:** anything keyed to
   editable text orphans a song's placements the moment someone corrects a typo
   in the composer's name.
4. **How does what exists today migrate in?** Thirteen live keys, one of which
   already has a v1-to-v2 migration precedent to copy
   (`profileStore.ts:173-205`). Nothing may be lost.
5. **How does it fail?** Quota exceeded, eviction, a corrupt record, a version
   from the future, a half-written transaction. **N.27's silent swallow must not
   be repeated.** What does the singer see?
6. **What is the archive file?** Format, what goes in it, how it is produced on
   iOS and on a desktop, and how it is read back including from a different
   machine and a future version.
7. **What does it weigh?** Bytes added to the bundle, dependencies with licences
   and sizes, and the per-song and hundred-song storage figures against a real
   quota.
8. **When does a save happen?** Continuous, explicit, or both. Unruled, and your
   view is wanted.
9. **What is the build order?** Sequenced so each step is shippable and
   observable on its own, because this project ships and walks every build day.
10. **The preservation question, which Dann named explicitly and which is the
    reason this went to you rather than to a cheaper model.** *How do you defend
    reasonably the idea of preserving song and poem?* Under Canadian law the
    singer's local copy is arguably private study, with Ilya as the photocopier
    under *CCH*. An export file is a poem leaving one device in a portable
    container, which moves the character and effect factors. **And a teacher with
    a studio stockpiling hundreds of texts is a different legal object from a
    singer studying one song.** Dann raised the studio case himself on 13 August
    and it has never been answered. **This is judgement, not mechanics. It is
    what you are for.**

---

## 7. NOT ESTABLISHED

**NOT ESTABLISHED beats a complete invented answer.**

Report anything you could not establish in a section of its own rather than
smoothing over it. These are already open going in:

1. **The shipped JS bundle size.** No build output in the tree.
2. **The real quota on Dann's Mac and iPhone.** `navigator.storage.estimate()`
   has never been called.
3. **How long a re-derivation takes on Dann's machine.** `transcribeMs` is
   already computed in `+page.svelte`'s `runPipeline` and nobody has read it.
   This decides whether derive-on-open is imperceptible or is a design problem.
4. **Whether iOS still mandates WebKit for all browsers in Canada.** Asserted in
   §3.4 from my general knowledge only.
5. **Bundle size, licence, and current maintenance for any storage wrapper.** The
   prior document read search-result titles and said so.
6. **The teacher-with-a-studio copyright case.** Open since 13 August.
7. **Who the beta is for.** Bears on how much the archive door matters at
   launch, and I do not know the answer.

---

## 8. RETURN FORMAT

A single markdown document, written so that Dann can read the reasoning and a
coding session can execute the plan. Please include, in this order:

1. **The decision, in a paragraph a non-programmer can act on.** What a saved
   song is, where it lives, and what the singer sees.
2. **The architecture.** Stores, schemas, keys, identity derivation, versioning.
3. **The migration** off the thirteen keys that exist today.
4. **Failure handling**, item by item, and what the singer is told in each case.
5. **The archive file.**
6. **The weight**, with numbers and licences.
7. **The build order**, each step shippable alone.
8. **The preservation and copyright answer.**
9. **NOT ESTABLISHED**, listing everything you could not settle.
10. **Where you overruled the prior N.67 document or this brief, and why.**

House style, which is Dann's: Canadian spelling, Oxford comma, **no em-dashes**.
Every claim about the code carries a `path:line`. Tell him which terms you coined
and which you adopted.

---

*Prepared 16 August 2026. Facts in §3 were read or measured in the working tree
and in `~/Downloads` this session, at HEAD `fd1f628`. §3.4's iOS claim is flagged
as unverified. §4 transcribes Dann's rulings, several of them via
`claude/e45-n67-storage-architecture_2026-08-13.md`, which was read in full this
session.*
