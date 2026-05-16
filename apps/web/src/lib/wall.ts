// Single source of truth for the Shane feature gate.
// Vite replaces import.meta.env.PUBLIC_INCLUDE_SHANE at build time with
// the string value of the env var. When unset (or set to anything other
// than 'true'), INCLUDE_SHANE resolves to a literal false, and Rollup
// tree-shakes any branches guarded by it.
export const INCLUDE_SHANE: boolean =
	import.meta.env.PUBLIC_INCLUDE_SHANE === 'true';
