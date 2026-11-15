# Fable review of the N.201 board (the Drawer's order)

2026-11-14 20:2x to 20:4x. Commissioned by the desk (Opus 5.5) at Dann's "Proceed" of 20:24, furnished with the phone thread of 07:57 to 08:21 (his paste), N.201 as homed in `OPEN.md`, the board's five artboards (https://claude.ai/artifact/7yBmABc1k57NLuiXHEvy8n), the four characters from the storyboard, and the tree at `d85a54cf`. Filed by the desk whole; the reviewer's paths are under `apps/web/src/` unless they start with `docs/`.

**Verdict:** ADOPT WITH CHANGES.

## The four, walked

**Ted (phone).** He pastes into INPUT, returns to the page, and taps a VERIFY word. In the trial he sees three closed bands, then ANALYSIS open with his word roughly 380 px down the Drawer. That is the fix he needs. The desk's walk omits its condition: INPUT has to shut. Today's tap raises the Drawer and nothing else (`routes/+page.svelte:2145`), and the existing bulk opener shuts nothing (`lib/components/Drawer/sections.svelte.ts:395-407`). Served, with change 1.

**James (phone, first visit).** He is going to VOICE and Calibrate. A first-run Drawer opens INPUT alone (`sections.svelte.ts:53`), and his tap on VOICE shuts it under the phone rule (`:378-381`). The trial adds one closed band above and costs him nothing. Neutral. The desk's "empty list" is NOT ESTABLISHED; the reviewer did not read how many rows a fresh library shows.

**Marie (desktop).** Her path is VOICE (import the card), then New song and a score. With REPERTOIRE open on arrival, 16 rows stand above INPUT and VOICE, and New song is under the sixteenth row. The desk's walk does not cover New song, and the trial does not say what opens after it. Served only with changes 4 and 5.

**Maxime (desktop, French).** She keeps INPUT open (two text boxes) and taps words to write glosses. "Shuts nothing" then opens ANALYSIS under INPUT, possibly past the window's foot: today's unanswered tap, moved to the desktop. The desk's "Served" is wrong without change 2. Its "French labels are drafts" is also wrong: « RÉPERTOIRE » and « ANALYSE » are in the tree (`lib/i18n.ts:1767`, `:990`).

## Changes

1. **Phone tap.** A word tap opens ANALYSIS under the one-band rule, so INPUT closes to its state line and the Drawer shows REPERTOIRE, PIECE, and INPUT closed, ANALYSIS open, scrolled to the top; tapping another word leaves ANALYSIS open. Why: Ted sees the word, and `toggle` would shut ANALYSIS on the second tap (`sections.svelte.ts:371-386`).
2. **Desktop tap.** A word tap brings the ANALYSIS head into view when it is outside the Drawer's window, and shuts nothing. Why: Maxime's case; it departs from "the drawer never scrolls itself ... Do not add a scroll here" (`Drawer/Drawer.svelte:971-976`), whose reason was movement the singer did not ask for, and this movement answers her own tap.
3. **Strike "or at the first touch of anything else".** REPERTOIRE folds on a pick, on New song, and by its own chevron. Why: the trial names two fold events and then a third, undefined one, which also contradicts "a word tap shuts nothing".
4. **Picking the piece already open folds REPERTOIRE.** Why: on arrival that is the likeliest pick, and the switch returns at once for it (`routes/+page.svelte:3106`), so the fold cannot sit inside the switch.
5. **New song folds REPERTOIRE and opens INPUT.** Why: "An empty drawer opens Input alone" (`docs/memory/PRODUCT.md:526`).
6. **Phone arrival does not open REPERTOIRE; the stored set is restored.** Why: a phone arrives on the page with the Drawer down (`routes/+page.svelte:288`, `:3649-3651`), and 16 open rows would push every other band off the raised Drawer; REPERTOIRE is the first band, one tap away.
7. **The James default is right; keep it, on desktop.** REPERTOIRE opens on arrival at two or more pieces. Why: a list of one offers no choice, and it agrees with `PRODUCT.md:526`.
8. **Drop "No word chosen".** With no word, ANALYSIS's closed line shows the count of words to verify, or nothing at zero. Why: an empty state line draws no element (`Drawer/Drawer.svelte:497`), as PIECE does today; `console.selectWord` (`i18n.ts:2518`) stays in the open body and is too long for a line that truncates (`Drawer/Drawer.svelte:1198-1203`).

## NOTATION

**Recommendation: first row of ANALYSIS, as drawn.**

- **Phone.** The foot already holds the 'the page' bar. A pinned row there makes two fixed bars under the thumb and costs 40 px on every screen, for a control most singers set once. As first row it costs 40 px above the word only while ANALYSIS is open.
- **Desktop.** A foot anchor would give one tap from anywhere, Melody included. As first row it is two taps, under a band whose name does not say notation. That is the loss, and it equals today's (INPUT, then the row).
- **Pinned at the top (Studio ruling).** Its reason was "what must never scroll away". The tree left that at N.108 (`routes/+page.svelte:4006-4010`), and five folding bands leave less to scroll away. The ruling's other half, the Inspector resident in Analysis, is kept by the trial.
- **Fallback.** If Dann reaches for NOTATION on his walk and misses it, pin the closed row at the foot on desktop only. I.01 objected to the open block, not the row (`docs/memory/INBOX.md:17`).

## The offers a to f

- **a. Decline the automatic word.** The 365 px blank it filled (`Drawer/AnalysisStation.svelte:146`) is out of sight once ANALYSIS is a closed band, and a marked word nobody chose pulls the eye on the focus surface. Keep its first condition alone: the tapped word is marked on the page, screen only (no selected state anywhere in `lib/components/Paper/`, grep this session).
- **b. Not now;** see NOTATION.
- **c. Yes.** A closed band shows its state (`PRODUCT.md:520`).
- **d. Yes.** Rows read as titles. Cost: renaming or deleting another piece means opening it first.
- **e. Yes.** "171ms" is the machine's term (`docs/memory/CONTRACT.md:83`; drawn at `AnalysisStation.svelte:77`; its home left to Dann at `:29-34`).
- **f. Yes, in the one place named in change 8.** Ted's goal is knowing which words Ilya was unsure of, and the cold walk found VERIFY pale at phone width. It is state, not a control; the page still does the finding.

## Rules at stake

- **Unnamed:** "Do not build any of the GUI track before the beta closes unless Dann names what it displaces" (`CONTRACT.md:145`). Nobody has said what N.201 displaces.
- **Unnamed:** "On a phone, a step's primary action lands the singer on the page itself, and Back brings them home" (`PRODUCT.md:528`). The trial is silent on what a phone shows after a pick.
- **Unnamed:** the stored set "is the singer's own and is kept" (`sections.svelte.ts:424`). Opening REPERTOIRE on every arrival overrides it; change 6 limits that to desktop.
- **Unnamed:** the no-scroll rule in change 2.
- **Named by the desk, confirmed:** the word tap is a ratified, unbuilt ruling, so it is applied, not trialled (`CONTRACT.md:24`, `:78`).
- **Hue:** nothing broken (`PRODUCT.md:1231`).

## What the brief must decide

**Engineering, decided:**

1. `repertoire` and `analysis` keep their stored strings and join the band tier; `binder` and `notation` stay stations; no version bump, because a bump resets every singer (`sections.svelte.ts:239-248`).
2. One new method on `SectionSet`, "reveal" (the reviewer's term): opens if closed, shuts the same tier when `exclusive`, does nothing if open, and writes through the one save site (`CONTRACT.md:147`).
3. The arrival opening runs after `restore` (`routes/+page.svelte:3621`), desktop only.
4. On a phone, after a pick the Drawer stays raised with REPERTOIRE folded and PIECE's line showing the new title. This departs from `PRODUCT.md:528`, which is itself marked unread against portrait C.
5. NOTATION is still never stored open (`sections.svelte.ts:62`).
6. The dictionary loading bar stays in ANALYSIS's body (`AnalysisStation.svelte:86-99`).
7. The tap's switch to the Text document is unchanged (`routes/+page.svelte:2147-2155`).

**Dann's:**

1. **Words, English and French.** The pieces count needs a new string; no count string exists. "16 pieces" disagrees with "New song" / « Nouveau chant » beside it (`i18n.ts:1768`) and agrees with PIECE (`:157`). The verify count is also new.
2. **Taste.** The look of the chosen-word mark.
3. **Taste, after his walk.** Whether desktop arrival opens REPERTOIRE every visit.
4. **What N.201 displaces.**

Irreversible: nothing.

## What the reviewer could not establish

- How many rows a fresh library shows.
- Any rendered height: the Inspector on a phone, the bands at 390 px. The board is a drawing and nothing was rendered.
- Whether Melody has word taps.
- The two Guide artifacts and the date of "fix 1": not opened.
- `CONTRACT.md` section 1 has no item 22 at this commit (it ends at item 20, line 40). [Desk note: the brief to the reviewer named tether 22 under section 3 and "item 22" under section 1 in error; section 3 tether 22 exists.]
- The focus-surface principle is not in `PRODUCT.md` at this commit; its only home is `docs/memory/INBOX.md:709`. [Desk note: homed in `PRODUCT.md` 2026-11-14 19:5x, uncommitted.]

Terms: "reveal" is the reviewer's. "Piece in hand" and "follows the moment" are the desk's and the reviewer did not adopt them.
