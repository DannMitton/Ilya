// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	/** Build-time constants from `vite.config.ts`: the recorder's flag and the commit the bundle was built from. */
	const __ILYA_RECORDER__: boolean;
	const __ILYA_BUILD__: string;
}

export {};
