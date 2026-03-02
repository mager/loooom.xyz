import type { PageServerLoad } from './$types';
import { getPlugin, MARKETPLACE_COMMAND, GITHUB_BASE } from '$lib/plugins';
import { fetchEvalScores, getPluginScore } from '$lib/eval-scores';
import { fetchPromptfooConfig } from '$lib/promptfoo';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const plugin = getPlugin(params.author, params.plugin);
	if (!plugin) throw error(404, 'Plugin not found');

	const [scores, promptfooConfig] = await Promise.all([
		fetchEvalScores(),
		plugin.source === 'loooom' ? fetchPromptfooConfig(params.plugin) : Promise.resolve(null),
	]);
	const evalScore = getPluginScore(scores, params.author, params.plugin);

	return { plugin, marketplaceCommand: MARKETPLACE_COMMAND, githubBase: GITHUB_BASE, evalScore, promptfooConfig };
};
