<script lang="ts">
	/**
	 * THE CAMERA IN THE FIELD, row 2e, Dann 2026-09-30, on his iPhone: "restore
	 * the photo glyph in the top right corner of the input field and make it a
	 * hotspot invoking the mobile device's camera utility". It amends N.108
	 * increment 4; `IntakePanel.svelte` says why 2026-09-03 does not reach it,
	 * and mounts this on a phone only.
	 *
	 * Its own hidden input, because `capture` is what asks a phone for the
	 * camera rather than the photo library, and the one picker must not carry
	 * it (N.70: no `accept` on a phone, so every kind stays pickable). What the
	 * camera hands back goes to `onpick`, which is the one picker's own
	 * handler, so a photograph takes exactly the road a picked picture takes.
	 *
	 * The drawing is the old OCR icon's viewfinder, recovered from `8fbc8d7c^`.
	 */
	import { t, type Language } from '$lib/i18n';

	interface Props {
		language: Language;
		disabled: boolean;
		onpick: (e: Event) => void;
	}

	let { language, disabled, onpick }: Props = $props();

	let inputEl = $state<HTMLInputElement | undefined>(undefined);

	/* What the camera hands the page is NOT ESTABLISHED (HEIC or JPEG, and at
	   what size; `docs/memory/ENVIRONMENT.md`). This one line names it on the
	   console for Dann's walk, read through Safari's Web Inspector. It is a
	   measurement, and it goes once the answer is recorded. */
	function onchange(e: Event): void {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (file) {
			const said = (what: string) => console.info('[Ilya] camera:', file.type || '(no type)', file.name, file.size, 'bytes', what);
			createImageBitmap(file).then(
				(b) => { said(`${b.width} x ${b.height}`); b.close(); },
				() => said('not decodable here')
			);
		}
		onpick(e);
	}
</script>

<button
	type="button"
	class="camera-btn"
	onclick={() => inputEl?.click()}
	{disabled}
	aria-label={t('intake.camera', language)}
	title={t('intake.camera', language)}
>
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
		<path d="M2 7V2h5"/>
		<path d="M17 2h5v5"/>
		<path d="M22 17v5h-5"/>
		<path d="M7 22H2v-5"/>
		<line x1="5" y1="12" x2="19" y2="12"/>
	</svg>
</button>
<!-- `capture="environment"` asks for the rear camera. -->
<input type="file" accept="image/*" capture="environment" class="camera-input" bind:this={inputEl} {onchange} />

<style>
	/* The old `.ocr-btn`'s corner, 6px in from the frame's (`.intake`, which
	   is `position: relative`), at the 44px floor (CONTRACT.md): the old
	   button was 28px, with its glyph at 18px. The glyph stays 18px and the
	   target grows around it. MEASURED at 390 x 844: the glyph sits 7px inside
	   the field's border on both edges; flush in the frame's corner, its
	   brackets sat on the field's rounded border.

	   RESTYLED, JUDGEMENT. The old button rested at 30 percent opacity on a
	   white chip and came up to full on hover. This one shows on a phone
	   only, and a phone has no hover, so it would rest at 30 percent for good.
	   It draws in `--ink-tertiary` at full strength on no chip: the field's
	   own `--paper-light` fill is the ground. */
	.camera-btn {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 44px;
		height: 44px;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--ink-tertiary);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.camera-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.camera-input {
		display: none;
	}
</style>
