# Research brief: the established practice for N.204

r1, 2026-11-23, by the desk (Opus 5). For Sonnet. Cap 350k.

## 0. Why this exists

Dann asked, 2026-11-23 20:49, transcribed as written: *"If there are already protocols in computer science that suipport the processes I have vibecoded here, please invoke them! I am not a programmer. I'm sure the filed of computer science fully recognizes an app in the current state of ILya and has well-worn approaches that will help us. Use them. Reserach if you have to, that's valid."*

The desk had written a plan for auditing and restructuring Ilya without consulting the literature on doing exactly that. You are fixing that.

## 1. The system this is for

Ilya is a Russian lyric diction tool for classical singers: a SvelteKit and TypeScript progressive web app. Measured by the desk 2026-11-19:

- **134,671 lines of source in 552 files**, outside tests and docs. 95,493 lines in `apps/web/src/lib` across 423 files; the rest in four local packages.
- **34,439 comment lines**, one for every 3.9 lines of code. Zero TODO or FIXME markers.
- It **grew organically from a single page of HTML** and its folder structure records where it grew rather than what it does.
- **The files that matter are full.** Thirteen of sixteen size-ratcheted files sit within five lines of their ceiling and six are at it exactly, so no line can be added to them until a split makes room.
- **Seventeen facts have two or more homes**, found in five of sixteen reading areas so far.
- **142 test files read source as text**, so a rename can break a test that never imports the renamed thing.
- Its top-level page file is 5,533 lines that own no rule of their own and exist to join other things together.
- One developer, who is a musician and not a programmer, with AI assistance.

**The goal:** reorganize it around what it does for a singer rather than around how it grew, make it legible and navigable to developers who have never met the author, and be able to show that this happened rather than assert it.

## 2. What to research

Six leads, named by the desk from its own knowledge and **not verified**. Treat each as a starting point, not a conclusion. If a lead turns out to be the wrong tool for this system, say so; that is a finding, not a failure. If you find a seventh thing that fits better, bring it.

1. **Software architecture reconstruction or recovery.** Recovering a system's architecture when it has one only implicitly. What the methods are, what they need as input, what they cost, and what they are known to get wrong.
2. **Reflexion models**, associated with Murphy, Notkin, and Sullivan. The desk believes these map source onto a stated high-level model and return convergences, divergences, and absences. Confirm or correct that, and find what the method requires of the model and of the mapping.
3. **Modularity measurement from a dependency graph**, in particular propagation cost and core size, associated with MacCormack, Rusnak, and Baldwin. **This is the highest-value lead:** the plan needs a number for how modular Ilya is, taken before and after. Find what the metric actually measures, what it needs, what counts as a good or bad value and whether that is comparable across systems, and what its critics say.
4. **The Mikado method** for large restructurings.
5. **Package by feature against package by layer**, and the argument that a structure ought to announce what the application does. Find the actual sources rather than blog restatements where you can.
6. **Ubiquitous language** in domain-driven design, and whether a project glossary of this kind has any evidence behind it.

## 3. How to read

**Primary sources, read in full.** Dann's standing rule, 2026-11-16 17:10, transcribed as written: *"I expect you to fully read the papers without relying on their summaires. We have been burned in the past from this inattention so I require a full read of the paper to apply its contents."*

- An abstract, a search snippet, a blog restatement, or a wiki page is **never** the source of a claim.
- Where you cannot obtain a source, **say so and name what you could not get**. Do not substitute a secondary account. Mark any such entry NOT OBTAINED.
- Where a source is a book rather than a paper, say so, and work from whatever substantial primary material is actually available to you, marking what you read.
- Peer-reviewed work and practitioner work are both admissible. Label which each is.

## 4. What to report, per source

1. Full citation: authors, year, title, venue, and the URL you read.
2. **Read in full, read in part, or NOT OBTAINED.**
3. Peer-reviewed, or practitioner.
4. **What it actually says**, in your own words, not what it is famous for.
5. **What it would have Ilya DO differently**, concretely, against section 1's description of the system. A source that changes nothing we would do is reported as that.
6. What it needs as input, and whether Ilya can supply it.
7. **Its limits and its critics.** A method with no stated failure mode has not been read carefully.

## 5. What to report overall

- **Which of the six leads earn their place and which do not**, with the reason.
- **A recommended order of work** drawn from the literature rather than from the desk's plan, so the desk can compare the two. Do not read the desk's plan first; form this from the sources.
- Anything the literature says about doing this work on a system of this size with one developer. Most of this literature assumes a team and an organization.

## 6. Files

- Report: `docs/sessions/research-n204-sources_r1_2026-11-23.md`. Check with `ls` before you name it.
- PDFs and saved pages: `~/Downloads/_desk-2026-11-23/n204-sources/`, created by you. Name each `Surname_I et al (Year) - Title - VENUE.pdf` where the source allows it. The desk files them into Dann's library later; that folder is not reachable from this session.
- Write nothing else. Nothing under `docs/memory/`. No code. No git write command of any kind.
- Create no `.bak` file; the bridge cannot delete one.

## 7. What you could not establish

Carry a section for it. **NOT ESTABLISHED beats a complete invented answer.**

## 8. Style

Canadian spelling, Oxford comma, no em dashes, sentence case headings. Do not write "simply", "just", "easy", "straightforward", "honestly", or "genuinely". No exclamation marks. Write for a reader who is a musician and an academic rather than a programmer: where a term is unavoidable, define it once in plain words.
