# Fable ruling, E.27: the four-tab consolidation (5 August 2026)

**Copied verbatim from project knowledge (`claude/fable-ruling-e27-four-tab-consolidation_2026-08-05.md`) into the repository on 2026-09-02 so that Design can read it. Read with tether 17: this ruling is four weeks old and has been amended by E.44 (2026-08-13), by the 2026-08-18 rulings, and by Dann's N.108 rulings of 2026-09-02, all in this pack.**

**Commissioned by Dann, 5 August 2026.** Brief written by Opus from two Sonnet
returns: a control inventory of all four tabs and a data verification of the
Design zip. Dann set the scope himself: **all four tabs open, the drawer-plus-page
shell fixed, ranked options with a specification of the winner.**

**Fable's ruling is reproduced verbatim below in §2. One correction to its
central premise is recorded first, in §1, because Opus verified the premise
against source after the ruling arrived and it does not hold.**

---

## 1. Opus's verification, and it matters

**Fable's §0.1 asserts that Fit consumes Transcribe's output**, that the two tabs
"are stages of one pipeline: text, then transcription, then score plus voice,
then report," and cites the handout mockup's footer as evidence.

**SOURCED. That is not true of the code today.**
`apps/web/src/lib/shane/VoiceProfilePane.svelte`'s `Props` interface declares
`formants`, `characteristics`, `voiceName`, `language`, `pageSize`, `ingested`,
`scoreTitle`, and `engraving`. **It does not declare `lines`, and the file
contains zero references to it.** Its underlay comes from
`ingested?.result.score` at `VoiceProfilePane.svelte:221`, that is, from the
uploaded score, through `paginateScore`.

**So Transcribe and Fit are not stages of a pipeline. They are two independent
intakes into the same phonology engine:** Transcribe takes pasted text, Fit takes
an uploaded score.

**Fable itself abstained correctly on this point in §3.3**, writing *"Whether
score upload extracts underlay text today is not established."* The confident
claim in §0 and the abstention in §3 are inconsistent, and the abstention was the
right instinct.

**This does not overturn the recommendation. It replaces the argument for it with
a better one.** The case is not that one tab feeds the other. It is that **the
app has two doors into the same engine and requires the singer to know which door
to use.** That is a mental-model problem rather than a data-dependency problem,
and it makes the strongest single item in Fable's specification, the **Source
station** that puts the text area, the scanner, and the score drop zone together
"because they are the same question: where does the material come from," correct
for a reason Fable did not have. **They belong together because they are
siblings, not because one feeds the other.**

### Three costs Fable named too lightly

1. **"The other five collapse mechanisms are retired"** is written as though it
   were free. It means reworking the profile switcher's mode enum, the wizard's
   hoisted collapse boolean, the uploader's local boolean, and the searchable
   select. Four components, not a configuration change.
2. **The phone rule "exactly one station open at a time" is a second override of
   Dann's "we leave this to the user,"** and Fable flagged only the first one
   (the rituals as takeovers).
3. **The packet's first sheet is unbounded in length**, since it is however long
   the pasted text runs. A three-sheet continuous scroll on a phone is governed
   by a segment pill in Fable's spec, which is right, but the scroll cost of
   sheet 1 is not priced.

---

## 2. The ruling, verbatim

# Ruling: the architecture of one sitting

## 0. What is wrong with the question, said first

Four things, in descending order of consequence.

1. **Consolidation is right, but the stated reason is the weak one.** Screen reuse is a benefit, not a justification. The strong reason is in the inventory's own structure: Fit consumes Transcribe's output. The handout mock says it outright: "Underlay transcription comes from Ilya verbatim; Fit adds the acoustic layer only." A tab bar presents Transcribe and Fit as peers, but they are stages of one pipeline: text, then transcription, then score plus voice, then report. The current IA hides a dependency behind a peer relationship, and every coupling in inventory section 6 is that hidden dependency leaking: the force-switch on word click, the provenance tag that Transcribe drops and only Fit displays, the wizard state hoisted to survive unmounting. Consolidate because the two tabs were never actually separate, not because pixels are scarce.

2. **"We leave this to the user" is right for sections and wrong for the two rituals.** The inspector, roughly ten controls that exist only when a word is selected, and the calibration wizard, a phased ceremony with a microphone gate, are modal by nature. They demand the whole drawer while active and are meaningless as persistently open sections. An accordion that includes them as peers of the metadata block recreates the density the accordion was meant to cure. The user should own the expansion of *stations*; the app must own the entry and exit of *rituals*.

3. **The editor-versus-report tension dissolves once you stop trying to blend the pages.** The audit's framing is correct: merging an editor with a report is a different problem from merging two editors. The answer is that you do not merge them. You staple them. A singer's printed packet already contains pages of different kinds: a transcription you annotate, a marked score you read, a handout you consult. The paper metaphor, which is fixed, solves the problem the tab bar could not.

4. **Tab count is not what blocks the ratified goal today.** Three inventory facts fail "one sitting" under any architecture: the Fit page cannot be printed because the print button lives in a panel that never renders alongside it, the Fit drawer is English-only in a bilingual app, and Fit's scan-from-image button is permanently inert beside a fully wired twin. Rearranging tabs without closing these ships a prettier failure.

---

## 1. Four architectures, ranked

### A. The Packet (recommended)

**Idea.** Three destinations: Studio, Learn, Guide. Studio's page is one multi-sheet document, the packet: a transcription sheet, a marked-score sheet, and a handout sheet. Studio's drawer is five accordion stations in workflow order plus two full-drawer takeovers for the inspector and the calibration ritual.

**Optimises for.** The pipeline made visible; one sitting on one surface; print as a first-class outcome, since the packet *is* the printable artifact; mobile, where stations and sheets are natural full-screen units.

**Costs.** Retires the `shane` tab id and demands a persistence migration. Retires the computed drawer width in favour of a fixed width with a scrolling character ribbon. Changes the INCLUDE_SHANE story from "drop a tab" to "drop two sheets and two stations." Overrides the owner's preference in exactly one place: the rituals are takeovers, not user-collapsible sections.

**Serves worst.** The singer on the smallest phones, who now traverses a five-station drawer instead of two shorter ones, and the maintainer of the three-tab build, whose flag now gates pieces of a shared surface rather than a whole tab.

**Would have to be true.** That Transcribe genuinely feeds Fit in practice, not just in intent, and that a singer's session really does run input, edit, calibrate, read in some order rather than living permanently inside one tab.

### B. The full accordion, the owner's proposal as stated

**Idea.** One merged tab; every control group, including the inspector and wizard, becomes a chevron-expandable section; the user decides what stays open.

**Optimises for.** User sovereignty and a single, simple collapse mechanism.

**Costs.** The inspector has no meaning when no word is selected, so its section is either empty most of the time or a lie. The wizard's phases and mic gate cannot be entered sideways through a chevron without breaking the ritual. The drawer becomes one very long scroll containing two things that fight the scroll.

**Serves worst.** The first-time user, who faces a wall of closed sections with no order of operations, and the phone user mid-calibration.

**Would have to be true.** That every control group in inventory section 3 is stateless and always-relevant. The inventory shows two of them are neither.

### C. The mode split: Prepare and Read

**Idea.** Two app-level modes instead of content tabs. Prepare holds every instrument: text input, inspector, calibration. Read holds every document: transcription, fit report, Learn, Guide, under one table of contents.

**Optimises for.** The editor-versus-report distinction, elevated to the whole app; a superb print and reading experience.

**Costs.** Breaks the tight loop that makes Transcribe good: click a word on the page, edit it in the drawer, see the page change. That loop requires editor and document on screen together, which the mode split forbids by principle.

**Serves worst.** The transcription editor, who is the most engaged user the app has.

**Would have to be true.** That editing is a phase a singer completes before reading, rather than a loop they cycle through. The clickable-word design already answers this: it is a loop.

### D. Four tabs, repaired

**Idea.** Keep the architecture; fix the asymmetries. Print on Fit, working scanner on Fit, bilingual wizard, provenance preserved from both metadata instances, accordion allow-list extended to all four tabs.

**Optimises for.** Minimum motion; the INCLUDE_SHANE flag stays trivially clean.

**Costs.** The pipeline stays hidden; the couplings stay load-bearing; "one sitting" remains stitched across tab switches with a wizard that unmounts on every switch away.

**Serves worst.** The phone user at the piano, bouncing between bottom tabs while both hands are busy.

**Would have to be true.** That the tab boundaries reflect real seams. Inventory sections 5 and 6 show they do not: half the asymmetries are twins that only one side received.

---

## 2. Recommendation

**Build A, the Packet.** Ranked A, D, C, B.

**The weighing.** I weighed the owner's favoured proposal (B) against the inventory and it fails on two hard facts: the inspector is contextual and the wizard is phased, and neither survives being flattened into a peer section. I weighed the audit's framing (C) and found it half right: the distinction between editor and report is real, but promoting it to an app-wide mode destroys the click-edit-see loop, which is the best interaction in the product. I weighed doing nothing structural (D) and found that it repairs symptoms while preserving the disease: a dependency dressed as a peer. A keeps what B wanted, the accordion and user control of expansion, keeps what C saw, that reports and editors are different kinds of page, and keeps what D protects, the working loop, by making the transcription sheet the one clickable sheet in the packet.

**What I am giving up, named.**

1. The `shane` tab id and its stored value, which requires an explicit migration or returning users silently land on the wrong surface.
2. The computed drawer width on Transcribe. The drawer becomes 520 pixels everywhere and long words scroll within the ribbon. Selected-word ergonomics get slightly worse so that every other drawer content stops being squeezed by a rule written for one tenant.
3. The one-line simplicity of INCLUDE_SHANE. The flag survives, but it now gates two sheets and two stations instead of one tab.
4. Full user sovereignty over expansion. Stations obey the user; the two rituals do not.
5. The neighbour slide transition between Transcribe and Fit, which becomes meaningless when they are one surface.

---

## 3. Specification of the Packet

### 3.1 Destinations

Three: **Studio**, **Learn**, **Guide**. Tab bar unchanged in kind: top on desktop, bottom on mobile, and the two-region shell holds inside Studio exactly as today. Learn and Guide keep their current drawer table of contents and reading pages untouched; their accordion mechanism is the one this spec reuses. The Studio label is my proposal; the name is the owner's call, but it must not be "Transcribe," because the surface is no longer only that.

**When INCLUDE_SHANE is false:** Studio still exists. The packet is one sheet, the transcription. The drawer loses the Voice station and the score half of the Source station. Nothing else changes, which is the argument for keeping the flag rather than retiring it.

### 3.2 The page: a packet of three sheets

*(Superseded by E.44 §PERSPECTIVE, 2026-08-13: the documents stay separate behind a selector; no sheet indicator is built. Kept for the record.)*

The page is one continuous document on the desk, three sheets in fixed order, scrolled continuously with a sheet indicator in the desk margin, never on the paper. All interactive chrome, sheet navigation, and legends live on the desk surface; the paper itself carries only what prints.

1. **The transcription sheet.** Cyrillic over IPA, every word clickable, exactly today's Transcribe page. This is the only sheet that accepts input. Clicking a word opens the inspector takeover and auto-expands a collapsed drawer, preserving the surviving half of the old force-switch coupling.
2. **The marked-score sheet.** The Fit_Score_Line design: only crossings and timbre turns reach the paper, everything else stays in the watch list. Read-only.
3. **The handout sheet.** The Fit_Handout design with two corrections. First, the watch list is the conclusion layer and keeps full ink; the inputs table is demoted to appendix weight, smaller and lighter, because conclusions and evidence are not peers and the singer reads conclusions first. Second, one numeral system across the packet: boxed numerals mean watch-list marks everywhere, and tier is a word chip ("attend," "note"), never a circled numeral. The circled-versus-boxed collision dies here.

**Absent inputs never blank a sheet.** A sheet that cannot exist renders as a slim card in its position stating what is missing and what is withheld, in the vocabulary of the Fit_Analysis_States mock: absence as a positive object. The seven-state list itself is an exploration device and never ships as a list; a singer sees exactly one condition block.

**Print** prints the packet in reading order, from the Output station (3.3). What prints is exactly what the paper shows. The on-screen legend card from the score-line mock lives on the desk beside sheet 2; the printed legend is the handout's "how to read the page" block, so the legend exists once per medium.

### 3.3 The drawer: five stations, two takeovers

The stations use the existing table-of-contents accordion mechanism, allow-list extended. The other five collapse mechanisms in inventory section 4 are retired, except the native disclosure element, which remains the pattern for micro-help like "what is vocal fry" and "older Finale files." One mechanism for structure, one for asides.

**Stations, in workflow order:**

1. **Piece.** The six metadata controls, one instance, one state object, as already unified, now also carrying the arranger provenance line and the revert-to-score-header action that only Fit's copy showed. Every metadata edit records its provenance tag. The silent drop dies because there is no second instance to be ignorant.
2. **Source.** The text area, the one working OCR scanner, and the score drop zone with its fidelity banner, together, because they are the same question: where does the material come from. The inert scan button dies; its wired twin serves both intakes. Actions: Transcribe, Clear. The result summary line lives at the foot of this station. Whether score upload extracts underlay text today is not established; this station's layout must make that relation explicit whenever it exists, and must not imply it where it does not.
3. **Notation.** The seven display toggles, with their two cascade relationships preserved.
4. **Voice.** The profile switcher and a one-line calibration summary: profile name, roster state counts (captured, provisional, estimated, not yet), and the six pitch fields. A single primary action, Calibrate, or Re-calibrate, enters the takeover. The [o] information glyph and its deep link into Learn survive; returning from Learn restores the drawer exactly as left, using the wizard's existing pause and resume.
5. **Output.** Print packet, and any future export. Print is enabled whenever sheet 1 exists, which fixes the release-relevant absurdity that the report page could never be printed.

**Takeovers, defined once.** A takeover replaces the entire drawer, shows a single back affordance at the top, restores the station accordion in its prior state on exit, and is never entered by a chevron. Two exist:

- **The inspector.** Entered by word selection, exited by back or by deselecting. Contents exactly as today's inventory: gloss popover, per-word reset, spot reconstitution, character ribbon with draggable boundary consonants, clitic arrows, ë sigils, stress circles, and the two provenance choosers. Drawer width is fixed at 520; the ribbon scrolls horizontally when a word exceeds it. *(E.44 overturned this: the Inspector is resident in Analysis, one takeover only.)*
- **Calibration.** Entered from the Voice station, structured per the Pacifier_Redesign mock: guided and choose-my-own, the vowel quadrilateral as both progress and lesson, the three vowel groups, with one correction the prior critique demands: the grouping axis is *necessity* (required, recommended, optional), and *difficulty* is carried per row by the "as in" cue line, never by the tier itself. One row, one axis. Pause, resume, retake, and the return-to-summary hatch all survive. Because the stations are one mounted surface, the unmount-on-tab-switch problem that forced the hoisted collapse boolean disappears; the wizard persists in its takeover across everything except leaving Studio.

**Automatic behaviour, exhaustively listed, because Calm Authority means the drawer does not fidget:** when a score first renders, the Source station collapses; when a word is selected, the inspector takeover opens and a collapsed drawer expands. Nothing else ever moves without the user.

### 3.4 Collapse defaults and persistence

- Desktop: any number of stations open at once. Phone: exactly one open at a time.
- The open set persists per device under a new key. Sheet in view persists under a new key.
- Migration: stored active-tab values `transcription` and `shane` both map to Studio, explicitly, so nothing falls through silently. The five Transcribe preference keys and the voice-profile namespace are untouched.

### 3.5 Phone

The singer is at a piano with one hand free. Drawer and page alternate as full screens, as today, with the paper-handle chevron retained. The bottom bar is Studio, Learn, Guide. Sheet navigation is a compact three-segment pill on the desk edge. The exclusive accordion means the drawer is never longer than one open station plus four headers. Calibration runs as a full-screen ritual, the quadrilateral scaled to width. When a profile exists and a score is loaded, opening Studio on a phone lands on the marked-score sheet, because that is the sheet a singer props on the piano; otherwise it lands on the transcription sheet.

### 3.6 First-time versus returning

**First run:** Piece and Source open, the rest closed. Every closed station header carries a right-aligned quiet status that does the wayfinding: Notation "defaults," Voice "no profile yet," Output "nothing to print yet." The page shows one empty sheet with a single invitation line. No tour, no overlay; the order of the stations is the instruction.

**Returning:** open set, sheet, piece, metadata, and profile all restore. A returning singer with a calibrated profile and a saved piece opens onto their packet, one tap from print.

### 3.7 When calibration is absent

Nothing guesses, and the surface says so in three registers at once:

- **Sheets 2 and 3** render the notation-only condition from Fit_Analysis_States: the vocal line with underlay and no marks, the withheld list stating plainly that every acoustic claim, the entire watch list, and any range or tessitura advice are withheld, and one Calibrate action.
- **The Voice station header** reads "no profile yet" even when collapsed, so the cause is visible from the drawer's top level.
- **Provenance vocabulary is one vocabulary.** Measured, provisional, estimated, and table value appear with identical wording in the Voice roster, the handout's inputs appendix, and the withheld block. Partial states, five anchors only or a provisional read, surface as withheld lines, never as diluted marks on the paper.

### 3.8 Debts this design inherits and must not launder

The English-only calibration drawer becomes more prominent inside a unified Studio, not less; it must be bilingual before this ships. The inert scan button and the dropped provenance tag are eliminated structurally by 3.3, not patched. These are stated here so the design thread does not treat them as optional polish: the ratified goal fails on them independently of everything above.

---

## 3. Decisions this leaves to Dann

1. **The name.** Fable proposes "Studio" and says explicitly the name is Dann's.
2. **Two overrides of "we leave this to the user":** the rituals as takeovers
   rather than sections, which Fable named, and one-station-at-a-time on phones,
   which it did not name as an override.
3. **Whether the Source station's two intakes stay two intakes**, now that §1
   establishes they are siblings rather than a pipeline.
4. **Whether any of this happens before the tag.** It is post-tag work by
   Fable's own §0.4: the three things that actually block the ratified goal are
   print on Fit, the English-only wizard, and the inert scanner, and none of them
   needs this architecture.

---
*Fable, commissioned and briefed by Opus, 5 August 2026, E.27. Premise verified
against `VoiceProfilePane.svelte` after delivery; the correction is §1 and it
does not overturn the ranking. Repository at `dc7cf09`, unmodified.*
