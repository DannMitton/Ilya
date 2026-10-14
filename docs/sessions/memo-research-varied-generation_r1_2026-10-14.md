# Memo: varied, human-reading text from vetted parts

Date: 2026-10-14. Revision 1. Prepared for Dann's Insights design question.

Scope: work outside generative AI on making assembled, vetted text read as bespoke. Every source in this memo was opened this session unless the last section says otherwise. Statements headed "Inference" are mine, not the sources'.

## Summary

1. The classical NLG pipeline treats the problem as three separate decisions made after content is chosen: lexicalisation, aggregation, and referring expression generation. First mention versus later mention is the core of the last one. This matches Dann's proposal directly.
2. The one human evaluation I found that tests repetition head-on (Foster and White, 2007) used a statistical realiser, not vetted text. Readers judged the less repetitive texts better written. It does not show how readers respond to vetted-template variation.
3. Game dialogue systems (Valve, inkle's Ink) solve "do not say the same line twice" with state: a memory of what has been said, and rules that prefer the most specific match. Both are deterministic or seedable and need no runtime language model.
4. Scholarly practice already has a settled form for "explain once, then point back": the shortened note, with a full note at first mention. Chicago now discourages "ibid." in favour of it.
5. I found no study that measures reader response to cross-reference pointers inside generated advice. NOT ESTABLISHED.

## 1. Classical NLG pipeline

### Reiter and Dale (2000)

What it is. Reiter, E., and Dale, R. (2000). Building Natural Language Generation Systems. Cambridge University Press. The contents list gives chapters on document planning, microplanning, and surface realisation (https://resolve-he.cambridge.org/core/books/abs/building-natural-language-generation-systems/microplanning/FEB90C3A816AD6A873A1BE85B69A9D0B). I opened the chapter 5 abstract and a published review, not the book text.

Technique. The chapter 5 abstract states that the microplanner is concerned with three tasks: lexicalisation (choosing words, syntactic constructs, and mark-up), aggregation (deciding how much information goes in each sentence), and referring expression generation (deciding what phrases identify domain entities). It states that after microplanning, "all substantive decisions have been made" (same URL). The review notes that the book compares representations ranging from skeletal propositions through lexicalised case frames to canned text, with pros and cons for the division of work (Horacek, Computational Linguistics 27(2), https://aclweb.org/anthology/J01-2008.pdf).

Referring expressions, first and later mention. Krahmer and van Deemter's survey reports Reiter and Dale's first choice: whether to use a proper name, a pronoun, or a description. It gives their conservative pronoun rule: use a pronoun if the target was mentioned in the previous sentence and that sentence referred to no other entity of the same gender (Krahmer and van Deemter, 2012, Computational Linguistics 38(1), https://aclanthology.org/J12-1006.pdf). The survey also notes the Full Brevity algorithm was meant to generate both initial and subsequent descriptions (same source).

Evidence it works. The cited sources describe the architecture and rules. They report no reader study of the first-versus-later distinction. NOT ESTABLISHED for readers of this kind of text.

Application to Insights. Inference: treat each recurring challenge as a discourse entity. Its first mention in a song gets the full vetted entry (explanation plus citation). Later mentions get a shorter vetted form or a pointer. This is the pipeline's referring-expression step with a table in place of an algorithm.

### SimpleNLG

What it is. A Java realisation engine for English (Gatt and Reiter, 2009, Proceedings of the 12th European Workshop on NLG, pp. 90-93, https://aclanthology.org/W09-0613.pdf).

Technique. The paper states that constituents "can be a mixture of canned and non-canned representations", and that the library handles inflection and linearisation (same source).

Evidence. The paper is a system description. I saw no reader evaluation in it.

Application. Inference: low value for Insights. The text is vetted whole, so inflecting words at runtime would put unvetted strings in front of the singer.

## 2. Evaluated data-to-text systems

### SumTime-Mousam (weather)

Reiter, E., Sripada, S., Hunter, J., Yu, J., and Davy, I. (2005). Choosing words in computer-generated weather forecasts. Artificial Intelligence 167. Abstract opened at https://abdn.elsevierpure.com/en/publications/choosing-words-in-computer-generated-weather-forecasts.

Technique. The authors found that human forecasters differed in word choice and in the meanings they attached to words. They built the generator with consistent data-to-word rules, avoiding words used by few writers and words read differently by different people.

Evidence. "An evaluation by forecast users suggested that they preferred SUMTIME-MOUSAM's texts to human-generated texts, in part because of better word choice" (same abstract).

Application. Inference: this pulls against variation. Consistent wording was judged better in a domain where words carry meaning. For Insights, a fixed term for a technical idea (for example, a named vocal phenomenon) stays fixed. Vary the framing, not the terms.

### FoG (Environment Canada weather)

Source. Reiter, E. (2022). FoG: The Birth of Commercial NLG. https://www.arria.com/?p=1411.

Technique. The post says FoG had an analytics module that extracted key insights from the weather data and two narrative modules, one for English and one for French. It reports that the system fell out of use in 1995, and that Reiter believes this was largely because forecasters and IT staff at Environment Canada could not modify it.

Evidence. A retrospective, not an evaluation. I did not open the original FoG paper (Goldberg, Driedger, and Kittredge, 1994). NOT ESTABLISHED: any reader judgement of FoG text.

Application. Inference: the lesson is maintenance. Text a domain expert cannot edit leaves the system when it needs changing. Insights' vetter needs to be able to read and edit every part in a plain table.

### BabyTalk BT-45 (neonatal intensive care)

Portet, F., Reiter, E., Gatt, A., Hunter, J., Sripada, S., Freer, Y., and Sykes, C. (2009). Automatic generation of textual summaries from neonatal intensive care data. Artificial Intelligence 173(7-8), 789-816. Abstract opened at https://www.um.edu.mt/library/oar/handle/123456789/22142.

Evidence. In a clinical off-ward experiment, human-expert texts led to better decisions than graphical displays. BT-45 texts led to decisions of similar quality to graphics. Textual analysis found BT-45 texts inferior to expert texts, "including not reporting temporal information as well and not producing good narratives" (same abstract).

Application. Inference: the shortfall named is narrative, not wording. Insights' complaint ("canned commentary") may be the same kind of gap: the parts are correct but the sequence across the song does not read as a story. Ordering the entries by what the singer meets first, and having later entries refer back, addresses narrative directly.

### Robo-journalism (Wordsmith, Narrative Science)

Graefe, A., Haim, M., Haarmann, B., and Brosius, H.-B. (2018). Readers' perception of computer-generated news: Credibility, expertise, and readability. Journalism 19(5), 595-610. https://epub.ub.uni-muenchen.de/42618/1/1464884916641269.pdf.

Evidence. 986 subjects rated two articles each (sports and finance). "Subjects rated computer-written articles as more credible and higher in journalistic expertise but less readable." The paper also cites earlier work by Clerwall (2014; 46 Swedish students), where the journalist-written article scored higher on readability. The paper's readability scale included "well written" and "not boring".

Limits. The study does not isolate repetition. The paper names Automated Insights and Narrative Science only as leading companies covered in other studies. It does not say which system produced its articles in the text I read. I did not open any Wordsmith or Narrative Science documentation. NOT ESTABLISHED: their variation techniques.

Application. Inference: the authors' result gives a reason to attend to readability while keeping the credibility advantage that sourcing brings. Insights' citations are the credibility asset. The readability gap is the thing to work on.

### Evidence on repetition itself

Foster, M. E., and White, M. (2007). Avoiding repetition in generated text. Proceedings of ENLG 2007. https://aclanthology.org/W07-2305.pdf.

Technique. Two methods for a statistical realiser (OpenCCG) in the COMIC bathroom-tile domain: epsilon-best sampling (pick randomly among near-top candidates) and anti-repetition scoring (penalise words from earlier sentences in the discourse).

Evidence. 37 native English speakers compared texts with and without the methods on three forced-choice questions. Understandability: 54% chose the anti-repetition version, not significant (p about 0.2). They chose the default version as more repetitive 210 times (72%) and the anti-repetition version as better written 180 times (62%); both significant at p < 0.0001. The authors report that epsilon-best sampling was "considerably more prone to introducing dispreferred variants", and that the best results came from anti-repetition scoring with strict or no epsilon-best sampling. They also note that van Deemter et al. (2005) used random choice "to maximise the variety of sentences produced".

Application. Inference: this is the closest direct support for Dann's observation that repetition reads as lesser writing. The mechanism that worked was memory of what was already said, not random choice. Random choice produced more bad variants. Caution: the texts were machine-realised sentences, and the vetted-parts case is different.

### Varying words: practitioner guidance

Reiter, E. (2018). Varying Words In NLG Texts. https://ehudreiter.com/2018/10/15/varying-words-in-nlg/.

Technique and cautions, as the post states them. Toolkits expect developers to pick acceptable synonyms. His recommendation is to use only alternatives observed in corpus texts. Choices can depend on each other: "rise ... then fall" reads better than "rise ... then go down", so linked choices have to be declared as linked. A quality-assurance process with independent testers who can see the alternatives helps find such problems. Varying connectives and other non-content words is "probably safer" than varying nouns and verbs, per his observation of forecasters' post-edits.

Application. Inference: if Insights varies wording at all, vary connectives and sentence frames, keep terms fixed, and have the vetter approve each combination that can co-occur.

## 3. Game and interactive dialogue

### Valve: fuzzy pattern matching (Ruskin, GDC 2012)

Source. Ruskin, E. (2012). AI-driven dynamic dialog through fuzzy pattern matching. GDC 2012 slides, https://cdn.fastly.steamstatic.com/apps/valve/2012/GDC2012_Ruskin_Elan_DynamicDialog.pdf. Overview of the talk: https://www.gdcvault.com/play/1015528/AI-driven-Dynamic-Dialog-through. A contemporaneous summary: https://emshort.blog/2012/03/16/gdc-2012-talk-on-dynamic-dialogue/.

Technique, from the slides.
- The world is a flat pile of facts. A query carries the facts; each rule has criteria that test facts. A rule that tests a fact not in the query rejects.
- Scoring: "the simplest one imaginable – the number of criteria in a rule." The more criteria, the more specific, and the specific rule plays in preference to the general one. Ties between equally specific rules are broken randomly "for variety".
- Several recorded variations of a line can sit inside one response, chosen randomly, as "an easier way to have variety than creating a bunch of parallel rules".
- Memory: a table of facts kept per character and sent with every query. A matched rule can write facts back, including facts that expire after a set time "to prevent two successive bits of a running gag from being played too close together".
- Chaining: a "then" clause triggers a follow-up concept after a line finishes.
- The slides name the motive: in a game built for replay, "if you hear the exact same canned lines at the exact same points over and over, it becomes dull very quickly."
- A late slide says that storing individual variables to remember which lines were said, and adding criteria to stop rules matching twice, "is lame", and that it would have been better for a response to remove itself from the database after playing.

Evidence. The slides describe shipped games. I found no player study in them. The talk's own argument is about writer productivity. NOT ESTABLISHED: any measured effect on player perception.

Application. Inference: three parts transfer. (a) Specificity scoring picks the entry tied to the most facts about this bar (voice type, range position, text setting, preceding phrase), so the text fits the situation. (b) A per-song memory of entries already shown. (c) Self-retiring entries: once the full explanation has been shown, it leaves the pool for that song. All three are deterministic given the song.

### Ink (inkle)

Source. Writing with ink, https://raw.githubusercontent.com/inkle/ink/master/Documentation/WritingWithInk.md.

Technique, as documented.
- Sequences ("stopping blocks") track how many times they have been seen and show the next element each time, continuing with the last when they run out.
- Cycles loop. Once-only blocks show nothing when they run out. Shuffles randomise.
- A knot or stitch name used in a test is an integer: the number of times that content has been seen, so a condition can ask "seen more than 3 times".
- TURNS_SINCE(-> knot) returns the number of moves since a knot was last visited.
- Choices can be used only once by default.

Evidence. Documentation only. No reader study.

Application. Inference: a once-only block with a pointer as fallback matches "explain once, then see also". Visit counts per challenge decide which of full, brief, or pointer form appears. TURNS_SINCE corresponds to bars since last mention, so a pointer can be withheld when the earlier entry is only a few bars back.

### Tracery

Source. Compton, K., Kybartas, B., and Mateas, M. (2015). Tracery: An author-focused generative text tool. ICIDS 2015. https://publications.graphics.tudelft.nl/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBZzBJIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--7d151c9ad24dc4d070b4e3720f9fa152c1865016/F978-3-319-27036-4_14.pdf. (The 2014 paper "Tracery: Approachable story grammar authoring for casual users" is a separate item; I did not open it.)

Technique. A context-free grammar where hashtag-marked symbols expand at random. Authors may need "a persistence of a character's name and pronouns". Rules can write to the grammar ("push-pop" stacks), so generated text can be saved and reused, with the grammar acting as "a sort of blackboard".

Evidence. The paper states its evaluation metric is "whether it has been successfully used to make works", and gives case studies. No reader study.

Application. Inference: the persistence mechanism is the useful part: a value chosen once is reused consistently later. For Insights, the equivalent is remembering which entry was shown. Random expansion is the part to leave out, since each output must have been seen by the vetter.

## 4. Writing practice for repeated reference text

### Scholarly notes: full first, short after

Chicago Manual of Style, 17th edition, 14.34, as quoted by the SBL Handbook of Style blog (https://sblhs2.com/2018/02/01/cms-update-ibid/): "In a departure from previous editions, Chicago discourages the use of ibid. in favor of shortened citations as described elsewhere in this section; to avoid repetition, the title of a work just cited may be omitted. Shortened citations generally take up less than a line, meaning that ibid. saves no space, and in electronic formats that link to one note at a time, ibid. risks confusing the reader." An ILO library note confirms the same reading (https://libanswers.ilo.org/zotero/faq/271382). I read CMOS through these two secondary pages, not CMOS itself.

Application. Inference: the convention is full form once, short form after. Its caution about electronic formats applies: a bare back-reference such as "same as before" is unsafe where the reader may open one entry alone. A pointer in Insights needs to name the bars ("see mm. 22, 31, and 40") and not use a bare back-reference.

### Technical writing: content reuse

The DITA 1.3 specification describes conref: the attributes "provide mechanisms for reusing content within DITA topics or maps", and when used alone "the referencing element acts as a placeholder for the referenced element, and the content of the referenced element is rendered in place" (https://docs.oasis-open.org/dita/dita/v1.3/os/part1-base/archSpec/base/conref-overview.html).

Application. Inference: this is the storage side of Dann's idea. Write the explanation once as a single vetted unit, and reference it from each place that needs it. A change by the vetter then reaches every use. The cost is that a unit that reads well in one position may read oddly when rendered in another, so units need to be self-contained.

## 5. Ranked techniques for Insights

Ranking reflects fit to Dann's constraint (every sentence vetted, no runtime model) and strength of the evidence I opened. Cost is the work added for the human vetter.

1. Three-form entries per challenge: full (explanation plus citation), brief reminder, pointer. A per-song memory picks the form by first or later mention. Sources: Reiter and Dale microplanning; Krahmer and van Deemter; Ink sequences and once-only blocks. Evidence: Foster and White support memory-based repetition avoidance. Vetter cost: three short texts per challenge instead of one, plus approval of the form-selection rule once. The pointer is a template with bar numbers as data, so it is vetted once for all challenges.

2. Pointer wording with explicit bar numbers, "see also mm. 22, 31, and 40", and a rule against bare back-references. Sources: CMOS 14.34; DITA conref. Vetter cost: one template, vetted once, plus a check that the bar list is correct for each song. A numeric list is data, not prose.

3. Specificity-scored entry selection with expiring memory. Source: Valve (Ruskin 2012). Vetter cost: the vetter reads each entry together with its criteria, since what the entry says is only right in its context. This is the heaviest rule table, but each entry stays a single fixed sentence set. No player or reader evidence found.

4. Aggregation of near-simultaneous mentions into one vetted passage (for example, two bars with the same challenge in a row). Source: Reiter and Dale aggregation. Vetter cost: each merged form is new text and needs approval; the count of merged forms grows with the number of challenge pairs. Limit to the few most frequent pairs. No reader evidence found for aggregation.

5. Linked, small sets of alternative frames and connectives, with terms held fixed. Sources: Reiter (2018); Foster and White; SumTime. Vetter cost: every combination that can co-occur needs approval, which multiplies quickly. Reiter's own advice is to declare linked choices and to use independent testers who can see the alternatives. SumTime's result favours consistent terms. Rank last because the cost is highest and the direct evidence involved machine-realised sentences.

Not recommended: random choice among variants. Foster and White report it produced more dispreferred variants than the memory-based method, and Tracery's random expansion has no vetting guarantee.

## What I could not establish

- Any reader study of cross-reference pointers ("see also mm. ...") inside generated or templated advice. NOT ESTABLISHED.
- Any measured effect of first-versus-later mention handling on reader perception of data-to-text. The architecture is documented; the evaluations I opened concern other variables.
- Reader judgements of FoG output. I opened only a retrospective by Reiter, not the 1994 paper.
- How Wordsmith (Automated Insights) or Narrative Science vary their text. I did not open any documentation or paper that describes it. Graefe et al. does not say which system wrote its articles in the text I read.
- Reiter and Dale (2000) itself. I opened the chapter 5 abstract and a review, not the book text, so I cannot quote its treatment of aggregation or of canned text beyond what those two pages state.
- The Chicago Manual of Style text itself. I relied on a quotation of 14.34 in a secondary page.
- Scholarly-edition cross-reference conventions beyond Chicago notes (for example, critical-edition apparatus, or the "see also" convention in indexes). No manual opened.
- Technical-writing guidance on single-sourcing beyond the DITA specification. I did not open Mark Baker's Every Page Is Page One, which appeared in search results. I have not read it, so I make no claim about its position on cross-references.
- The 2014 Tracery paper, and any user study of Tracery.
- Player-perception evidence for Valve's system or for Ink.
- Whether the vetting costs in section 5 match Dann's actual process. They are my estimates from the structure of each technique.
