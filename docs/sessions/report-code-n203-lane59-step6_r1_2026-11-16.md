# Report, Code, N.203 lane 59, Step 6 (finish early)

r1, 2026-11-16. Branch `cloud-lane-59`. Brief r3 Step 6 as amended by Fable's amendments 10 and 11 and the counted forms of 01:35. Tests run: this step's files and what imports them (the desk's change of 02:4x).

## What the unrecorded vowels get in each state (the brief's open item, read from the code)

- Four vowels are worked out from recorded ones by fixed anchors, `DERIVE_ANCHORS` (`engine/derivations.ts`): [ɨ] from [i] and [u]; [ɪ] from [e] and [i]; [ʌ] from [ɑ] and [ɛ]; [a] from [ɑ]. An anchor counts when `usableAnchor` holds (fR1 and fR2 positive, not implausible unless kept; it does not test `f2Quality`).
- Every other unrecorded vowel, and any vowel whose own reading is unusable, takes a stand-in from the voice type's staff fitted to the recorded vowels (`engine/stand-ins.ts` `fillStandIns`), flagged `surrogate`. With nothing usable recorded the fill is the template alone.
- The control's state is read from the chart's own resolution, `resolveVowelValues(profile, voiceType, { placeholders: 'always' })`, so what the control says matches what the chart draws.

## What changed

- `voice/chart/finish-early.ts` (new, as you directed; lane 60 imports it): `finishEarlyState(profile, voiceType, recorded)` returns `{ kind: 'workOut', m, vowels }` when no vowel's fR1 or fR2 is `surrogate` and at least one vowel is not recorded (`vowels` in `VOWELS` order), `{ kind: 'useRecorded', m, anySung }` otherwise, and null with none recorded or all ten. `finishEarlyText(state, language)` returns the link and the caption (null where the caption would be untrue: `useRecorded` with `anySung` false). Also `numberWord` and `vowelList` (an Oxford comma in English, none in French; brackets round each vowel).
- `voice/VowelCapture.svelte`: the old "Return to summary" link at the foot becomes the finish-early link (the quiet `.return` style, never filled, never moves the focus) with its caption under it. It shows at rest from the first recorded vowel to the ninth. Either wording calls `onReturn`, as Return to summary did, so the wizard needed no change (its line count is untouched).
- `i18n.ts`: the ratified counted forms and consent captions (sheet-english r2 and sheet-french r1, "Counted forms and consent captions", 01:35): `capture.finish.useRecorded` and its two captions, `capture.finish.workOut.last`, `.many`, and its two captions; `calib.capture.returnToSummary` marked UNUSED and kept. Header 1,294 keys, `capture.` 54.

**Two things I added that the sheets do not spell out, flagged because you said to stop on any word the sheets lack.** (1) The number words two to nine and their French (deux, trois, quatre, cinq, six, sept, huit, neuf), as `capture.number.2` to `.9`: the sheets rule "numbers in words (one to nine)" and show only "two to four" and "three"; I wrote the ordinary words for the rest because the control can print up to "nine" (for example "Ilya fills the other seven"). (2) The list word `capture.list.and` (and, et), which the list punctuation needs. Neither is composed prose, but both are words the sheets did not print. Please look at them; they are two small keys to change or strike.

## Tests

- `chart/finish-early.test.ts` (new, 15): the seven in Ilya's order shows "work out the other three" with [ɪ], [ɨ], [ʌ]; none and ten show nothing; [o] unrecorded shows "Use what I've recorded"; an anchor with no fR2 does; an anchor with `f2Quality: 'absent'` and a positive fR2 does; [o] recorded but implausible and not kept does; "Not sure" with three recorded does; one implausible reading shows the control with no caption; a kept implausible reading counts again; the lists; the number words; the counted forms in both languages for three, two, one, and for "use what I've recorded" by count; and `m` plus the head's count is ten.
- `VowelCapture.test.ts`: the old "Return to summary" assertions replaced; a new test that after the seven the screen offers the other three and names them in both languages. `chart/ratified-strings.test.ts`: 16 new pins (54 to 70). `e2e/calibrate-new.test.ts`: "Return to summary" is now `Use what I.ve recorded` in its three places (not run yet).
- The 15 plus `ratified-strings`, `VowelCapture`, `i18n-index`, and `i18n` files: 55 tests, all passing at the time; I then fixed one assertion in `VowelCapture.test.ts` (it compared a no-break space the test helper turns into a space) and re-ran that file: 21 passed.

## Pictures (`step6-<phone|desk>-<en|fr>-early-<state>.png`)

States: seven recorded (work out the other three), three recorded (use what I've recorded, "the other seven"), nine without [ʌ] (work out the last one), nine without [o] (use what I've recorded, "the last one"), one implausible reading (the control with no caption), and ten (Re-take and See your vowel space under the buttons, nothing at the foot). Phone English and French for all six; desk English for seven, three, and ten: 15 pictures, all opened and looked at. What I saw: the link and its caption sit at the foot of the takeover below the toggle, in both languages and at both sizes; the French « : » has its no-break space; the lists read "[ɪ], [ɨ], and [ʌ]" and « [ɪ], [ɨ] et [ʌ] »; the implausible state shows the link alone; at ten the foot is empty and "See your vowel space" sits directly under the two buttons.

## Needs Dann's eye

- The control is at the very foot, so on a phone it is below the chart, the readings, and the toggle, as ruled at 01:28. A singer who has recorded seven must scroll to find it. Fable's amendment 9 gave the ten-recorded state a door under the buttons; for one to nine the foot stands.
- The two small word additions above.

## What I could not establish

- The browser suites for this change: not run yet.
