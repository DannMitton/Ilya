// N.199 Step 3: the count-in MOVED to `voice/count-in.ts`, beside the ritual that now drives it (`capture-ritual.svelte.ts`).
// This line keeps `Pacifier.svelte`'s import of './count-in' working without editing the wheel; it goes with `pacifier/` in Step 8b.
export * from '../count-in';
