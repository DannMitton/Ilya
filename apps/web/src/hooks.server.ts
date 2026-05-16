import type { Handle } from '@sveltejs/kit';
import { INCLUDE_SHANE } from '$lib/wall';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api/shane/') && !INCLUDE_SHANE) {
		return new Response('Not Found', { status: 404 });
	}
	return resolve(event);
};
