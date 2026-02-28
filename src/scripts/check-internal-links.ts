import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const URL_ATTR_REGEX = /\b(?:href|src)\s*=\s*["']([^"']+)["']/gi;
const SRCSET_REGEX = /\bsrcset\s*=\s*["']([^"']+)["']/gi;
const IGNORE_PROTOCOLS = new Set([
  'http:',
  'https:',
  'mailto:',
  'tel:',
  'sms:',
  'data:',
  'javascript:'
]);

interface BrokenRef {
  sourceFile: string;
  url: string;
}

function stripQueryAndHash(rawUrl: string): string {
  const base = rawUrl.split('#')[0].split('?')[0] ?? '';
  try {
    return decodeURI(base);
  } catch {
    return base;
  }
}

function hasProtocol(rawUrl: string): boolean {
  const protocolMatch = rawUrl.match(/^([a-zA-Z][a-zA-Z\d+\-.]*:)/);
  return protocolMatch ? IGNORE_PROTOCOLS.has(protocolMatch[1].toLowerCase()) : false;
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function canResolveToDistFile(rawUrlPath: string, htmlFilePath: string): Promise<boolean> {
  if (rawUrlPath === '' || rawUrlPath === '/') {
    return exists(path.join(DIST_DIR, 'index.html'));
  }

  const basePath = rawUrlPath.startsWith('/')
    ? path.join(DIST_DIR, rawUrlPath.replace(/^\/+/, ''))
    : path.resolve(path.dirname(htmlFilePath), rawUrlPath);

  const candidates: string[] = [basePath];
  const ext = path.extname(basePath);

  if (!ext) {
    candidates.push(`${basePath}.html`);
    candidates.push(path.join(basePath, 'index.html'));
  } else if (rawUrlPath.endsWith('/')) {
    candidates.push(path.join(basePath, 'index.html'));
  }

  for (const candidate of candidates) {
    if (await exists(candidate)) return true;
  }

  return false;
}

function extractUrls(html: string): string[] {
  const urls: string[] = [];
  let match: RegExpExecArray | null = null;

  while ((match = URL_ATTR_REGEX.exec(html)) !== null) {
    urls.push(match[1]);
  }

  while ((match = SRCSET_REGEX.exec(html)) !== null) {
    const parts = match[1]
      .split(',')
      .map((entry) => entry.trim().split(/\s+/)[0])
      .filter(Boolean);
    urls.push(...parts);
  }

  return urls;
}

function shouldSkip(rawUrl: string): boolean {
  const trimmed = rawUrl.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('#')) return true;
  if (trimmed.startsWith('//')) return true;
  return hasProtocol(trimmed);
}

async function main(): Promise<void> {
  const htmlFiles = await glob('**/*.html', { cwd: DIST_DIR, nodir: true });
  const broken: BrokenRef[] = [];
  let checkedCount = 0;

  for (const relativeFile of htmlFiles) {
    const filePath = path.join(DIST_DIR, relativeFile);
    const content = await readFile(filePath, 'utf-8');
    const urls = extractUrls(content);

    for (const url of urls) {
      if (shouldSkip(url)) continue;

      const normalized = stripQueryAndHash(url);
      if (shouldSkip(normalized)) continue;

      const ok = await canResolveToDistFile(normalized, filePath);
      checkedCount += 1;

      if (!ok) {
        broken.push({ sourceFile: relativeFile, url });
      }
    }
  }

  if (broken.length > 0) {
    console.error(`Found ${broken.length} broken internal references:`);
    for (const entry of broken) {
      console.error(`- ${entry.sourceFile} -> ${entry.url}`);
    }
    process.exit(1);
  }

  console.log(`Internal link check passed. Verified ${checkedCount} references across ${htmlFiles.length} HTML files.`);
}

void main();
