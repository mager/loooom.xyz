import yaml from 'js-yaml';

export interface PromptfooAssertion {
	type: string;
	value?: string;
}

export interface PromptfooTest {
	description: string;
	message: string;
	assertions: PromptfooAssertion[];
}

export interface PromptfooConfig {
	description: string;
	tests: PromptfooTest[];
	rawYaml: string;
}

const CATALOG_BASE = 'https://raw.githubusercontent.com/mager/loooom/main';

export async function fetchPromptfooConfig(pluginSlug: string): Promise<PromptfooConfig | null> {
	try {
		const url = `${CATALOG_BASE}/plugins/${pluginSlug}/promptfooconfig.yaml`;
		const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
		if (!res.ok) return null;
		const rawYaml = await res.text();
		const parsed = yaml.load(rawYaml) as Record<string, unknown>;
		const rawTests = (parsed.tests as unknown[]) || [];
		const tests: PromptfooTest[] = rawTests.map((t: unknown) => {
			const test = t as Record<string, unknown>;
			const vars = (test.vars as Record<string, unknown>) || {};
			const asserts = (test.assert as unknown[]) || [];
			return {
				description: (test.description as string) || 'Unnamed test',
				message: (vars.message as string) || '',
				assertions: asserts.map((a: unknown) => {
					const assertion = a as Record<string, unknown>;
					return {
						type: (assertion.type as string) || 'unknown',
						value:
							typeof assertion.value === 'string'
								? assertion.value.trim()
								: JSON.stringify(assertion.value),
					};
				}),
			};
		});
		return { description: (parsed.description as string) || '', tests, rawYaml };
	} catch {
		return null;
	}
}
