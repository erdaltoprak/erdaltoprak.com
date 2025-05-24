import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET(context: { site: string }) {
  // @ts-ignore
  const articles = await getCollection('articles');
  return rss({
    title: 'Erdal Toprak – Articles',
    description: 'Long-form articles',
    site: context.site,
    stylesheet: '/rss/styles.xsl',
    items: articles.map((post) => ({
      link: `/articles/${post.slug}/`,
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
      }),
      ...post.data,
    })),
  });
} 