# Proposal: period and tradition in Ilya's readings (desk, r1, 2026-11-09)

For Dann. Written by the desk (Opus) 2026-11-09 20:1x to 20:4x, from his request at 20:12. After the share; nothing here is built. Sources read this session: Grayson 2012 pp. 172 to 175 (PDF 188 to 191), 240 (PDF 256), 301 to 303 (PDF 317 to 319); Pons 2008 pp. 35, 36, 55 (OCR blocks p1-061, p1-062, p1-081). Code read on `Shane`: `packages/phonology/src/engine.ts:635-650` (the -кий guard), `:307`; `apps/web/src/lib/composers-poets.ts:11-45`; `apps/web/src/lib/components/Drawer/MetadataFields.svelte`; `apps/web/src/lib/i18n.ts:310-325` (NOTATION), `:725-740` (Inspector); `InspectorPanel.svelte:1056-1095` (the reading chooser). Terms: "period-sensitive sound" and "reading witness" are coined here; "Stage pronunciation", "Literary pronunciation", and "Old Muscovite" are Grayson's.

## 1. What the sources say, sound by sound

### Unstressed -кий, -гий, -хий

- **Grayson, pp. 301 to 303.** Three readings, sorted by tradition and by the poem, not by date. Stage pronunciation: the velar stays hard and the vowel is the central [ɨ], so [kɨj]. "Strictly, the [ɨj] pronunciation is more appropriate for Russian lyric diction, but the modern version (/ij/) would not be considered unacceptable." The Literary reading: where the poem rhymes the ending with -ой or -ый, the ending follows the rhyme, and "in the end, the rhyme takes precedence" (p. 302, n. 328 extends it to any letter).
- **Pons, p. 55.** One reading, sorted by date. Before the mid-twentieth century the endings are sung hard with a schwa-type vowel, [kəj]; "this rationale, however, does not apply to works written in the mid- to late 20th century", when the soft [kʲij] became the norm.
- **Ilya today.** The stage reading for every unstressed -кий, -гий, -хий (`engine.ts:635-650`). No rhyme test and no date.

### щ

- **Grayson, pp. 172 to 173.** Sing [ʃʲʃʲ], the Bolshoi's reading. [ʃʲtʃʲ] "might be appropriate" for a Soviet-era opera such as *Lady Macbeth of Mtsensk*, a song on Gogol's text, or to show a class difference in a character. "As a general practice, though, sing [ʃʲʃʲ]."
- **Pons, p. 35.** [ʃʲtʃʲ] until the mid-twentieth century, [ʃʲː] since the mid-1950s; lyric diction follows today's standard, without the stop, in all repertoire.
- **Ilya today.** [ʃʲʃʲ] for all; NOTATION only changes how it is written ([ʃʲʃʲ] or [ʃʲː]), not what is sung.

### жж and зж

- **Grayson, pp. 174 to 175.** Hard [ʒʒ] dominates today; soft [ʒʲʒʲ] "is often perfectly acceptable, even desired, when singing late-romantic Russian works, such as Tchaikovsky's *Eugene Onegin*", and for a nineteenth-century high-society character.
- **Pons, p. 36.** Soft and long is still the reading of "the prestige users of the language, namely classical actors and singers".
- **Ilya today.** зж is [ʒː] (`engine.ts:307`, p. 236). What Ilya does with a written жж: NOT ESTABLISHED (no entry found by grep).

**What this shows.** Only one of the three has a rule a machine can apply without judgement: -кий by date (Pons) and by rhyme (Grayson). щ and жж turn on the work and the character ("might be appropriate", "acceptable, even desired"), which is a coach's call. A design that treats all three alike would overstate the sources.

## 2. Criteria (item 1 of the request)

Precedence, highest first. Each step names its source in the Inspector.

1. **The singer's own choice for this word** (§3, control C), where she has made one.
2. **The rhyme.** An unstressed -кий/-гий/-хий at the end of a line that rhymes with a line ending in -ой takes the rhyme's reading (Grayson p. 302). Ilya has the poem's lines, so this is testable. The rhyme test itself (which line ends pair) is new work and the hardest part.
3. **The date of the work**, for -кий only. A work from 1950 on takes the modern soft reading (Pons p. 55; Grayson allows it, p. 303). The cut-off year is Dann's ruling: Pons says "mid-twentieth century" and "mid- to late 20th century", not a year.
4. **The default**: Grayson's preferred reading, which is today's behaviour (stage [kɨj], [ʃʲʃʲ], and hard жж).

щ and жж are not switched by date. Their alternative is offered as information and as a per-word choice (control C), because Grayson ties them to the work and the character, not to a year. DESK DEFAULT, Dann's to overrule.

Where the date comes from, in order: the year the singer types; else the composer's dates, only where they decide it (died before 1950: an earlier work; born 1950 or later: a later one); else unknown, and the default holds. Prokofiev (1891 to 1953), Gretchaninov (1864 to 1956), and Kabalevsky (1904 to 1987) straddle the line, so their songs need the year.

The composer's date or the poet's? Dann raised the poet's (librettist's) dates, 2026-11-09 20:15. The sources split along the same line as the criteria: Pons's rule is about "works written in the mid- to late 20th century" in an anthology of arias, so the musical work's date; Grayson's rhyme argument is about the poem ("older Russian poetry, such as Pushkin's works", p. 302), so the poet's era. Desk reading: the composition date drives the date criterion, and the poet's era is already carried by the rhyme test, which reads the poem itself. The case that tests it: a twentieth-century setting of Pushkin (a Soviet composer, a nineteenth-century poem with -кий/-ой rhymes). Under this design the rhyme wins there, as Grayson says it should. For Fable to test.

## 3. Controls (item 2)

Ranked, with a recommendation.

- **A. A Year field in PIECE (recommended).** One optional field beside Opus in the metadata the singer already fills (`MetadataFields.svelte`: title, opus, composer, poet, translator). It holds the year of composition. When empty and the composer's dates decide it, the field shows the inferred period in the same faint style as "from score" (`meta.fromScore`), so she sees what Ilya assumed and can correct it. It is a fact about the song, not a style setting, which keeps Dann's 2026-11-01 ruling ("Ilya is going to take a defensible position").
- **B. A NOTATION toggle (not recommended).** NOTATION changes how a sound is written, never what is sung (`cosmetic.*`: [ʌ] or [ə], [ɲ] or [nʲ], [ʃʲʃʲ] or [ʃʲː]). A tradition toggle there would put a pronunciation choice among spelling choices and apply it to every song at once, which is the "option" Dann ruled out.
- **C. A per-word choice in the Inspector (recommended, as a second device).** The Inspector already lets a singer choose between readings of a word: with more than one dictionary entry, each entry is a button that re-runs the pipeline (`InspectorPanel.svelte:1056-1095`, N.14b). The same device, on a period-sensitive sound, offers the other reading with its source. It records a correction for that word in this song, as the Loupe's corrections do. This is where a coach's instruction lands, for щ and жж above all.

## 4. GUIDE and the Inspector (item 1, staging)

- **GUIDE.** One new section, "Readings that depend on the work", in Dann's voice: Ilya's default and why (Grayson's preference); the three things that can change it (the rhyme, the date, her choice), each with its source; the year field; and where to see what Ilya chose. EN then FR, ratified with the Wednesday Guide.
- **Inspector, staged.** The phonological note for a period-sensitive sound has two layers. Always shown: one line naming the reading and its reason. On demand (a disclosure, "Why this reading?"): the alternative, its source, and what would change Ilya's choice. Desk drafts, EN, not ratified:
  - default: "[kɨj]: the stage reading, which Grayson calls the more appropriate one for lyric diction (pp. 301–303)."
  - by date: "[kʲij]: this song is from {year}; for works from the mid-twentieth century on, Pons gives the soft ending (p. 55)."
  - by rhyme: "[kʌj]: this line rhymes with «{word}», and Grayson lets the rhyme decide (p. 302)." (The vowel symbol is NOT ESTABLISHED: the font on p. 302 does not survive extraction; read the page image.)
  - disclosure, -кий: "The ending has three readings in the sources. Ilya sings the stage reading unless the poem rhymes it with -ой or the song is from the mid-twentieth century on. You can choose another reading for this word below."

## 5. Questions for Dann, one at a time, after Fable

1. The cut-off year for -кий (1950 is the desk's placeholder for Pons's "mid-twentieth century").
2. Whether щ and жж join the date switch or stay as information and per-word choice (desk default: the latter).
3. The strings, EN then FR.

## 6. Cost

Fable review of the design: 250k to 350k tokens (the ENVIRONMENT table's nearest rows are a two-lane review at 367k and a three-brief review at 378k; this is one brief with source pages). Code build after that: three steps (year field and inference; rhyme test; Inspector layers and per-word choice), each with its gates.
