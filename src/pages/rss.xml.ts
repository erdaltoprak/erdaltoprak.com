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
      content: sanitizeHtml(post.compiledContent()),
      ...post.frontmatter,
    })),
  });
}



// import rss, { pagesGlobToRssItems } from '@astrojs/rss';

// export async function get(context) {
//   return rss({
//     title: 'Erdal Toprak | Blog',
//     description: 'IA/ML | Privacy | Software ecosystems',
//     site: 'https://erdaltoprak.com',
//     items: await pagesGlobToRssItems(
//       import.meta.glob('./blog/*.md'),
//     ),
//   });
// }