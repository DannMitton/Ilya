<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import type { TabId } from '$lib/destinations';

	interface Props {
		width: number;
		collapsed: boolean;
		isMobile: boolean;
		language: Language;
		activeTab: TabId;
		activeHeadingId: string | null;
		tabTransitionClass: string;
		rootPanel: Snippet;
		shanePanel?: Snippet;
		/**
		 * NOTATION (item N.7). Rendered ONCE, outside the tab switch, anchored
		 * below the scrolling panel so it holds the same position on every tab
		 * that shows it. Dann's ruling, 2026-08-06: predictable, and within a
		 * thumb's reach on mobile, where the mobile rule on `.drawer` gives the
		 * overlay the whole viewport height. It said `calc(100dvh - 56px)` and
		 * named the line, until N.73 S1 deleted the tab bar that owned the
		 * 56 px; the rule is named here rather than numbered, because a line
		 * number in a comment rots.
		 *
		 * A snippet rather than props, matching rootPanel and shanePanel, so
		 * the state stays in +page.svelte and nothing is drilled through here.
		 */
		notationPanel?: Snippet;
		ontogglecollapse: () => void;
		ontabchange: (tab: TabId) => void;
		onheadingnavigate: (id: string) => void;
	}

	let { width, collapsed, isMobile, language, activeTab, activeHeadingId = null, tabTransitionClass, rootPanel, shanePanel, notationPanel, ontogglecollapse, ontabchange, onheadingnavigate }: Props = $props();

	let expandedSections = $state(new Set<string>());
	let drawerContentEl: HTMLElement | undefined = $state();

	/* ── Parent chain lookup for auto-expand ───────────────── */

	const learnUnitChildren: Record<string, string> = {
		'learn-u1-song': 'learn-unit-1', 'learn-u1-alphabet': 'learn-unit-1',
		'learn-u1-familiar': 'learn-unit-1', 'learn-u1-signs': 'learn-unit-1', 'learn-u1-yo': 'learn-unit-1',
		'learn-u1-glyphs': 'learn-unit-1', 'learn-u1-try': 'learn-unit-1',
		'learn-u2-meaning': 'learn-unit-2', 'learn-u2-moves': 'learn-unit-2', 'learn-u2-dictionary': 'learn-unit-2',
		'learn-u2-sounds': 'learn-unit-2', 'learn-u2-try': 'learn-unit-2',
		'learn-u3-inventory': 'learn-unit-3', 'learn-u3-note-o': 'learn-unit-3', 'learn-u3-interpalatal': 'learn-unit-3', 'learn-u3-iotated': 'learn-unit-3',
		'learn-u3-yo': 'learn-unit-3', 'learn-u3-try': 'learn-unit-3',
		'learn-u4-akanye': 'learn-unit-4', 'learn-u4-ikanye': 'learn-unit-4', 'learn-u4-reconstitution': 'learn-unit-4',
		'learn-u4-try': 'learn-unit-4',
		'learn-u5-familiar': 'learn-unit-5', 'learn-u5-pairs': 'learn-unit-5', 'learn-u5-attention': 'learn-unit-5',
		'learn-u5-fixed': 'learn-unit-5', 'learn-u5-signs': 'learn-unit-5', 'learn-u5-devoicing': 'learn-unit-5',
		'learn-u5-try': 'learn-unit-5',
		'learn-u6-what': 'learn-unit-6', 'learn-u6-signals': 'learn-unit-6', 'learn-u6-stops': 'learn-unit-6',
		'learn-u6-paired': 'learn-unit-6', 'learn-u6-clusters': 'learn-unit-6', 'learn-u6-practice': 'learn-unit-6',
		'learn-u6-velari': 'learn-unit-6',
		'learn-u7-two': 'learn-unit-7', 'learn-u7-voiced': 'learn-unit-7', 'learn-u7-stops': 'learn-unit-7',
		'learn-u7-boundary': 'learn-unit-7', 'learn-u7-deletion': 'learn-unit-7', 'learn-u7-mergers': 'learn-unit-7',
		'learn-u7-unusual': 'learn-unit-7', 'learn-u7-geminates': 'learn-unit-7', 'learn-u7-tryit': 'learn-unit-7',
	};

	function getParentIds(id: string | null): string[] {
		if (!id) return [];
		if (learnUnitChildren[id]) return [learnUnitChildren[id]];
		if (['guide-what','guide-paste','guide-source','guide-ai','guide-role','guide-limits','guide-future','guide-fit-forecast','guide-fit-characteristics','guide-fit-notation'].includes(id)) return ['guide-how'];
		if (['guide-walk-interface','guide-walk-tabs','guide-walk-metadata','guide-walk-transcribe','guide-walk-analysis','guide-walk-notation','guide-walk-print'].includes(id)) return ['guide-walkthrough'];
		if (['guide-grayson','guide-mitton','guide-claude','guide-kimi'].includes(id)) return ['guide-contributors'];
		if (id === 'guide-grayson-intro') return ['guide-contributors', 'guide-grayson'];
		if (id === 'guide-mitton-note') return ['guide-contributors', 'guide-mitton'];
		return [];
	}

	const collapsibleIds = new Set([
		'learn-unit-1','learn-unit-2','learn-unit-3','learn-unit-4','learn-unit-5','learn-unit-6','learn-unit-7',
		'guide-how','guide-walkthrough','guide-contributors','guide-grayson','guide-mitton'
	]);

	/* ── Interactions ──────────────────────────────────────── */

	function toggleSection(id: string) {
		const next = new Set(expandedSections);
		if (next.has(id)) next.delete(id); else next.add(id);
		expandedSections = next;
	}

	function handleTocClick(id: string) {
		const next = new Set(expandedSections);
		getParentIds(id).forEach(p => next.add(p));
		if (collapsibleIds.has(id)) next.add(id);
		expandedSections = next;
		onheadingnavigate(id);
	}

	/* ── Auto-expand parents when active heading changes ──── */

	let autoExpandTimer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (!activeHeadingId) return;
		if (autoExpandTimer) clearTimeout(autoExpandTimer);
		autoExpandTimer = setTimeout(() => {
			const parents = getParentIds(activeHeadingId);
			if (parents.length === 0) return;
			const next = new Set(expandedSections);
			let changed = false;
			for (const p of parents) {
				if (!next.has(p)) { next.add(p); changed = true; }
			}
			if (changed) expandedSections = next;
		}, 150);
	});

	/* ── Auto-scroll Drawer to keep active item visible ───── */

	$effect(() => {
		if (!activeHeadingId || !drawerContentEl) return;
		requestAnimationFrame(() => {
			if (!drawerContentEl) return;
			const btn = drawerContentEl.querySelector(`[data-heading-id="${activeHeadingId}"]`) as HTMLElement | null;
			if (!btn) return;
			const cRect = drawerContentEl.getBoundingClientRect();
			const bRect = btn.getBoundingClientRect();
			if (bRect.top < cRect.top + 20 || bRect.bottom > cRect.bottom - 60) {
				btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		});
	});

	function isActive(id: string): boolean {
		return activeHeadingId === id;
	}

	function sectionContainsActive(id: string): boolean {
		if (!activeHeadingId) return false;
		return getParentIds(activeHeadingId).includes(id);
	}
</script>

<aside class="drawer" class:collapsed data-tab={activeTab} style="{isMobile ? '' : `width: ${collapsed ? 0 : width}px`}" aria-label="Controls">
	<div class="drawer-clip">
	<div class="drawer-body" style="{isMobile ? '' : `width: ${width}px`}">
		<div
			class="drawer-content {tabTransitionClass}"
			role="tabpanel"
			id="tabpanel-{activeTab}"
			aria-labelledby="tab-{activeTab}"
			bind:this={drawerContentEl}
		>
				<!-- N.73 S2. ONE Studio drawer. Both panels render, always, in this
				     order, on both of Studio's documents, so nothing in the drawer
				     appears, disappears, or moves when the singer flips the pair.
				     Their own {#if} guards still suppress score-only content, and
				     shanePanel carries its own INCLUDE_SHANE gate. Learn and Guide
				     are untouched. -->
				{#if activeTab === 'transcription' || activeTab === 'shane'}
					{@render rootPanel()}
					{@render shanePanel?.()}
				{:else if activeTab === 'learn'}
					<nav class="learn-toc" aria-label={language === 'fr' ? 'Table des matières' : 'Table of contents'}>
						<h2 class="section-label section-label-learn">{language === 'fr' ? 'LEÇONS' : 'LEARN'}</h2>
						<ul class="toc-list">
							<li>
								<button class="toc-link toc-title" class:active={isActive('learn-title')} data-heading-id="learn-title" onclick={() => handleTocClick('learn-title')}>
									{language === 'fr' ? 'La diction lyrique russe pour chanteurs' : 'Russian Lyric Diction for Singers'}
								</button>
							</li>
							<li>
								<button class="toc-link" class:active={isActive('learn-about')} data-heading-id="learn-about" onclick={() => handleTocClick('learn-about')}>
									{language === 'fr' ? 'À propos de ce module' : 'About This Module'}
								</button>
							</li>
							<li>
								<button class="toc-link" class:active={isActive('learn-arc')} data-heading-id="learn-arc" onclick={() => handleTocClick('learn-arc')}>
									{language === 'fr' ? 'L\u2019arc d\u2019apprentissage' : 'The Learning Arc'}
								</button>
							</li>

							<!-- ── Unit 1 ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={expandedSections.has('learn-unit-1')} class:contains-active={sectionContainsActive('learn-unit-1')} onclick={() => toggleSection('learn-unit-1')} aria-label="Toggle"><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link" class:active={isActive('learn-unit-1')} data-heading-id="learn-unit-1" onclick={() => handleTocClick('learn-unit-1')}>
										{language === 'fr' ? '1 \u00b7 Les lettres' : '1 \u00b7 The Letters'}
									</button>
								</div>
								<div class="toc-children" class:expanded={expandedSections.has('learn-unit-1')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u1-song')} data-heading-id="learn-u1-song" onclick={() => handleTocClick('learn-u1-song')}>{language === 'fr' ? 'La chanson de l\u2019alphabet' : 'The Alphabet Song'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u1-alphabet')} data-heading-id="learn-u1-alphabet" onclick={() => handleTocClick('learn-u1-alphabet')}>{language === 'fr' ? 'L\u2019alphabet' : 'The Alphabet'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u1-familiar')} data-heading-id="learn-u1-familiar" onclick={() => handleTocClick('learn-u1-familiar')}>{language === 'fr' ? 'Ce que vous connaissez d\u00e9j\u00e0' : 'What You Already Know'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u1-signs')} data-heading-id="learn-u1-signs" onclick={() => handleTocClick('learn-u1-signs')}>{language === 'fr' ? 'Les deux signes' : 'The Two Signs'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u1-yo')} data-heading-id="learn-u1-yo" onclick={() => handleTocClick('learn-u1-yo')}>{language === 'fr' ? 'Note sur \u27E8\u0401\u27E9' : 'A Note on \u27E8\u0401\u27E9'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u1-glyphs')} data-heading-id="learn-u1-glyphs" onclick={() => handleTocClick('learn-u1-glyphs')}>{language === 'fr' ? 'Le tableau des glyphes' : 'The Glyph Table'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u1-try')} data-heading-id="learn-u1-try" onclick={() => handleTocClick('learn-u1-try')}>{language === 'fr' ? 'Essayez' : 'Try This'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Unit 2 ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={expandedSections.has('learn-unit-2')} class:contains-active={sectionContainsActive('learn-unit-2')} onclick={() => toggleSection('learn-unit-2')} aria-label="Toggle"><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link" class:active={isActive('learn-unit-2')} data-heading-id="learn-unit-2" onclick={() => handleTocClick('learn-unit-2')}>
										{language === 'fr' ? '2 \u00b7 L\u2019accent tonique' : '2 \u00b7 Stress'}
									</button>
								</div>
								<div class="toc-children" class:expanded={expandedSections.has('learn-unit-2')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u2-meaning')} data-heading-id="learn-u2-meaning" onclick={() => handleTocClick('learn-u2-meaning')}>{language === 'fr' ? 'L\u2019accent change le sens' : 'Stress changes meaning'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u2-moves')} data-heading-id="learn-u2-moves" onclick={() => handleTocClick('learn-u2-moves')}>{language === 'fr' ? 'L\u2019accent se d\u00e9place' : 'Stress moves'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u2-dictionary')} data-heading-id="learn-u2-dictionary" onclick={() => handleTocClick('learn-u2-dictionary')}>{language === 'fr' ? 'Probl\u00e8me de dictionnaire' : 'A dictionary problem'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u2-sounds')} data-heading-id="learn-u2-sounds" onclick={() => handleTocClick('learn-u2-sounds')}>{language === 'fr' ? 'Comment l\u2019accent sonne' : 'How stress sounds'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u2-try')} data-heading-id="learn-u2-try" onclick={() => handleTocClick('learn-u2-try')}>{language === 'fr' ? 'Essayez' : 'Try this'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Unit 3 ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={expandedSections.has('learn-unit-3')} class:contains-active={sectionContainsActive('learn-unit-3')} onclick={() => toggleSection('learn-unit-3')} aria-label="Toggle"><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link" class:active={isActive('learn-unit-3')} data-heading-id="learn-unit-3" onclick={() => handleTocClick('learn-unit-3')}>
										{language === 'fr' ? '3 \u00b7 Les voyelles accentu\u00e9es' : '3 \u00b7 Stressed Vowels'}
									</button>
								</div>
								<div class="toc-children" class:expanded={expandedSections.has('learn-unit-3')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u3-inventory')} data-heading-id="learn-u3-inventory" onclick={() => handleTocClick('learn-u3-inventory')}>{language === 'fr' ? 'Ce sont les voyelles accentu\u00e9es qui constituent les cibles' : 'Stressed vowels are the targets'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u3-note-o')} data-heading-id="learn-u3-note-o" onclick={() => handleTocClick('learn-u3-note-o')}>{language === 'fr' ? 'Un mot sur le /o/' : 'A note on /o/'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u3-interpalatal')} data-heading-id="learn-u3-interpalatal" onclick={() => handleTocClick('learn-u3-interpalatal')}>{language === 'fr' ? 'Deux voyelles changent de couleur au voisinage des consonnes molles' : 'Two vowels change colour near soft consonants'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u3-iotated')} data-heading-id="learn-u3-iotated" onclick={() => handleTocClick('learn-u3-iotated')}>{language === 'fr' ? 'Quatre lettres vocaliques portent une consonne cach\u00e9e' : 'Four vowel letters carry a hidden consonant'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u3-yo')} data-heading-id="learn-u3-yo" onclick={() => handleTocClick('learn-u3-yo')}>{language === 'fr' ? '\u27E8\u0451\u27E9 est toujours accentu\u00e9' : '\u27E8\u0451\u27E9 is always stressed'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u3-try')} data-heading-id="learn-u3-try" onclick={() => handleTocClick('learn-u3-try')}>{language === 'fr' ? 'Essayez dans Ilya' : 'Try this in Ilya'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Unit 4 ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={expandedSections.has('learn-unit-4')} class:contains-active={sectionContainsActive('learn-unit-4')} onclick={() => toggleSection('learn-unit-4')} aria-label="Toggle"><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link" class:active={isActive('learn-unit-4')} data-heading-id="learn-unit-4" onclick={() => handleTocClick('learn-unit-4')}>
										{language === 'fr' ? '4 \u00b7 La r\u00e9duction vocalique' : '4 \u00b7 Vowel Reduction'}
									</button>
								</div>
								<div class="toc-children" class:expanded={expandedSections.has('learn-unit-4')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u4-akanye')} data-heading-id="learn-u4-akanye" onclick={() => handleTocClick('learn-u4-akanye')}>{language === 'fr' ? '\u27E8\u043E\u27E9 et \u27E8\u0430\u27E9 sans accent' : '\u27E8\u043E\u27E9 and \u27E8\u0430\u27E9 when unstressed'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u4-ikanye')} data-heading-id="learn-u4-ikanye" onclick={() => handleTocClick('learn-u4-ikanye')}>{language === 'fr' ? '\u27E8\u0435\u27E9 et \u27E8\u044F\u27E9 vers [\u026A]' : '\u27E8\u0435\u27E9 and \u27E8\u044F\u27E9 toward [\u026A]'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u4-reconstitution')} data-heading-id="learn-u4-reconstitution" onclick={() => handleTocClick('learn-u4-reconstitution')}>{language === 'fr' ? 'La reconstitution' : 'Reconstitution'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u4-try')} data-heading-id="learn-u4-try" onclick={() => handleTocClick('learn-u4-try')}>{language === 'fr' ? 'Essayez dans Ilya' : 'Try this in Ilya'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Unit 5 ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={expandedSections.has('learn-unit-5')} class:contains-active={sectionContainsActive('learn-unit-5')} onclick={() => toggleSection('learn-unit-5')} aria-label="Toggle"><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link" class:active={isActive('learn-unit-5')} data-heading-id="learn-unit-5" onclick={() => handleTocClick('learn-unit-5')}>
										{language === 'fr' ? '5 \u00b7 Les consonnes' : '5 \u00b7 The Consonants'}
									</button>
								</div>
								<div class="toc-children" class:expanded={expandedSections.has('learn-unit-5')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u5-familiar')} data-heading-id="learn-u5-familiar" onclick={() => handleTocClick('learn-u5-familiar')}>{language === 'fr' ? 'Le syst\u00e8me consonantique' : 'The consonant system'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u5-pairs')} data-heading-id="learn-u5-pairs" onclick={() => handleTocClick('learn-u5-pairs')}>{language === 'fr' ? 'Paires vois\u00e9es-non vois\u00e9es' : 'Voiced-voiceless pairs'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u5-attention')} data-heading-id="learn-u5-attention" onclick={() => handleTocClick('learn-u5-attention')}>{language === 'fr' ? 'Attention cibl\u00e9e' : 'Focused attention'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u5-fixed')} data-heading-id="learn-u5-fixed" onclick={() => handleTocClick('learn-u5-fixed')}>{language === 'fr' ? 'Duret\u00e9 ou mollesse fixe' : 'Fixed hardness or softness'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u5-signs')} data-heading-id="learn-u5-signs" onclick={() => handleTocClick('learn-u5-signs')}>{language === 'fr' ? 'Les deux signes' : 'The two signs'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u5-devoicing')} data-heading-id="learn-u5-devoicing" onclick={() => handleTocClick('learn-u5-devoicing')}>{language === 'fr' ? 'D\u00e9voisement final' : 'Final devoicing'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u5-try')} data-heading-id="learn-u5-try" onclick={() => handleTocClick('learn-u5-try')}>{language === 'fr' ? 'Essayez dans Ilya' : 'Try this in Ilya'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Unit 6 ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={expandedSections.has('learn-unit-6')} class:contains-active={sectionContainsActive('learn-unit-6')} onclick={() => toggleSection('learn-unit-6')} aria-label="Toggle"><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link" class:active={isActive('learn-unit-6')} data-heading-id="learn-unit-6" onclick={() => handleTocClick('learn-unit-6')}>
										{language === 'fr' ? '6 \u00b7 La palatalisation' : '6 \u00b7 Palatalization'}
									</button>
								</div>
								<div class="toc-children" class:expanded={expandedSections.has('learn-unit-6')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u6-what')} data-heading-id="learn-u6-what" onclick={() => handleTocClick('learn-u6-what')}>{language === 'fr' ? 'Qu\u2019est-ce que la palatalisation\u00A0?' : 'What palatalization is'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u6-signals')} data-heading-id="learn-u6-signals" onclick={() => handleTocClick('learn-u6-signals')}>{language === 'fr' ? 'Rep\u00E9rer la palatalisation \u00E0 l\u2019\u00E9crit' : 'Signals on the page'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u6-stops')} data-heading-id="learn-u6-stops" onclick={() => handleTocClick('learn-u6-stops')}>{language === 'fr' ? 'Les six fronti\u00E8res' : 'What stops the spread'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u6-paired')} data-heading-id="learn-u6-paired" onclick={() => handleTocClick('learn-u6-paired')}>{language === 'fr' ? 'Appari\u00E9es et non appari\u00E9es' : 'Paired versus unpaired'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u6-clusters')} data-heading-id="learn-u6-clusters" onclick={() => handleTocClick('learn-u6-clusters')}>{language === 'fr' ? 'R\u00E9gressive dans les groupes' : 'Regressive in clusters'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u6-practice')} data-heading-id="learn-u6-practice" onclick={() => handleTocClick('learn-u6-practice')}>{language === 'fr' ? 'Mise en pratique' : 'Putting it together'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u6-velari')} data-heading-id="learn-u6-velari" onclick={() => handleTocClick('learn-u6-velari')}>{language === 'fr' ? 'Le i v\u00E9laire [\u0268]' : 'Velar-i [\u0268]'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Unit 7 ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={expandedSections.has('learn-unit-7')} class:contains-active={sectionContainsActive('learn-unit-7')} onclick={() => toggleSection('learn-unit-7')} aria-label="Toggle"><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link" class:active={isActive('learn-unit-7')} data-heading-id="learn-unit-7" onclick={() => handleTocClick('learn-unit-7')}>
										{language === 'fr' ? '7 \u00b7 Assimilation et fronti\u00e8res' : '7 \u00b7 Assimilation and Boundaries'}
									</button>
								</div>
								<div class="toc-children" class:expanded={expandedSections.has('learn-unit-7')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-two')} data-heading-id="learn-u7-two" onclick={() => handleTocClick('learn-u7-two')}>{language === 'fr' ? 'Deux formes d\u2019assimilation' : 'Two kinds of assimilation'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-voiced')} data-heading-id="learn-u7-voiced" onclick={() => handleTocClick('learn-u7-voiced')}>{language === 'fr' ? 'Vois\u00e9e rencontre sourde' : 'Voiced meets voiceless'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-stops')} data-heading-id="learn-u7-stops" onclick={() => handleTocClick('learn-u7-stops')}>{language === 'fr' ? 'Les limites du voisement' : 'What stops the spread'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-boundary')} data-heading-id="learn-u7-boundary" onclick={() => handleTocClick('learn-u7-boundary')}>{language === 'fr' ? 'D\u2019un mot \u00e0 l\u2019autre' : 'Across word boundaries'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-deletion')} data-heading-id="learn-u7-deletion" onclick={() => handleTocClick('learn-u7-deletion')}>{language === 'fr' ? 'L\u2019effacement consonantique' : 'Consonant deletion'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-mergers')} data-heading-id="learn-u7-mergers" onclick={() => handleTocClick('learn-u7-mergers')}>{language === 'fr' ? 'Fusions et absorptions' : 'Mergers and acquisitions'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-unusual')} data-heading-id="learn-u7-unusual" onclick={() => handleTocClick('learn-u7-unusual')}>{language === 'fr' ? '\u0441\u043A\u0443\u0447\u043D\u043E et \u0447\u0442\u043E' : '\u0441\u043A\u0443\u0447\u043D\u043E and \u0447\u0442\u043E'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-geminates')} data-heading-id="learn-u7-geminates" onclick={() => handleTocClick('learn-u7-geminates')}>{language === 'fr' ? 'Les g\u00e9min\u00e9es' : 'Geminates'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('learn-u7-tryit')} data-heading-id="learn-u7-tryit" onclick={() => handleTocClick('learn-u7-tryit')}>{language === 'fr' ? '\u00C0 vous de jouer' : 'Try this in Ilya'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Section 8 + closing items ── -->
							<li>
								<div class="toc-parent">
									<span class="toc-chevron-spacer" aria-hidden="true"></span>
									<button class="toc-link" class:active={isActive('learn-coda')} data-heading-id="learn-coda" onclick={() => handleTocClick('learn-coda')}>
										{language === 'fr' ? '8 \u00b7 Les inclassables' : '8 \u00b7 What These Rules Do Not Teach'}
									</button>
								</div>
							</li>
							<li>
								<button class="toc-link" class:active={isActive('learn-try')} data-heading-id="learn-try" onclick={() => handleTocClick('learn-try')}>
									{language === 'fr' ? 'Essayez' : 'Try This'}
								</button>
							</li>
							<li>
								<button class="toc-link" class:active={isActive('learn-notation')} data-heading-id="learn-notation" onclick={() => handleTocClick('learn-notation')}>
									{language === 'fr' ? 'Note sur la notation' : 'A Note on Notation'}
								</button>
							</li>
						</ul>
					</nav>
				{:else if activeTab === 'guide'}
					<nav class="learn-toc guide-toc" aria-label={language === 'fr' ? 'Table des matières du Guide' : 'Guide table of contents'}>
						<h2 class="section-label section-label-guide">GUIDE</h2>
						<ul class="toc-list">

							<!-- ── How Ilya Works ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={expandedSections.has('guide-how')} class:contains-active={sectionContainsActive('guide-how')} onclick={() => toggleSection('guide-how')} aria-label="Toggle"><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link toc-title" class:active={isActive('guide-how')} data-heading-id="guide-how" onclick={() => handleTocClick('guide-how')}>
										{language === 'fr' ? 'Comment fonctionne Ilya' : 'How Ilya Works'}
									</button>
								</div>
								<div class="toc-children" class:expanded={expandedSections.has('guide-how')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('guide-what')} data-heading-id="guide-what" onclick={() => handleTocClick('guide-what')}>{language === 'fr' ? 'Que fait Ilya ?' : 'What does Ilya do?'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-paste')} data-heading-id="guide-paste" onclick={() => handleTocClick('guide-paste')}>{language === 'fr' ? 'Saisie d\u2019un texte russe' : 'Pasting a Russian text'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-source')} data-heading-id="guide-source" onclick={() => handleTocClick('guide-source')}>{language === 'fr' ? 'Pourquoi une seule source ?' : 'Why only one source?'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-ai')} data-heading-id="guide-ai" onclick={() => handleTocClick('guide-ai')}>{language === 'fr' ? 'Ilya et l\u2019IA' : 'Is Ilya an AI tool?'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-role')} data-heading-id="guide-role" onclick={() => handleTocClick('guide-role')}>{language === 'fr' ? 'R\u00f4le de l\u2019utilisateur' : 'Your role as user'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-limits')} data-heading-id="guide-limits" onclick={() => handleTocClick('guide-limits')}>{language === 'fr' ? 'Limites d\u2019Ilya' : 'Limitations'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-future')} data-heading-id="guide-future" onclick={() => handleTocClick('guide-future')}>{language === 'fr' ? 'O\u00f9 va Ilya ?' : 'Where is Ilya headed?'}</button></li>
								<li><button class="toc-link toc-sub" class:active={isActive('guide-fit-forecast')} data-heading-id="guide-fit-forecast" onclick={() => handleTocClick('guide-fit-forecast')}>{language === 'fr' ? 'Fit pr\u00e9voit, il ne d\u00e9clare pas' : 'Fit forecasts, it doesn\u2019t declare'}</button></li>
								<li><button class="toc-link toc-sub" class:active={isActive('guide-fit-characteristics')} data-heading-id="guide-fit-characteristics" onclick={() => handleTocClick('guide-fit-characteristics')}>{language === 'fr' ? 'Caract\u00e9ristiques vocales' : 'Voice characteristics'}</button></li>
								<li><button class="toc-link toc-sub" class:active={isActive('guide-fit-notation')} data-heading-id="guide-fit-notation" onclick={() => handleTocClick('guide-fit-notation')}>{language === 'fr' ? 'Conventions de notation de Fit' : 'Fit\u2019s notation conventions'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Walkthrough ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={expandedSections.has('guide-walkthrough')} class:contains-active={sectionContainsActive('guide-walkthrough')} onclick={() => toggleSection('guide-walkthrough')} aria-label="Toggle"><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link toc-title" class:active={isActive('guide-walkthrough')} data-heading-id="guide-walkthrough" onclick={() => handleTocClick('guide-walkthrough')}>
										{language === 'fr' ? 'Une visite guidée' : 'A Walkthrough'}
									</button>
								</div>
								<div class="toc-children" class:expanded={expandedSections.has('guide-walkthrough')}><div class="toc-children-inner"><ul class="toc-subsections">
									<li><button class="toc-link toc-sub" class:active={isActive('guide-walk-interface')} data-heading-id="guide-walk-interface" onclick={() => handleTocClick('guide-walk-interface')}>{language === 'fr' ? 'L’interface en un coup d’œil' : 'The interface at a glance'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-walk-tabs')} data-heading-id="guide-walk-tabs" onclick={() => handleTocClick('guide-walk-tabs')}>{language === 'fr' ? 'Naviguer entre les onglets' : 'Navigating the tabs'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-walk-metadata')} data-heading-id="guide-walk-metadata" onclick={() => handleTocClick('guide-walk-metadata')}>{language === 'fr' ? 'Renseigner les métadonnées' : 'Entering metadata'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-walk-transcribe')} data-heading-id="guide-walk-transcribe" onclick={() => handleTocClick('guide-walk-transcribe')}>{language === 'fr' ? 'Transcrire' : 'Transcribing'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-walk-analysis')} data-heading-id="guide-walk-analysis" onclick={() => handleTocClick('guide-walk-analysis')}>{language === 'fr' ? 'Analyser les mots' : 'Analysing words'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-walk-notation')} data-heading-id="guide-walk-notation" onclick={() => handleTocClick('guide-walk-notation')}>{language === 'fr' ? 'Les préférences de notation' : 'Notation preferences'}</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-walk-print')} data-heading-id="guide-walk-print" onclick={() => handleTocClick('guide-walk-print')}>{language === 'fr' ? 'Imprimer et réinitialiser' : 'Printing and resetting'}</button></li>
								</ul></div></div>
							</li>

							<!-- ── Contributors ── -->
							<li>
								<div class="toc-parent">
									<button class="toc-chevron" class:expanded={expandedSections.has('guide-contributors')} class:contains-active={sectionContainsActive('guide-contributors')} onclick={() => toggleSection('guide-contributors')} aria-label="Toggle"><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
									<button class="toc-link toc-title" class:active={isActive('guide-contributors')} data-heading-id="guide-contributors" onclick={() => handleTocClick('guide-contributors')}>
										{language === 'fr' ? 'Collaborateurs' : 'Contributors'}
									</button>
								</div>
								<div class="toc-children" class:expanded={expandedSections.has('guide-contributors')}><div class="toc-children-inner"><ul class="toc-subsections">

									<!-- Craig Grayson -->
									<li>
										<div class="toc-parent toc-parent-nested">
											<button class="toc-chevron toc-chevron-nested" class:expanded={expandedSections.has('guide-grayson')} class:contains-active={sectionContainsActive('guide-grayson')} onclick={() => toggleSection('guide-grayson')} aria-label="Toggle"><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
											<button class="toc-link toc-sub" class:active={isActive('guide-grayson')} data-heading-id="guide-grayson" onclick={() => handleTocClick('guide-grayson')}>Craig Grayson</button>
										</div>
										<div class="toc-children" class:expanded={expandedSections.has('guide-grayson')}><div class="toc-children-inner"><ul class="toc-subsections">
											<li><button class="toc-link toc-deep" class:active={isActive('guide-grayson-intro')} data-heading-id="guide-grayson-intro" onclick={() => handleTocClick('guide-grayson-intro')}>{language === 'fr' ? 'Introduction \u00e0 Russian Lyric Diction' : 'Introduction to Russian Lyric Diction'}</button></li>
										</ul></div></div>
									</li>

									<!-- Dann Mitton -->
									<li>
										<div class="toc-parent toc-parent-nested">
											<button class="toc-chevron toc-chevron-nested" class:expanded={expandedSections.has('guide-mitton')} class:contains-active={sectionContainsActive('guide-mitton')} onclick={() => toggleSection('guide-mitton')} aria-label="Toggle"><svg class="chevron-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,1.5 7,5 3,8.5" /></svg></button>
											<button class="toc-link toc-sub" class:active={isActive('guide-mitton')} data-heading-id="guide-mitton" onclick={() => handleTocClick('guide-mitton')}>Dann Mitton</button>
										</div>
										<div class="toc-children" class:expanded={expandedSections.has('guide-mitton')}><div class="toc-children-inner"><ul class="toc-subsections">
											<li><button class="toc-link toc-deep" class:active={isActive('guide-mitton-note')} data-heading-id="guide-mitton-note" onclick={() => handleTocClick('guide-mitton-note')}>{language === 'fr' ? 'Mot du cr\u00e9ateur' : "Builder's Note"}</button></li>
										</ul></div></div>
									</li>

									<li><button class="toc-link toc-sub" class:active={isActive('guide-claude')} data-heading-id="guide-claude" onclick={() => handleTocClick('guide-claude')}>Claude</button></li>
									<li><button class="toc-link toc-sub" class:active={isActive('guide-kimi')} data-heading-id="guide-kimi" onclick={() => handleTocClick('guide-kimi')}>Kimi</button></li>
								</ul></div></div>
							</li>

							<!-- Licences -->
							<li><button class="toc-link" class:active={isActive('guide-licences')} data-heading-id="guide-licences" onclick={() => handleTocClick('guide-licences')}>{language === 'fr' ? 'Licences et remerciements' : 'Licences and Acknowledgments'}</button></li>
						</ul>
					</nav>
				{/if}
		</div>
		<!-- NOTATION (item N.7), anchored. Sibling of .drawer-content rather
		     than a child of it, so it sits outside the scroll (:468-471) and
		     holds the same position on both tabs. Gated to the two surfaces
		     that HAVE a document: Learn and Guide are reading surfaces with no
		     transcription in front of the reader. -->
		{#if notationPanel && (activeTab === 'transcription' || activeTab === 'shane')}
			<div class="drawer-anchor">
				{@render notationPanel()}
			</div>
		{/if}
	</div>
	</div>
	<!-- THE PULL, one control on every display (N.73 S1 §2.7, Dann's ruling
	     of 2026-08-19). No visible word: "fewer text elements onscreen is good
	     to allow the user to focus on their own texts, not controls." The
	     ratified word is the accessible name instead, and aria-expanded says
	     the state, so the name does not change under the singer.

	     The chevron points the way the drawer will MOVE when pressed: right
	     when it is closed and about to arrive, left when it is open and about
	     to leave. The SVG is drawn pointing right and flipped by CSS. -->
	<button
		class="drawer-lip"
		onclick={ontogglecollapse}
		aria-label={t('drawer.pull', language)}
		aria-expanded={!collapsed}
		title={t('drawer.pull', language)}
	>
		<svg class="lip-chevron" aria-hidden="true" width="14" height="20" viewBox="0 0 14 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<polyline points="3,2 11,10 3,18" />
		</svg>
	</button>
</aside>

<style>
	.drawer {
		position: relative;
		display: flex;
		flex-direction: row;
		height: 100%;
		flex-shrink: 0;
		transition: width 1500ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.drawer.collapsed {
		width: 0px;
	}

	.drawer-clip {
		/* Clips the pinned-width body as drawer animates — lip lives outside this */
		flex: 1;
		min-width: 0;
		overflow: hidden;
		position: relative;
	}

	.drawer-body {
		height: 100%;
		overflow: hidden;
		background: var(--drawer-bg);
		display: flex;
		flex-direction: column;
		border-right: 2px double var(--ink-primary, #1a1612);
	}


	.drawer-content {
		flex: 1;
		overflow-y: auto;
	}

	/* ── NOTATION anchor (N.7) ───────────────────────────── */
	/* A sibling of .drawer-content, not a child, so it never scrolls away.
	   flex-shrink: 0 because .drawer-content owns the flexible height and
	   this block must keep its own; without it a long panel would compress
	   the toggles rather than scroll behind them.

	   Side padding is 1rem, matching .root-panel and .shane-panel, so the
	   toggles keep the same left edge as everything above them. The rule is
	   the drawer's own border language (the 2px double of .drawer-body's
	   border-right) rather than the sage of RootPanel's .console-section,
	   because this shelf is now shared by two surfaces and must not carry
	   either one's identity colour. The section label inside it does that. */
	.drawer-anchor {
		flex-shrink: 0;
		/* 6px top to match .console-section's padding exactly
		   (RootPanel.svelte:498), so ANALYSIS and NOTATION sit the same
		   distance below their rules. */
		padding: 6px 1rem 12px;
		background: var(--drawer-bg);
		border-top: 2px double var(--ink-primary, #1a1612);
	}

	/* ── Tab transition animations ──────────────────────── */

	@keyframes tabSlideFromRight {
		from { opacity: 0; transform: translateX(12px); }
		to { opacity: 1; transform: translateX(0); }
	}

	@keyframes tabSlideFromLeft {
		from { opacity: 0; transform: translateX(-12px); }
		to { opacity: 1; transform: translateX(0); }
	}

	.drawer-content :global(.tab-enter-from-right) {
		animation: tabSlideFromRight 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	.drawer-content :global(.tab-enter-from-left) {
		animation: tabSlideFromLeft 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	.drawer-content.tab-enter-from-right {
		animation: tabSlideFromRight 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	.drawer-content.tab-enter-from-left {
		animation: tabSlideFromLeft 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	/* ── The pull: a bookmark tab on the drawer's edge ──── */

	/* Option A of `docs/sessions/ilya-lip-options_r1_2026-08-18.html`, ruled
	   by Dann 2026-08-18 for the desktop and extended to every display on
	   2026-08-19. A flat tab flush with the drawer's outward edge, drawer
	   fill, hairline border, rounded on its outward corners only. It reads as
	   part of the drawer, a thumb notch on a spine, not a button floating on
	   the desk.

	   THE HUE STAYS NEUTRAL. The four per-destination handle colours that
	   lived here (sage, rose, cobalt, lavender, each with a hover shade) are
	   gone: hue names place, and this control belongs to the drawer, which is
	   the same drawer on every desk. That also settles §2.5's instruction to
	   fold `shane` in with `transcription` here; there is no colour left to
	   fold. Ink names state, and the state is the chevron's direction. */
	.drawer-lip {
		position: absolute;
		top: 50%;
		left: 100%;
		transform: translateY(-50%);
		width: 20px;
		height: 76px;
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--drawer-bg, #FAF8F5);
		border: 1px solid rgba(26, 22, 18, 0.18);
		border-left: none;
		border-radius: 0 5px 5px 0;
		box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.18);
		cursor: pointer;
		z-index: 2;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.drawer-lip:hover {
		background: #fff;
	}

	.drawer-lip:focus-visible {
		outline: 2px solid var(--ink-primary, #1a1612);
		outline-offset: 2px;
	}

	/* MODALITY, not viewport width, sets the geometry: a coarse pointer gets
	   the 44 px floor. This is the ruled pattern and it is deliberately not a
	   third touch-geometry exemption.

	   N.73 S1b §3. This rule used to grow the VISIBLE tab to 44 by 88, which
	   is 11 percent of a 390px screen given over to a handle. The visible tab
	   is now 20 by 76 on every pointer, the desktop's own size, and a
	   transparent extension carries the target. The target is still 44 by 88,
	   so the floor is met and no exemption is created.

	   The extension is a pseudo-element rather than padding because padding
	   would grow the tab's painted box: the background, the border and the
	   border-radius are on .drawer-lip itself, and there is no way to pad a
	   box without painting the padding. ::before is inside the button, so a
	   press anywhere in it is a press on the button.

	   It extends INTO THE DESK, not off-screen: left: 0 anchors it to the
	   tab's left edge, so it covers the 20px tab and reaches 24px further
	   right, over the desk. Closed, the tab sits at left: 100%, which on the
	   phone is the viewport's left edge, so all 44px are on-screen. */
	@media (pointer: coarse) {
		.drawer-lip::before {
			content: '';
			position: absolute;
			top: 50%;
			left: 0;
			width: 44px;
			height: 88px;
			transform: translateY(-50%);
		}
	}

	/* ── The chevron ─────────────────────────────────────── */

	.lip-chevron {
		width: 14px;
		height: 20px;
		color: var(--ink-primary, #1a1612);
		/* Drawn pointing right, which is the direction a CLOSED drawer will
		   move. Open, it flips to point the way out. */
		transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.drawer:not(.collapsed) .lip-chevron {
		transform: scaleX(-1);
	}

	.drawer.collapsed .lip-chevron {
		transform: scaleX(1);
	}

	/* ── Placeholder panels ─────────────────────────────── */

	.placeholder-panel {
		padding: 1.5rem;
	}

	.section-label {
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-secondary, #4a4540);
		margin: 0 0 1rem 0;
	}

	.section-label-learn {
		color: var(--dusty-rose, #A67B7B);
	}

	.section-label-guide {
		color: var(--quiet-cobalt, #5C739E);
	}

	.placeholder-text {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 0.95rem;
		color: var(--ink-secondary, #4a4540);
		line-height: 1.6;
		margin: 0;
	}

	/* ── TOC base styles ─────────────────────────────────── */

	.learn-toc {
		padding: 1.5rem;
	}

	.toc-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.toc-list li {
		margin: 0;
		padding: 0;
	}

	.toc-link {
		display: block;
		width: 100%;
		text-align: left;
		background: none;
		border: none;
		border-left: 3px solid transparent;
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 0.9rem;
		color: var(--ink-secondary, #4a4540);
		line-height: 1.4;
		padding: 0.4rem 0 0.4rem 0.75rem;
		cursor: pointer;
		transition: border-color 150ms ease, color 150ms ease, background-color 150ms ease;
	}

	.toc-link:hover {
		border-left-color: rgba(166, 123, 123, 0.4);
		background: rgba(166, 123, 123, 0.06);
		color: var(--ink-primary, #1a1612);
	}

	.toc-link:focus-visible {
		outline: 2px solid var(--sage, #8B9A7D);
		outline-offset: -2px;
		border-radius: 2px;
	}

	/* ── Active heading indicator ─────────────────────────── */

	.toc-link.active {
		border-left-color: var(--dusty-rose, #A67B7B);
		border-left-width: 4px;
		color: var(--ink-primary, #1a1612);
		background: rgba(166, 123, 123, 0.08);
		font-weight: 500;
		padding-left: calc(0.75rem - 1px);
	}

	.toc-link.active:hover {
		border-left-color: var(--dusty-rose, #A67B7B);
		color: var(--ink-primary, #1a1612);
	}

	.toc-link.toc-title {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--ink-primary, #1a1612);
		padding-top: 0.25rem;
		padding-bottom: 0.5rem;
	}

	.toc-subsections {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.toc-subsections li {
		margin: 0;
		padding: 0;
	}

	.toc-sub {
		padding-left: 2.5rem !important;
		font-size: 0.8rem !important;
		color: var(--ink-secondary, #4a4540);
		opacity: 0.85;
	}

	.toc-sub:hover {
		opacity: 1;
	}

	.toc-sub.active {
		opacity: 1;
	}

	.toc-deep {
		padding-left: 3.5rem !important;
		font-size: 0.75rem !important;
		color: var(--ink-secondary, #4a4540);
		opacity: 0.75;
	}

	.toc-deep:hover {
		opacity: 1;
	}

	.toc-deep.active {
		opacity: 1;
	}

	/* ── Parent row: chevron + text side by side ──────────── */

	.toc-parent {
		display: flex;
		align-items: center;
	}

	.toc-parent .toc-link {
		flex: 1;
		min-width: 3px;
	}

	/* ── Chevron button ──────────────────────────────────── */

	.toc-chevron {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		flex-shrink: 0;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		color: var(--ink-tertiary, #8a8780);
		transition: color 150ms ease;
	}

	.toc-chevron:hover {
		color: var(--ink-secondary, #4a4540);
	}

	.toc-chevron.contains-active {
		color: var(--dusty-rose, #A67B7B);
	}

	.toc-chevron-spacer {
		width: 24px;
		height: 24px;
		flex-shrink: 0;
	}


	/* -- Guide tab: quiet-cobalt colour identity ----------- */

	.guide-toc .toc-link:hover {
		border-left-color: rgba(92, 115, 158, 0.4);
		background: rgba(92, 115, 158, 0.06);
	}

	.guide-toc .toc-link.active {
		border-left-color: var(--quiet-cobalt, #5C739E);
		background: rgba(92, 115, 158, 0.08);
	}

	.guide-toc .toc-link.active:hover {
		border-left-color: var(--quiet-cobalt, #5C739E);
	}

	.guide-toc .toc-chevron.contains-active {
		color: var(--quiet-cobalt, #5C739E);
	}

	.toc-chevron:focus-visible {
		outline: 2px solid var(--sage, #8B9A7D);
		outline-offset: -2px;
		border-radius: 2px;
	}

	.chevron-icon {
		transition: transform 200ms ease-out;
	}

	.toc-chevron.expanded .chevron-icon {
		transform: rotate(90deg);
	}

	.toc-parent-nested {
		padding-left: 0;
	}

	.toc-parent-nested .toc-sub {
		padding-left: calc(2.5rem - 20px) !important;
	}

	.toc-chevron-nested {
		width: 20px;
		height: 20px;
	}

	/* ── Collapsible children: grid animation ────────────── */

	.toc-children {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 250ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.toc-children.expanded {
		grid-template-rows: 1fr;
	}

	.toc-children-inner {
		overflow: hidden;
	}

	/* ── Mobile ──────────────────────────────────────────── */

	@media (max-width: 767px) {
		/* The drawer is a full-screen overlay that arrives FROM THE LEFT.
		   Dann's ruling, 2026-08-19: the desktop's illusion is horizontal
		   motion, the phone's vertical motion was a form-factor concession,
		   and the concession is withdrawn. One motion model, every display.
		   It arrives from the left because that is where it sits on the
		   desktop, where .drawer-body's double border-right faces the paper.

		   The height was calc(100dvh - 56px), reserving the deleted tab bar's
		   footer. The bar is gone and the drawer takes the viewport. */
		.drawer {
			position: fixed !important;
			top: 0 !important;
			left: 0 !important;
			width: 100% !important;
			height: 100dvh !important;
			z-index: 60;
			/* MEASURED: this was `overflow: hidden`, and it clipped the pull
			   out of sight the moment the pull moved outside the drawer's own
			   box. The pull sits at `left: 100%` when the drawer is closed,
			   which is the only place a closed drawer can show a handle. The
			   body is still clipped, by .drawer-clip, which is what that
			   element is for. */
			overflow: visible;
			transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1) !important;
		}

		/* Collapsed, the overlay sits entirely to the left of the viewport.
		   It was `translateY(100%)` with `width: 0 !important` behind it,
		   the width there only to stop a translated full-width overlay from
		   swallowing touches on the desk. Two things now stop that instead,
		   and neither needs the width: the overlay is off-screen, and it
		   takes no pointer events. Off-screen to the LEFT also costs no
		   horizontal scroll, because no browser scrolls into negative space
		   in a left-to-right document. */
		.drawer.collapsed {
			transform: translateX(-100%);
			pointer-events: none;
		}

		.drawer:not(.collapsed) {
			transform: translateX(0);
		}

		/* The pull is the exception to that: it is how a closed drawer gets
		   opened, so it keeps its touches while the overlay behind it
		   refuses them. */
		.drawer.collapsed .drawer-lip {
			pointer-events: auto;
		}

		/* Closed, `left: 100%` lands the tab against the drawer's outward
		   edge, which is the left edge of the phone. Open, the drawer is the
		   whole screen, so the tab moves inside its right edge, still the
		   outward edge and still within a thumb's reach. */
		.drawer:not(.collapsed) .drawer-lip {
			left: auto;
			right: 0;
		}

		/* The open tab's outward edge IS the viewport's right edge, so the
		   touch extension has to reach the other way or it would hang
		   off-screen and the target would measure 20px. It reaches back into
		   the drawer, across the 44px gutter .drawer-body reserves below,
		   where nothing else is drawn. Inert without a coarse pointer, which
		   is the only place ::before takes a `content`. */
		.drawer:not(.collapsed) .drawer-lip::before {
			left: auto;
			right: 0;
		}

		/* Body fills full height */
		.drawer-clip {
			width: 100% !important;
			height: 100%;
			overflow: visible;
		}

		/* The open drawer keeps a 44px gutter on the right, the width of the
		   pull's TOUCH TARGET, which since N.73 S1b is wider than the 20px
		   the pull paints. The gutter measures the target, not the paint, so
		   the pull can never cover a control. On .drawer-body rather than .drawer-content because the
		   NOTATION anchor is .drawer-content's SIBLING, not its child, and
		   would otherwise keep its own edge under the pull. It costs 44px of
		   a 390px phone, which is the price of one control never hiding
		   another. */
		.drawer-body {
			width: 100% !important;
			height: 100%;
			flex-direction: column;
			border-right: none;
			overflow: visible;
			padding-right: 44px;
			box-sizing: border-box;
		}

		/* Drawer content: allow scroll to prevent left clipping */
		.drawer-content {
			overflow-x: auto;
			overflow-y: auto;
		}

		.toc-chevron {
			width: 44px;
			height: 44px;
		}
	}

	/* ── Reduced motion ──────────────────────────────────── */

	@media (prefers-reduced-motion: reduce) {
		.drawer {
			transition: none;
		}

		.lip-chevron {
			transition-duration: 0.01ms !important;
		}

		.drawer-content.tab-enter-from-right,
		.drawer-content.tab-enter-from-left {
			animation: none;
		}

		.toc-children {
			transition: none;
		}

		.chevron-icon {
			transition: none;
		}
	}
</style>
