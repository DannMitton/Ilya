# The blank states of TEXT, MELODY, and INSIGHTS

Ruled by Dann 2026-11-19, 08:45 to 09:17, on his walk of the three blank pages at
`f7e03836`. His words are in `INBOX.md` under those times. This file is the verbatim
record of what he ratified and of what is still a draft awaiting his ruling.

## 1. The treatment. RATIFIED

- Each blank page carries **one squircle**, **centred vertically** in the space between
  the title rule and the footer rule. Dann 08:49: *"I'm going to opt for a squircle centred
  vertically instead of flush top left. I thin the central placement lets the opening text
  stand out, and it will be replaced by content once the user acts."* (transcribed as written)
- The squircle is the cue that Ilya is speaking. Dann 08:49: *"a bounding squircle is a cue
  that the message is a system message... it really does communicate \"Ilya is speaking\""*
  (transcribed as written).
- **Inside the squircle, ordinary formatting, ranged left.** Dann 08:51: *"Within thw
  squircle there can be normnal formatting so text can we fluch left, that's fine"*
  (transcribed as written).
- **Roman, not italic.** DESK DEFAULT of 08:55, offered to him and not overruled: the
  squircle now carries the "Ilya is speaking" cue, so italic on top of it says the same
  thing twice. His to strike.
- The NOTES heading stays small caps in the page's own accent, as INSIGHTS already draws it
  (`insights.r2.notes`, `i18n.ts:2081`, « Notes » in both languages).
- Every section a singer must visit is a **link**. Dann 08:40: *"I like the hyperlinks that
  save searching and provide one-touch access."* No directional words anywhere.

## 2. The rule that decides what each page asks for. RATIFIED 09:17

**The ask names only what stops the page drawing at all. NOTES says how complete what is
there already is.** Two jobs, never mixed in one sentence.

Applied:

| State | Ask | NOTES |
|---|---|---|
| No voice of any kind, and no score | both asks | none |
| A voice type chosen, nothing sampled | score only | the page draws from generic values |
| Some vowels sampled, fewer than five stable | score only | how many more complete the profile |
| Profile set | score only | the provisional vowels, if any |

So a singer who already has a profile is never sent back to VOICE. The signals all exist:
`isSung` (`MarkupPane.svelte:450`), `isPersonal` (`profile-status.ts:39`), `stableCore` and
`belowCoreText` (`analysis/placeholder-line.ts:53`), `voiceTypeChoice` (passed to both panes
from `+page.svelte`), and the pane's own analysis.

## 3. The English. RATIFIED

**TEXT.** "TEXT transcribes the words you give it, syllable by syllable, into IPA. Add your
score's words as LYRICS, or its source poem as POEM, in INPUT to begin."

**MELODY.** "MELODY marks your own resonances as it draws your score."

**INSIGHTS.** "INSIGHTS looks at how your voice meets your score, and comments on what it
finds."

**The ask, three forms, on MELODY and INSIGHTS both** (Dann 09:13, *"Same with Insights"*).
The voice comes before the score, which is the order a singer does them in (his draft of
09:16, adopted):

- Score missing, voice ready: "Add a score in INPUT to begin."
- Voice missing, score ready: "Set up your voice in VOICE to begin."
- Both missing: "Set up your voice in VOICE, and add a score in INPUT, to begin."

TEXT keeps one ask, because TEXT needs words and nothing else.

**NOTES, MELODY.** "Your profile is set, with ten vowels measured. Your [e] close-e, [a]
bright-a, and [ɨ] velar-i are provisional; set them in VOICE."

**NOTES, INSIGHTS.** "Method: from your resonance profile, measured in VOICE."

## 4. The French

### RATIFIED 09:17

« Établissez votre voix dans VOIX et ajoutez une partition dans ENTRÉE pour commencer. »

« Ajoutez une partition dans ENTRÉE pour commencer. » (the existing string
`insights.silence.noScore`, `i18n.ts:1902`, less « le volet »)

Dann rejected his own earlier draft « Faites vos échantillons et ajoutez une partition dans
ENTRÉE pour commencer. » on the desk's three objections: it names no section, so there is
nothing to tap; it turns a verb the file owns (« échantillonner », `i18n.ts:1443`) into
« faire » plus a noun; and it leaves out the voice-type path, which is built.

### RATIFIED 09:25

Dann 09:25, transcribed as written: *"I ratify all five blurbs you offered. Thank you!"*
The three choices the desk flagged as its own are ratified with them: « le texte chanté »,
« la rencontre de », and the coined « réglez-les ».

- **TEXTE:** « Le TEXTE transcrit en API, syllabe par syllabe, les mots que vous lui donnez.
  Ajoutez le texte chanté de votre partition comme PAROLES, ou son poème source comme POÈME,
  dans ENTRÉE pour commencer. » Open: « le texte chanté », chosen because the literal
  « les paroles » collides with the field name PAROLES in the same clause.
- **CHANT:** « Le CHANT trace votre partition en y marquant vos propres résonances. »
- **APERÇUS:** « Les APERÇUS observent la rencontre de votre voix et de votre partition, et
  commentent ce qu'ils y trouvent. » The desk chose the noun « la rencontre de » over the
  literal « comment votre voix rencontre votre partition ».
- **The voice-only ask:** « Établissez votre voix dans VOIX pour commencer. »
- **NOTES, CHANT:** « Votre profil est maintenant établi, avec {count} voyelles mesurées.
  Vos voyelles {vowels} sont provisoires; réglez-les dans VOIX. » The first sentence is his
  already, verbatim (`i18n.ts:1502`). Coined by the desk and ratified: « réglez-les ». The
  file's existing verb is « modifier ces valeurs » (`:1504`), which belonged to the retired
  "update these values" wording; « définissez-les » is the other candidate.
- **NOTES, APERÇUS:** « Méthode : à partir de votre profil de résonances, mesuré dans VOIX. »
  Exists verbatim (`i18n.ts:1904`), no-break space before the colon. No new French.

Glossary sources, all from the tree at `f7e03836`: TEXTE `i18n.ts:210`, CHANT `:228`,
APERÇUS `:232`, POÈME `:884`, PAROLES `:885`, ENTRÉE `:168`, VOIX `:1904`, API `:1059`,
« pour commencer » `:1423` and five others, « résonances » `:1431`, the article with a page
name after « Le CHANT » `:1498`, the plural article and plural verb for « Les APERÇUS »
`:1902` and `:2241`.

## 5. Still open, and not this batch's to settle

The verb for the act of giving Ilya a voice. VOICE says "recorded" (`i18n.ts:1435-1440`),
MELODY says "measured" (`:1502`), and `profile.emptyState` says "record your vowels"
(`:1514`). Three words for one act, in both languages. Already in the walk's text batch.
When Dann rules it, "Set up your voice in VOICE" and « Établissez votre voix dans VOIX »
change with it.

## 6. What the repair retires

- `paper.empty` (`i18n.ts:1014`) and `paper.empty.mobile` (`:1032`), TEXT's blank state
  split by device, the phone form reading "Tap DRAWER at the bottom of the screen to open
  the DRAWER". The new blurb retires both strings and the device split with them.
- The directional tails of `profile.provisional.noneMessage` (`:1499`),
  `profile.provisional.sentenceSingular` (`:1503`), and `sentencePlural` (`:1504`).
- `insights.silence.noScore` (`:1902`) is reworded, not retired.

---

## Corrections of 2026-11-20, by the Opus desk

This file is the verbatim record of what Dann ratified on 2026-11-19, so nothing above is rewritten. These corrections sit beside it and win where they differ.

### 1. Section 2's rule was reworded by Dann on 2026-11-19 at 09:35, and this file never caught up

Section 2 above opens "The ask names only what stops the page drawing at all", with its table built on that. **Dann reworded it the same morning, after Fable's review of the lane 71 brief r1 exposed the hole:** *the ask names what is missing for the page to do what its own first sentence promises; NOTES says how complete what is already there is.* The earlier wording was the desk's and is struck. Why it matters: MELODY draws a score with no voice at all, so the struck wording would have left a voiceless MELODY asking for nothing, and Dann 09:35: *"that is no MELODY's target function"*. Marking is what MELODY is for, so a voiceless MELODY asks for the voice even though pixels would appear. The reworded rule reaches this file only now; it had lived in `brief-code-lane71-blank-states_r2_2026-11-19.md` and in `docs/memory/STATE-archive.md`. Found by Fable's review of the lane 78 brief, 2026-11-20 (`review-fable-two-briefs_r1_2026-11-20.md`, blocker 78-B1), which also found that the delta review's edit 12 had asked for this correction on 2026-11-19 and it was never made.

### 2. RATIFIED 2026-11-20 17:17: the one-provisional-vowel sentence

Section 3 above gives NOTES on MELODY for several provisional vowels and nothing for exactly one. Dann ratified the singular, English and French together, 2026-11-20 17:17 (*"Yes I ratify both"*, transcribed as written):

- **English:** "Your {vowels} is provisional; set it in VOICE."
- **French:** « Votre voyelle {vowels} est provisoire; réglez-la dans VOIX. »

Nothing coined. Both are the singular inflection of his plural of 2026-11-19 09:25, whose « réglez-les » was the desk's coinage and his ratification. Agreement checked against its referent: « réglez-la » agrees with « voyelle », feminine singular, the noun the French sentence names. No space before the semicolon, matching the plural and OQLF.

### 3. This file's line numbers into `i18n.ts` are stale

The tree has moved since 2026-11-19. Read by the desk on `47bd5c5c`, 2026-11-20, and confirmed by Fable: this file's `:1499` is now `:1501`, `:1502` is `:1504`, `:1503` is `:1505`, `:1504` is `:1506`, `:1514` is `:1516`, `:1902` is `:1904`, `:1904` is `:1906`, and `:2081` is `:2086`. **Cite the keys, not the numbers**: `profile.provisional.noneMessage`, `profile.statusSetMeasuredPlural`, `profile.provisional.sentenceSingular`, `profile.provisional.sentencePlural`, `profile.emptyState`, `insights.silence.noScore`, `insights.method.noScore.samples`, `insights.r2.notes`. Where this file and the tree differ on a live string's wording, the tree wins.

