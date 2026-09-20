# BRIEF. N.149 completion and N.150: Corrections leaves the drawer, and the band becomes Voice

Written by the desk 2026-09-20. Shape from `BRIEF-TEMPLATE.md`.
**Both in one pass, which is what N.150 always said: "once Corrections leaves, Voice
is all that is in it."**

## 1. What was observed

**Dann, 2026-09-20 12:07, verbatim:** *"Yes, it was always the plan to migrate
Corrections from the Drawer to the Loup surface. Remove it"*

**What prompted it:** after `38dac87` shipped, a desk singer has TWO Corrections
surfaces, the drawer's and the loupe's, both driving one undo stack. **N.149's
ruling of 2026-09-17 was that Corrections MOVES into the loupe. What shipped was a
copy.**

## 2. What is established, each line read this session

- `apps/web/src/routes/+page.svelte:134` imports `CorrectionSurface`; it is mounted
  **twice**, at `:4630` (the drawer, `variant="panel"`) and `:4996` (the loupe).
- `:4594` `{#snippet scoreGroup()}` is the Score markup band's body. It holds the
  Corrections station (`:4622` to about `:4688`) and then the Voice station
  (`:4689` onward).
- `:4622-4627` the station's `StationHeader` takes
  `label={t('loupe.station.corrections', language)}` and toggles
  `STATION_IDS.corrections`.
- `:4673-4685` **the `correctedCount` sentence renders INSIDE this station's body**,
  with a comment recording N.108 increment 1a, ruled by Dann 2026-09-02, that it
  belongs there rather than in the notices block, because a sentence about
  corrections should not sit three stations from the surface that made them.
- `lib/components/Drawer/sections.svelte.ts:75` `corrections: 'corrections'` in
  `STATION_IDS`.
- **`+page.svelte:4576` and `:4704` record the precedent:** when a station goes, its
  id leaves `STATION_IDS` with it, because a station that cannot be opened has no
  state to store.
- **`loupe.station.corrections` KEEPS TWO OTHER USERS** and must not be deleted:
  `CorrectionSurface.svelte:456` (its own header) and `Loupe.svelte:2193` (the
  pill's Corrections label). `i18n.ts:518` defines it.
- `Drawer.svelte:549-550` the band's comment still reads "SCORE MARKUP. Lavender,
  one step down. Corrections and Voice."

## 3. Measure before you change anything, and report before writing code

1. **Every handler the drawer mount passes that the loupe mount does not.** List
   them. `ondismiss`, `onwalk`, `shiftDisabled`, `onshift` and `open={loupeOpen}`
   look drawer-specific from the markup. **Report which become unused, and do not
   delete a handler that still has another caller.**
2. **What `dockShiftDisabled` and `handleDockShift` serve once the drawer mount is
   gone.** Report their remaining callers.
3. **Whether `sections` migration needs a step** when `corrections` leaves
   `STATION_IDS`. `sections.test.ts` asserts on `BAND_IDS` and on
   `migrateOpenStations`; report what it expects today.

**The cause of anything you find is yours to state. This brief supplies none.**

## 4. The rulings this serves

- **Dann, 2026-09-17:** Corrections moves into the loupe. **Dann, 2026-09-20,
  quoted in full above, confirming it was always the plan.** These are the ruling.
- **Dann, 2026-09-02, N.108 increment 1a:** the corrected-count sentence belongs
  with the surface that made the corrections. **That reasoning now carries it into
  the loupe rather than deleting it.** See section 5.

## 5. Constraints

- **Remove the drawer's mount only.** The loupe's mount at `:4996` does not change,
  and `CorrectionSurface.svelte` itself does not change.
- **DO NOT DELETE `loupe.station.corrections`.** Two other users remain.
- **No new strings and no French.**
- **RENAME THE VALUE, NEVER THE KEY.** `group.scoreMarkup` stays as a key.
  `sections.test.ts:67` asserts `Object.values(BAND_IDS)` equals
  `['piece','input','scoreMarkup']`, and `sections.svelte.ts:104` defines it, so
  renaming the key breaks a gate for nothing. **Only the English and French values
  change.**
- **No agent commits and no agent stages.**

## 5d. N.150. THE BAND BECOMES VOICE. Ruled by Dann 2026-09-20 12:08

**His words, verbatim:** *"the current Score Markup Section in the Drawer becomes
Voice."* Numbered N.150 on 2026-09-17, DESK DEFAULT number, and recorded in
`OPEN.md` since.

- **`apps/web/src/lib/i18n.ts:59`** reads
  `'group.scoreMarkup': { en: 'Score markup', fr: 'Score markup' }`. **The French
  slot is English today, so this closes a French gap as well as renaming.**
- **THE FRENCH IS A DESK PROPOSAL AWAITING DANN'S RATIFICATION: « Voix ».**
  **Adopted, not coined.** It is already proposed in `OPEN.md`. **Build it, and if
  he changes it, it is one string.**
- **`Drawer.svelte:549-550`'s comment must be corrected in the same pass.** It reads
  "SCORE MARKUP. Lavender, one step down. Corrections and Voice." Neither half is
  true after this. **A stale comment is the trap this project keeps paying for.**
- **`Drawer.svelte:850`** also renders `t('group.scoreMarkup', language)`. Check what
  that second site is and report it; both must read the new name.

**THE NAME COLLISION, AND THE DESK DECIDES IT. DESK DEFAULT, reversible, Dann's to
overturn with a word.** Once the band is called Voice it will contain a station whose
header is `t('voice.heading')` (`+page.svelte:4724`), so the word is drawn twice, one
directly under the other. **The inner station header retires and the band carries the
name.** The project already has this rule in its own words at `+page.svelte:4618`:
*"the name is drawn once."*

**The cost, stated:** N.114a, ruled by Dann 2026-09-09, said that station's header
stays while its toggle goes. **That ruling was made when the band was called Score
markup and the header was the only thing naming Voice.** It is not a bar; the
condition that justified it has gone. **If Dann wants the header back, it is one
line.**

## 5e. THE CORRECTED-COUNT SENTENCE IS DELETED. Ruled by Dann 2026-09-20 12:09

**His words, verbatim:** *"No user cares about the courtesy message you invented
about 'you have x corrected note' They do not need this."*

**It is deleted, not relocated.** An earlier line of this brief proposed moving it
into the loupe. **That is struck.**

- Remove `+page.svelte:4678-4685` entirely.
- **Delete `i18n.ts:262` `correct.count` and `:263` `correct.countOne`.** Read this
  session: their only render site is `+page.svelte:4681-4682`. Every other mention
  is a comment or a test comment (`i18n.ts:516`, `bandState.ts:210`,
  `bandState.test.ts:190`). **Fix those comments in the same pass rather than
  leaving them pointing at deleted keys.**
- **`correctedCount` ITSELF STAYS.** It has other callers: `+page.svelte:750`,
  `:1425`, `:2298`. Do not remove the derivation.
- **FOR THE RECORD, stated correctly:** the sentence was the DESK's amenity, offered
  as N.108 increment 1a. **Dann ratified its placement on 2026-09-02; he did not
  invent it.** The comment at `+page.svelte:4673` records the ratification, not the
  authorship. **His ruling today withdraws it, and it governs.**

**MEASURE AND REPORT, do not decide:** `bandState.ts:227-238` builds the band's own
state line from `correctedCount` using `correct.state`. **Report what that line says
after this change, in both languages.** A band named Voice that still announces
corrections is the same fault in a smaller place, and Dann has not ruled on it.

## 5f. THE DESK'S TWO CALLS, after Code's section 3. Both reversible, both Dann's to overturn

**Code established and the desk accepts:** no handler or prop is drawer-only, both
mounts pass all 40; `dockShiftDisabled` and `handleDockShift` keep one caller each;
`corrections` needs no migration step because `migrateOpenStations` drops any stored
id absent from `SUCCESSOR`, and `OPEN_STATIONS_VERSION` stays 3.

**CALL 1. THE BAND'S STATE LINE STOPS ANNOUNCING CORRECTIONS. DESK DEFAULT.**
`bandState.ts:227-238` `scoreStateLine` would otherwise read
"3 notes corrected · Voice: X · a/b" on a band called Voice.

- **The reason is structural, not taste: a band's state line describes what the band
  HOLDS, and after this change it holds only Voice.** Corrections have moved to the
  loupe, so the band announcing them is a stale summary, which is the same class of
  fault as the comment at `Drawer.svelte:549`.
- **The voice half of the line stays**, unchanged.
- **Report, do not assume, whether `correct.state` and `correct.stateOne` still have
  a caller afterwards.** Delete them only if none remains, and fix any comment that
  points at them.

**CALL 2. THE TAKEOVER'S `voice.heading` TITLE STAYS. DESK DEFAULT, and it is
deliberately do-nothing.** `Drawer.svelte:850` draws the band name and `:853` draws
`voice.heading` directly under it, so the rename doubles the word there as it does in
the band. **The desk is NOT ruling on it: that is a separate surface, nobody has
looked at it, and a screen the desk has not seen is not a screen the desk rules on.**
**It goes on the walk list. Change nothing at `:853`.**

**THE ONE TEST THAT MOVES, and Code's handling of it is accepted:**
`sections.test.ts:276-280` uses `corrections` as its surviving id. Swap in another
live station, `analysis`, and correct the comment at `:271-274`. **The test's point,
that the mapping is kept, is unchanged, so this is not a moved gate baseline.** Say
so in the report.

## 6. Done when

`WRITTEN` on all of these, each observed in a browser:

- **The drawer's band is named Voice**, in English and in French, and no longer
  draws a Corrections station.
- **The word Voice appears once in that band**, not twice. The drawer's TAKEOVER is
  out of scope and still doubles it; that is on the walk list, not a defect to fix
  here.
- **The band's closed state line no longer mentions corrections**, in either
  language, and still reports voice.
- **The loupe's Corrections panel is unchanged** and still corrects.
- **The corrected-count sentence is GONE, not moved.** It appears nowhere: not in the
  drawer, not in the loupe. See section 5e.
- **`correct.count` and `correct.countOne` are deleted from `i18n.ts`**, having no
  remaining render site.
- `corrections` has left `STATION_IDS`, and any stored open-station state that named
  it is migrated rather than left to rot.
- No handler or prop is deleted while another caller remains.
- `tsc` clean and the five gates at baseline. **If `sections.test.ts` moves, say so
  and say why before changing a gate number.**

`DONE` is Dann's walk.

## 7. Report back

The commit, the three measurements of section 3, the results against section 6, and
**what could not be established.**

**NOT ESTABLISHED beats a complete invented answer.**
