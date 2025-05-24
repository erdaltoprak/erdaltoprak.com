import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET(context: { site: string }) {
  const site_url = context.site;
  // @ts-ignore
  const articles = await getCollection('articles');
  return rss({
    title: 'Erdal Toprak – Articles',
    description: 'Long-form articles',
    site: site_url,
    stylesheet: '/rss/styles.xsl',
    items: articles.map((post) => {
      const post_content = sanitizeHtml(
        parser.render(post.body),
        {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
          transformTags: {
            'img': (tagName, attribs) => {
              if (attribs.src && attribs.src.startsWith('./')) {
                attribs.src = `${site_url}/articles/${post.slug}/${attribs.src.substring(2)}`;
              }
              return { tagName, attribs };
            }
          }
        }
      );
      return {
        ...post.data,
        author: 'rss@erdaltoprak.com',
        link: `/articles/${post.slug}/`,
        content: post_content,
        pubDate: new Date(post.data.pubDate),
      };
    }),
    customData: `<atom:link href="${site_url}/articles/rss.xml" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom"/>`,
  });
} 