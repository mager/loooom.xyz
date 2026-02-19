<script lang="ts">
	let { size = 28 }: { size?: number } = $props();
</script>

<svg viewBox="0 0 200 200" width={size} height={size} class="yarn-logo">
	<defs>
		<filter id="logo-glow">
			<feGaussianBlur stdDeviation="2" result="coloredBlur" />
			<feMerge>
				<feMergeNode in="coloredBlur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<circle cx="100" cy="100" r="70" fill="var(--bg-card, #16161f)" stroke="var(--border, #2a2a3a)" stroke-width="1" />
	<g filter="url(#logo-glow)">
		<ellipse cx="100" cy="100" rx="66" ry="28" fill="none" stroke="var(--accent, #6c5ce7)" stroke-width="3" opacity="0.9" />
		<ellipse cx="100" cy="100" rx="64" ry="26" fill="none" stroke="var(--yarn-pink, #fd79a8)" stroke-width="3" opacity="0.9" transform="rotate(60, 100, 100)" />
		<ellipse cx="100" cy="100" rx="62" ry="24" fill="none" stroke="var(--yarn-blue, #74b9ff)" stroke-width="3" opacity="0.9" transform="rotate(120, 100, 100)" />
	</g>
	<path d="M 168 95 Q 178 88 183 76 Q 188 65 192 58" fill="none" stroke="var(--accent, #6c5ce7)" stroke-width="2.5" stroke-linecap="round" opacity="0.7" />
</svg>

<style>
	.yarn-logo {
		display: block;
		flex-shrink: 0;
	}
</style>
