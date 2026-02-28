import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';
import MiniSearch from 'minisearch';

const CONTENT_DIR = 'src/content/blog';
const OUTPUT_DIR = 'public/$collection-search';
const INDEX_PATH = join(OUTPUT_DIR, 'minisearch-index.json');
const WORKER_PATH = join(OUTPUT_DIR, 'minisearch-worker.mjs');

type PostType = 'article' | 'note';

interface SearchDoc {
  id: number;
  title: string;
  description: string;
  body: string;
  frontmatter: Record<string, unknown>;
  collection: 'blog';
  file: string;
}

function isSearchablePostType(value: unknown): value is PostType {
  return value === 'article' || value === 'note';
}

async function readSearchDocs(): Promise<SearchDoc[]> {
  const files = await glob('**/index.{md,mdx}', { cwd: CONTENT_DIR, nodir: true });
  const docs: SearchDoc[] = [];

  for (const file of files.sort()) {
    const source = await readFile(join(CONTENT_DIR, file), 'utf-8');
    const { data, content } = matter(source);

    if (data.draft === true || !isSearchablePostType(data.type)) {
      continue;
    }

    docs.push({
      id: docs.length,
      title: String(data.title ?? file),
      description: String(data.description ?? ''),
      body: content,
      frontmatter: data,
      collection: 'blog',
      file,
    });
  }

  return docs;
}

async function main() {
  const docs = await readSearchDocs();

  if (docs.length === 0) {
    throw new Error('No blog posts found in src/content/blog. Refusing to build an empty search index.');
  }

  const index = new MiniSearch<SearchDoc>({
    fields: ['title', 'description', 'body'],
    storeFields: ['title', 'description', 'frontmatter', 'collection', 'file'],
  });

  index.addAll(docs);

  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(
    INDEX_PATH,
    JSON.stringify({
      index: index.toJSON(),
      fields: ['title', 'description', 'body'],
      storeFields: ['title', 'description', 'frontmatter', 'collection', 'file'],
      collections: ['blog'],
    }),
    'utf-8',
  );
  await rm(WORKER_PATH, { force: true });

  console.log(`Generated ${INDEX_PATH} for ${docs.length} blog posts`);
}

main().catch((error) => {
  console.error('Failed to generate search index:', error);
  process.exit(1);
});
