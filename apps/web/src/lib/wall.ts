// Single source of truth for the Markup and Insights feature gate.
// Two names open it: PUBLIC_INCLUDE_MARKUP_INSIGHTS, the name since N.174
// slice D.1 (2026-09-27), and PUBLIC_INCLUDE_SHANE, the name before it, so an
// environment still setting the old name keeps the same build.
// Vite replaces each import.meta.env value at build time with the string
// value of the env var. When both are unset (or set to anything other than
// 'true'), INCLUDE_MARKUP_INSIGHTS resolves to a literal false, and Rollup
// tree-shakes any branches guarded by it. Keep both sides literal
// comparisons, or that stops being true.
export const INCLUDE_MARKUP_INSIGHTS: boolean =
	import.meta.env.PUBLIC_INCLUDE_MARKUP_INSIGHTS === 'true' ||
	import.meta.env.PUBLIC_INCLUDE_SHANE === 'true';
