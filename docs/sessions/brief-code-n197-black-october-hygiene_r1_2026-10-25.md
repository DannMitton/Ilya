# Brief r1: N.197, Black October repository hygiene for Ilya (2026-10-25)

Written by Fable 2026-10-25 about 23:3x, during Dann's Black October audit (audit record: `black-october-audit.md`, delivered to Dann in that session). N.197 is a DESK DEFAULT number, offered here and ruled in by Dann; it is unruled until he says so. It sits beside N.196 (security headers, brief r1 of 2026-10-22) and does not depend on it.

For Code in a cloud session, Sonnet, on a lane cut from `Shane` by Dann. **"NOT ESTABLISHED beats a complete invented answer."** Every claim about the code carries a `path:line` Fable read on 2026-10-25 over the device bridge, or says NOT ESTABLISHED. One commit per step on the lane; no pull request; no other branch; no brief file in any commit.

Cost, a range and not measured: about 15k to 40k Sonnet tokens. No test count moves.

## 1. The need and the done state

Dann 2026-10-25 21:56 asked for a scan of his Mac and online presence against the Black October 2026 disclosures. The repository findings were four, none a confirmed leak:

1. The CI workflow runs on Node 20 (`.github/workflows/ci.yml:24` and `:83`, `node-version: 20`). The Node.js security releases of 2026-10-21 (CVE-2026-111497, CVE-2026-105483, CVE-2026-106069) shipped fixes for the 22, 24, and 26 lines only (nodejs.org release pages for 22.23.4, 24.22.1, 26.12.1, read 2026-10-25). Node 20 received none. Vercel builds the site on 24.x (project setting, read 2026-10-25), so CI and the build disagree.
2. The workflow sets no `permissions:` block (`ci.yml`, whole file read), so the `GITHUB_TOKEN` carries the repository default. Both jobs only read the checkout and upload a report.
3. `.gitignore` has no rule for `.env.local`, `.env.*.local`, `*.pem`, or `*.key` (whole file read). `apps/web/.env` is tracked (git ls-files, 2026-10-25) and holds one public flag, `PUBLIC_INCLUDE_MARKUP_INSIGHTS` (`apps/web/.env:1`). Tracking it is fine while it stays public; the gap is that a local secret file would be committed by the same path.
4. No `SECURITY.md`, and `CONTRIBUTING.md` names no private channel for a vulnerability report (whole file read). GitHub's Security tab shows no policy (read by the OSINT pass, 2026-10-25).

Done when: CI runs on Node 24 with read-only token permissions, the ignore rules exist, a security contact is published, the eight gates sit at baseline, and nothing about how the app works changes.

## 2. The steps, one commit each

1. `ci.yml`: change both `node-version: 20` to `node-version: 24`; add at top level, after `concurrency:`, the block `permissions:` with `contents: read`. Run the test job's steps locally on the lane to confirm nothing in `pnpm test` or the build depends on Node 20 behaviour. NOT ESTABLISHED whether the Playwright job's standing failure (every run 2026-10-15 to 2026-10-23, per the GitHub notification mails) changes; it is not this brief's to fix.
2. `.gitignore`: append a block headed `# Local secrets never leave the Mac` with `.env.local`, `.env.*.local`, `*.pem`, `*.key`. Leave `apps/web/.env` tracked.
3. Security contact. DESK DEFAULT: a section `## Reporting a Security Problem` at the end of `CONTRIBUTING.md`, three sentences: report privately to dannmitton@gmail.com with the word Security in the subject; do not open a public issue for it; an acknowledgement within seven days. No `SECURITY.md` file, because an untracked file blocks `ilya-ship.sh` (its untracked-files refusal, read 2026-10-25) and a tracked section does the same job. French parity: CONTRIBUTING.md is English-only today, so no French is owed by this step.

Not in this brief, by DESK DEFAULT: pinning the four actions by sha instead of tag. All four are first-party or widely used (`actions/checkout@v4`, `pnpm/action-setup@v4`, `actions/setup-node@v4`, `actions/cache@v4`, `actions/upload-artifact@v4`; `ci.yml:17-20, 77-80, 93`), and sha pins add upkeep Dann has not asked for. His to wave in.

## 3. Outside the tree, done by Fable with Dann's yes

The Vercel project `ilya` still lists `dannmitton.com` as a domain while DNS points that name at GoDaddy (Vercel project read and dns.google, 2026-10-25; Vercel's notice mail of 2026-10-22). Removing the entry from the project settings is a dashboard action, reversible, and needs no code.
