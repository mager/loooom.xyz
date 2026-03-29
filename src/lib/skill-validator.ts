/**
 * SKILL.md validator
 * Ensures skills meet the Loooom v1.0 spec
 */

import matter from 'gray-matter';

export interface ValidationResult {
	valid: boolean;
	errors: ValidationIssue[];
	warnings: ValidationIssue[];
	suggestions: ValidationIssue[];
}

export interface ValidationIssue {
	field?: string;
	message: string;
}

const REQUIRED_FIELDS = ['name', 'description', 'author', 'version'];
const URL_SAFE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;

export function validateSkill(content: string): ValidationResult {
	const errors: ValidationIssue[] = [];
	const warnings: ValidationIssue[] = [];
	const suggestions: ValidationIssue[] = [];

	// Parse frontmatter
	let parsed;
	try {
		parsed = matter(content);
	} catch (e) {
		errors.push({ message: 'Invalid YAML frontmatter' });
		return { valid: false, errors, warnings, suggestions };
	}

	const { data: frontmatter, content: body } = parsed;

	// Check required fields
	for (const field of REQUIRED_FIELDS) {
		if (!frontmatter[field]) {
			errors.push({ field, message: `Missing required field: ${field}` });
		}
	}

	// Validate name
	if (frontmatter.name) {
		if (!URL_SAFE_PATTERN.test(frontmatter.name)) {
			errors.push({
				field: 'name',
				message: 'Name must be kebab-case (lowercase, hyphens only)'
			});
		}
		if (frontmatter.name.length > 50) {
			errors.push({
				field: 'name',
				message: 'Name must be under 50 characters'
			});
		}
	}

	// Validate description
	if (frontmatter.description) {
		if (frontmatter.description.length > 120) {
			suggestions.push({
				field: 'description',
				message: 'Description is long — consider keeping it under 120 chars for clean display'
			});
		}
		if (frontmatter.description.endsWith('.')) {
			suggestions.push({
				field: 'description',
				message: 'Description should not end with a period'
			});
		}
	}

	// Validate version
	if (frontmatter.version && !SEMVER_PATTERN.test(frontmatter.version)) {
		errors.push({
			field: 'version',
			message: 'Version must follow SemVer (e.g., 1.0.0)'
		});
	}

	// Validate tags
	if (frontmatter.tags) {
		if (!Array.isArray(frontmatter.tags)) {
			errors.push({
				field: 'tags',
				message: 'Tags must be an array of strings'
			});
		} else {
			for (const tag of frontmatter.tags) {
				if (typeof tag !== 'string') {
					errors.push({
						field: 'tags',
						message: 'All tags must be strings'
					});
					break;
				}
				if (tag !== tag.toLowerCase()) {
					suggestions.push({
						field: 'tags',
						message: `Tag "${tag}" should be lowercase`
					});
				}
			}
		}
	}

	// Check body content
	if (!body.trim()) {
		errors.push({ message: 'Skill body cannot be empty' });
	} else {
		// Check for agent behavior section
		const hasAgentSection = /#{2,3}\s+(?:agent behavior|behavior|instructions|prompt|system)/i.test(body);
		if (!hasAgentSection) {
			warnings.push({
				message: 'No "Agent Behavior" section found — Claude needs instructions on how to behave'
			});
		}

		// Check for usage/examples
		const hasExamples = /#{2,3}\s+(?:example|usage|how to|getting started)/i.test(body);
		if (!hasExamples) {
			suggestions.push({
				message: 'Consider adding a "Usage" or "Examples" section'
			});
		}

		// Warn if body is very short
		if (body.trim().length < 200) {
			suggestions.push({
				message: 'Skill body is quite short — consider adding more documentation'
			});
		}
	}

	return {
		valid: errors.length === 0,
		errors,
		warnings,
		suggestions
	};
}

export function formatValidation(result: ValidationResult): string {
	const lines: string[] = [];

	if (result.errors.length > 0) {
		lines.push('❌ Errors:');
		for (const e of result.errors) {
			lines.push(`  • ${e.field ? `${e.field}: ` : ''}${e.message}`);
		}
	}

	if (result.warnings.length > 0) {
		lines.push('⚠️ Warnings:');
		for (const w of result.warnings) {
			lines.push(`  • ${w.field ? `${w.field}: ` : ''}${w.message}`);
		}
	}

	if (result.suggestions.length > 0) {
		lines.push('💡 Suggestions:');
		for (const s of result.suggestions) {
			lines.push(`  • ${s.field ? `${s.field}: ` : ''}${s.message}`);
		}
	}

	if (lines.length === 0) {
		return '✅ All checks passed!';
	}

	return lines.join('\n');
}
