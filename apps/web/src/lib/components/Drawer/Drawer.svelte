<script lang="ts">
	import type { Snippet } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import TabBar, { type TabId } from './TabBar.svelte';

	interface Props {
		width: number;
		collapsed: boolean;
		language: Language;
		activeTab: TabId;
		tabTransitionClass: string;
		rootPanel: Snippet;
		ontogglecollapse: () => void;
		ontabchange: (tab: TabId) => void;
	}

	let { width, collapsed, language, activeTab, tabTransitionClass, rootPanel, ontogglecollapse, ontabchange }: Props = $props();
</script>

<aside class="drawer" class:collapsed style="width: {collapsed ? 6 : width}px" aria-label="Controls">
	<div class="drawer-body">
		{#if !collapsed}
			<div
				class="drawer-content {tabTransitionClass}"
				role="tabpanel"
				id="tabpanel-{activeTab}"
				aria-labelledby="tab-{activeTab}"
			>
				{#if activeTab === 'transcription'}
					{@render rootPanel()}
				{:else if activeTab === 'learn'}
					<nav class="learn-toc" aria-label={language === 'fr' ? 'Table des matières' : 'Table of contents'}>
						<h2 class="section-label">LEARN</h2>
						<ul class="toc-list">
							<li>
								<button class="toc-link toc-title" onclick={() => document.getElementById('learn-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
									{language === 'fr' ? 'La diction lyrique russe pour chanteurs' : 'Russian Lyric Diction for Singers'}
								</button>
							</li>
							<li>
								<button class="toc-link" onclick={() => document.getElementById('learn-about')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
									{language === 'fr' ? 'À propos de ce module' : 'About This Module'}
								</button>
							</li>
							<li>
								<button class="toc-link" onclick={() => document.getElementById('learn-arc')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
									{language === 'fr' ? 'L\u2019arc d\u2019apprentissage' : 'The Learning Arc'}
								</button>
							</li>
							<li class="toc-unit">
								<button class="toc-link" onclick={() => document.getElementById('learn-unit-1')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
									{language === 'fr' ? '1 · Les lettres' : '1 · The Letters'}
								</button>
								<ul class="toc-subsections">
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u1-song')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'La chanson de l\u2019alphabet' : 'The Alphabet Song'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u1-before')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Avant de commencer' : 'Before We Begin'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u1-alphabet')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'L\u2019alphabet' : 'The Alphabet'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u1-familiar')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Ce que vous connaissez d\u00e9j\u00e0' : 'What You Already Know'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u1-signs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Les deux signes' : 'The Two Signs'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u1-yo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Note sur \u27E8\u0401\u27E9' : 'A Note on \u27E8\u0401\u27E9'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u1-glyphs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Le tableau des glyphes' : 'The Glyph Table'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u1-try')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Essayez' : 'Try This'}
										</button>
									</li>
								</ul>
							</li>
							<li class="toc-unit">
								<button class="toc-link" onclick={() => document.getElementById('learn-unit-2')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
									{language === 'fr' ? '2 · L\u2019accent tonique' : '2 · Stress'}
								</button>
								<ul class="toc-subsections">
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u2-meaning')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'L\u2019accent change le sens' : 'Stress changes meaning'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u2-moves')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'L\u2019accent se d\u00e9place' : 'Stress moves'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u2-dictionary')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Probl\u00e8me de dictionnaire' : 'A dictionary problem'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u2-sounds')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Comment l\u2019accent sonne' : 'How stress sounds'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u2-try')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Essayez' : 'Try this'}
										</button>
									</li>
								</ul>
							</li>
							<li class="toc-unit">
								<button class="toc-link" onclick={() => document.getElementById('learn-unit-3')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
									{language === 'fr' ? '3 · Les voyelles accentuées' : '3 · Stressed Vowels'}
								</button>
								<ul class="toc-subsections">
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u3-inventory')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Ce sont les voyelles accentu\u00e9es qui constituent les cibles' : 'Stressed vowels are the targets'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u3-interpalatal')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Deux voyelles changent de couleur au voisinage des consonnes molles' : 'Two vowels change colour near soft consonants'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u3-iotated')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Quatre lettres vocaliques portent une consonne cach\u00e9e' : 'Four vowel letters carry a hidden consonant'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u3-yo')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? '\u27E8\u0451\u27E9 est toujours accentu\u00e9' : '\u27E8\u0451\u27E9 is always stressed'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u3-try')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Essayez dans Ilya' : 'Try this in Ilya'}
										</button>
									</li>
								</ul>
							</li>
							<li class="toc-unit">
								<button class="toc-link" onclick={() => document.getElementById('learn-unit-4')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
									{language === 'fr' ? '4 · La réduction vocalique' : '4 · Vowel Reduction'}
								</button>
								<ul>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u4-akanye')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? '⟨о⟩ et ⟨а⟩ sans accent' : '⟨о⟩ and ⟨а⟩ when unstressed'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u4-ikanye')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? '⟨е⟩ et ⟨я⟩ vers [ɪ]' : '⟨е⟩ and ⟨я⟩ toward [ɪ]'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u4-reconstitution')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'La reconstitution' : 'Reconstitution'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u4-try')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Essayez dans Ilya' : 'Try this in Ilya'}
										</button>
									</li>
								</ul>
							</li>
								<li class="toc-unit">
								<button class="toc-link" onclick={() => document.getElementById('learn-unit-5')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
									{language === 'fr' ? '5 · Les consonnes' : '5 · The Consonants'}
								</button>
								<ul class="toc-subsections">
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u5-familiar')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Le système consonantique' : 'The consonant system'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u5-pairs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Paires voisées-non voisées' : 'Voiced-voiceless pairs'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u5-attention')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Attention ciblée' : 'Focused attention'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u5-fixed')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Dureté ou mollesse fixe' : 'Fixed hardness or softness'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u5-signs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Les deux signes' : 'The two signs'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u5-devoicing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Dévoisement final' : 'Final devoicing'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u5-try')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Essayez dans Ilya' : 'Try this in Ilya'}
										</button>
									</li>
								</ul>
							</li>
							<li class="toc-unit">
								<button class="toc-link" onclick={() => document.getElementById('learn-unit-6')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
									{language === 'fr' ? '6 · La palatalisation' : '6 · Palatalization'}
								</button>
															<ul class="toc-subsections">
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u6-what')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Qu\u2019est-ce que la palatalisation\u00A0?' : 'What palatalization is'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u6-signals')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Rep\u00E9rer la palatalisation \u00E0 l\u2019\u00E9crit' : 'Signals on the page'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u6-stops')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Les six fronti\u00E8res' : 'What stops the spread'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u6-paired')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Appari\u00E9es et non appari\u00E9es' : 'Paired versus unpaired'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u6-clusters')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'R\u00E9gressive dans les groupes' : 'Regressive in clusters'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u6-practice')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Mise en pratique' : 'Putting it together'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u6-velari')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Le i v\u00E9laire [\u0268]' : 'Velar-i [\u0268]'}
										</button>
									</li>
								</ul>
</li>
							<li class="toc-unit">
								<button class="toc-link" onclick={() => document.getElementById('learn-unit-7')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
									{language === 'fr' ? '7 · Assimilation et frontières' : '7 · Assimilation and Boundaries'}
								</button>
									<ul class="toc-subsections">
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u7-two')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Deux formes d\u2019assimilation' : 'Two kinds of assimilation'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u7-voiced')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Vois\u00E9e rencontre sourde' : 'Voiced meets voiceless'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u7-stops')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Les limites du voisement' : 'What stops the spread'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u7-boundary')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'D\u2019un mot \u00E0 l\u2019autre' : 'Across word boundaries'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u7-deletion')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'L\u2019effacement consonantique' : 'Consonant deletion'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u7-mergers')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Fusions et absorptions' : 'Mergers and acquisitions'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u7-unusual')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? '\u0441\u043A\u0443\u0447\u043D\u043E et \u0447\u0442\u043E' : '\u0441\u043A\u0443\u0447\u043D\u043E and \u0447\u0442\u043E'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u7-geminates')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? 'Les g\u00E9min\u00E9es' : 'Geminates'}
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('learn-u7-tryit')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											{language === 'fr' ? '\u00C0 vous de jouer' : 'Try this in Ilya'}
										</button>
									</li>
								</ul>
							</li>
							<li>
								<button class="toc-link" onclick={() => document.getElementById('learn-coda')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
									{language === 'fr' ? 'Les inclassables' : 'What These Rules Do Not Teach'}
								</button>
							</li>
							<li>
								<button class="toc-link" onclick={() => document.getElementById('learn-try')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
									{language === 'fr' ? 'Essayez' : 'Try This'}
								</button>
							</li>
							<li>
								<button class="toc-link" onclick={() => document.getElementById('learn-notation')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
									{language === 'fr' ? 'Note sur la notation' : 'A Note on Notation'}
								</button>
							</li>
						</ul>
					</nav>
				{:else if activeTab === 'guide'}
					<nav class="learn-toc" aria-label={language === 'fr' ? 'Table des matières du Guide' : 'Guide table of contents'}>
						<h2 class="section-label">GUIDE</h2>
						<ul class="toc-list">
							<li>
								<button class="toc-link toc-title" onclick={() => document.getElementById('guide-how')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
									{language === 'fr' ? 'Comment fonctionne Ilya' : 'How Ilya Works'}
								</button>
							</li>
							<li>
								<button class="toc-link toc-title" onclick={() => document.getElementById('guide-contributors')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
									{language === 'fr' ? 'Collaborateurs' : 'Contributors'}
								</button>
								<ul class="toc-subsections">
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('guide-grayson')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											Craig Grayson
										</button>
										<ul class="toc-subsections">
											<li>
												<button class="toc-link toc-deep" onclick={() => document.getElementById('guide-grayson')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
													{language === 'fr' ? 'Biographie' : 'Bio'}
												</button>
											</li>
											<li>
												<button class="toc-link toc-deep" onclick={() => document.getElementById('guide-grayson-intro')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
													{language === 'fr' ? 'Introduction à Russian Lyric Diction' : 'Introduction to Russian Lyric Diction'}
												</button>
											</li>
										</ul>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('guide-mitton')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											Dann Mitton
										</button>
										<ul class="toc-subsections">
											<li>
												<button class="toc-link toc-deep" onclick={() => document.getElementById('guide-mitton')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
													{language === 'fr' ? 'Biographie' : 'Bio'}
												</button>
											</li>
											<li>
												<button class="toc-link toc-deep" onclick={() => document.getElementById('guide-mitton-note')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
													{language === 'fr' ? 'Mot du créateur' : "Builder's Note"}
												</button>
											</li>
										</ul>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('guide-claude')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											Claude
										</button>
									</li>
									<li>
										<button class="toc-link toc-sub" onclick={() => document.getElementById('guide-kimi')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
											Kimi
										</button>
									</li>
								</ul>
							</li>
						</ul>
					</nav>
				{/if}
			</div>
			<TabBar {activeTab} {language} {ontabchange} />
		{/if}
	</div>
	<button
		class="drawer-lip"
		onclick={ontogglecollapse}
		aria-label={collapsed ? t('drawer.expand', language) : t('drawer.collapse', language)}
		title={collapsed ? t('drawer.expand', language) : t('drawer.collapse', language)}
	></button>
</aside>

<style>
	.drawer {
		position: relative;
		display: flex;
		flex-direction: row;
		height: 100%;
		flex-shrink: 0;
		transition: width 1000ms cubic-bezier(0.25, 0, 0.15, 1);
	}

	.drawer.collapsed {
		width: 6px;
	}

	.drawer-body {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		background: var(--drawer-bg);
		display: flex;
		flex-direction: column;
	}

	.collapsed .drawer-body {
		display: none;
	}

	.drawer-content {
		flex: 1;
		overflow-y: auto;
	}

	/* ── Tab transition animations ──────────────────────── */

	@keyframes tabSlideFromRight {
		from {
			opacity: 0;
			transform: translateX(12px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes tabSlideFromLeft {
		from {
			opacity: 0;
			transform: translateX(-12px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.drawer-content :global(.tab-enter-from-right) {
		animation: tabSlideFromRight 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	.drawer-content :global(.tab-enter-from-left) {
		animation: tabSlideFromLeft 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	/* Apply animation to the drawer-content itself when class is set */
	.drawer-content.tab-enter-from-right {
		animation: tabSlideFromRight 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	.drawer-content.tab-enter-from-left {
		animation: tabSlideFromLeft 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	/* ── Lip: 6px sage edge with invisible 44px touch target ── */

	.drawer-lip {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 6px;
		min-width: 6px;
		height: 100%;
		background: var(--sage);
		opacity: 0.6;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: opacity 0.2s ease, width 0.2s ease;
	}

	/* Invisible touch target: 44px wide, extends into page area */
	.drawer-lip::after {
		content: '';
		position: absolute;
		top: 0;
		left: -19px;
		right: -19px;
		bottom: 0;
		z-index: 1;
	}

	.drawer-lip:hover {
		opacity: 0.9;
		width: 8px;
		min-width: 8px;
	}

	.drawer-lip:focus-visible {
		outline: 2px solid var(--sage);
		outline-offset: 2px;
	}

	/* ── Placeholder panels for LEARN and Guide tabs ─────── */

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

	.placeholder-text {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 0.95rem;
		color: var(--ink-secondary, #4a4540);
		line-height: 1.6;
		margin: 0;
	}

	/* ── LEARN table of contents ───────────────────────── */

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
		transition: border-color 150ms ease, color 150ms ease;
	}

	.toc-link:hover {
		border-left-color: var(--terracotta, #C17C60);
		color: var(--ink-primary, #1a1612);
	}

	.toc-link:focus-visible {
		outline: 2px solid var(--sage, #8B9A7D);
		outline-offset: -2px;
		border-radius: 2px;
	}

	.toc-link.toc-title {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--ink-primary, #1a1612);
		padding-top: 0.25rem;
		padding-bottom: 0.5rem;
	}

	.toc-unit .toc-link {
		padding-left: 1.5rem;
		font-size: 0.85rem;
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

	.toc-deep {
		padding-left: 3.5rem !important;
		font-size: 0.75rem !important;
		color: var(--ink-secondary, #4a4540);
		opacity: 0.75;
	}

	.toc-deep:hover {
		opacity: 1;
	}

	/* ── Mobile: drawer stays open below 768px ──────────── */

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
	}

	/* ── Reduced motion ──────────────────────────────────── */

	@media (prefers-reduced-motion: reduce) {
		.drawer {
			transition: none;
		}

		.drawer-content.tab-enter-from-right,
		.drawer-content.tab-enter-from-left {
			animation: none;
		}
	}
</style>
