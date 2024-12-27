import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';
import matter from 'gray-matter';

async function generateFullDoc() {
  try {
    // Read the base llms.txt content
    const baseLLMsContent = await readFile('public/llms.txt', 'utf-8');
    
    // Initialize the full content with the base content
    let fullContent = baseLLMsContent + '\n\n# Full Content\n\n';

    // Get all .astro pages (excluding layouts and components)
    const astroPages = await glob('src/pages/**/*.astro');
    
    // Get all markdown blog posts
    const blogPosts = await glob('src/content/blog/**/*.md');

    // Process Astro pages
    for (const page of astroPages) {
      if (!page.includes('layouts') && !page.includes('components')) {
        const content = await readFile(page, 'utf-8');
        const relativePath = page.replace('src/pages/', '');
        fullContent += `\n## Page: ${relativePath}\n\`\`\`astro\n${content}\n\`\`\`\n`;
      }
    }

    // Process blog posts
    for (const post of blogPosts) {
      const content = await readFile(post, 'utf-8');
      const { data, content: markdownContent } = matter(content);
      const relativePath = post.replace('src/content/blog/', '');
      
      fullContent += `\n## Blog Post: ${relativePath}\n`;
      fullContent += `\nFrontmatter:\n\`\`\`yaml\n${matter.stringify('', data).trim()}\n\`\`\`\n`;
      fullContent += `\nContent:\n${markdownContent}\n`;
    }

    // Write the full content to the new file
    await writeFile('public/llms-full.txt', fullContent);
    console.log('Generated llms-full.txt successfully');

  } catch (error) {
    console.error('Error generating llms-full.txt:', error);
    throw error;
  }
}

// Execute the function
generateFullDoc().catch(error => {
  console.error('Failed to generate full LLMs document:', error);
  process.exit(1);
}); 