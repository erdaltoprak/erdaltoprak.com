import { getCollection } from 'astro:content';
import { formatMonthYear } from './index';

export type PostType = 'article' | 'note';
export type BlogFilter = 'all' | PostType;

export interface ListPost {
  slug: string;
  title: string;
  type: PostType;
  url: string;
  isoDate: string;
  monthYearDate: string;
  timestamp: number;
}

export async function getBlogListPosts(filter: BlogFilter = 'all'): Promise<ListPost[]> {
  const posts = await getCollection('blog', ({ data }) => {
    const includeDraft = import.meta.env.PROD ? !data.draft : true;
    const isBlogPost = data.type === 'article' || data.type === 'note';
    const matchesFilter = filter === 'all' ? true : data.type === filter;

    return includeDraft && isBlogPost && matchesFilter;
  });

  return posts
    .map((post): ListPost => {
      const pubDate = post.data.pubDate;
      const type = post.data.type as PostType;

      return {
        slug: post.slug,
        title: post.data.title,
        type,
        url: `/blog/${post.slug}`,
        isoDate: pubDate.toISOString(),
        monthYearDate: formatMonthYear(pubDate),
        timestamp: pubDate.getTime(),
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp);
}
