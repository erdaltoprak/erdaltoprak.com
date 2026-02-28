import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { renderRssContent } from '../utils/rss';

interface Context {
  site: string;
}

export async function GET(context: Context) {
  const siteUrl = context.site;
  const includeDraft = import.meta.env.PROD ? false : true;

  const posts = (await getCollection('blog', ({ data }) => {
    return includeDraft ? true : !data.draft;
  })).sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: 'Erdal Toprak - All content',
    description: 'Latest blog posts',
    site: siteUrl,
    stylesheet: '/rss/styles.xsl',
    items: posts.map((post) => ({
      ...post.data,
      author: 'rss@erdaltoprak.com',
      link: `/blog/${post.slug}`,
      content: renderRssContent(post.body, siteUrl, '/blog', post.slug),
      pubDate: post.data.pubDate,
    })),
    customData: `<atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom"/>`,
  });
}
