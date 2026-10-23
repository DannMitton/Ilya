# Addendum to batch C r2, B2: the ratified offline-Refresh string, 2026-10-21

Batch C r2 (`brief-code-batch-c_r2_2026-10-21.md`, md5 `9e4c554e9c203e8ba2e18efa183296ff`, Fable-reviewed) is unchanged. This addendum supplies the one string its B2 done-when 3 says is owed to Dann, and it supersedes that item's "do not add the string".

Ruled by Dann 2026-10-21 13:56 (*"yes"*) to a first wording, "Ilya could not connect.", then CORRECTED at 13:57 after his question *"Ilya doesn't actually need to conect, does it?"* (the desk's wording implied Ilya needs a connection; `apps/web/static/sw.js` serves the shell and assets from caches, so only getting a new version needs the network): the desk offered the wording below and he ratified it (*"yes"*, 13:57). SCOPE, DESK DEFAULT, his to wave off. Offered by the desk; ratified by him.

What the singer reads after a Refresh that could not reach the host (the probe of B2 failed; the notice stays up, the caches are kept):

- EN: `The new version could not be loaded. Check your connection, then press Refresh again.`
- FR: `La nouvelle version n’a pas pu être chargée. Vérifiez votre connexion, puis appuyez de nouveau sur Actualiser.`

Source of the wording, all adopted, none coined: "could not be loaded", « n’a pas pu être chargé(e) », "Check your connection" and « Vérifiez votre connexion » from `apps/web/src/lib/i18n.ts:1137` (`upload.err.readerLoadFailed`); "new version" and « nouvelle version » from `i18n.ts:926` (`update.notice`); "Refresh" and « Actualiser » from `i18n.ts:927` (`update.action`); « appuyez sur » ratified for the Guide at 13:54. The connective wording is the desk's. French agreements: « version » feminine, so « chargée »; U+2019 apostrophe; no colon.

For Code: add one key to `i18n.ts` beside `update.notice` (`:926`), for example `update.offline` (DESK DEFAULT name), both languages, and show it in the notice after a Refresh whose probe failed. The Refresh path stays in `apps/web/src/lib/update-check.ts` as the brief says; the page receives wiring lines only (`+page.svelte` has one line of headroom). A test pins both strings as written, with the literal characters. List the key in the report.

**Correction, 2026-10-21 21:2x, the desk:** the sentence above that `sw.js` serves the shell and assets from caches, so that only getting a new version needs the network, is wider than the code supports. The dictionary needs the manifest fetch on every start (`apps/web/src/lib/loader.ts:283`, `:623-631`), so a start with no connection runs without it (INBOX 2026-10-21 21:2x). The ratified strings are unchanged: they say only that the new version could not be loaded.
