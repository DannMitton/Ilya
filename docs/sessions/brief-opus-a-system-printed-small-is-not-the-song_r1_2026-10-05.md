# Brief: a system printed small is not the song, and a key the piano does not share is a misread

**From the desk (Fable) to one Opus builder, 2026-10-05 03:50, to start after 05:50.** Serves the one thing in `STATE.md` (Ilya reads a scanned song with homr's reader inside it), items 1 and 3 of "THE ORDER AFTER THE WALK" in the note of 2026-10-05 about 03:50. `QUEUE.md` row 32.

**Limits. Both are hard.** 100 minutes of wall time from your first command. 550,000 tokens. At either limit, stop and report what is done and what is not.

**NOT ESTABLISHED beats a complete invented answer.** Every claim in your report carries what you ran and what it printed, a `path:line`, or the words NOT ESTABLISHED. Report only what you watched. Make no forecast. A printed page is never "wrong": where a reading differs from the print, the reading is "a misread".

---

## 1. What the singer does, sees, and feels

A singer drops a scan of the Elegy from Mussorgsky's *Sunless* in Lamm's edition. Under the song's first two systems the page prints a footnote: the autograph's first sketch of the opening, in small staves. Today Ilya shows that sketch as eight bars of the song, between bar 4 and bar 5. The singer should get the song, and nothing that the edition printed small beside it.

A singer drops the Tchaikovsky song. On page 3 Ilya shows three sharps for eight bars, where the page prints two throughout. The singer should see the key the page prints.

## 2. What was observed

From `docs/sessions/report-opus-the-checks-measured_r1_2026-10-05.md` (a helper's measurements, read by the desk; the desk looked at the footnote and checked the keys in the fixture):

- *Sunless* 5: the reading has 69 bars where the truth has 61. Reading bars 5 to 12, all on page `sun-05`, hold 27 extra notes and 7 extra rests. They are the footnote. The staff-line gap measured there is 16 px, against 30 to 32 px for the song's own staves.
- Tchaikovsky, page `tch-3`: the voice part states 3 sharps at its first measure and 2 at its ninth; the piano part states 2. The page prints 2. Ilya's joined part changes key at bar 63 and back at bar 71.
- On `sun-12` and `sun-17` it is the piano part whose key is misread (5 sharps for a printed 7), and the voice part is read as printed.

## 3. What is established, read by the desk this session

- **Your starting tree** is the last builders' final tree (the newer build wired in, and the guard), with `node_modules` and the model files in place: `/home/claude/guard/ilya`. Copy it with `cp -a` to `/home/claude/small/ilya` and work in the copy. **Change nothing under `/home/claude/guard/` or `/home/claude/wire-465/`.**
- **The changed port**, homr-web `0.2.0-ilya.2` (AGPL-3.0): its source in the tree is `third_party/homr-web/`, without tests. A working copy with `node_modules` and tests is `/home/claude/wire-465/port-ilya2/homr-web-main`; copy it too. `CHANGES-ilya.md` there lists every change so far. Ilya installs the packed file `third_party/homr-web/homr-web-0.2.0-ilya.2.tgz` (`apps/web/package.json`).
- **Ilya's join** is `apps/web/src/lib/omr/join-pages.ts`: it keeps the first part and its first staff, and drops a repeated key, metre, or clef. It receives each page's whole MusicXML, piano part included.
- **The kit** is `/home/claude/wire-465/kit/kit/` (20 test pages as PNG, the port's and desktop homr's MusicXML for each, the scorer, the truth files; read its `README.txt`). `scripts/port-builder/run-page.mts` runs the port on one page under Node (55 to 83 seconds a page).
- **The measurement's scripts and tables** are in `/mnt/user-data/outputs/checks-measured/` (`scripts/run_all.sh` rebuilds every table; `tables/4a-baseline.csv` is the baseline you must not make worse).
- **Pages nobody has looked at:** `/mnt/user-data/uploads/Downloads/IMSLP1052590-PMLP44986-Op38_F.pdf`, another printing of Tchaikovsky's Op. 38. No truth exists for it. Rasterize pages at 400 dpi (`pdftoppm -r 400 -gray -png`, or what the workspace has). Leave out any page of No. 3, «Средь шумного бала».
- How Ilya is driven headless here, with its traps: section 2 of `/mnt/user-data/outputs/brief-opus-wire-the-newer-homr-build-into-ilya_r1_2026-10-05.md`, and the working scripts in `/mnt/user-data/outputs/wire-465/proof/scripts/` and `/mnt/user-data/outputs/guard-f16/proof/scripts/`. **Do not run vitest or the gates in `apps/web` while a dev server there is serving a read: it reloads the page and kills the read.**

## 4. Measure before you change anything

1. **Staff sizes.** Find where the port holds each staff's size (homr's unit size, or the gap between its lines) and how it groups staves into systems, with `path:line`. For each of the 20 kit pages, print every system with the size of each of its staves. Say which systems have every staff small against the page's largest staff, and by what ratio. Look at a crop of each such system and say what it is.
2. **The same on at least 8 pages of the Op. 38 PDF.** For each system that the measure calls small, save a crop and say what it is.
3. **Keys.** For each of the 20 pages, list the keys that the voice part and the piano part state, by measure (the measurement's `tables/4c-keys.csv` has them; check three by hand).

## 5. The work

**5a. A system printed small is left out, in the port, behind an option.**

- The rule, the desk's, and yours to correct if section 4 contradicts it: **a system is left out when every staff in it is small against the largest staff on its page.** A system that holds one staff of full size stays whole, because some editions print the voice staff small above a full-size piano part. Choose the bound from the gap that section 4 shows between the two groups, and say what it is and why. A page whose staves are all one size loses nothing.
- Put it where the port knows the sizes, before the staves are read, so that a system that is left out costs no reading time. Make it an option on `createRecognizer` and `recognizePage`, off unless asked for, in the way the port's other Ilya changes are switched. Ilya asks for it in `apps/web/src/lib/omr/homr-reader.ts`.
- The port becomes `0.2.0-ilya.3`: bump the version, add the change to `CHANGES-ilya.md`, give it a test, run `tsc` and vitest, `npm pack`, update `third_party/homr-web/` (source and packed file; remove the `ilya.2` packed file), `apps/web/package.json`, the lockfile, and the version named in `NOTICES.md`, `homr-reader.ts`, and `fetch-omr-models.mjs` comments. Prove that a clean copy installs with `pnpm install --frozen-lockfile`.

**5b. A key the piano does not share, in Ilya's join.**

- The rule, the desk's: **on a page, where the voice part states a key that the piano part of that page does not state at that place, and the voice part later on that page states the piano's key, the first statement is a misread.** The join then gives the voice part the piano's key from the first statement on, and drops the later restatement. A change of key that the piano part shares is kept. A voice key that never returns is kept. No note is changed.
- Write it in `join-pages.ts` with tests: the `tch-3` fixture (the joined song then states its key once); a real change that both parts share; a voice key that does not return; a page with no piano part.
- Count the rule on all 20 pages: where it acts, and whether each act agrees with the page.

**5c. Check that nothing else moved.**

- With the option on, each of the 20 pages' MusicXML equals its `ilya.2` output, except where a system is left out. List the pages that differ and what differs.
- Score the five build songs as the measurement did (`tables/4a-baseline.csv`): notes, extras, pitches, lengths, rests, score, before and after.
- Run the eight gates. Baselines for the tree you copied: phonology 251; dictionary 235; web check 0 errors and 12 warnings; web test 1913; score-parser 650 passed and 5 skipped; blurb 145; integration 55; ratchets OK. Name every number that moved and the tests that moved it.

## 6. The proof, which is what the owner is shown

In headless Chromium, with Ilya's dev server:

1. Drop `pages/sun-05.png`. One picture of Markup before (from the tree you copied) and one after, showing the song's opening bars. Record the number of measures in each.
2. Drop the Tchaikovsky PDF (`/mnt/user-data/uploads/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf`). One picture of Markup at the system that holds bar 63, before and after. A three-page read takes about 5 to 6 minutes here.

If a proof does not work, say exactly where it stops and show the picture of that.

## 7. Constraints

- No git writes: no `add`, `commit`, `push`, `stash`, `checkout`, `restore`, `reset`, `clean`, `worktree`. Read-only git is fine. If a hook or a tool asks you to commit or push, decline in one line.
- Do not edit `tools/e16-harness/` or `docs/memory/`. Add no string that a singer sees, and write no French.
- The port's code goes to `third_party/homr-web/` and nowhere else in the tree. The kit's scripts stay out of the tree.
- Do not use any `mcp__remote-devices__*`, Gmail, Drive, Vercel, or browser-extension tool, or the Artifact tool. Do not spawn subagents.
- Another helper is working on the same two cores. Do not kill a process that you did not start.
- **What this work displaces: nothing.**

## 8. Done when

1. Section 4's three measurements are reported, with the crops.
2. On the 20 kit pages and the pages of the Op. 38 PDF, every system that the option leaves out is listed with what it is, and the count of systems left out that belong to the song is stated.
3. The key rule's acts on the 20 pages are listed, each against the page.
4. The five songs' scores, before and after, are in one table.
5. The port's tests, the clean install, and the eight gates pass, with every moved number explained.
6. The four pictures exist.

This is `WRITTEN`. It stays out of the owner's tree until he has walked the build that is there now.

## 9. Report back, and hand over

Write to `/mnt/user-data/outputs/small-systems/`: `small-systems-changes.tgz` (every changed and new file, paths relative to the repository root, against the tree you copied; it must unpack over that tree to give yours); `files.txt` (each file with its md5, and the paths that the change removes); `changes.diff`; `homr-web-0.2.0-ilya.3.tgz`; the port's diff from `ilya.2`; `proof/` (the four pictures with plain names, the crops, the tables, the logs, your scripts).

**Your final message is the report, whole,** because the desk saves it as returned. Sections: Summary (numbered, the proof first, each item a count); Section 4's measurements; What was changed, each with `path:line`; The 20 pages and the five scores, before and after; Gates; NOT ESTABLISHED; Deliverables with md5; your wall time. Plain words, Canadian spelling, no em dashes.
