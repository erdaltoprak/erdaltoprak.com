import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';

const SITE_URL = 'https://erdaltoprak.com';
const CONTENT_DIR = 'src/content/blog';
const OUTPUT_FILE = 'public/llms.txt';

type PostType = 'article' | 'note';

interface PostEntry {
  title: string;
  slug: string;
  type: PostType;
  pubDate: Date;
}

function toPostUrl(slug: string): string {
  return `${SITE_URL}/blog/${slug}`;
}

async function readPosts(): Promise<PostEntry[]> {
  const files = await glob('**/index.md', { cwd: CONTENT_DIR });
  const posts: PostEntry[] = [];

  for (const file of files) {
    const fullPath = join(CONTENT_DIR, file);
    const content = await readFile(fullPath, 'utf-8');
    const { data } = matter(content);

    if (data.draft === true) continue;
    if (data.type !== 'article' && data.type !== 'note') continue;

    const slug = file.replace(/\/index\.md$/, '');
    const title = String(data.title || slug);
    const pubDate = new Date(String(data.pubDate));

    posts.push({ title, slug, type: data.type as PostType, pubDate });
  }

  return posts.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

async function main() {
  const posts = await readPosts();

  const articles = posts.filter((post) => post.type === 'article');
  const notes = posts.filter((post) => post.type === 'note');

  const lines: string[] = [
    '# ErdalToprak.com',
    '',
    '> This website is Erdal Toprak\'s personal website. It is built with Astro and deployed on a VPS.',
    '',
    '## Pages',
    '',
    `- [Home](${SITE_URL})`,
    `- [Blog](${SITE_URL}/blog)`,
    `- [About](${SITE_URL}/about)`,
    '',
    '## Articles',
    '',
    ...articles.map((post) => `- [${post.title}](${toPostUrl(post.slug)})`),
    '',
    '## Notes',
    '',
    ...notes.map((post) => `- [${post.title}](${toPostUrl(post.slug)})`),
    '',
    '## Links',
    '',
    '- [GitHub](https://github.com/erdaltoprak): Open source projects and source code.',
    '- [Hugging Face](https://huggingface.co/erdal): Machine learning models and datasets.',
    '',
  ];

  await writeFile(OUTPUT_FILE, lines.join('\n'), 'utf-8');
  console.log(`Generated ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error('Failed to generate llms.txt:', error);
  process.exit(1);
});
