import type { PageServerLoad } from './$types';
import { getPlugin, MARKETPLACE_COMMAND, GITHUB_BASE } from '$lib/plugins';
import { fetchEvalScores, getPluginScore } from '$lib/eval-scores';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const plugin = getPlugin(params.author, params.plugin);
	if (!plugin) throw error(404, 'Plugin not found');

	const scores = await fetchEvalScores();
	const evalScore = getPluginScore(scores, params.author, params.plugin);

	return { plugin, marketplaceCommand: MARKETPLACE_COMMAND, githubBase: GITHUB_BASE, evalScore };
};
