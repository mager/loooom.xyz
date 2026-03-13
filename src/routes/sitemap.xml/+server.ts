import { PLUGINS } from '$lib/plugins';

export const prerender = true;

export async function GET() {
	const base = 'https://loooom.xyz';
	const now = new Date().toISOString().split('T')[0];

	const staticPages = [
		{ url: '/', priority: '1.0', changefreq: 'weekly' },
		{ url: '/browse', priority: '0.9', changefreq: 'weekly' },
		{ url: '/me', priority: '0.7', changefreq: 'monthly' },
		{ url: '/docs', priority: '0.6', changefreq: 'monthly' },
	];

	const pluginPages = PLUGINS.map((p) => ({
		url: `/p/${p.author}/${p.name}`,
		priority: '0.8',
		changefreq: 'weekly',
	}));

	const allPages = [...staticPages, ...pluginPages];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
	.map(
		(page) => `  <url>
    <loc>${base}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600',
		},
	});
}
