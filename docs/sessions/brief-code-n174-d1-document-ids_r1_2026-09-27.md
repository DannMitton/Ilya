# Brief for Code, r1: N.174 slice D.1, the document ids

Written by the desk 2026-09-27 on Dann's go-ahead ("D.1", 03:21). Spec:
`docs/sessions/spec-n174-text-markup-insights_r1_2026-09-26.md`. Plan:
`docs/sessions/plan-n174-change-list_r1_2026-09-27.md`, section D.1. Every `path:line`
here was read by the desk at `da3097f` this session; if the tree has moved, the tree wins,
and say where it moved.

**What the singer sees must not change.** No shown string changes in this slice. The
desk compares 60 screenshots from before and after once you push.

## Before you start

Fetch `Shane`, and confirm HEAD is `da3097f` or a descendant of it. One writer on `Shane`
at a time: if anything else landed, rebase before you deliver.

## The change

All paths are under `apps/web/src/` unless given in full.

1. `lib/destinations.ts:36` `StudioDocument` becomes `'text' | 'markup' | 'insights'`. `:46` `TabId` takes the same two new members in place of `'transcription'` and `'shane'`.
2. `lib/destinations.ts:55` `DEFAULT_SURFACE`, and `:64-75` `surfaceFor`, use the new ids.
3. `lib/destinations.ts:98-113` `restoreSurface`: add `case 'text'` and `case 'markup'`. **Keep** `case 'transcription'` (returns the Text surface) and `case 'shane'` (returns the Markup surface under the same gate as `'markup'`). Comment them as the migration for values written before N.174. The function's parameter stays `string | null`.
4. `routes/+page.svelte`, id literals: `:339`, `:1564`, `:2093`, `:2129`, `:2806`, `:2808`, `:2810`, `:4994`. The write at `:4117` passes `tab` through and needs no literal change; it now writes the new ids. The read at `:4309` goes through `restoreSurface` and needs no change.
5. `lib/components/HeaderBar.svelte:42`, `:45`: `class:tab-transcription` and `class:tab-shane` become `class:tab-text` and `class:tab-markup`, with their rules at `:73`, `:93`, `:147`, `:163`, `:210`, `:223`.
6. `routes/+page.svelte:4507`, `:4983` build `tab-{activeTab}`: rename the rules `.app-content.tab-transcription` (`:5716`) and `.app-content.tab-shane` (`:5735`). Search the whole `apps/web` for any other `tab-transcription` or `tab-shane` selector and rename it too.
7. `lib/components/DeskHead.svelte:53`, `:58`, `:63`: the ids in `pairIds` and the two `case` labels. Its DOM ids `tab-{id}` and `tabpanel-{id}` (`:104-129`) and `Drawer.svelte:419`, `:438` follow automatically; confirm no selector or test reads the old ones.
8. `lib/i18n.ts:105`: key `tab.transcription` becomes `tab.text`; the value is unchanged. Update its one reader, `DeskHead.svelte:58`, and the comments that name the key (`i18n.ts:102`, `:111`, `:141`, `:601`; `i18n.test.ts:11`). Delete `tab.fit` (`:108`) and its comment at `:115`: nothing reads it.
9. `lib/wall.ts:6-7`: export `INCLUDE_MARKUP_INSIGHTS`, true when `import.meta.env.PUBLIC_INCLUDE_MARKUP_INSIGHTS === 'true'` **or** `import.meta.env.PUBLIC_INCLUDE_SHANE === 'true'`. Keep both sides as literal comparisons so Rollup still removes the gated code when both are unset. Rewrite the file comment.
10. Importers of `INCLUDE_SHANE` to `INCLUDE_MARKUP_INSIGHTS`: `lib/destinations.ts:30`, `:103`, `:105`; `DeskHead.svelte:26`, `:53`; `routes/+page.svelte:97`, `:1562`, `:2366`, `:4558`, `:4636`, `:4828`. Comments naming the gate (`IntakePanel.svelte:48`, `Drawer.svelte:458`, `DeskHead.svelte:41`, `+page.svelte:4660`, `vite.config.ts:8`) follow.
11. `apps/web/.env:1` becomes `PUBLIC_INCLUDE_MARKUP_INSIGHTS=true`. `apps/web/.env.example:3-4` the same name. The Vercel project has no such setting (desk read it 2026-09-27), so the tracked `.env` is what every deploy reads.
12. `ARCHITECTURE.md:131`, invariant 10, "Stored ids never change": reword to say a stored id changes only with a migration that reads both the old and the new value, and name `restoreSurface` as the example. Add one clause: amended by N.174, 2026-09-27.
13. Comments in the files you touch that name the documents `'transcription'` or `'shane'` as ids (`+page.svelte:1558`, `:2089`, `:2224`, `:2279`; `DeskHead.svelte:59`): reword to the new ids. Leave every other comment for slice D.3.

## Tests

- New `lib/destinations.test.ts`: `restoreSurface('transcription')` equals `restoreSurface('text')`, and `restoreSurface('shane')` equals `restoreSurface('markup')`; each new id round-trips through `surfaceFor` and `tabIdFor`; `null` and an unknown string give `DEFAULT_SURFACE`.
- If `lib/wall.ts` can be tested with a stubbed `import.meta.env`, test that each name alone opens the gate. If it cannot, say so in the memo and do not restructure the file to make it testable.

## Done when

- All eight gates pass. State the new web-test count; the desk moves the baseline in `ilya-ship.sh`.
- Playwright desktop 28 and phone 2 stay green.
- A search of `apps/web/src` for `'transcription'` and `'shane'` as quoted strings finds only the two migration `case`s in `restoreSurface` and their test.
- On localhost, with `ilya:activeTab` set to `shane` by hand in the browser's storage before the reload, the page opens on Markup. **State your expectation before you measure** (CONTRACT §5, THE CONTROL RULE).
- A memo of fifteen lines or fewer in `docs/sessions/memo-code-n174-d1_r1_2026-09-27.md`: what changed, the tests, the localhost observation, and a section titled "NOT ESTABLISHED". **NOT ESTABLISHED beats a complete invented answer.**

## Do not

- Do not move any file under `lib/shane/`. That is D.2.
- Do not rename `shane.profile.v1` or `shane.profiles.v2` (`lib/shane/profileStore.ts:66-67`). They stay, by the plan.
- Do not change any string a singer sees.
- Do not commit. Dann ships with `ilya-ship.sh`; `git add` the new test file first.
