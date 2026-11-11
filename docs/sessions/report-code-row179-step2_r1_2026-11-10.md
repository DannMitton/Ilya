# Report, row 179, step 2: the personal glossary (cloud-lane-44, 2026-11-10)

Brief: `brief-code-gloss-language-and-reuse_r3_2026-11-03.md`, step 2. Base: `7be21a1` on `cloud-lane-44`.

## What changed

- **New `apps/web/src/lib/text/glossary.ts`** (pure) **and `glossary.svelte.ts`** (the reactive store, `GlossaryStore`). Stored in `localStorage` under `ilya.glossary.v1`, on `voice/profileStore.ts`'s pattern: a versioned key, `writeGlossary` returns an `Outcome` (`no-storage`, `quota-exceeded`, `write-failed`) and never throws, and an unreadable or refused store is an empty glossary. It is not in the song record, the page's fields, or a binder (a test checks the record carries none of its text), and the two modules name no network call (a source test, on the pattern of `poem-library-privacy.test.ts`).
- **Keyed by (lemma, language)**, the word form (`glossAnchorForm`) standing in where the dictionary found no lemma. DESK DEFAULT, per the brief: one glossary per device, not per named voice.
- **A change is committed to memory only after the device kept it.** Where storage refuses, `set` returns the reason and makes no entry, so the offer in step 3 stays open when the tap fails.
- **`glossFor` now has its glossary.** The page passes a `GlossaryStore`, and `shownGlosses` holds `{ text, source: 'glossary' }` for a word the dictionary leaves empty, the song has no edit on, and the glossary knows. It reaches `WordStack` and the Inspector as its own value, never through an edit, so `hasOverrides` (`gloss?.source === 'song'`) stays false and Reset does not appear for a word she did not edit.
- **Blanking a field the glossary fills writes her "no gloss here"** (`glossToWrite`, `gloss-edit.ts`): an explicit empty edit in the song. Blanking a field the dictionary fills, or one nothing fills, still reverts. Typing the dictionary's own gloss still reverts. An edit equal to the glossary's text stays an edit of the song, so step 3's **Stop using** can leave the song alone. The Inspector got one new prop, `glossaryText`, and its handler shrank (`InspectorPanel.svelte` is at 2429, ceiling 2432).
- **Reset** on an explicit empty edit over a fill removes the edit (`hasOverrides` is true for `''`) and the fill shows again (tested).

## A finding the brief did not have, and what I did with it

**The shipped dictionary gives every personal pronoun the lemma `я`.** I read `dictionary.86d83340-a.json` and `-b` (943,106 entries): `ты`, `он`, `она`, `мы`, `вы`, `они`, `меня`, `тебя`, `нас`, `вас`, `его`, `ей`, `им`, and the rest of the table all have `l: "я"` (81 pronoun entries). A French "vous" typed for `вас` and keyed by lemma would have filled `я`, `ты`, `он`, and every other pronoun form with "vous". That is the walk's own example word.

Adaptation, one constant and no widening: a word whose lemma is `я` is keyed by its own form (`glossaryKey`, `glossary.ts`). DESK DEFAULT. The cost is that a pronoun's gloss does not travel to its other cases (typed for `вас`, it does not appear on `вам`). A test pins it. The desk may prefer a different rule (for example, every `pron` by form); that is a taste call and is cheap to change in one function.

## Amendment 12: how a lemma-keyed fill reads on an inflected form the singer did not write it for

Measured on the dictionary, not on a page. Among 903,897 Cyrillic headwords, 860,938 carry a lemma that differs from the headword, none with a stress mark, and the samples read soundly (`лесоводе` gives `лесовод`, `клубах` gives `клуб`, `дому` and `дома` give `дом`). So a gloss typed for `дому` ("to the house", or "house") fills `дом`, `дома`, and `домах` where the dictionary's own is empty. It reads as the lemma's meaning, not the case: a gloss typed for a dative reads on the nominative. That is what the brief asks, and it is also the thing a singer may not expect; the French "à la maison" typed for `дому` would show on `дом`. The brief's step 3 does not change a word's offer by case. 3,737 lemmas carry a capital letter (names); the key folds case, so `Швеция` and `швеция` meet.

## Tests

New `glossary.test.ts` (18 tests): keyed by lemma and language, an entry reads on other forms in its language only; form key where there is no lemma, folding case and ё; pronouns keyed by form; versioned key and read back; empty on refused or damaged storage; the three refusal reasons; no entry for a write the device refused; remove and the empty gloss; the fill is its own source and never an edit; it never replaces a dictionary gloss and does not show in the other language; the song's edit, including `''`, sets it aside; Reset on an empty edit over a fill shows the fill again; no Reset for a fill; `glossToWrite`'s five cases; the glossary is not in the record; no network call.

Walk items covered here: 5 (blanking; the later-song fill), 7 (no offer yet, but a correction stays in its song), 6 (a fill is per language), 8 (Reset).

## Gates



All eight gates pass after this step (`test:phonology`, `test:dictionary`, `@ilya/web check`, `@ilya/web test`, `@ilya/score-parser test`, `test:blurb`, `test:integration`, `ratchets`). No ceiling raised; `+page.svelte` stays at 5526 and `InspectorPanel.svelte` at 2429.

## What I could not establish

- Whether `pos === 'pron'` should be the rule rather than lemma `я`. I measured the lemma `я` group only; the other pronoun lemmas I looked at (`мой`, `твой`, `свой`, `сей`, `который`) group their own forms soundly.
- How the glossary behaves with two tabs open. `localStorage` writes win last; I added no `storage` event listener, so a second tab sees the change on reload. The brief names no rule.
- The French short gloss for each pronoun the dictionary leaves empty. I did not run the pipeline on a page; I know only that `formatGlossForDisplay` blanks a French gloss when none exists (`gloss.ts:105`, `:111`).
