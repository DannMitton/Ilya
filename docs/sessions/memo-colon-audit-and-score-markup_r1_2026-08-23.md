# MEMO. The colon audit, and the Score markup rename

Built against floor `cc3b912`. Brief:
`docs/sessions/brief-colon-audit-and-score-markup_r1_2026-08-23.md`.

Done. 229 sites changed across three files, plus one string renamed and three
test expectations updated. Ilya's French now follows Canada on the colon, the
exclamation mark, and the semicolon.

**One thing you did not ask for and I had to do anyway.**
`apps/web/src/lib/shane/analyze-score-adapter.test.ts` hard-codes the French of
`fit.broad.body` in three assertions, with an ASCII space before its colon.
Changing the string broke gate 4. I updated the three expectations to the hard
space. The alternative was to leave `fit.broad.body` unruled, which the brief
does not allow.

## Part A. The rename

`apps/web/src/lib/i18n.ts:41`. `en` now reads `Score markup`. `fr` is
byte-identical: I diffed the `fr:` half of the line against `cc3b912` and it
matches. The key stays `tab.markedScore`. The browser shows `Score markup` and
`Partition annotée` on the two tabs.

I left the six code comments that say "Marked score". They are not the singer's,
and the brief allowed either.

## Step 1. The spelling census, before a byte changed

Counts are total occurrences of each spelling anywhere in the file, not just
before a mark.

| file | U+00A0 | U+202F | `&#160;` | `&nbsp;` | `&#8239;` | mark at line start |
|---|---|---|---|---|---|---|
| `LearnContent.svelte` | 106 | 0 | 289 | 31 | 29 | 2 (both `:`) |
| `GuideContent.svelte` | 23 | 1 | 0 | 2 | 0 | 0 |
| `i18n.ts` | 2 literal | 0 | 0 | 0 | 0 | 0 |

`i18n.ts` writes its hard spaces as the TypeScript escape `\u00a0`, not as a
literal character. The census above counts literals, which is why it shows 2.
Counting escapes instead, `i18n.ts` carries 25 `\u00a0` before a colon.

**All five spellings the brief warned about are present in the tree**, and the
line-start case is real: `LearnContent.svelte:1704` and `:1711` put the colon
at the head of its own source line, where the newline and its tabs collapse to
one ordinary space at render.

`GuideContent.svelte`'s single U+202F is at `:253`, inside `11 920 lignes`. It
is a thousands separator, not a mark space. Left alone.

**Spelling written per file**, each the one that file already uses most:
`&#160;` in `LearnContent.svelte`, literal U+00A0 in `GuideContent.svelte`,
`\u00a0` in `i18n.ts`.

## Step 2. The site census, French blocks only

Block boundaries on `cc3b912`: `LearnContent` French is lines 16 to 2065 and
English 2067 to 4070; `GuideContent` French is 16 to 288 and English 290 to 563.
Sites are counted after excluding HTML tags and their attributes, `<code>`
content, Svelte `{…}` expressions, HTML entities and their terminating
semicolon, bare URLs, and `digit:digit`.

### `LearnContent.svelte`, French

| mark | before | after |
|---|---|---|
| `:` | 151 `&#160;`, 89 ASCII, 3 U+00A0, 2 line-start, 1 bare | 242 `&#160;`, 3 U+00A0, 1 bare |
| `!` | 1 `&nbsp;`, 1 ASCII | 2 bare |
| `;` | 29 `&#8239;`, 25 ASCII, 13 U+00A0, 12 `&#160;`, 6 bare | 85 bare |
| `?` | 24 bare | 24 bare, untouched |

**172 edits**: 89 ASCII colons and 2 line-start colons became `&#160;`, and 79
semicolons and 2 exclamation marks lost their space.

### `GuideContent.svelte`, French

| mark | before | after |
|---|---|---|
| `:` | 27 ASCII, 9 U+00A0, 2 bare | 36 U+00A0, 2 bare |
| `;` | 22 ASCII, 4 U+00A0 | 26 bare |
| `?` | 9 bare | 9 bare, untouched |
| `!` | none | none |

**53 edits**: 27 ASCII colons became U+00A0, and 26 semicolons lost their space.

The brief's desk survey said `GuideContent` carried no hard-space colons. It
carries 9. Mine governs, as the brief said it would.

### `i18n.ts`, `fr` values only

37 colons, 6 semicolons, 12 question marks. Nine of the colons and five of the
semicolons are inside the credits string at `:214`, in `https://` URLs and in
the Canadian flag's inline `style=` attribute. Both are excluded, and I read all
fourteen to confirm it rather than trusting the pattern.

**4 edits**: `:142`, `:227`, and `:636` had ASCII-space colons and now carry
`\u00a0`; `:378` had `\u00a0;` and now has a bare `;`.

### Total

**229 edits**, counted as 172 + 53 + 4: 121 colons gained or upgraded a hard
space, and 106 semicolons and 2 exclamation marks lost one. By file, colons are
91 + 27 + 3 and semicolons are 79 + 26 + 1.

## The three colons I did not touch

Every bare colon in a French block is inside an English book title:

- `LearnContent.svelte:30`, `<em>Russian Lyric Diction: A practical guide…</em>`
- `GuideContent.svelte:201`, `<em>Russian Lyric Diction: A Practical Guide</em>`
- `GuideContent.svelte:221`,
  `<em>Sung Russian for the Low Male Voice Classical Singer: The Latent
  Pedagogical Value…</em>`

The brief says a bare French colon gets a space. **No site qualifies.** All
three colons are English, quoted inside a French sentence, and an English title
keeps English punctuation. If you want them spaced anyway, say so and it is
three edits.

I also found one whole English paragraph inside the French block:
`LearnContent.svelte:1075` is a verbatim Grayson quotation in guillemets, with
its French translation in the next paragraph. Its semicolon is already bare, so
no rule reached it. I checked for others by scoring every line in both French
blocks for English function words against French ones; that paragraph is the
only hit.

## English typos found

**None.** I searched every English block and every `en:` value in `i18n.ts` for
a space of any spelling before `:`, `!`, `;`, or `?`. Zero hits in all three
files. Nothing to list.

I also proved the English blocks are untouched by this build: `LearnContent`'s
English block is byte-identical at 165,943 bytes and `GuideContent`'s at 38,253,
and the head and tail outside both blocks are identical in each file.

## The `?` mark, which ship 5 already did

`LearnContent` French carries 24, `GuideContent` French 9, `i18n.ts` 12. All 45
are bare. **Ship 5 missed none.** Nothing to report and nothing changed.

## Step 3. What the browser showed

`vite dev` at 360 × 800, French, console clean.

I measured wrapping directly rather than by eye. For every `:`, `;`, and `!` in
a text node, I took the client rect of the mark and of the character before it;
a wrap puts them on different lines. **Zero separations on either page.**

Rendered character before each mark, read by code point:

| page | result |
|---|---|
| Leçons, French | 245 `:` after U+00A0, 1 `:` bare, 85 `;` bare, 2 `!` bare |
| Guide, French | 36 `:` after U+00A0, 2 `:` bare, 26 `;` bare, 12 `?` bare |
| Leçons, English | 235 `:`, 81 `;`, 2 `!`, 24 `?`, all bare |
| Guide, English | 32 `:`, 21 `;`, 13 `?`, all bare |

Every bare French colon is one of the three English titles. The rendered counts
match the source census site for site, which is the check that the entities
resolve to the character I intended and not to a literal `&#160;` on the page.

Spot checks, five colons and five semicolons on the French Leçons page, read out
of the rendered text: `au premier abord : nombre`, `un registre élevé : plus`,
`du russe : comment`, `une synthèse : un guide`, `Ce que Grayson apporte`;
`d'utilisation d'Ilya; l'onglet`, `partitions anciennes; ceux-ci`,
`au B latin; se prononce`, `au H latin; se prononce`, `au P latin; se prononce`.
Both exclamation marks: `apprendre l'alphabet! »` and `(pizza!)`.

The English tab reads `Score markup`; the French reads `Partition annotée`.

## The five gates

Run on this machine on 2026-08-23, after every edit in this memo.

| gate | baseline | this build |
|---|---|---|
| phonology | 216 | 216 passed |
| dictionary | 235 | 235 passed |
| web-check | 0 errors, 7 warnings, 4 files | 0 errors, 7 warnings, 4 files |
| web-test | 705 | 705 passed |
| score-parser | 444 passed, 5 skipped | 444 passed, 5 skipped |

All five at baseline. No baseline moves and nothing for you to `sed`.

Gate 4 failed at first with 3 failures, all in
`analyze-score-adapter.test.ts > composeBroadNote (§B.5 print legend)`, all from
the `fit.broad.body` string. The three expectations now carry the hard space and
the gate is back at 705.

## The bundle byte count

Clean rebuilds both times, `rm -rf apps/web/build apps/web/.svelte-kit/output`
before each, so no stale chunk is counted. The before figure was measured from
a `git stash` of this work, not from memory.

| measure | before | after | delta |
|---|---|---|---|
| all client JS under `build/_app` | 1,768,778 | 1,768,886 | +108 |
| whole `build/` tree | 203,306,388 | 203,306,496 | +108 |

The rise is small because the two large changes nearly cancel: 121 colons gained
a multi-byte space and 108 marks lost one.

## What I could not establish

- **Whether the three English book titles should keep their bare colons.** I
  ruled it myself, on the ground that an English title inside a French sentence
  is English. The brief's rule as written would space them. This is the one
  place where I read past the letter of the brief, and it is three edits to
  reverse.
- **Whether 360 px is the width that matters.** I measured at 360 × 800 because
  the brief named it. `ENVIRONMENT.md` records that `innerWidth` is 0 in the
  browser pane and trips Ilya's own mobile gate; that did not happen here, the
  pane reported 360 and the layout rendered, but I did not confirm on a phone.
  **No iOS Safari observation exists for this build.**
- **Whether the mask over-excluded anywhere.** The exclusion is mechanical: HTML
  tags, `<code>` content, `{…}`, entities, URLs, and `digit:digit`. If a French
  colon lives inside a construct I excluded, I never saw it and never counted
  it. The rendered-page counts match the source counts exactly, which proves the
  mask is self-consistent, not that it is complete.
- **Whether `&#8239;` was ever intentional.** `LearnContent` used the narrow
  no-break space before 29 semicolons and nowhere else that a mark follows. All
  29 are now gone, because the rule deletes the space rather than respelling it.
  Whoever wrote them may have meant something by the narrow width, and I did not
  find a record of it.
- **Whether any other file carries French prose with these marks.** I audited
  the three the brief named. I did not sweep the tree for a fourth.
