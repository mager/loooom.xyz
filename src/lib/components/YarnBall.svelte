<script lang="ts">
	let { size = 200, animated = true }: { size?: number; animated?: boolean } = $props();
</script>

<div class="yarnball-container" style="width: {size}px; height: {size}px;">
	<svg viewBox="0 0 200 200" class="yarnball" class:animated>
		<!-- Outer glow -->
		<defs>
			<radialGradient id="ballGlow" cx="50%" cy="50%" r="50%">
				<stop offset="0%" stop-color="#6c5ce7" stop-opacity="0.3" />
				<stop offset="100%" stop-color="#6c5ce7" stop-opacity="0" />
			</radialGradient>
			<filter id="glow">
				<feGaussianBlur stdDeviation="2" result="coloredBlur" />
				<feMerge>
					<feMergeNode in="coloredBlur" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
		</defs>

		<!-- Glow backdrop -->
		<circle cx="100" cy="100" r="95" fill="url(#ballGlow)" />

		<!-- Core sphere -->
		<circle cx="100" cy="100" r="70" fill="#16161f" stroke="#2a2a3a" stroke-width="0.5" />

		<!-- Yarn threads - orbital paths -->
		<g filter="url(#glow)">
			<!-- Thread 1 - purple/accent -->
			<ellipse cx="100" cy="100" rx="68" ry="30" fill="none" stroke="#6c5ce7" stroke-width="1.8" opacity="0.9" class="thread t1" />
			<ellipse cx="100" cy="100" rx="65" ry="35" fill="none" stroke="#6c5ce7" stroke-width="1.2" opacity="0.5" class="thread t1b" transform="rotate(15, 100, 100)" />

			<!-- Thread 2 - pink -->
			<ellipse cx="100" cy="100" rx="66" ry="28" fill="none" stroke="#fd79a8" stroke-width="1.8" opacity="0.9" class="thread t2" transform="rotate(60, 100, 100)" />
			<ellipse cx="100" cy="100" rx="62" ry="33" fill="none" stroke="#fd79a8" stroke-width="1.2" opacity="0.5" class="thread t2b" transform="rotate(75, 100, 100)" />

			<!-- Thread 3 - blue -->
			<ellipse cx="100" cy="100" rx="64" ry="26" fill="none" stroke="#74b9ff" stroke-width="1.8" opacity="0.9" class="thread t3" transform="rotate(120, 100, 100)" />
			<ellipse cx="100" cy="100" rx="60" ry="31" fill="none" stroke="#74b9ff" stroke-width="1.2" opacity="0.5" class="thread t3b" transform="rotate(135, 100, 100)" />

			<!-- Thread 4 - crossing diagonals -->
			<ellipse cx="100" cy="100" rx="67" ry="24" fill="none" stroke="#a29bfe" stroke-width="1.4" opacity="0.7" class="thread t4" transform="rotate(40, 100, 100)" />
			<ellipse cx="100" cy="100" rx="63" ry="22" fill="none" stroke="#55efc4" stroke-width="1.4" opacity="0.6" class="thread t5" transform="rotate(95, 100, 100)" />
			<ellipse cx="100" cy="100" rx="58" ry="20" fill="none" stroke="#fdcb6e" stroke-width="1.2" opacity="0.5" class="thread t6" transform="rotate(155, 100, 100)" />
		</g>

		<!-- Center highlight -->
		<circle cx="88" cy="88" r="18" fill="url(#ballGlow)" opacity="0.4" />

		<!-- Trailing thread end -->
		<path d="M 168 95 Q 180 90 185 78 Q 190 65 195 60" fill="none" stroke="#6c5ce7" stroke-width="1.5" stroke-linecap="round" opacity="0.8" class="thread-tail" />
	</svg>
</div>

<style>
	.yarnball-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.yarnball {
		width: 100%;
		height: 100%;
	}

	.animated .thread {
		animation: spin-slow 20s linear infinite;
		transform-origin: 100px 100px;
	}

	.animated .t1 { animation-duration: 25s; }
	.animated .t1b { animation-duration: 28s; animation-direction: reverse; }
	.animated .t2 { animation-duration: 22s; }
	.animated .t2b { animation-duration: 26s; animation-direction: reverse; }
	.animated .t3 { animation-duration: 20s; }
	.animated .t3b { animation-duration: 24s; animation-direction: reverse; }
	.animated .t4 { animation-duration: 30s; }
	.animated .t5 { animation-duration: 18s; animation-direction: reverse; }
	.animated .t6 { animation-duration: 27s; }

	.animated .thread-tail {
		animation: sway 4s ease-in-out infinite;
		transform-origin: 168px 95px;
	}

	@keyframes spin-slow {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	@keyframes sway {
		0%, 100% { transform: rotate(0deg); }
		50% { transform: rotate(8deg); }
	}
</style>
