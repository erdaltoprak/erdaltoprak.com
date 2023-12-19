import rss from '@astrojs/rss';
import sanitizeHtml from 'sanitize-html';

export function get(context) {
  const postImportResult = import.meta.glob('./blog/*.md', { eager: true }); 
  const posts = Object.values(postImportResult);
  return rss({
    title: 'Erdal Toprak | Blog',
    description: 'IA/ML | Privacy | Software ecosystems',
    site: context.site,
    items: posts.map((post) => ({
      link: post.url,
      title: post.frontmatter.title,  // Include the title
      description: post.frontmatter.description,  // Include the description
      content: sanitizeHtml(post.compiledContent()),  // Include the entire content
      pubDate: post.frontmatter.pubDate,  // Include the publication date
    })),
  });
}
 