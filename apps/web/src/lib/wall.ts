// Single source of truth for the Markup and Insights feature gate,
// PUBLIC_INCLUDE_MARKUP_INSIGHTS. Its name before N.174 (PUBLIC_INCLUDE_SHANE)
// was read as well from slice D.1 until D.3 retired it (2026-09-27).
// Vite replaces import.meta.env.PUBLIC_INCLUDE_MARKUP_INSIGHTS at build time
// with the string value of the env var. When unset (or set to anything other
// than 'true'), INCLUDE_MARKUP_INSIGHTS resolves to a literal false, and
// Rollup tree-shakes any branches guarded by it. Keep it a literal
// comparison, or that stops being true.
export const INCLUDE_MARKUP_INSIGHTS: boolean =
	import.meta.env.PUBLIC_INCLUDE_MARKUP_INSIGHTS === 'true';
