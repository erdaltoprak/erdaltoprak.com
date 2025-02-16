import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import { glob } from 'glob';
import sharp from 'sharp';

const BLOG_DIR = 'src/content/blog';
const OUTPUT_DIR = 'public/og';

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function createBlurredBackground(imagePath: string): Promise<string> {
  try {
    const exists = await fileExists(imagePath);
    if (!exists) {
      throw new Error(`Image file does not exist: ${imagePath}`);
    }

    const imageBuffer = await sharp(imagePath)
      .resize(1200, 630, { 
        fit: 'cover',
        position: 'center'
      })
      .blur(5)
      .modulate({ 
        brightness: 0.8,
        saturation: 0.8
      })
      .toFormat('png', { 
        quality: 90,
        compressionLevel: 9,
        palette: true
      })
      .toBuffer();
    
    return `data:image/png;base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.error(`Error processing image ${imagePath}:`, error);
    throw error;
  }
}

async function generateOGImage(title: string, slug: string, heroImage: string, fonts: { regular: Buffer; bold: Buffer }) {
  try {
    const cleanHeroImage = heroImage.replace(/^\.\//, '');
    const imagePath = join(BLOG_DIR, slug, cleanHeroImage);
    const blurredBackground = await createBlurredBackground(imagePath);

    const markup = html`
      <div style="display: flex; width: 1200px; height: 630px; background-image: url('${blurredBackground}'); background-size: cover; background-position: center;">
        <div style="display: flex; flex-direction: column; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); align-items: center; justify-content: center; padding: 60px;">
          <div style="color: white; font-size: 60px; font-weight: 700; text-align: center; font-family: 'Roboto'; text-shadow: 0 2px 4px rgba(0,0,0,0.5); margin-bottom: 16px;">
            ${title}
          </div>
          <div style="color: rgba(255, 255, 255, 0.9); font-size: 24px; font-weight: 400; font-family: 'Roboto';">
            erdaltoprak.com
          </div>
        </div>
      </div>
    `;

    const svg = await satori(markup, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Roboto',
          data: fonts.regular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Roboto',
          data: fonts.bold,
          weight: 700,
          style: 'normal',
        },
      ],
    });

    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    const outputPath = join(OUTPUT_DIR, `${slug}.png`);
    await writeFile(outputPath, pngBuffer);
    console.log(`Generated OG image for: ${slug}`);

  } catch (error) {
    console.error(`Failed to generate OG image for ${slug}:`, error);
    throw error;
  }
}

async function main() {
  try {
    const fontRegular = Buffer.from(
      await readFile(
        './node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff'
      )
    );

    const fontBold = Buffer.from(
      await readFile(
        './node_modules/@fontsource/roboto/files/roboto-latin-700-normal.woff'
      )
    );

    const fonts = {
      regular: fontRegular,
      bold: fontBold
    };

    await mkdir(OUTPUT_DIR, { recursive: true });

    const blogPosts = await glob('**/index.md', {
      cwd: BLOG_DIR,
    });

    for (const postPath of blogPosts) {
      try {
        const fullPath = join(BLOG_DIR, postPath);
        const content = await readFile(fullPath, 'utf-8');
        const { data } = matter(content);
        const slug = postPath.split('/')[0];

        if (!data.heroImage) {
          console.warn(`No hero image found for ${slug}, skipping OG image generation`);
          continue;
        }

        await generateOGImage(data.title, slug, data.heroImage, fonts);
      } catch (error) {
        console.error(`Error processing post ${postPath}:`, error);
        continue;
      }
    }

    console.log('OG image generation complete!');
  } catch (error) {
    console.error('Error generating OG images:', error);
    process.exit(1);
  }
}

main();