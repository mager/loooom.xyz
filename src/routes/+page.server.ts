import type { PageServerLoad } from './$types';
import { PLUGINS, CATEGORIES } from '$lib/plugins';

export const load: PageServerLoad = async () => {
	return {
		plugins: PLUGINS,
		categories: CATEGORIES,
		featuredPlugins: PLUGINS.slice(0, 3)
	};
};
