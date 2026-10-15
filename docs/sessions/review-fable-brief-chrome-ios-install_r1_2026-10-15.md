# Fable review of the Chrome-on-iPhone install brief, r1

Reviewer: Fable 5.1, 2026-10-15, independent of the drafting instance. Brief: `brief-code-chrome-ios-install_r1_2026-10-15.md` with `draft-strings-chrome-ios-install_r1_2026-10-15.md`. Checked against a clone of `Shane` at `14e2ff8`; every `path:line` below read this session.

## Verdict

SEND WITH AMENDMENTS. Every citation holds. The choice (B: build the detection, keep the banner down until the string is ratified) matches the known decision and tether 7. The amendments are a Playwright API name, the iPad user-agent fact the test would otherwise misstate, a typing detail for the `null` key, and the branch name. The draft strings are correctly marked as owed; the French is Dann's to ratify and I do not pre-empt it.

## Citations

| Citation | Status |
|---|---|
| `InstallPrompt.svelte:81-90` the `ios` test and the 6,000 ms raise | CONFIRMED (`:81-82` the test, `:84-90` the raise) |
| `:96-101` the `beforeinstallprompt` listener | CONFIRMED |
| `:20-39` the strings table, EN and FR values as quoted | CONFIRMED character for character (`ios_heading` `:26`/`:35`, `ios_body` `:27`/`:36`, `ios_dismiss` `:28`/`:37`); typographic apostrophes in the French |
| `:126-134` the template reads `isIos` | CONFIRMED (`:127-134`) |
| `:71` the display-mode check | CONFIRMED |
| `install-decline.ts` (`DECLINE_KEY`, `declineIsFresh`), `:11-16` the reason for plain TypeScript | CONFIRMED (`:11-16`) |
| `+page.svelte:4270` the one mount | CONFIRMED (`:4270`; import at `:88`) |
| `settle-field.test.ts:106`, `composers-poets.test.ts:194` read a component as text | NOT CHECKED at those lines; the pattern exists in the tree (`i18n.test.ts` and `french-italics.test.ts` read `GuideContent.svelte` as text, per the 2026-10-14 review). Code can use either precedent |
| 9to5Mac 2023-07-14 and Google's help page | Not re-read this session; the brief marks the menu path NOT ESTABLISHED, which is the right status for the strings |

## Amendments

### 1. Playwright: the user-agent override is a context option

In "Done when" item 2 replace "(`page.setUserAgent` or a context `userAgent`)" with "(`browser.newContext({ userAgent })`; Playwright has no `page.setUserAgent`, that name is Puppeteer's)".

Reason: Code would look for a method that does not exist.

### 2. The iPad case: say what the test string is

In "Tests", replace "an iPad Safari string gives `ios-safari`" with:

> an iPad Safari string containing `iPad` gives `ios-safari`. Note in the test and the report that iPadOS Safari sends a Macintosh user agent by default (desktop-class browsing), so a current iPad reaches neither branch; that is the component's behaviour today and is not this row's to change. Add one test that a Macintosh Safari string gives `other`.

Reason: a "real iPad Safari string" taken from a current iPad would give `other`, and the test as worded would then be wrong about what it tests.

### 3. The `null` key: the type

Append to build item 3:

> The `strings` object is inferred; with `ios_chrome_body: null` in both languages the field's type is `null`, and `typeof t.ios_chrome_body === 'string'` narrows to `never`, which `svelte-check` may flag. Declare the table's type once (an interface with `ios_chrome_body: string | null`) or write the two keys as `null as string | null`; say which in the report.

Reason: a literal `null` in both branches gives the follow-up row a type to change as well as a value.

### 4. The follow-up's done state, in this row's report

Append to "Report": "State that until the follow-up lands, Chrome on iPhone shows nothing, as today, and that the six-case detection is the only observable change in the tree (a test, not a screen)."

Reason: the brief's "the singer sees no change" is right and the report is where the next desk reads it.

### 5. Branch

Replace every `cloud-lane-8` with `cloud-lane-10`.

### 6. Gate baselines

Add: "`gates-scratch.sh:111`'s expected string for gate 4 is stale (2433); compare against 2512 plus what rows 91 and N.27 added."

## Strings

No string reaches the tree in this row; the keys hold `null`. Owed to Dann: `strings.en.ios_chrome_body` and `strings.fr.ios_chrome_body`, drafted in `draft-strings-chrome-ios-install_r1_2026-10-15.md`, and the menu path walked on his iPhone first. The draft says which words it coined ("In Chrome, open the **Share** menu" / « Dans Chrome, ouvrez le menu **Partager** ») and which it adopted; its agreement check names its referents (« le menu », « le bouton », masculine nouns). The draft is a draft; nothing in it is ratified, and the brief enforces that with the `null` gate. One observation for the desk, not for Code: the draft's own bold word "Share" is a claim about the control, which the draft flags as open choice 1; if Dann's walk finds the three-dot menu, both languages change, as the draft says.

## Executability

Pure TypeScript detection, a text test, and a Playwright run with two contexts on the built site. Nothing needs a Mac, WebGPU, a microphone, or a held-out song.

## Collision with cloud-lane-9

None. `InstallPrompt.svelte`, the new `install-platform.ts`, and its test are touched by no lane-9 row; `+page.svelte` is not edited by this brief.

## What I could not establish

- The two text-test precedents at the lines the brief names; not opened.
- Whether headless Chromium's `navigator.userAgent` override reaches `onMount` before the 6 s timer; the brief's 10 s wait covers it.
- The Chrome-on-iPhone menu path, by design.
