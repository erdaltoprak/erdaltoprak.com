import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET(context: { site: string }) {
  const site_url = context.site;
  // @ts-ignore
  const notes = await getCollection('notes');
  return rss({
    title: 'Erdal Toprak – Notes',
    description: 'Short-form notes',
    site: site_url,
    stylesheet: '/rss/styles.xsl',
    items: notes.map((post) => {
      const post_content = sanitizeHtml(
        parser.render(post.body),
        {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
          transformTags: {
            'img': (tagName, attribs) => {
              if (attribs.src && attribs.src.startsWith('./')) {
                attribs.src = `${site_url}/notes/${post.slug}/${attribs.src.substring(2)}`;
              }
              return { tagName, attribs };
            }
          }
        }
      );
      return {
        ...post.data,
        author: 'rss@erdaltoprak.com',
        link: `/notes/${post.slug}/`,
        content: post_content,
        pubDate: new Date(post.data.pubDate),
      };
    }),
    customData: `<atom:link href="${site_url}/notes/rss.xml" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom"/>`,
  });
} 