import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

function rewriteLegacyBlogHref(href: string): string {
  return href
    .replace(/^\/(?:articles|notes)\//, '/blog/')
    .replace(/^https:\/\/erdaltoprak\.com\/(?:articles|notes)\//, 'https://erdaltoprak.com/blog/');
}

export function renderRssContent(
  body: string,
  siteUrl: string,
  routeBase: '/blog',
  slug: string
): string {
  return sanitizeHtml(parser.render(body), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    transformTags: {
      img: (tagName, attribs) => {
        if (attribs.src && attribs.src.startsWith('./')) {
          attribs.src = `${siteUrl}${routeBase}/${slug}/${attribs.src.substring(2)}`;
        }
        return { tagName, attribs };
      },
      a: (tagName, attribs) => {
        if (attribs.href) {
          attribs.href = rewriteLegacyBlogHref(attribs.href);
        }
        return { tagName, attribs };
      },
    },
  });
}
