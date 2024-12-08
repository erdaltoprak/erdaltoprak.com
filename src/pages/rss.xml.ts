import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

interface Context {
  site: string;
}

interface BlogPost {
  slug: string;
  body: string;
  data: Record<string, any>;
}

export async function GET(context: Context) {
    const blog = await getCollection('blog') as BlogPost[];
    return rss({
      title: 'Erdal Toprak',
      description: 'A humble Astronaut’s guide to the stars',
      site: context.site,
      stylesheet: '/rss/styles.xsl',
      items: blog.map((post: BlogPost) => ({
        link: `/blog/${post.slug}/`,
        // Note: this will not process components or JSX expressions in MDX files.
        content: sanitizeHtml(parser.render(post.body), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
        }),
        ...post.data,
      })),
    });
  }