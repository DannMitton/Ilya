# Citation audit memo — blurb-composer.json vs Grayson (2012)

Audited all 209 entries (85 distinct template/citation pairs) in `data/blurb-composer.json` against the PDF at `/mnt/user-data/uploads/Downloads/Grayson - 2012 - Russian Lyric Diction.pdf`, branch `audit`, read-only. Full table: `citations.csv`. Method: page-offset text extraction for English prose, page-image rendering (confirmed by Read) wherever a claim turned on a specific IPA symbol or Cyrillic letter, plus a full-document text search for two claims I could not locate nearby.

## Counts (by entry, weighting each group by how many entries share it)

- WRONG-PAGE: 115 entries (32 groups) — Grayson supports the claim, but on a different page.
- SUPPORTED: 44 entries (19 groups) — citation checks out.
- PARTLY: 28 entries (9 groups) — some of the cited range is right, some isn't.
- ALREADY-FIXED: 13 entries (9 groups) — your coordinator's earlier pass (и, у/ю, ц, ш, ж); not re-audited, listed for completeness.
- CONTENT-DISAGREES: 5 entries (1 group) — Grayson says something different from the template.
- NOT-FOUND: 4 entries (3 groups) — no supporting passage found anywhere in the 459-page book.

## The one pattern behind most of the WRONG-PAGE rows

The consonant "Cognates/Greeks/False Friends" identity tables (Chapter 4) and the vowel tables (Chapter 3) each introduce several letters in a row, one per page. It looks like whoever cited these took the page number of the *first* letter in a batch and stamped it onto all the others in that batch, rather than each letter's own page. Examples, confirmed by direct read (two by page image):

- Cited **p. 140** for б, з, к, м, т: only к is actually on p.140. б is p.144 (confirmed by image), з is p.143, м is p.141, т is p.142.
- Cited **p. 145** for г, д, л, п, ф, х: only г is on p.145. д is p.146, л is p.150, п is p.147, ф is p.148, х is p.149.
- Cited **p. 152** for в, н, с: only в is on p.152-153. н is p.154, с is p.159.
- The "hard"/"soft" palatalization *processes* for all of these consonants are also cited to their (wrong) identity pages, when the actual governing rule is stated once, generally, on **p.169**: "The Cyrillic letters for the consonants are generally read in hard form when standing alone... They are usually read in palatalized form only when followed by an indicator letter... the soft sign... or another palatalized consonant."
- Same story for а/я (cited p.85, actually p.81) and э/е (cited p.106, actually p.87, which is a different, earlier section than the p.106-107 material that *is* correctly about э/е's [e]-allophone).

Once this is understood, most WRONG-PAGE rows are mechanical corrections, not content problems. Full per-letter corrections are in `citations.csv`.

## CONTENT-DISAGREES

**processes:post-stress-immediate:а** (and grouped with о, я, е, э under the same template/citation, pp. 108–112). Template: "When а falls after the stressed syllable... it always reduces to [ipa]." Grayson's text directly contradicts this for а: "**Reminder: The letter -а- in the immediate post-stressed syllable, remains sung as /a/**, even though in spoken Russian, the pronunciation would be /U/ or /ə/" (p.111). In singing, а does not reduce immediately after the stress; it stays /a/. This is a real content problem, not just a citation problem, for at least the а entry. I have not proposed new wording; this needs your call, and likely a similar check for о.

## NOT-FOUND

**processes/implications:genitive:г** (pp. 89, 101 — no, cited p. 232), "In the genitive endings -ого and -его, г is traditionally pronounced [v]" and "[v] sounds like /v/; this is a Russian spelling convention, not a phonological rule." Page 232 (checked by image) is about the doubled -нн-/-сс- consonant clusters, unrelated. I searched the full 459-page text layer for "genitive," "ogo," and "spelling convention" and found no passage anywhere in the book discussing this rule (which is a real, well-known fact about Russian, but I could not find it in Grayson).

**processes:silent:з, с** (pp. 242–246), "In the cluster ⟨cluster⟩, the letter з/с is silent." I rendered and read p.243: the section is explicitly titled "Three- and Four-Letter Clusters **not Reading Internal -Т- or -Д-**." That whole section (pp.242–246) only documents т, д, л (солнце, p.246), and в (чувство, здравствуйте, p.246) as silent cluster members. No з- or с-silencing rule appears anywhere in it, or elsewhere via full-text search. This looks like a data-entry mismatch (these two process keys may have been meant to point at material that doesn't exist, or were meant to be additional т/д examples).

## WRONG-PAGE rows with proposed corrections

(Full list of 32 groups / 115 entries is in `citations.csv`; the highlights beyond the batch-pattern above:)

- **identities:а,я** "usually sounds like /ɑ/" — cited p.85 → correct **p.81** ("Sound Cyrillic /ɑ/ а... in the stressed position... я when preceded by a palatalized consonant...").
- **identities:о** "usually sounds like /o/" — cited p.86 → correct **pp.84–85** ("Sound Cyrillic /o/ о generally..."; "must be read as /o/, when in the stressed syllable").
- **identities:ё** "always sounds like /o/... never unstressed" — cited p.86 → correct **p.85** ("This spelling can only occur in the stressed syllable...").
- **identities:ы** "always sounds like /ɨ/, regardless of stress" — cited pp.89–90 (that's actually the и/i entry) → correct **pp.93–94, 102**.
- **processes:after-hard:и,е** "shifts to [ipa] after an always-hard consonant" — cited pp.89–90 → correct **p.102** ("When the Cyrillic letter -и- is preceded by one of the consonants -ж-,-ш-,-ц-... it is read as [ɨ]...").
- **щ style entries** (Old Muscovite / Peterburgian) — cited p.181 → correct **pp.172–173**. Substance checks out once relocated: the affricate [ʃʲtʃʲ] is the older, St. Petersburg-associated pronunciation; the long fricative [ʃʲː] is the Moscow-derived one Grayson recommends ("sing /ʃʲː/").
- **implications:soft:н** (palatal nasal, "ogni"/"agneau") — cited p.183 → correct **p.186**. Substance is right; Grayson's own examples are Italian *sdegno* and French *ligne*, not *ogni*/*agneau*.
- **implications:hard:л** (velarized dark-l) and **identities:л** — cited p.145 → correct **p.150**.
- **processes:silent:л** (солнце) — cited p.244 → correct **p.246**.
- **processes:silent:в** (чувство, здравствуйте) — cited pp.244–245 → correct **p.246**.
- **processes:bog-exception:г** ("бог exceptionally [x]") — cited p.233 → correct **p.144**, confirmed by page image: "бог /bɔx/ God" is listed as an example word under the б entry, not discussed on p.233 (which is the -нн-/-сс- section).
- **final-devoicing / regressive-devoicing / regressive-voicing (б,в,г,д,ж,з and п,ф,к,т,ш,с)** — all cited **pp.226–229**, which (confirmed by page image) is actually the "Double Consonants" section (-жж-, -лл-, -тт-, etc.), an unrelated topic. Correct locations: final-devoicing → **pp.199–202** ("Section 4 – Final Consonants"); regressive-devoicing → **pp.215–219**; regressive-voicing (к→g etc.) → **pp.219–224**. I could not pin the exact page for the "normally devoices but a following voiced consonant re-voices it" sub-claim in the time available; it's somewhere in that pp.215–224 span or the word-boundary assimilation section just after it.
- **j-glide "begins a word" / "follows a vowel" / "follows a sign"** (я,е,ё,ю) — cited pp.114–116 → я and е are covered, but ё's and ю's specific cluster entries are on **pp.118–119**, outside the cited range. Correct range: **pp.114–119** (signs: 193, 195, already right).

## What I could not establish

- The precise page for the б/в/г/д/ж/з "normally devoices, then a following voiced consonant re-voices it" mechanic (6 entries, "processes:regressive-voicing:б,в,г,д,ж,з" and its matching implication). I've confirmed the cited pp.226–229 is wrong (Double Consonants section) and that the general mechanism lives somewhere in pp.215–224 or the word-boundary assimilation material just after, but ran out of time to pin the exact page before reporting.
- **processes:pretonic:я,е,э begins-unstressed** (ikanye, word-initial): I confirmed the general rule (p.127) but did not find a specific Grayson example illustrating a word-initial unstressed я/е/э reducing, the way p.98 gives explicit initial-position examples for the akanye (а/о) case. Not a contradiction, just unconfirmed by example within the time available.
- I did not independently re-verify the already-fixed и, у/ю, ц, ш, ж entries; I've taken the coordinator's 2026-09-26 verification as given, per your instructions, though my own page-97/89/91 reads are consistent with those pages being correct.
- Given the volume (209 entries), most IPA-symbol-specific claims were checked against the English prose describing them (e.g., "the tongue rises toward the hard palate") rather than by rendering every single page to an image; I rendered images and read them directly wherever a claim turned on distinguishing similar-looking garbled symbols (the б/бог page, the т/д cluster page) or where the text-layer garbling made the English-prose route unreliable. A second pass focused purely on image-confirming the `{ipa}` placeholder values themselves (rather than the surrounding claim) would be a reasonable next step if you want that level of certainty.
