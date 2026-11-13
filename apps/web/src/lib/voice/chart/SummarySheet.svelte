<!--
	THE SHEET ON THE SUMMARY, behind `?calibrate=new` (N.199 Step 2). The wizard is at its line ceiling, so the switch, the sheet, and its
	print control live here and the wizard carries one line for it. With the switch off this draws nothing.
-->
<script lang="ts">
	import type { Language } from '$lib/i18n';
	import type { CalibratedFormant, Vowel } from '../engine/types';
	import { calibrateNewOn } from './calibrate-switch';
	import VowelSpaceSheet from './VowelSpaceSheet.svelte';
	import { printVowelSheet } from './print-sheet';

	let { profile, voiceType, language, voiceName }: { profile: Partial<Record<Vowel, CalibratedFormant>>; voiceType?: string; language: Language; voiceName?: string } = $props();
	const on = calibrateNewOn();
</script>

{#if on}
	<VowelSpaceSheet {profile} {voiceType} {language} {voiceName} onprint={() => printVowelSheet({ profile, voiceType, language, voiceName })} />
{/if}
