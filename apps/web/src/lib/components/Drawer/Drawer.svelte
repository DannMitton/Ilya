<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import TabBar, { type TabId } from './TabBar.svelte';

	interface Props {
		width: number;
		collapsed: boolean;
		language: Language;
		activeTab: TabId;
		activeHeadingId: string | null;
		tabTransitionClass: string;
		rootPanel: Snippet;
		ontogglecollapse: () => void;
		ontabchange: (tab: TabId) => void;
		onheadingnavigate: (id: string) => void;
	}

	let { width, collapsed, language, activeTab, activeHeadingId = null, tabTransitionClass, rootPanel, ontogglecollapse, ontabchange, onheadingnavigate }: Props = $props();

	let expandedSections = $state(new Set<string>());
	let drawerContentEl: HTMLElement | undefined = $state();

	/* ── Parent chain lookup for auto-expand ───────────────── */

	const learnUnitChildren: Record<string, string> = {
		'learn-u1-song': 'learn-unit-1', 'learn-u1-alphabet': 'learn-unit-1',
		'learn-u1-familiar': 'learn-unit-1', 'learn-u1-signs': 'learn-unit-1', 'learn-u1-yo': 'learn-unit-1',
		'learn-u1-glyphs': 'learn-unit-1', 'learn-u1-try': 'learn-unit-1',
		'learn-u2-meaning': 'learn-unit-2', 'learn-u2-moves': 'learn-unit-2', 'learn-u2-dictionary': 'learn-unit-2',
		'learn-u2-sounds': 'learn-unit-2', 'learn-u2-try': 'learn-unit-2',
		'learn-u3-inventory': 'learn-unit-3', 'learn-u3-interpalatal': 'learn-unit-3', 'learn-u3-iotated': 'learn-unit-3',
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
		if (['guide-what','guide-paste','guide-source','guide-ai','guide-role','guide-limits','guide-future'].includes(id)) return ['guide-how'];
		if (['guide-grayson','guide-mitton','guide-claude','guide-kimi'].includes(id)) return ['guide-contributors'];
		if (id === 'guide-grayson-intro') return ['guide-contributors', 'guide-grayson'];
		if (id === 'guide-mitton-note') return ['guide-contributors', 'guide-mitton'];
		return [];
	}

	const collapsibleIds = new Set([
		'learn-unit-1','learn-unit-2','learn-unit-3','learn-unit-4','learn-unit-5','learn-unit-6','learn-unit-7',
		'guide-how','guide-contributors','guide-grayson','guide-mitton'
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

<aside class="drawer" class:collapsed style="width: {collapsed ? 0 : width}px" aria-label="Controls">
	<div class="drawer-clip">
	<div class="drawer-body" style="width: {width}px">
		<div
			class="drawer-content {tabTransitionClass}"
			role="tabpanel"
			id="tabpanel-{activeTab}"
			aria-labelledby="tab-{activeTab}"
			bind:this={drawerContentEl}
		>
				{#if activeTab === 'transcription'}
					{@render rootPanel()}
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
						</ul>
					</nav>
				{/if}
		</div>
		<TabBar {activeTab} {language} {ontabchange} />
	</div>
	</div>
	<button
		class="drawer-lip"
		onclick={ontogglecollapse}
		aria-label={collapsed ? t('drawer.expand', language) : t('drawer.collapse', language)}
		title={collapsed ? t('drawer.expand', language) : t('drawer.collapse', language)}
	>
		<span class="drawer-handle" aria-hidden="true">
			<svg class="handle-chevron" width="14" height="20" viewBox="0 0 14 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="3,2 11,10 3,18" />
			</svg>
		</span>
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

	/* ── Lip: invisible full-height touch target ─────── */

	.drawer-lip {
		position: absolute;
		top: 0;
		right: -22px;
		width: 44px;
		height: 100%;
		padding: 0;
		margin: 0;
		border: none;
		cursor: pointer;
		background: transparent;
		z-index: 2;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.drawer-lip:hover {
		background: transparent;
	}

	.drawer-lip:focus-visible {
		outline: 2px solid var(--sage);
		outline-offset: 2px;
	}

	/* ── Handle: visible morphing semicircle (36×72) ─── */

	.drawer-handle {
		position: absolute;
		top: 50%;
		left: 22px;
		transform: translateY(-50%);
		width: 36px;
		height: 72px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0 72px 72px 0;
		background-color: var(--handle-bg, rgba(26, 22, 18, 0.65));
		box-shadow: 1px 0 4px rgba(45, 45, 45, 0.12);
		pointer-events: none;
		user-select: none;
		/* Colour morphs; position rides with drawer width */
		transition: background-color 1500ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	/* ── Chevron ─────────────────────────────────────── */

	.handle-chevron {
		width: 14px;
		height: 20px;
		color: var(--handle-fg, #FAF8F5);
		transition:
			color 1500ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 1500ms cubic-bezier(0.22, 1, 0.36, 1);
		/* Open: right-pointing SVG flipped to point left */
		transform: scaleX(-1);
	}

	/* ── State: expanded (default) — black, chevron left  */

	.drawer:not(.collapsed) .drawer-handle {
		--handle-bg: rgba(26, 22, 18, 0.65);
	}

	.drawer:not(.collapsed) .handle-chevron {
		--handle-fg: var(--drawer-bg, #FAF8F5);
		transform: scaleX(-1);
	}

	/* ── State: collapsed — sage, chevron right ─────── */

	.drawer.collapsed .drawer-handle {
		--handle-bg: var(--sage, #8B9A7D);
	}

	.drawer.collapsed .handle-chevron {
		--handle-fg: var(--drawer-bg, #FAF8F5);
		transform: scaleX(1);
	}

	/* ── Hover: immediate feedback ──────────────────── */

	.drawer:not(.collapsed) .drawer-lip:hover .drawer-handle {
		--handle-bg: rgba(26, 22, 18, 0.82);
		transition: background-color 200ms ease;
	}

	.drawer.collapsed .drawer-lip:hover .drawer-handle {
		--handle-bg: var(--deeper-sage, #7A8A6C);
		transition: background-color 200ms ease;
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
		.drawer.collapsed {
			width: auto;
		}

		.drawer.collapsed .drawer-body {
			display: flex;
		}

		.drawer-lip {
			display: none;
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

		.drawer-handle,
		.handle-chevron {
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
