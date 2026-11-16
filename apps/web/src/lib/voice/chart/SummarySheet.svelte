<!--
	THE SHEET ON THE SUMMARY (N.199 Step 2; for every singer since Step 8). The wizard is at its line ceiling, so the sheet and its
	print control live here and the wizard carries one line for it.
-->
<script lang="ts">
	import type { Language } from '$lib/i18n';
	import type { CalibratedFormant, Vowel } from '../engine/types';
	import VowelSpaceSheet from './VowelSpaceSheet.svelte';
	import { printVowelSheet } from './print-sheet';

	let { profile, voiceType, language, voiceName, onOpenLearnNote }: { profile: Partial<Record<Vowel, CalibratedFormant>>; voiceType?: string; language: Language; voiceName?: string; onOpenLearnNote?: () => void } = $props();
</script>

<VowelSpaceSheet {profile} {voiceType} {language} {voiceName} onLearnNote={onOpenLearnNote} onprint={() => printVowelSheet({ profile, voiceType, language, voiceName })} />
