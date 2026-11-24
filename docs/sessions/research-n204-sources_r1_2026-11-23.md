# Research report: established practice for N.204

r1, 2026-11-23, by Sonnet, for the desk. Answers `brief-sonnet-n204-research-sources_r1_2026-11-23.md`. I did not read the desk's plan. Sources are saved in `~/Downloads/_desk-2026-11-23/n204-sources/`.

## 0. Read this first

1. **Reading depth fell short of Dann's rule for most sources.** Full reads: 3 substantial sources (Parnas 1972, Martin 2011, MacCormack et al. working paper 2004/2006) plus two thin authors' pages for the Mikado method. Partial reads: 11. Obtained but not read: 2. NOT OBTAINED: 12 (section 8). Each entry below says which it is, and what I skipped.
2. **Labels.** "Source says" means I read it this session. "Inference" means my own reasoning from what I read about Ilya's description in the brief. "Desk knowledge" means something I know from training that I did not verify here; treat it as NOT ESTABLISHED.
3. **The highest-value lead (propagation cost) is real, but its authors say the number has no meaning on its own.** It is a before and after instrument for one system, with caveats that bite hard on Ilya because the plan splits files (section 3, lead 3).

## 1. Verdict on the six leads

| Lead | Verdict | Reason |
|---|---|---|
| 1. Architecture reconstruction | Earns a place as vocabulary and as a warning, not as a tool to run | Automatic recovery is only as good as its inputs and has no trusted ground truth for a system like Ilya |
| 2. Reflexion models | **Earns its place. Best fit.** | Takes the author's own picture of the system and tells him where the code disagrees. Needs exactly what Ilya has: one person who knows what the system is meant to do |
| 3. Propagation cost and core size | Earns its place, with conditions | Gives a before and after number, but the number moves when file counts change, and "core size" was not in the sources I could read |
| 4. Mikado method | Not established | The book was not obtainable. Only two thin pages by the authors were read |
| 5. Package by feature or layer | Earns its place, through Parnas rather than through the feature/layer debate | Parnas 1972 gives a testable criterion and a way to count the damage of duplicated facts |
| 6. Ubiquitous language | Earns a small place as a cheap practice. No evidence for its effect | The systematic review found communication benefits reported, thin empirical evaluation |
| Seventh: Big Ball of Mud | Earns its place | Names Ilya's situation and gives the strategy vocabulary, plus a caution on rewrites |

## 2. Per-source entries

### 2.1 Murphy, Notkin, and Sullivan 1995 (reflexion models)

- **Citation:** Murphy, G. C., Notkin, D., Sullivan, K. (1995). Software reflexion models: bridging the gap between source and high-level models. SIGSOFT '95 (FSE), Washington, D.C. URL read: https://www.cs.kent.edu/~jmaletic/cs63902/Papers/Murphy95.pdf
- **Depth:** Read in part. Read the abstract, introduction, worked example, case studies, performance, discussion, related work, conclusion. Skipped the Z-notation formal schemas in section 3 beyond the first one.
- **Type:** Peer-reviewed.
- **What it says.** The engineer supplies three inputs: a high-level model (boxes and arrows), a source model extracted from code (their example: a calls relation, 15,000 tuples over 3,000 entities in 250,000 lines of C), and a declarative mapping from source files or directories to the boxes, written with regular expressions. A tool then computes three kinds of arcs: convergences (code agrees with the model), divergences (code has an arc the model did not predict), and absences (the model predicts an arc the code lacks). Each arc carries a count and the underlying source tuples can be inspected. The desk's belief is confirmed.
- **Corrections and details the desk did not have.** The mapping may be partial; only the parts of interest need entries. The approach is syntactic: it has no knowledge of what the model means, so "it is the engineer's responsibility to ensure that it makes sense to compare" the two models (the paper's own example: comparing a calls diagram with an #include structure "would probably be meaningless"). Engineers iterate: rough map, inspect, refine. A first model for NetBSD took one hour of the developer's time after the source model was extracted. Excel, reengineered by one Microsoft engineer, used a mapping of almost 1,000 entries. Time to compute was a minute or two for large systems.
- **What it would have Ilya do.** Dann writes down what Ilya does for a singer as a small box-and-arrow model (capabilities, not folders). A mapping assigns files to boxes. The divergences list is a concrete, countable list of hidden couplings. Absences show where the intended design does not exist in code. The 5,533-line page file, which owns no rule and joins other things, would show as a source of many divergences.
- **Input needed.** A high-level model (only Dann can supply), a file-level dependency extraction (Ilya can supply, tool choice is NOT ESTABLISHED, see section 5), and a mapping.
- **Limits.** Syntactic only. The paper itself plans to "track the use of some declarative maps across the evolution of several systems" to learn how well a map survives code change, so map upkeep cost is stated as unknown. Its case evidence is anecdotal: a handful of uses, each by the tool's authors or one engineer.

### 2.2 Murphy, Notkin, and Sullivan 1997 (extensions)

- **Citation:** Murphy, G. C., Notkin, D., Sullivan, K. (1997). Extending and managing software reflexion models. UBC Department of Computer Science Technical Report TR-97-15. URL read: https://www.cs.ubc.ca/sites/default/files/tr/1997/TR-97-15_0.pdf
- **Depth:** Read in part. Read the abstract, introduction, the iteration discussion, and located the conclusion. Did not read the typed-model and tagging sections in detail.
- **Type:** Technical report from a university department (not peer-reviewed as filed).
- **What it says.** Reports shortcomings found when the method was used on a design conformance task, an implementation change, and the Excel reengineering. Two extensions: typed models (separate calls from global-variable references) and tagging and annotation (hide inconsistencies until they change; record which have been explored). In the Excel reengineering one Microsoft engineer iterated for more than four weeks, expanded the mapping to over 1,600 entries, and left a "significant amount of uninvestigated inconsistency" in parts immaterial to the task.
- **For Ilya.** The method is meant to be used to a task's sufficiency, not to completion. That sets a stopping rule for a solo developer. It is also the only one-person precedent in this literature set.
- **Limits.** As 2.1. The report says inconsistency management is the hard part, not computing the model.

### 2.3 MacCormack, Rusnak, and Baldwin (working paper for the 2006 Management Science article)

- **Citation:** MacCormack, A., Rusnak, J., Baldwin, C. (2004; forthcoming in Management Science 2006, vol. 52, no. 7, 1015-1030). Exploring the structure of complex software designs: an empirical study of open source and proprietary code. Harvard Business School Working Paper 05-016. URL read: https://www.hbs.edu/ris/Publication%20Files/05-016.pdf
- **Depth:** Read in full as prose, except figure captions and the reference list. **This is the working paper, not the published article.** Numbers may differ from the journal version; I could not obtain it.
- **Type:** Working paper that became a peer-reviewed article.
- **What it says (the metric).** Build a design structure matrix (DSM): rows and columns are source files; a mark means "file i calls a function in file j". Raise the matrix to successive powers to find indirect dependencies, sum them (including path length zero, so a file always affects itself) to get the visibility matrix, with entries limited to 0 or 1. **Propagation cost is the share of cells in the visibility matrix that are marked.** In their words, the proportion of elements that could be affected, on average, when a change is made to one element. In their worked six-element example it is 42%. Cycles are handled by capping the matrix power at the number of elements. A second metric, clustered cost, scores each dependency by the size of the cluster it sits in, after a clustering step that sets aside "vertical buses" (files called by more than a threshold share of the system, initially 10%). Parameters (bus threshold 10-100%, lambda nominally 2) have "no right answer"; the authors vary them to test sensitivity.
- **What it needs.** A file-level call dependency extraction. They used a commercial extractor (Understand for C++), chosen because it handled indirect calls and exported matrix form. Unit of analysis: the source file, justified because tasks, version control, and header comments all work at file level.
- **Values.** Linux (about 4,000 files in version 2.5; a size-matched early version in the comparison): 5.16%. Mozilla first release (over 1,500 files): 17.35%. Mozilla after the 1998 redesign: 2.78%, the paired comparison dropping dependencies from 2.4 to 1.3 per thousand file pairs. Over time Mozilla's propagation cost moved from a 15-18% band to a 2-6% band. The redesign removed redundant files and cut dependencies by about 50%. Mozilla had over one million lines at the time; the redesign was by "a small team of developers, most of who worked for Netscape" over several months.
- **Comparability.** The paper states: "the absolute level of modularity for a product has no meaning; we can only determine that product A is more (or less) modular than product B." Comparisons they trust are of the same system over time, and of systems of comparable size and function. They also note that the fall in clustered cost during the Mozilla redesign partly came from fewer files, "hence the need for the paired comparisons we conduct".
- **Limits stated by the authors.** Two products only, "exploratory". Function calls are one dependency type among several. Clustering is random-restart and varies by a small margin each run. Causes of the structure (organization versus the architects' choices) cannot be separated.
- **For Ilya.** Same-system before and after is the use the authors endorse. See lead 3 in section 3 for what splitting files does to the number.
- **"Core size"** (desk's term) does not appear in this paper. NOT ESTABLISHED here; see section 8.

### 2.4 Pisch, Cai, Kazman, Lefever, and Fang 2024 (M-score and critique of PC)

- **Citation:** Pisch, E., Cai, Y., Kazman, R., Lefever, J., Fang, H. (2024). M-score: an empirically derived software modularity metric. ESEM '24, Barcelona. URL read: https://par.nsf.gov/servlets/purl/10590179
- **Depth:** Read in part. Read the abstract, introduction, the isolated-files study (RQ1 to RQ3), the metric definition, EQ3 and the threats to validity. Skipped most of the stability tables.
- **Type:** Peer-reviewed.
- **What it says.** Studied 1,220 releases of 37 open source projects. Their definition of PC: transitive closure of the file dependency graph, divided by the square of the file count. Their critique of PC: it is "sensitive to project size", with larger projects always getting smaller scores, "unsuitable for comparing projects with different sizes". They say PC "is inversely proportional to the square of file count". They also critique Mo et al.'s decoupling level (DL): adding one isolated file can move it by more than 20%. All 37 projects had isolated files (in jdt-core, 48.9% of files). Isolated files are common because of framework use, dependency injection, dynamic loading, tests, examples. Their new M-score combines a size penalty on modules over 5 files, a cross-layer dependency density, and within-module density, and holds steadier under isolated files. It correlates with maintenance measures taken from commit history.
- **Limits stated.** Projects were mostly Apache projects in Java, C, C++, and C#. Dependencies came from one tool (Understand); another tool could change results. Maintenance ground truth is derived from history and "may not reflect real maintenance effort". M-score has one team's validation and no independent replication in what I read.
- **For Ilya.** Two warnings: (a) any file split raises N and may lower PC mechanically; (b) many static-analysis tools cannot see links made through frameworks, dependency injection, or reading source as text. Inference: Ilya's 142 tests that read source as text create dependencies no import-graph tool will see.

### 2.5 Cai, He, Qian, Kochinski, Zhang, Jaspan, and Bianco (Google study)

- **Citation:** Cai, Y., He, L., Qian, J., Kochinski, Y., Zhang, N., Jaspan, C., Bianco, A. Understanding architectural complexity, maintenance burden, and developer sentiment: a large-scale study. Drexel University and Google LLC. Venue and year are NOT ESTABLISHED: the file I read names none. URL read: https://par.nsf.gov//servlets/purl/10590984
- **Depth:** Read in part: abstract, introduction, metric collection, regression results, implications, threats. Skipped the survey-analysis tables.
- **Type:** Peer-reviewed status NOT ESTABLISHED (appears to be a conference paper or preprint).
- **What it says.** 1,252 Google projects in C++ and Java, 7,200 survey responses. Higher propagation cost and more cycle anti-patterns went with a lower ratio of feature work to bug-fix work (measured by lines of code; PC also by active coding time). A one-unit rise in clique density was associated with a 1.7% fall in the feature-over-bug ratio. "To our surprise, there is no significant correlation between DL and any maintenance activity metrics", which the authors tentatively tie to dependency injection frameworks forming large modules. This is the only large-scale evidence I found that PC tracks something a developer cares about.
- **Limits stated.** Only Java and C/C++, only Google. Tool-dependent dependency extraction. They could not directly test architecture against sentiment. Older legacy projects might have fewer feature changes for other reasons. Projects were chosen to have at least one year of life, more than 500 files, and commits by at least 20 developers.
- **For Ilya.** Ilya has about 552 files, matching the 500-file floor, but one developer against a floor of 20. Inference: the correlations are not shown to hold for a solo project. The outcome measure (share of change effort that goes to feature work against bug-fixing) is something Ilya could compute from its own commit history without a new tool.

### 2.6 Li, Liang, and Avgeriou 2014

- **Citation:** Li, Z., Liang, P., Avgeriou, P. (2014). An empirical investigation of modularity metrics for indicating architectural technical debt. QoSA '14. URL read: https://sites.uom.gr/a.ampatzoglou/public_html/papers/li2014qosa.pdf
- **Depth:** Read in part: abstract and introduction only.
- **Type:** Peer-reviewed.
- **What it says.** Takes the average number of modified components per commit (ANMCC), computed from the commit log, as an indicator of architectural technical debt. Across 13 open source projects, two package-level modularity metrics (IPCI and IPGF) correlated with ANMCC.
- **For Ilya.** ANMCC needs only the commit log. It is a second, independent before and after measure that does not depend on any dependency extraction tool. Whether Ilya's commit history is clean enough to use is NOT ESTABLISHED.
- **Limits.** Not read beyond the abstract. Do not rely on this entry for more than the existence of the measure.

### 2.7 Ducasse and Pollet 2009

- **Citation:** Ducasse, S., Pollet, D. (2009). Software architecture reconstruction: a process-oriented taxonomy. IEEE Transactions on Software Engineering 35(4). URL read: https://typeset.io/pdf/software-architecture-reconstruction-a-process-oriented-7l4j2qqyzy.pdf (a mirror; I did not check it against the journal version).
- **Depth:** Read in part: abstract, introduction, vocabulary, challenges, goals, process discussion. Did not read the technique tables, the pattern-extraction section, or the conclusion.
- **Type:** Peer-reviewed survey.
- **What it says.** Architecture is not explicitly represented in code, and successful applications evolve, so the architecture "inevitably" erodes. They classify methods by goals, process (bottom-up, top-down, hybrid), inputs, techniques, outputs. In their usage "recovery" is bottom-up (infer groupings from code) and "discovery" is top-down (start from a hypothesized model). They name the reflexion model as the method that bridges a conceptual (intended) architecture and the concrete (as-built) one, and note that the conceptual one is "often inaccurate with respect to the concrete one". They stress that a reconstructed architecture is a basis for redocumentation and for keeping architecture and implementation in step.
- **For Ilya.** The sources say the intended architecture must come from a person. Ilya's author is the only available source for it.
- **Limits.** A survey of tools as of 2009; most tools named are not maintained. The survey excludes commercial tools.

### 2.8 Lutellier et al. 2018 and 2015 (recovery accuracy)

- **Citation:** Lutellier, T., Chollak, D., Garcia, J., Tan, L., Rayside, D., Medvidovic, N., Kroeger, R. (2018). Measuring the impact of code dependencies on software architecture recovery techniques. IEEE Transactions on Software Engineering. URL read: https://www.cs.purdue.edu/homes/lintan/publications/archrec-tse17.pdf. Companion (obtained, NOT READ): Lutellier et al. (2015) Comparing software architecture recovery techniques using accurate dependencies, ICSE SEIP, https://www.cs.purdue.edu/homes/lintan/publications/archrec-icse15.pdf.
- **Depth:** 2018 paper: read in part (abstract, introduction, conclusion). 2015 paper: obtained, not read.
- **Type:** Peer-reviewed.
- **What it says.** Nine recovery techniques on five open source systems, including a ground-truth architecture of Chromium that took "two years of collaboration with its developers". Better input (symbol-level dependencies against include-level) gave better recovered architectures, and "the highest scoring technique often changes when the input changes". The conclusion is that "more accurate recovery techniques are needed". The introduction cites a prior estimate (not read by me) that a medium system of 70K to 280K lines needs about 100 hours of an experienced person to build an accurate ground-truth architecture.
- **For Ilya.** Automatic clustering would produce a picture nobody has validated, from a graph with blind spots. Ilya's 134,671 lines are in the range where the cited estimate says ground truth is expensive; the author's own model plus reflexion is cheaper because the author is the ground truth.
- **Limits.** Evaluated on C, C++, and Java systems, not TypeScript or Svelte. The 100 hour figure is quoted from a source I did not read.

### 2.9 Parnas 1972

- **Citation:** Parnas, D. L. (1972). On the criteria to be used in decomposing systems into modules. Communications of the ACM 15(12), 1053-1058. URL read: https://www.cse.sc.edu/~mgv/csce590f20/ParnasCriteria.pdf
- **Depth:** Read in full (short lines filtered during reading; no substantive section skipped).
- **Type:** Peer-reviewed.
- **What it says.** Two decompositions of the same small program (a KWIC index). The conventional one makes each processing step a module (input, shift, alphabetize, output), "to get the first decomposition one makes a flowchart". The second makes each module hide one design decision "likely to change" (how lines are stored, how shifts are made, when alphabetization happens). A module is "a responsibility assignment rather than a subprogram". He compares them on three counts: changeability, independent development, and comprehensibility. Under the flowchart decomposition, changing the storage format changes every module; under the information-hiding one it changes one. His recommended starting point is a list of difficult or changeable design decisions, with each module designed to hide one. His own critique: his interface revealed more than necessary, by specifying an order that callers did not need.
- **For Ilya.** The brief's "seventeen facts have two or more homes" is, in Parnas's terms, a design decision known to more than one module. His method of testing a decomposition (list likely changes, count how many modules each touches) gives a measure independent of any dependency graph and one that Dann can supply from domain knowledge. His criterion is neither "by feature" nor "by layer". It is "by decision likely to change". Whether that coincides with what a singer would call a feature is an open question.
- **Limits.** The evidence is one toy example and the author's "subjective judgment" on comprehensibility, as he says himself. He also warns the second decomposition is slower if implemented naively with procedure calls (not a concern for Ilya).

### 2.10 Martin 2011 (Screaming Architecture)

- **Citation:** Martin, R. C. (2011, 30 September). Screaming architecture. The Clean Code Blog. URL read: https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html
- **Depth:** Read in full.
- **Type:** Practitioner blog post. No data.
- **What it says.** The top-level directory structure and highest-level package ought to announce what the application is for (his examples: health care, accounting), not what framework it uses (Rails, Spring). He credits Jacobson's "use case driven approach" (book not read). Frameworks are tools, not architectures, and a framework-shaped architecture "cannot" be use-case-shaped. A use-case architecture lets you unit-test use cases without the web server or database. Delivery over the web is "a detail".
- **For Ilya.** Matches the stated goal (organize around what it does for a singer). Inference: SvelteKit's routes directory is framework-prescribed and cannot be the whole story; the domain code under `lib` is where the structure is Ilya's own choice. That SvelteKit prescribes route layout is desk knowledge, not verified here.
- **Limits.** Assertion without evidence. Package by feature against package by layer, as such, is not argued here and I did not obtain a source that argues it (section 8).

### 2.11 Foote and Yoder 1997 (Big Ball of Mud)

- **Citation:** Foote, B., Yoder, J. (1997). Big ball of mud. Pattern Languages of Program Design 4. URL read: http://www.laputan.org/mud/mud.html
- **Depth:** Read in part. Read the abstract and pattern summaries, Shearing Layers, Sweeping It Under the Rug, Reconstruction. Did not read Keep It Working, Piecemeal Growth, or the throwaway-code pattern in full.
- **Type:** Practitioner pattern paper (conference workshop).
- **What it says.** Systems become mud through throwaway code that "takes on a life of its own", and through piecemeal growth of structure. Five strategies: Piecemeal Growth, Keep It Working, Shearing Layers (separate things that change at different rates, from Brand's building layers), Sweeping It Under the Rug (cordon off the disordered parts behind a facade, then "divide and conquer" them), and Reconstruction (total rewrite, when "your code has declined to the point where it is beyond repair, or even comprehension"). It says a rewrite also loses staff experience and demands management support.
- **For Ilya.** Ilya's origin from a single HTML page matches the throwaway-code route. Sweeping it under the rug is a candidate treatment for the 5,533-line page: wrap it, then take pieces out. That application is inference.
- **Limits.** Patterns are observations, not tested prescriptions.

### 2.12 Evans, Domain-Driven Design Reference (2015)

- **Citation:** Evans, E. (2015). Domain-Driven Design Reference: definitions and pattern summaries. domainlanguage.com. URL read: https://domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf. The 2003 book is a book: NOT OBTAINED. A 60-page sample from the publisher's site (contents and front matter only) was opened but not saved.
- **Depth:** Read in part: the Ubiquitous Language and Continuous Integration entries.
- **Type:** Practitioner. Author's own summary.
- **What it says.** Use the model "as the backbone of a language" in speech, writing, diagrams, and code, within one bounded context. "A change in the language is a change to the model", so when the words change, rename classes, methods, and modules to match. Experts and developers who use different words force translation, which "blunts communication". The need for a single shared language is argued from a team that includes domain experts.
- **For Ilya.** The operative instruction is cheap: when the term for a thing is settled, rename the code to match. In the parts I read there is no instruction to keep a separate glossary document; that is not a finding about the whole reference.
- **Limits.** Assertion. See 2.13.

### 2.13 Özkan, Babur, and van den Brand 2025 (DDD systematic review)

- **Citation:** Özkan, O., Babur, Ö., van den Brand, M. (2025). Domain-driven design in software development: a systematic literature review on implementation, challenges, and effectiveness. Journal of Systems and Software (preprint, arXiv 2310.01905v4, 27 June 2025). URL read: https://arxiv.org/pdf/2310.01905v4
- **Depth:** Read in part: abstract, introduction, ubiquitous language passages, strengths and weaknesses, conclusion.
- **Type:** Peer-reviewed review of 36 studies (preprint version read).
- **What it says.** Ubiquitous language is the most commonly employed DDD pattern across the studies. The studies "consistently emphasize" its role in communication and collaboration. The authors also list "limited empirical evaluation in several studies" as a weakness, report that a few studies failed to use the language consistently, and call for more empirical research.
- **For Ilya.** The evidence is of use and reported benefit among teams, not of a measured effect on defects, comprehension, or cost. For a one-developer project, the review reports no study.
- **Limits.** Only communication between people is claimed. I did not obtain the one controlled study on identifier naming that I located (section 8).

### 2.14 Ivers, Nord, Ozkaya, Seifried, Timperley, and Kessentini 2022

- **Citation:** Ivers, J., Nord, R. L., Ozkaya, I., Seifried, C., Timperley, C. S., Kessentini, M. (2022). Industry experiences with large-scale refactoring. arXiv 2202.00173. URL read: https://arxiv.org/pdf/2202.00173
- **Depth:** Read in part: abstract, method, findings boxes for RQ1 to RQ3.
- **Type:** Survey of 107 developers (self-reported). I could not confirm the venue from the file.
- **What it says.** 82% had done a large-scale refactoring; 71% of those who did worked on systems of at least 100K lines, mean effort above 1,500 staff days; 71% had wanted to refactor and could not. Challenges: starting quality of the software, then difficulty understanding it. "Choosing which changes to make" is among the most challenging and time-consuming activities and among those with the least tool use. 80% say they reached their goals. Respondents rely on general-purpose tools such as IDEs more than on refactoring tools (54.3% against under 10%).
- **For Ilya.** The hard part is deciding what to change, not executing changes. That is the problem reflexion and the Parnas change table address. It does not mention the Mikado method.
- **Limits.** Self-reported, convenience sample, team-scale work.

### 2.15 The Mikado method

- **Citation:** Ellnestam, O., Brolund, D. (2014). The Mikado Method. Manning. **A book: NOT OBTAINED.** Pages read: https://mikadomethod.info/ (Brolund and Ellnestam) and https://mikadomethod.wordpress.com/2011/08/12/the-mikado-method-sweetspot/ (Ellnestam, quoting the book's section 5.1.3). A video interview on InfoQ has no transcript and was not used.
- **Depth:** Both web pages read in full. Together they are short and promotional.
- **Type:** Practitioner.
- **What the pages say.** The method is "a process for surfacing hard-to-see dependencies in a codebase", used to change a codebase and remove technical debt. The map of a restructuring is a Mikado Graph, drawn on pen and paper or a whiteboard. It works "as a single developer to keep track of where you are". The book is said to describe its sweet spot as large-scale improvements spread over days, weeks, or months, where the graph on a whiteboard communicates the goal and progress.
- **Not established.** The steps, the revert rule, and how the graph is built are NOT ESTABLISHED from anything I read. Desk knowledge, unverified: try the change, note what breaks as prerequisites, revert, work on the leaf prerequisites first. Do not cite that as read.
- **For Ilya.** Inference only: the ratcheted-file situation (cannot add a line until a split makes room) is a dependency chain of the kind a prerequisite graph records.
- **Limits.** No evidence of effectiveness found. Ivers et al. do not mention it.

## 3. What each lead would change, and what the literature says about it

**Lead 1, reconstruction.** Sources 2.7 and 2.8. The literature distinguishes inferring structure from code (recovery, bottom-up) from testing a hypothesized structure against code (discovery, top-down, which includes reflexion). Automatic recovery has no validated ground truth for Ilya and its accuracy depends on dependency inputs. Recommendation: do not run clustering tools as the source of truth. Use them, if at all, to propose boxes that Dann accepts or rejects.

**Lead 2, reflexion models.** Sources 2.1 and 2.2. The desk's belief is right in outline. Two items it lacked: partial maps, and the engineer's responsibility to compare like with like.

**Lead 3, propagation cost.** Sources 2.3, 2.4, 2.5, 2.6.
- *Measures:* the share of file pairs connected by any chain of dependencies, as a percentage of N squared (2.3, 2.4).
- *Needs:* a file-level dependency graph from a tool.
- *Good or bad:* the only calibration points I read are Linux 5.16%, Mozilla 17.35%, and Mozilla redesigned 2.78%. The authors say absolute levels have no meaning. Treat these as anchors for scale, not thresholds.
- *Comparable across systems:* the originating authors say no; Pisch et al. say not across sizes; Cai et al. say it has "successfully" compared projects of similar size. All three are consistent: compare the same system over time.
- *Critics:* size sensitivity and isolated-file artefacts (2.4), insensitivity to dependency strength and type, tool dependence (2.3, 2.4, 2.5), and, in 2.5, the mixed evidence that DL did not correlate while PC did.
- *Where it bites Ilya (inference):* splitting a 5,533-line file into many raises N. MacCormack et al. themselves needed paired comparisons for this reason. A plan that splits files must hold the unit of analysis fixed (for example, count the pre-split file as one element in a coarse view) and report files, edges, density, and PC together. A PC fall that coincides only with an N rise is not evidence of modularity.
- *Corroborating measures with different weaknesses:* a Parnas change-scenario count (2.9) and a commit-log measure (2.6). Using two measures that fail differently is my recommendation, not a finding from the sources.

**Lead 4, Mikado.** See 2.15. Not established.

**Lead 5, package by feature or layer.** Sources 2.9 and 2.10. I did not obtain a source arguing the feature-versus-layer question directly. What I read says: decompose by decisions likely to change (Parnas), and let the top level announce what the system is for (Martin). The two are compatible but not identical.

**Lead 6, ubiquitous language.** Sources 2.12 and 2.13. A practice without measured effect. Cheap to follow and low risk.

## 4. Recommended order of work, drawn from the literature alone

I formed this before and without the desk's plan. Items marked (I) combine the sources with my own inference.

1. **Fix the measurement instrument before changing code.** Choose the unit (the file), the dependency type, and the tool. Record the baseline: file count, edge count, density, PC, bus list, and the sensitivity to threshold choices (2.3). Record a commit-log baseline (2.6). Reason: the authors who defined PC compare designs only against themselves over time and need the instrument held constant. (I) Treat the 142 text-reading tests as a known blind spot and say so in the baseline.
2. **Dann writes the high-level model of what Ilya does for a singer.** Boxes for capabilities, arrows for who may know about whom. Reason: reflexion needs it and nothing else can supply it (2.1, 2.7).
3. **Draft the Parnas list.** Write the design decisions most likely to change, and for each, where it currently lives. The seventeen duplicated facts begin this list. Reason: 2.9 gives a criterion for module boundaries and a counting test.
4. **Map and compute reflexion models on the worst areas first, partially, and stop at sufficiency** (2.1, 2.2). The divergences list becomes the work list.
5. **Order the work as a prerequisite chain, in small steps that keep Ilya working** (2.11 Keep It Working, Piecemeal Growth; 2.15, with the caveat that the method itself is not established). (I) Start from changes that unblock the ratcheted files.
6. **Isolate before dissolving**: wrap the 5,533-line page behind a boundary and extract pieces (2.11, Sweeping It Under the Rug).
7. **Re-measure after each phase** with the same instrument, and read PC next to files and edges (2.3, 2.4).
8. **Rename as terms settle** (2.12). Do this alongside step 5, not as a project of its own.
9. **Reconstruction (rewrite) last**, only if the above shows the structure cannot be reached piecemeal (2.11).

## 5. What the literature says about one developer

- Most sources assume teams. Ivers et al. report team-scale efforts (mean above 1,500 staff days). The Google study's selection floor was 20 committing developers. The Mozilla redesign was a small team over several months. Parnas's managerial argument is about separate work groups.
- Closest solo precedents: one Microsoft engineer using reflexion models on Excel for more than four weeks (2.2); the Mikado authors' statement that a single developer can use their graph to keep track of progress (2.15).
- No source I read tests any of these methods on a solo project. Whether the correlations in 2.5 hold for one developer is NOT ESTABLISHED.
- Tools: the sources used Understand (2.3, 2.4), Kythe and DV8 (2.5), and field tools for C. Whether any extracts a trustworthy graph from TypeScript and Svelte is NOT ESTABLISHED; desk knowledge names npm-ecosystem tools, which I did not verify.

## 6. The single most useful finding

Propagation cost's own authors say absolute values mean nothing and that one design is compared with itself over time, and that file-count changes confound the number even in their own Mozilla study. Because Ilya's plan splits files, a before and after PC number is only trustworthy if the unit of analysis is held fixed and two further measures are taken beside it.

## 7. Verdict summary

Earned: reflexion models, propagation cost (with conditions), Parnas decomposition, Big Ball of Mud. Partly: reconstruction, ubiquitous language. Not established: Mikado.

## 8. What I could not establish

NOT OBTAINED, each named:
1. MacCormack, Rusnak, Baldwin (2006) Management Science published article. Cloudflare blocked the publisher and mirror; I read the working paper instead.
2. Baldwin, MacCormack, Rusnak (2014) Hidden structure: using network methods to map system architecture. Research Policy. The download returned an error page. This is the likely source of "core size" and a core-periphery classification; the desk's term "core size" is NOT ESTABLISHED from anything I read.
3. MacCormack, Baldwin, Rusnak (2012) Exploring the duality between product and organizational architectures. Obtained (saved in the folder), NOT READ.
4. Lutellier et al. (2015) ICSE SEIP: obtained, NOT READ.
5. Mo, Cai, Kazman et al. (2016) decoupling level: not obtained.
6. Garcia, Ivkovic, Medvidovic (2013) comparative analysis of architecture recovery techniques (ASE) and Garcia et al. (2013) ground-truth architectures (ICSE): not obtained.
7. Murphy and Notkin (2001) journal version of reflexion models: not searched for.
8. Ellnestam and Brolund (2014) The Mikado Method (Manning): book not obtainable. Chapters sit behind a paywall.
9. Evans (2003) Domain-Driven Design: book not obtainable.
10. Hofmeister, Siegmund, Holt (2017) Shorter identifier names take longer to comprehend, SANER: download failed. This is the one controlled study of naming that I found; its content is not used above.
11. Jacobson (1992) Object-Oriented Software Engineering, and any source arguing package by feature against package by layer directly (for example from Fowler, Bogard, or Hauer): not searched for in depth, none read.
12. Feathers, Working Effectively with Legacy Code (book), cited by the Mikado authors' site: not obtained.

Not established, as questions:
- A good or bad threshold for PC on any system of Ilya's size and age.
- Whether PC, DL, or M-score has been validated on a TypeScript or Svelte code base, or on a one-developer system.
- Whether a project glossary has any measured benefit.
- How the Mikado method works step by step (primary text unavailable).
- What a reflexion mapping costs to keep up as code changes (the 1995 paper says it plans to find out).
- Venue and year of the Google study (2.5).

## 9. Files written

- This report.
- 18 saved sources in `~/Downloads/_desk-2026-11-23/n204-sources/` (14 PDFs, 4 saved pages). Two of the 14 PDFs are not read (items 3 and 4 above).
