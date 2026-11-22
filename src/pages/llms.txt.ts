import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../lib/config';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  const body = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## Articles',
    ...posts.map(({ id, data }) => `- [${data.title}](${site.url}/posts/${id}/): ${data.description}`),
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
