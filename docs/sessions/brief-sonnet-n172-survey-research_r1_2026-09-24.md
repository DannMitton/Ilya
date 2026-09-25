# Research brief: designing Ilya's self-assessment intake (N.172)

Written by the desk 2026-09-24 23:22, on Dann's instruction of 23:20: *"this is a survey we are creating and it needs more thought and care than the two minutes we have been talking about it. Research survey design for these kinds of discussion points and report."*

## Context

Ilya is a free, bilingual (English and French) web app for classical singers learning Russian songs. Its Insights feature comments on a piece against the singer's own measured voice. A short, optional intake survey will ask the singer how secure they are in a few areas (the top of the voice, the bottom, moving through the passaggio, long held notes, soft singing up high) and which topics of advice they want. The answers tune which comments appear: a novice sees more "something to try" comments on moderate challenges; an expert sees only the highest-stakes ones. Answers are editable at any time. Users range from undergraduates to professionals.

Read first: `docs/sessions/draft-n172-intake-survey_r1_2026-09-24.md` (the current draft and its principles) and `docs/sessions/draft-curation-rules_r1_2026-09-24.md` (how the answers are used).

## Questions to answer, with evidence

1. **Scale design:** number of points, labelling every point, unipolar versus bipolar, behavioural anchors versus evaluative words, neutral midpoints, "not sure" options. Start from Krosnick and Presser (2010) and go beyond it.
2. **Self-assessment accuracy:** how well people rate their own skill (including the Dunning-Kruger literature and its critiques), and specifically musicians' and singers' self-assessment of performance. What question designs reduce bias (behavioural anchors, concrete situations, comparison to criteria rather than to others)?
3. **Skill-stage models:** Dreyfus and Dreyfus; Berliner (1988, 2004); Benner (1984) as a self-assessment precedent; any use of stage models in music education or voice pedagogy.
4. **Onboarding surveys in personalized or adaptive learning apps:** length, completion rates, optional versus required, when to ask, letting users revise answers, and how preferences for "types of advice" are best offered (opt-out defaults and their effects).
5. **Tone:** wording that invites honest self-report without shame, for performers. Any research on stereotype threat or self-presentation in skill self-report.
6. **Bilingual scales:** good practice for translating rating scales so the English and French versions mean the same (for example the ITC guidelines for translating and adapting tests).
7. **Existing instruments in voice** that ask singers about their own voice (for example the Singing Voice Handicap Index and the Evaluation of the Ability to Sing Easily). Note what they measure and why they are or are not a fit; Ilya does no clinical assessment, and the words "fault" and "diagnose" are ruled out.

## Output

`docs/sessions/report-n172-survey-research_r1_2026-09-24.md` in the repository at `$HOME/mnt/ilya-rewrite` (reach it with `mcp__remote-devices__device_bash`; load it with ToolSearch "select:mcp__remote-devices__device_bash"). Sections: a one-page summary of recommendations for Ilya, ranked; then the evidence per question, each claim with its source and a link; then specific critiques of the current draft (which anchors or questions the evidence supports or undermines); then a NOT ESTABLISHED section. Distinguish sources you read from sources you only saw cited. **NOT ESTABLISHED beats a complete invented answer.** Never invent a citation, page, or statistic. Canadian spelling, Oxford comma, no em dashes. Edit no other file; never run git.

## Return

Under 250 words: the path, the top five recommendations, and what the evidence says about the current draft.
