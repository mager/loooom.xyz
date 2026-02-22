// Static plugin catalog — mirrors .claude-plugin/marketplace.json
// GitHub is the source of truth; this file drives the website UI

export interface Plugin {
	name: string;
	title: string;
	description: string;
	version: string;
	author: string;
	authorDisplay: string;
	category: string;
	keywords: string[];
	homepage: string;
	repoPath: string;
	installCommand: string;
	skills: { name: string; description: string }[];
	emoji: string;
}

export const MARKETPLACE_COMMAND = '/plugin marketplace add mager/loooom';
export const MARKETPLACE_REPO = 'mager/loooom';
export const GITHUB_BASE = 'https://github.com/mager/loooom/tree/main';

export const PLUGINS: Plugin[] = [
	{
		name: 'beginner-japanese',
		title: 'Beginner Japanese',
		description:
			'Learn conversational Japanese for traveling in Japan. Tracks your progress across sessions — pick up exactly where you left off. Supports local file or mem0 cloud memory.',
		version: '2.1.0',
		author: 'mager',
		authorDisplay: 'Mager',
		category: 'languages',
		keywords: ['japanese', 'language', 'travel', 'japan'],
		homepage: 'https://loooom.xyz/p/mager/beginner-japanese',
		repoPath: 'plugins/beginner-japanese',
		installCommand: '/plugin install beginner-japanese@loooom',
		emoji: '🇯🇵',
		skills: [
			{ name: 'Kana Foundations', description: 'Hiragana & katakana from memory' },
			{ name: 'Survival Phrases', description: '20 phrases for 80% of traveler situations' },
			{ name: 'Grammar Blocks', description: 'Particles and real sentence structure' },
			{ name: 'Conversation Practice', description: 'Ramen shops, stations, convenience stores' }
		]
	},
	{
		name: 'kana-ascii',
		title: 'Kana ASCII',
		description:
			'Render hiragana, katakana, and kanji as ASCII art in the terminal. Teaches stroke order and vivid mnemonics. Backed by the kana-ascii npm package.',
		version: '2.0.0',
		author: 'mager',
		authorDisplay: 'Mager',
		category: 'languages',
		keywords: ['japanese', 'kana', 'ascii', 'art', 'hiragana', 'katakana'],
		homepage: 'https://loooom.xyz/p/mager/kana-ascii',
		repoPath: 'plugins/kana-ascii',
		installCommand: '/plugin install kana-ascii@loooom',
		emoji: '🎨',
		skills: [
			{ name: 'ASCII Rendering', description: 'Dot-grid art for any kana character' },
			{ name: 'Stroke Order', description: '[1][2] notation with type descriptions' },
			{ name: 'Mnemonics', description: 'Vivid, weird, sticky memory hooks' }
		]
	},
	{
		name: 'learn-anything',
		title: 'Learn Anything',
		description:
			"Benjamin Franklin's autodidact method for mastering any subject — spaced repetition, imitation writing, and the commonplace book.",
		version: '1.0.0',
		author: 'loooom',
		authorDisplay: 'Loooom',
		category: 'learning',
		keywords: ['learning', 'study', 'mastery', 'autodidact', 'franklin'],
		homepage: 'https://loooom.xyz/p/loooom/learn-anything',
		repoPath: 'plugins/learn-anything',
		installCommand: '/plugin install learn-anything@loooom',
		emoji: '📚',
		skills: [
			{
				name: "Franklin's Method",
				description: 'Imitation writing, commonplace books, deliberate questioning'
			},
			{ name: 'Spaced Repetition', description: 'Low-tech review cycles that actually stick' }
		]
	},
	{
		name: 'socratic-thinking',
		title: 'Socratic Thinking',
		description:
			"Plato's Socratic method for questioning assumptions, building arguments from first principles, and thinking with precision.",
		version: '1.0.0',
		author: 'loooom',
		authorDisplay: 'Loooom',
		category: 'thinking',
		keywords: ['philosophy', 'socratic', 'reasoning', 'critical-thinking', 'plato'],
		homepage: 'https://loooom.xyz/p/loooom/socratic-thinking',
		repoPath: 'plugins/socratic-thinking',
		installCommand: '/plugin install socratic-thinking@loooom',
		emoji: '🏛️',
		skills: [
			{ name: 'Elenchus', description: 'Cross-examination to reveal hidden assumptions' },
			{ name: 'Dialectic', description: 'Building truth through structured dialogue' }
		]
	},
	{
		name: 'persuasive-writing',
		title: 'Persuasive Writing',
		description:
			"Abraham Lincoln's techniques for speechwriting — clarity, structure, emotional resonance, and moral authority.",
		version: '1.0.0',
		author: 'loooom',
		authorDisplay: 'Loooom',
		category: 'writing',
		keywords: ['writing', 'speechwriting', 'persuasion', 'lincoln', 'rhetoric'],
		homepage: 'https://loooom.xyz/p/loooom/persuasive-writing',
		repoPath: 'plugins/persuasive-writing',
		installCommand: '/plugin install persuasive-writing@loooom',
		emoji: '🎤',
		skills: [
			{ name: 'Structure & Parallelism', description: 'The Gettysburg Address method' },
			{ name: 'Moral Authority', description: 'Building credibility through concession' }
		]
	},
	{
		name: 'frontend-design',
		title: 'Frontend Design',
		description:
			'A frontend design agent channeling a specific aesthetic philosophy. Every UI should feel hot, sleek, usable, fun, and addictive.',
		version: '1.0.0',
		author: 'mager',
		authorDisplay: 'Mager',
		category: 'design',
		keywords: ['design', 'frontend', 'ui', 'ux', 'css'],
		homepage: 'https://loooom.xyz/p/mager/frontend-design',
		repoPath: 'plugins/frontend-design',
		installCommand: '/plugin install frontend-design@loooom',
		emoji: '✨',
		skills: [
			{ name: 'Design System', description: 'Cards, buttons, forms, spacing, typography' },
			{ name: 'Layout Principles', description: 'Grid, responsive, visual hierarchy' }
		]
	}
];

export const CATEGORIES = ['languages', 'learning', 'thinking', 'writing', 'design'];

export function getPlugin(author: string, name: string): Plugin | undefined {
	return PLUGINS.find((p) => p.author === author && p.name === name);
}

export function getPluginsByCategory(category: string): Plugin[] {
	return PLUGINS.filter((p) => p.category === category);
}

export function getPluginsByAuthor(author: string): Plugin[] {
	return PLUGINS.filter((p) => p.author === author);
}
