# Desk draft: the install banner's instruction line for Chrome on iPhone (r1)

Desk (Fable 5.1 for Opus), 2026-10-15. DRAFT. Nothing here reaches the tree until Dann ratifies it (CONTRACT §7). The keys it fills are created, empty, by `brief-code-chrome-ios-install_r1_2026-10-15.md`: `strings.en.ios_chrome_body` and `strings.fr.ios_chrome_body` in `apps/web/src/lib/components/InstallPrompt.svelte`.

## What is being asked of Dann

Two things, one at a time.

1. **The menu path, on your iPhone, in Chrome.** Open Ilya in Chrome, find the control that offers **Add to Home Screen**, and say which control it is and where it sits (the share arrow in the address bar, the three-dot menu, or something else). No source the desk read gives this path: 9to5Mac (2023-07-14) says Chrome on iOS 16.4 or later can do it and gives no steps; Google's help page for adding to the Home Screen covers Android and the Chrome widget only. The draft below is written so it does not name a position, and it still has to be walked.
2. **The French**, once the path is known.

## The existing strings the draft is built from

`InstallPrompt.svelte:26-27` and `:35-36`, read 2026-10-15:

| key | EN | FR |
|---|---|---|
| `ios_heading` | Add *Ilya* to your Home Screen | Ajoutez *Ilya* à votre écran d’accueil |
| `ios_body` | Tap the **Share** button below, then choose **Add to Home Screen**. | Appuyez sur le bouton **Partager** en bas, puis choisissez **Sur l’écran d’accueil**. |
| `ios_dismiss` | Got it | Compris |

The heading and the dismiss button are shared with the Chrome path; only the body line is new.

## The draft

| key | EN | FR |
|---|---|---|
| `ios_chrome_body` | In Chrome, open the **Share** menu, then choose **Add to Home Screen**. | Dans Chrome, ouvrez le menu **Partager**, puis choisissez **Sur l’écran d’accueil**. |

### Adopted and coined

- **Adopted** from `ios_body`: "then choose **Add to Home Screen**" / « puis choisissez **Sur l’écran d’accueil** »; **Share** / **Partager**; the imperative register (« Appuyez », « choisissez »).
- **Coined** by the desk: "In Chrome, open the **Share** menu" / « Dans Chrome, ouvrez le menu **Partager** ». "Open the menu" instead of Safari's "Tap the button below", because the control's position in Chrome is not established and "below" would be a claim.

### Agreements checked (CONTRACT §7)

« le menu **Partager** » and « le bouton » are masculine nouns in their own right; nothing agrees with a person, so no inclusive pair is needed. « Sur l’écran d’accueil » is carried verbatim from the ratified `ios_body`.

### Open choices, Dann's

1. **Share or three dots.** If the path on your iPhone goes through Chrome's three-dot menu rather than a Share control, the bold word changes in both languages, and the desk redrafts from your words.
2. **Chrome's own French label.** Safari's item is « Sur l’écran d’accueil » and that is what `ios_body` carries. Chrome's French menu may label its item differently (NOT ESTABLISHED; no French Chrome was opened). If you run your iPhone in French, the label on the screen wins over the draft.
3. **"In Chrome" / « Dans Chrome ».** Kept so the sentence differs visibly from the Safari one and the singer knows the line was written for the browser they are in. Drop it if it reads as noise.

## What happens on ratification

A follow-up row pastes the two ratified strings into the two `null` keys and removes the gate comment. No other code changes; the detection, the timing, and the tests already exist from this lane's row 3.
