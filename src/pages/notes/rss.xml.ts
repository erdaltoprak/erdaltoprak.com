import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET(context: { site: string }) {
  // @ts-ignore
  const notes = await getCollection('notes');
  return rss({
    title: 'Erdal Toprak – Notes',
    description: 'Short-form notes',
    site: context.site,
    stylesheet: '/rss/styles.xsl',
    items: notes.map((post) => ({
      link: `/notes/${post.slug}/`,
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }),
      ...post.data,
    })),
  });
} 