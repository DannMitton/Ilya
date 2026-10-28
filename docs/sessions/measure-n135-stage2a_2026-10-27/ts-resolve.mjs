// A Node resolve hook for the cross-check scripts: an import written without an extension (`./underlay-rows`) finds its `.ts` file, as vite does.
export async function resolve(specifier, context, next) {
	try {
		return await next(specifier, context);
	} catch (err) {
		if (err && err.code === 'ERR_MODULE_NOT_FOUND' && specifier.startsWith('.') && !/\.[cm]?[jt]s$/.test(specifier)) return next(specifier + '.ts', context);
		throw err;
	}
}
