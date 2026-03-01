// Static plugin catalog — mirrors .claude-plugin/marketplace.json
// GitHub is the source of truth; this file drives the website UI
// External skills from skills.sh are aggregated here with auto-synced install counts

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
	// Multi-source fields
	source: 'loooom' | 'skills.sh' | 'github';
	skillsShPath?: string;       // e.g. 'obra/superpowers/brainstorming'
	installs?: number;           // live install count from skills.sh sync
	installCommandSkillsSh?: string; // npx skillsadd command
	githubRepo?: string;         // e.g. 'blader/theorist'
}

export const MARKETPLACE_COMMAND = '/plugin marketplace add mager/loooom';
export const MARKETPLACE_REPO = 'mager/loooom';
export const GITHUB_BASE = 'https://github.com/mager/loooom/tree/main';

export const PLUGINS: Plugin[] = [
	// ─────────────────────────────────────────────
	// LOOOOM NATIVE
	// ─────────────────────────────────────────────
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
		source: 'loooom',
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
		source: 'loooom',
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
		author: 'mager',
		authorDisplay: 'Mager',
		category: 'learning',
		keywords: ['learning', 'study', 'mastery', 'autodidact', 'franklin'],
		homepage: 'https://loooom.xyz/p/mager/learn-anything',
		repoPath: 'plugins/learn-anything',
		installCommand: '/plugin install learn-anything@loooom',
		source: 'loooom',
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
		author: 'mager',
		authorDisplay: 'Mager',
		category: 'thinking',
		keywords: ['philosophy', 'socratic', 'reasoning', 'critical-thinking', 'plato'],
		homepage: 'https://loooom.xyz/p/mager/socratic-thinking',
		repoPath: 'plugins/socratic-thinking',
		installCommand: '/plugin install socratic-thinking@loooom',
		source: 'loooom',
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
		author: 'mager',
		authorDisplay: 'Mager',
		category: 'writing',
		keywords: ['writing', 'speechwriting', 'persuasion', 'lincoln', 'rhetoric'],
		homepage: 'https://loooom.xyz/p/mager/persuasive-writing',
		repoPath: 'plugins/persuasive-writing',
		installCommand: '/plugin install persuasive-writing@loooom',
		source: 'loooom',
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
		source: 'loooom',
		emoji: '✨',
		skills: [
			{ name: 'Design System', description: 'Cards, buttons, forms, spacing, typography' },
			{ name: 'Layout Principles', description: 'Grid, responsive, visual hierarchy' }
		]
	},

	// ─────────────────────────────────────────────
	// GITHUB NATIVE — featured community skills
	// ─────────────────────────────────────────────
	{
		name: 'theorist',
		title: 'Theorist',
		description:
			'Maintain a continuously updated operating theory for ongoing engineering work. Keeps a per-repo THEORY.MD with problem thesis, system model, strategy, key discoveries, and open questions — so future decisions stay coherent with your latest mental model.',
		version: '1.0.0',
		author: 'blader',
		authorDisplay: 'blader',
		category: 'productivity',
		keywords: ['theory', 'engineering', 'documentation', 'strategy', 'memory', 'codex'],
		homepage: 'https://github.com/blader/theorist',
		repoPath: 'https://github.com/blader/theorist',
		installCommand: 'git clone https://github.com/blader/theorist.git "${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}/theorist"',
		source: 'github',
		githubRepo: 'blader/theorist',
		emoji: '🧠',
		skills: [
			{ name: 'Operating Theory', description: 'Per-repo THEORY.MD: thesis, model, strategy, pivots' },
			{ name: 'Strategic Memory', description: 'Keeps future decisions coherent with current mental model' },
			{ name: 'Always-On', description: 'Sticky activation — once active, stays active all session' }
		]
	},

	// ─────────────────────────────────────────────
	// SKILLS.SH — obra/superpowers  [category: productivity]
	// ─────────────────────────────────────────────
	{
		name: 'brainstorming',
		title: 'Brainstorming',
		description: 'Structured divergent and convergent thinking for generating, evaluating, and refining ideas. The SCAMPER method, brainwriting, and rapid ideation frameworks.',
		version: '1.0.0',
		author: 'obra',
		authorDisplay: 'obra',
		category: 'productivity',
		keywords: ['brainstorming', 'ideation', 'creativity', 'thinking'],
		homepage: 'https://skills.sh/obra/superpowers/brainstorming',
		repoPath: 'https://github.com/obra/superpowers',
		installCommand: 'npx skillsadd obra/superpowers/brainstorming',
		installCommandSkillsSh: 'npx skillsadd obra/superpowers/brainstorming',
		skillsShPath: 'obra/superpowers/brainstorming',
		installs: 33100,
		source: 'skills.sh',
		emoji: '🧠',
		skills: [
			{ name: 'Divergent Thinking', description: 'Generate many ideas fast without judgment' },
			{ name: 'Convergent Thinking', description: 'Narrow and prioritize to best options' },
			{ name: 'SCAMPER Method', description: 'Structured creative mutation of existing ideas' }
		]
	},
	{
		name: 'systematic-debugging',
		title: 'Systematic Debugging',
		description: 'Root cause analysis and methodical hypothesis testing for finding and eliminating bugs. Stop guessing, start eliminating.',
		version: '1.0.0',
		author: 'obra',
		authorDisplay: 'obra',
		category: 'productivity',
		keywords: ['debugging', 'problem-solving', 'root-cause', 'engineering'],
		homepage: 'https://skills.sh/obra/superpowers/systematic-debugging',
		repoPath: 'https://github.com/obra/superpowers',
		installCommand: 'npx skillsadd obra/superpowers/systematic-debugging',
		installCommandSkillsSh: 'npx skillsadd obra/superpowers/systematic-debugging',
		skillsShPath: 'obra/superpowers/systematic-debugging',
		installs: 18000,
		source: 'skills.sh',
		emoji: '🔍',
		skills: [
			{ name: 'Root Cause Analysis', description: 'Find the real problem, not the symptom' },
			{ name: 'Hypothesis Testing', description: 'Methodical elimination of candidates' }
		]
	},
	{
		name: 'writing-plans',
		title: 'Writing Plans',
		description: 'Hierarchical outlining and audience-mapping for structured, purposeful writing. Plan before you prose.',
		version: '1.0.0',
		author: 'obra',
		authorDisplay: 'obra',
		category: 'productivity',
		keywords: ['writing', 'planning', 'outlining', 'structure'],
		homepage: 'https://skills.sh/obra/superpowers/writing-plans',
		repoPath: 'https://github.com/obra/superpowers',
		installCommand: 'npx skillsadd obra/superpowers/writing-plans',
		installCommandSkillsSh: 'npx skillsadd obra/superpowers/writing-plans',
		skillsShPath: 'obra/superpowers/writing-plans',
		installs: 16300,
		source: 'skills.sh',
		emoji: '📝',
		skills: [
			{ name: 'Outline Structure', description: 'Hierarchical planning before writing' },
			{ name: 'Audience Mapping', description: 'Write for the reader, not the writer' }
		]
	},
	{
		name: 'test-driven-development',
		title: 'Test-Driven Development',
		description: 'The red-green-refactor loop and the art of knowing what to test. Write tests first, code second, ship with confidence.',
		version: '1.0.0',
		author: 'obra',
		authorDisplay: 'obra',
		category: 'productivity',
		keywords: ['tdd', 'testing', 'engineering', 'quality'],
		homepage: 'https://skills.sh/obra/superpowers/test-driven-development',
		repoPath: 'https://github.com/obra/superpowers',
		installCommand: 'npx skillsadd obra/superpowers/test-driven-development',
		installCommandSkillsSh: 'npx skillsadd obra/superpowers/test-driven-development',
		skillsShPath: 'obra/superpowers/test-driven-development',
		installs: 14800,
		source: 'skills.sh',
		emoji: '🧪',
		skills: [
			{ name: 'Red-Green-Refactor', description: 'The TDD loop, properly executed' },
			{ name: 'Test Boundaries', description: 'What to test, and what not to test' }
		]
	},
	{
		name: 'executing-plans',
		title: 'Executing Plans',
		description: 'Task decomposition and progress tracking for actually finishing what you start. Break big into small, then ship.',
		version: '1.0.0',
		author: 'obra',
		authorDisplay: 'obra',
		category: 'productivity',
		keywords: ['planning', 'execution', 'productivity', 'tasks'],
		homepage: 'https://skills.sh/obra/superpowers/executing-plans',
		repoPath: 'https://github.com/obra/superpowers',
		installCommand: 'npx skillsadd obra/superpowers/executing-plans',
		installCommandSkillsSh: 'npx skillsadd obra/superpowers/executing-plans',
		skillsShPath: 'obra/superpowers/executing-plans',
		installs: 13800,
		source: 'skills.sh',
		emoji: '⚡',
		skills: [
			{ name: 'Task Decomposition', description: 'Break big work into completable chunks' },
			{ name: 'Progress Tracking', description: 'Know when you\'re done (and when you\'re not)' }
		]
	},
	{
		name: 'requesting-code-review',
		title: 'Requesting Code Review',
		description: 'How to write PRs that save reviewer time and get better feedback. Frame context, self-review first, make it easy to approve.',
		version: '1.0.0',
		author: 'obra',
		authorDisplay: 'obra',
		category: 'productivity',
		keywords: ['code-review', 'pull-request', 'engineering', 'collaboration'],
		homepage: 'https://skills.sh/obra/superpowers/requesting-code-review',
		repoPath: 'https://github.com/obra/superpowers',
		installCommand: 'npx skillsadd obra/superpowers/requesting-code-review',
		installCommandSkillsSh: 'npx skillsadd obra/superpowers/requesting-code-review',
		skillsShPath: 'obra/superpowers/requesting-code-review',
		installs: 13100,
		source: 'skills.sh',
		emoji: '👀',
		skills: [
			{ name: 'PR Framing', description: 'Context that saves reviewer time' },
			{ name: 'Self Review', description: 'Catch the obvious issues before others do' }
		]
	},
	{
		name: 'using-superpowers',
		title: 'Using Superpowers',
		description: 'Meta-skill for orchestrating and combining other agent skills effectively. Prompt the prompter, compose the composer.',
		version: '1.0.0',
		author: 'obra',
		authorDisplay: 'obra',
		category: 'productivity',
		keywords: ['meta', 'orchestration', 'agent', 'skills'],
		homepage: 'https://skills.sh/obra/superpowers/using-superpowers',
		repoPath: 'https://github.com/obra/superpowers',
		installCommand: 'npx skillsadd obra/superpowers/using-superpowers',
		installCommandSkillsSh: 'npx skillsadd obra/superpowers/using-superpowers',
		skillsShPath: 'obra/superpowers/using-superpowers',
		installs: 12400,
		source: 'skills.sh',
		emoji: '💪',
		skills: [
			{ name: 'Skill Orchestration', description: 'Combining skills for compound results' },
			{ name: 'Meta-Prompting', description: 'Prompt the prompter for better outputs' }
		]
	},
	{
		name: 'subagent-driven-development',
		title: 'Subagent-Driven Development',
		description: 'Split complex work across multiple agents, coordinate parallel execution, and aggregate results. The future of AI-assisted engineering.',
		version: '1.0.0',
		author: 'obra',
		authorDisplay: 'obra',
		category: 'productivity',
		keywords: ['subagents', 'parallel', 'orchestration', 'agents'],
		homepage: 'https://skills.sh/obra/superpowers/subagent-driven-development',
		repoPath: 'https://github.com/obra/superpowers',
		installCommand: 'npx skillsadd obra/superpowers/subagent-driven-development',
		installCommandSkillsSh: 'npx skillsadd obra/superpowers/subagent-driven-development',
		skillsShPath: 'obra/superpowers/subagent-driven-development',
		installs: 11100,
		source: 'skills.sh',
		emoji: '🤖',
		skills: [
			{ name: 'Agent Decomposition', description: 'Split work across specialized agents' },
			{ name: 'Result Aggregation', description: 'Combine parallel agent outputs cleanly' }
		]
	},
	{
		name: 'receiving-code-review',
		title: 'Receiving Code Review',
		description: 'Parse feedback, decide what to implement vs discuss, and maintain productive reviewer dynamics. The other side of the PR.',
		version: '1.0.0',
		author: 'obra',
		authorDisplay: 'obra',
		category: 'productivity',
		keywords: ['code-review', 'feedback', 'collaboration', 'engineering'],
		homepage: 'https://skills.sh/obra/superpowers/receiving-code-review',
		repoPath: 'https://github.com/obra/superpowers',
		installCommand: 'npx skillsadd obra/superpowers/receiving-code-review',
		installCommandSkillsSh: 'npx skillsadd obra/superpowers/receiving-code-review',
		skillsShPath: 'obra/superpowers/receiving-code-review',
		installs: 10600,
		source: 'skills.sh',
		emoji: '📥',
		skills: [
			{ name: 'Feedback Parsing', description: 'What to implement vs what to discuss' },
			{ name: 'Response Etiquette', description: 'Productive reviewer dynamics' }
		]
	},
	{
		name: 'verification-before-completion',
		title: 'Verification Before Completion',
		description: 'Checklist discipline and acceptance criteria to ensure you never ship something broken. Define done before you start.',
		version: '1.0.0',
		author: 'obra',
		authorDisplay: 'obra',
		category: 'productivity',
		keywords: ['verification', 'quality', 'checklist', 'done'],
		homepage: 'https://skills.sh/obra/superpowers/verification-before-completion',
		repoPath: 'https://github.com/obra/superpowers',
		installCommand: 'npx skillsadd obra/superpowers/verification-before-completion',
		installCommandSkillsSh: 'npx skillsadd obra/superpowers/verification-before-completion',
		skillsShPath: 'obra/superpowers/verification-before-completion',
		installs: 10500,
		source: 'skills.sh',
		emoji: '✅',
		skills: [
			{ name: 'Checklist Discipline', description: 'Never ship without a final check' },
			{ name: 'Acceptance Criteria', description: 'Define done before you write a line' }
		]
	},
	{
		name: 'using-git-worktrees',
		title: 'Using Git Worktrees',
		description: 'Run multiple branches simultaneously in separate directories. No more stashing, no more branch anxiety.',
		version: '1.0.0',
		author: 'obra',
		authorDisplay: 'obra',
		category: 'productivity',
		keywords: ['git', 'worktrees', 'branches', 'engineering'],
		homepage: 'https://skills.sh/obra/superpowers/using-git-worktrees',
		repoPath: 'https://github.com/obra/superpowers',
		installCommand: 'npx skillsadd obra/superpowers/using-git-worktrees',
		installCommandSkillsSh: 'npx skillsadd obra/superpowers/using-git-worktrees',
		skillsShPath: 'obra/superpowers/using-git-worktrees',
		installs: 10200,
		source: 'skills.sh',
		emoji: '🌳',
		skills: [
			{ name: 'Parallel Branches', description: 'Multiple branches checked out simultaneously' },
			{ name: 'Worktree Lifecycle', description: 'Create, use, and clean up worktrees' }
		]
	},
	{
		name: 'writing-skills',
		title: 'Writing Skills',
		description: 'Clarity, flow, and economy of language. Write like your reader\'s time is precious — because it is.',
		version: '1.0.0',
		author: 'obra',
		authorDisplay: 'obra',
		category: 'writing',
		keywords: ['writing', 'clarity', 'flow', 'communication'],
		homepage: 'https://skills.sh/obra/superpowers/writing-skills',
		repoPath: 'https://github.com/obra/superpowers',
		installCommand: 'npx skillsadd obra/superpowers/writing-skills',
		installCommandSkillsSh: 'npx skillsadd obra/superpowers/writing-skills',
		skillsShPath: 'obra/superpowers/writing-skills',
		installs: 10200,
		source: 'skills.sh',
		emoji: '✍️',
		skills: [
			{ name: 'Clarity', description: 'Say more with less, every time' },
			{ name: 'Flow', description: 'Ideas that connect naturally and propel the reader' }
		]
	},
	{
		name: 'dispatching-parallel-agents',
		title: 'Dispatching Parallel Agents',
		description: 'Partition work for parallel agent execution and synchronize results. Multiply your throughput without multiplying complexity.',
		version: '1.0.0',
		author: 'obra',
		authorDisplay: 'obra',
		category: 'productivity',
		keywords: ['agents', 'parallel', 'orchestration', 'throughput'],
		homepage: 'https://skills.sh/obra/superpowers/dispatching-parallel-agents',
		repoPath: 'https://github.com/obra/superpowers',
		installCommand: 'npx skillsadd obra/superpowers/dispatching-parallel-agents',
		installCommandSkillsSh: 'npx skillsadd obra/superpowers/dispatching-parallel-agents',
		skillsShPath: 'obra/superpowers/dispatching-parallel-agents',
		installs: 9600,
		source: 'skills.sh',
		emoji: '🔀',
		skills: [
			{ name: 'Work Partitioning', description: 'Split tasks cleanly for parallel execution' },
			{ name: 'Synchronization', description: 'Coordinate and merge agent results' }
		]
	},
	{
		name: 'finishing-a-development-branch',
		title: 'Finishing a Dev Branch',
		description: 'Branch cleanup, commit hygiene, and PR readiness. Ship with confidence by doing the boring-but-critical work before merge.',
		version: '1.0.0',
		author: 'obra',
		authorDisplay: 'obra',
		category: 'productivity',
		keywords: ['git', 'branch', 'pr', 'engineering', 'shipping'],
		homepage: 'https://skills.sh/obra/superpowers/finishing-a-development-branch',
		repoPath: 'https://github.com/obra/superpowers',
		installCommand: 'npx skillsadd obra/superpowers/finishing-a-development-branch',
		installCommandSkillsSh: 'npx skillsadd obra/superpowers/finishing-a-development-branch',
		skillsShPath: 'obra/superpowers/finishing-a-development-branch',
		installs: 8900,
		source: 'skills.sh',
		emoji: '🏁',
		skills: [
			{ name: 'Branch Cleanup', description: 'Tidy commits and history before merge' },
			{ name: 'PR Readiness', description: 'Everything checked before you hit ship' }
		]
	},

	// ─────────────────────────────────────────────
	// SKILLS.SH — obra/episodic-memory  [category: memory]
	// ─────────────────────────────────────────────
	{
		name: 'remembering-conversations',
		title: 'Remembering Conversations',
		description: 'Episodic recall and context continuity across sessions. Agents that actually remember what was said — no more repeating yourself.',
		version: '1.0.0',
		author: 'obra',
		authorDisplay: 'obra',
		category: 'memory',
		keywords: ['memory', 'episodic', 'continuity', 'context', 'sessions'],
		homepage: 'https://skills.sh/obra/episodic-memory/remembering-conversations',
		repoPath: 'https://github.com/obra/episodic-memory',
		installCommand: 'npx skillsadd obra/episodic-memory/remembering-conversations',
		installCommandSkillsSh: 'npx skillsadd obra/episodic-memory/remembering-conversations',
		skillsShPath: 'obra/episodic-memory/remembering-conversations',
		installs: 5500,
		source: 'skills.sh',
		emoji: '🧠',
		skills: [
			{ name: 'Episodic Recall', description: 'Remember what was said in prior sessions' },
			{ name: 'Context Continuity', description: 'Sessions that feel connected and aware' }
		]
	},

	// ─────────────────────────────────────────────
	// SKILLS.SH — coreyhaines31/marketingskills  [category: marketing]
	// ─────────────────────────────────────────────
	{
		name: 'seo-audit',
		title: 'SEO Audit',
		description: 'Technical SEO fundamentals and content gap analysis. Find what\'s broken, find what\'s missing, climb the rankings.',
		version: '1.0.0',
		author: 'coreyhaines31',
		authorDisplay: 'Corey Haines',
		category: 'marketing',
		keywords: ['seo', 'audit', 'marketing', 'search', 'content'],
		homepage: 'https://skills.sh/coreyhaines31/marketingskills/seo-audit',
		repoPath: 'https://github.com/coreyhaines31/marketingskills',
		installCommand: 'npx skillsadd coreyhaines31/marketingskills/seo-audit',
		installCommandSkillsSh: 'npx skillsadd coreyhaines31/marketingskills/seo-audit',
		skillsShPath: 'coreyhaines31/marketingskills/seo-audit',
		installs: 28100,
		source: 'skills.sh',
		emoji: '🔍',
		skills: [
			{ name: 'Technical SEO', description: 'Site health fundamentals that search engines reward' },
			{ name: 'Content Gaps', description: 'Find the keywords you should be ranking for' }
		]
	},
	{
		name: 'copywriting',
		title: 'Copywriting',
		description: 'Hook writing and persuasive body copy that converts. The craft of words that make people act.',
		version: '1.0.0',
		author: 'coreyhaines31',
		authorDisplay: 'Corey Haines',
		category: 'marketing',
		keywords: ['copywriting', 'writing', 'conversion', 'marketing'],
		homepage: 'https://skills.sh/coreyhaines31/marketingskills/copywriting',
		repoPath: 'https://github.com/coreyhaines31/marketingskills',
		installCommand: 'npx skillsadd coreyhaines31/marketingskills/copywriting',
		installCommandSkillsSh: 'npx skillsadd coreyhaines31/marketingskills/copywriting',
		skillsShPath: 'coreyhaines31/marketingskills/copywriting',
		installs: 21600,
		source: 'skills.sh',
		emoji: '✍️',
		skills: [
			{ name: 'Hook Writing', description: 'Headlines and openers that demand attention' },
			{ name: 'Body Copy', description: 'Persuasive structure that carries through to CTA' }
		]
	},
	{
		name: 'content-strategy',
		title: 'Content Strategy',
		description: 'Editorial calendars, channel fit, and systematic content planning. Stop publishing randomly and start publishing strategically.',
		version: '1.0.0',
		author: 'coreyhaines31',
		authorDisplay: 'Corey Haines',
		category: 'marketing',
		keywords: ['content', 'strategy', 'editorial', 'marketing'],
		homepage: 'https://skills.sh/coreyhaines31/marketingskills/content-strategy',
		repoPath: 'https://github.com/coreyhaines31/marketingskills',
		installCommand: 'npx skillsadd coreyhaines31/marketingskills/content-strategy',
		installCommandSkillsSh: 'npx skillsadd coreyhaines31/marketingskills/content-strategy',
		skillsShPath: 'coreyhaines31/marketingskills/content-strategy',
		installs: 13800,
		source: 'skills.sh',
		emoji: '📅',
		skills: [
			{ name: 'Editorial Calendar', description: 'Plan content systematically, not reactively' },
			{ name: 'Channel Fit', description: 'Right format for the right platform' }
		]
	},
	{
		name: 'marketing-psychology',
		title: 'Marketing Psychology',
		description: 'Cialdini\'s influence principles, loss aversion framing, and the psychology of decision-making applied to marketing.',
		version: '1.0.0',
		author: 'coreyhaines31',
		authorDisplay: 'Corey Haines',
		category: 'marketing',
		keywords: ['psychology', 'influence', 'cialdini', 'marketing', 'persuasion'],
		homepage: 'https://skills.sh/coreyhaines31/marketingskills/marketing-psychology',
		repoPath: 'https://github.com/coreyhaines31/marketingskills',
		installCommand: 'npx skillsadd coreyhaines31/marketingskills/marketing-psychology',
		installCommandSkillsSh: 'npx skillsadd coreyhaines31/marketingskills/marketing-psychology',
		skillsShPath: 'coreyhaines31/marketingskills/marketing-psychology',
		installs: 15900,
		source: 'skills.sh',
		emoji: '🧠',
		skills: [
			{ name: 'Cialdini Principles', description: 'The 7 influence levers that actually work' },
			{ name: 'Loss Aversion', description: 'Framing decisions to drive action' }
		]
	},
	{
		name: 'social-content',
		title: 'Social Content',
		description: 'Platform-native voice and engagement loops for Twitter, LinkedIn, Instagram and beyond. Content that gets shared.',
		version: '1.0.0',
		author: 'coreyhaines31',
		authorDisplay: 'Corey Haines',
		category: 'marketing',
		keywords: ['social', 'twitter', 'linkedin', 'content', 'engagement'],
		homepage: 'https://skills.sh/coreyhaines31/marketingskills/social-content',
		repoPath: 'https://github.com/coreyhaines31/marketingskills',
		installCommand: 'npx skillsadd coreyhaines31/marketingskills/social-content',
		installCommandSkillsSh: 'npx skillsadd coreyhaines31/marketingskills/social-content',
		skillsShPath: 'coreyhaines31/marketingskills/social-content',
		installs: 12000,
		source: 'skills.sh',
		emoji: '📱',
		skills: [
			{ name: 'Platform Voice', description: 'Twitter vs LinkedIn vs Instagram — each is different' },
			{ name: 'Engagement Loops', description: 'Content structures that earn shares and replies' }
		]
	},
	{
		name: 'launch-strategy',
		title: 'Launch Strategy',
		description: 'Pre-launch anticipation building and day-of playbook for coordinated product launches that actually land.',
		version: '1.0.0',
		author: 'coreyhaines31',
		authorDisplay: 'Corey Haines',
		category: 'marketing',
		keywords: ['launch', 'strategy', 'product', 'marketing', 'go-to-market'],
		homepage: 'https://skills.sh/coreyhaines31/marketingskills/launch-strategy',
		repoPath: 'https://github.com/coreyhaines31/marketingskills',
		installCommand: 'npx skillsadd coreyhaines31/marketingskills/launch-strategy',
		installCommandSkillsSh: 'npx skillsadd coreyhaines31/marketingskills/launch-strategy',
		skillsShPath: 'coreyhaines31/marketingskills/launch-strategy',
		installs: 10500,
		source: 'skills.sh',
		emoji: '🚀',
		skills: [
			{ name: 'Pre-Launch', description: 'Build anticipation before you ship anything' },
			{ name: 'Day-of Playbook', description: 'Coordinate every channel for maximum impact' }
		]
	},
	{
		name: 'programmatic-seo',
		title: 'Programmatic SEO',
		description: 'Template pages and data-driven content at scale. Turn structured data into rankings without writing every page by hand.',
		version: '1.0.0',
		author: 'coreyhaines31',
		authorDisplay: 'Corey Haines',
		category: 'marketing',
		keywords: ['seo', 'programmatic', 'scale', 'content', 'templates'],
		homepage: 'https://skills.sh/coreyhaines31/marketingskills/programmatic-seo',
		repoPath: 'https://github.com/coreyhaines31/marketingskills',
		installCommand: 'npx skillsadd coreyhaines31/marketingskills/programmatic-seo',
		installCommandSkillsSh: 'npx skillsadd coreyhaines31/marketingskills/programmatic-seo',
		skillsShPath: 'coreyhaines31/marketingskills/programmatic-seo',
		installs: 13900,
		source: 'skills.sh',
		emoji: '⚙️',
		skills: [
			{ name: 'Template Pages', description: 'Scale content creation from data sources' },
			{ name: 'Data Sources', description: 'Turn structured data into rankable pages' }
		]
	},
	{
		name: 'analytics-tracking',
		title: 'Analytics & Tracking',
		description: 'Event schema design, attribution modeling, and knowing what drives conversions. Measure what matters.',
		version: '1.0.0',
		author: 'coreyhaines31',
		authorDisplay: 'Corey Haines',
		category: 'marketing',
		keywords: ['analytics', 'tracking', 'attribution', 'conversion', 'data'],
		homepage: 'https://skills.sh/coreyhaines31/marketingskills/analytics-tracking',
		repoPath: 'https://github.com/coreyhaines31/marketingskills',
		installCommand: 'npx skillsadd coreyhaines31/marketingskills/analytics-tracking',
		installCommandSkillsSh: 'npx skillsadd coreyhaines31/marketingskills/analytics-tracking',
		skillsShPath: 'coreyhaines31/marketingskills/analytics-tracking',
		installs: 10500,
		source: 'skills.sh',
		emoji: '📊',
		skills: [
			{ name: 'Event Schema', description: 'What to track, why, and how to name it' },
			{ name: 'Attribution', description: 'Know what channels actually drive conversions' }
		]
	},

	// ─────────────────────────────────────────────
	// SKILLS.SH — inference-sh-9/skills  [category: automation]
	// ─────────────────────────────────────────────
	{
		name: 'ai-image-generation',
		title: 'AI Image Generation',
		description: 'Prompt engineering for stunning AI images and consistent style control across generations. Make your agent a creative director.',
		version: '1.0.0',
		author: 'inference-sh-9',
		authorDisplay: 'inference.sh',
		category: 'automation',
		keywords: ['image', 'ai', 'generation', 'creative', 'prompt'],
		homepage: 'https://skills.sh/inference-sh-9/skills/ai-image-generation',
		repoPath: 'https://github.com/inference-sh-9/skills',
		installCommand: 'npx skillsadd inference-sh-9/skills/ai-image-generation',
		installCommandSkillsSh: 'npx skillsadd inference-sh-9/skills/ai-image-generation',
		skillsShPath: 'inference-sh-9/skills/ai-image-generation',
		installs: 29600,
		source: 'skills.sh',
		emoji: '🎨',
		skills: [
			{ name: 'Prompt Engineering', description: 'Prompts that produce consistently stunning images' },
			{ name: 'Style Control', description: 'Consistent aesthetic across all generations' }
		]
	},
	{
		name: 'ai-video-generation',
		title: 'AI Video Generation',
		description: 'Cinematic scene prompting and character consistency for AI video generation. Direct like a filmmaker.',
		version: '1.0.0',
		author: 'inference-sh-9',
		authorDisplay: 'inference.sh',
		category: 'automation',
		keywords: ['video', 'ai', 'generation', 'creative', 'cinematic'],
		homepage: 'https://skills.sh/inference-sh-9/skills/ai-video-generation',
		repoPath: 'https://github.com/inference-sh-9/skills',
		installCommand: 'npx skillsadd inference-sh-9/skills/ai-video-generation',
		installCommandSkillsSh: 'npx skillsadd inference-sh-9/skills/ai-video-generation',
		skillsShPath: 'inference-sh-9/skills/ai-video-generation',
		installs: 29300,
		source: 'skills.sh',
		emoji: '🎬',
		skills: [
			{ name: 'Scene Prompting', description: 'Describe motion and camera work cinematically' },
			{ name: 'Character Consistency', description: 'Subjects that hold across scenes' }
		]
	},
	{
		name: 'twitter-automation',
		title: 'Twitter / X Automation',
		description: 'Viral thread structure and smart scheduling for maximum reach on X. Your agent as a social media manager.',
		version: '1.0.0',
		author: 'inference-sh-9',
		authorDisplay: 'inference.sh',
		category: 'automation',
		keywords: ['twitter', 'x', 'social', 'automation', 'threads'],
		homepage: 'https://skills.sh/inference-sh-9/skills/twitter-automation',
		repoPath: 'https://github.com/inference-sh-9/skills',
		installCommand: 'npx skillsadd inference-sh-9/skills/twitter-automation',
		installCommandSkillsSh: 'npx skillsadd inference-sh-9/skills/twitter-automation',
		skillsShPath: 'inference-sh-9/skills/twitter-automation',
		installs: 29200,
		source: 'skills.sh',
		emoji: '🐦',
		skills: [
			{ name: 'Thread Drafting', description: 'Viral thread structure that drives engagement' },
			{ name: 'Scheduling', description: 'Post at the right time for your audience' }
		]
	},
	{
		name: 'agent-browser',
		title: 'Agent Browser',
		description: 'Full browser automation and structured data extraction. Navigate, click, fill forms, and pull data from any website.',
		version: '1.0.0',
		author: 'inference-sh-9',
		authorDisplay: 'inference.sh',
		category: 'automation',
		keywords: ['browser', 'automation', 'scraping', 'web', 'agent'],
		homepage: 'https://skills.sh/inference-sh-9/skills/agent-browser',
		repoPath: 'https://github.com/inference-sh-9/skills',
		installCommand: 'npx skillsadd inference-sh-9/skills/agent-browser',
		installCommandSkillsSh: 'npx skillsadd inference-sh-9/skills/agent-browser',
		skillsShPath: 'inference-sh-9/skills/agent-browser',
		installs: 29400,
		source: 'skills.sh',
		emoji: '🌐',
		skills: [
			{ name: 'Web Navigation', description: 'Browse and interact with any site autonomously' },
			{ name: 'Data Extraction', description: 'Pull structured data from any web page' }
		]
	},
	{
		name: 'web-search',
		title: 'Web Search',
		description: 'Query crafting and result synthesis for effective agent-powered research. Find exactly what you need and turn it into insight.',
		version: '1.0.0',
		author: 'inference-sh-9',
		authorDisplay: 'inference.sh',
		category: 'automation',
		keywords: ['search', 'research', 'web', 'agent'],
		homepage: 'https://skills.sh/inference-sh-9/skills/web-search',
		repoPath: 'https://github.com/inference-sh-9/skills',
		installCommand: 'npx skillsadd inference-sh-9/skills/web-search',
		installCommandSkillsSh: 'npx skillsadd inference-sh-9/skills/web-search',
		skillsShPath: 'inference-sh-9/skills/web-search',
		installs: 4400,
		source: 'skills.sh',
		emoji: '🔎',
		skills: [
			{ name: 'Query Crafting', description: 'Find exactly what you need with precise queries' },
			{ name: 'Result Synthesis', description: 'Turn search results into structured insights' }
		]
	},

	// ─────────────────────────────────────────────
	// SKILLS.SH — browser-use  [category: automation]
	// ─────────────────────────────────────────────
	{
		name: 'browser-use',
		title: 'Browser Use',
		description: 'Full browser control from your AI agent. Navigate, fill forms, click buttons, and extract data — from any website, automatically.',
		version: '1.0.0',
		author: 'browser-use',
		authorDisplay: 'browser-use',
		category: 'automation',
		keywords: ['browser', 'automation', 'web', 'agent', 'playwright'],
		homepage: 'https://skills.sh/browser-use/browser-use/browser-use',
		repoPath: 'https://github.com/browser-use/browser-use',
		installCommand: 'npx skillsadd browser-use/browser-use/browser-use',
		installCommandSkillsSh: 'npx skillsadd browser-use/browser-use/browser-use',
		skillsShPath: 'browser-use/browser-use/browser-use',
		installs: 41100,
		source: 'skills.sh',
		emoji: '🌐',
		skills: [
			{ name: 'Browser Control', description: 'Full browser automation from any AI agent' },
			{ name: 'Form Filling', description: 'Interact with any web form automatically' }
		]
	},

	// ─────────────────────────────────────────────
	// SKILLS.SH — firecrawl  [category: automation]
	// ─────────────────────────────────────────────
	{
		name: 'firecrawl',
		title: 'Firecrawl',
		description: 'Extract clean, structured content from any URL. Turn messy web pages into clean markdown or JSON your agent can actually use.',
		version: '1.0.0',
		author: 'firecrawl',
		authorDisplay: 'Firecrawl',
		category: 'automation',
		keywords: ['firecrawl', 'scraping', 'web', 'extraction', 'markdown'],
		homepage: 'https://skills.sh/firecrawl/cli/firecrawl',
		repoPath: 'https://github.com/firecrawl/cli',
		installCommand: 'npx skillsadd firecrawl/cli/firecrawl',
		installCommandSkillsSh: 'npx skillsadd firecrawl/cli/firecrawl',
		skillsShPath: 'firecrawl/cli/firecrawl',
		installs: 6500,
		source: 'skills.sh',
		emoji: '🔥',
		skills: [
			{ name: 'Web Scraping', description: 'Extract clean content from any URL' },
			{ name: 'Structured Data', description: 'Turn messy web pages into clean JSON or markdown' }
		]
	},

	// ─────────────────────────────────────────────
	// SKILLS.SH — anthropics/skills  [category: documents]
	// ─────────────────────────────────────────────
	{
		name: 'pdf',
		title: 'PDF Tools',
		description: 'Read, analyze, and generate PDF documents. Extract structured content from PDFs and create formatted documents programmatically.',
		version: '1.0.0',
		author: 'anthropics',
		authorDisplay: 'Anthropic',
		category: 'documents',
		keywords: ['pdf', 'documents', 'extraction', 'generation'],
		homepage: 'https://skills.sh/anthropics/skills/pdf',
		repoPath: 'https://github.com/anthropics/skills',
		installCommand: 'npx skillsadd anthropics/skills/pdf',
		installCommandSkillsSh: 'npx skillsadd anthropics/skills/pdf',
		skillsShPath: 'anthropics/skills/pdf',
		installs: 23200,
		source: 'skills.sh',
		emoji: '📄',
		skills: [
			{ name: 'PDF Reading', description: 'Extract and analyze content from any PDF' },
			{ name: 'PDF Generation', description: 'Create formatted PDF documents programmatically' }
		]
	},
	{
		name: 'pptx',
		title: 'PowerPoint / Slides',
		description: 'Generate polished presentations with proper story arc and slide structure. Your agent as a slide deck designer.',
		version: '1.0.0',
		author: 'anthropics',
		authorDisplay: 'Anthropic',
		category: 'documents',
		keywords: ['powerpoint', 'slides', 'presentations', 'pptx'],
		homepage: 'https://skills.sh/anthropics/skills/pptx',
		repoPath: 'https://github.com/anthropics/skills',
		installCommand: 'npx skillsadd anthropics/skills/pptx',
		installCommandSkillsSh: 'npx skillsadd anthropics/skills/pptx',
		skillsShPath: 'anthropics/skills/pptx',
		installs: 19400,
		source: 'skills.sh',
		emoji: '📊',
		skills: [
			{ name: 'Slide Generation', description: 'Create polished presentations from content' },
			{ name: 'Deck Structure', description: 'Story arc and narrative flow for slides' }
		]
	},
	{
		name: 'webapp-testing',
		title: 'Web App Testing',
		description: 'Test planning, coverage strategy, and end-to-end scenario design. Test real user journeys, not just unit paths.',
		version: '1.0.0',
		author: 'anthropics',
		authorDisplay: 'Anthropic',
		category: 'productivity',
		keywords: ['testing', 'e2e', 'qa', 'web', 'engineering'],
		homepage: 'https://skills.sh/anthropics/skills/webapp-testing',
		repoPath: 'https://github.com/anthropics/skills',
		installCommand: 'npx skillsadd anthropics/skills/webapp-testing',
		installCommandSkillsSh: 'npx skillsadd anthropics/skills/webapp-testing',
		skillsShPath: 'anthropics/skills/webapp-testing',
		installs: 15500,
		source: 'skills.sh',
		emoji: '🧪',
		skills: [
			{ name: 'Test Planning', description: 'Coverage that matters without over-testing' },
			{ name: 'E2E Scenarios', description: 'Real user journey tests from login to done' }
		]
	},
	{
		name: 'mcp-builder',
		title: 'MCP Builder',
		description: 'Define tools for any AI agent and run your own Model Context Protocol server. Extend what your agent can do.',
		version: '1.0.0',
		author: 'anthropics',
		authorDisplay: 'Anthropic',
		category: 'productivity',
		keywords: ['mcp', 'tools', 'agent', 'server', 'protocol'],
		homepage: 'https://skills.sh/anthropics/skills/mcp-builder',
		repoPath: 'https://github.com/anthropics/skills',
		installCommand: 'npx skillsadd anthropics/skills/mcp-builder',
		installCommandSkillsSh: 'npx skillsadd anthropics/skills/mcp-builder',
		skillsShPath: 'anthropics/skills/mcp-builder',
		installs: 13900,
		source: 'skills.sh',
		emoji: '🔧',
		skills: [
			{ name: 'Tool Definition', description: 'Define tools any agent can call' },
			{ name: 'MCP Server Setup', description: 'Run your own Model Context Protocol server' }
		]
	}
];

export const CATEGORIES = [
	'languages',
	'learning',
	'thinking',
	'writing',
	'design',
	'productivity',
	'marketing',
	'automation',
	'documents',
	'memory'
];

export function getPlugin(author: string, name: string): Plugin | undefined {
	return PLUGINS.find((p) => p.author === author && p.name === name);
}

export function getPluginsByCategory(category: string): Plugin[] {
	return PLUGINS.filter((p) => p.category === category);
}

export function getPluginsByAuthor(author: string): Plugin[] {
	return PLUGINS.filter((p) => p.author === author);
}

export function getPluginsBySource(source: 'loooom' | 'skills.sh'): Plugin[] {
	return PLUGINS.filter((p) => p.source === source);
}
