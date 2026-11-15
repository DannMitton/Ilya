# Report: closing polish lane, step 3, the install banner shows where Chrome's Share button is (Code, cloud-lane-48, r1, 2026-11-12)

## Strings changed (`components/InstallPrompt.svelte`)

- `ios_chrome_body` EN (`:41`), old "In Chrome, open the <strong>Share</strong> menu, then choose <strong>Add to Home Screen</strong>." new "In Chrome, tap the <strong>Share</strong> button at the right inside the address bar, tap <strong>View More</strong>, then choose <strong>Add to Home Screen</strong>."
- `ios_chrome_body` FR (`:51`), old « Dans Chrome, ouvrez le menu <strong>Partager</strong>, puis choisissez <strong>Sur l’écran d’accueil</strong>. » new « Dans Chrome, appuyez sur le bouton <strong>Partager</strong>, à droite dans la barre d’adresse, puis sur <strong>Afficher plus</strong>, et choisissez <strong>Sur l’écran d’accueil</strong>. »
- Both stay single-quoted literals with no straight apostrophe, so the pin's regex still reads them. `ios_body` (`:40`, `:50`) and the banner's other strings are unchanged.

## The glyph (desk default)

`SHARE_GLYPH` and `withGlyph` (after `let t`): a 24-unit inline SVG of plain paths, an open-topped rounded square with an arrow rising from its middle, `aria-hidden="true"`, `stroke="currentColor"`, 1em by 1em, aligned to the baseline with `vertical-align: -0.15em`. `withGlyph` inserts it after the first `</strong>` of the line it is given, which is the word Share or Partager in both `ios_body` and `ios_chrome_body`. The render expression is `withGlyph(isChrome ? (t.ios_chrome_body ?? '') : t.ios_body)` (Amendment 6), so `install-prompt-gate.test.ts:34-36` still matches it. The glyph is not written into the strings.

## Tests

- `components/install-prompt-gate.test.ts`: the pin at `:22-28` moved to the two new lines; a new test pins the wrapped expression, the glyph's `aria-hidden`, `currentColor`, and 1em size, that it is inserted after the first `</strong>`, and that no string holds an `<svg`.
- Web unit suite not re-run in full for this step; the file's five tests pass.

## What I could not establish

- A render of the banner with the glyph (iPhone user agent, six-second delay): not captured. The glyph's look at 1em in Source Sans 3, and whether « Afficher plus » and "View More" match Chrome's labels (the desk could not establish the latter either), are open.
