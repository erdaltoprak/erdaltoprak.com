import { writeFile } from 'fs/promises';
import https from 'https';

const username = 'erdal';
const url = `https://huggingface.co/api/collections?owner=${username}&limit=100`;

const getItemUrl = (item) => {
  const baseUrl = 'https://huggingface.co';
  switch (item.type) {
    case 'dataset':
      return `${baseUrl}/datasets/${item.id}`;
    default:
      return `${baseUrl}/${item.id}`;
  }
};

const fetchHfCollections = () => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'node.js' } }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', async () => {
        try {
          const collections = JSON.parse(data)
            .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
            .map(collection => ({
              title: collection.title,
              description: collection.description || '',
              lastModified: collection.lastUpdated,
              url: `https://huggingface.co/collections/${collection.slug}`,
              items: collection.items.map(item => ({
                type: item.type,
                title: item.id.split('/')[1],
                url: getItemUrl(item),
                description: item.description || '',
                likes: item.type === 'paper' ? item.upvotes : item.likes,
                downloads: item.downloads || 0,
                lastModified: item.lastModified,
                tags: item.tags || []
              })),
              theme: collection.theme,
              upvotes: collection.upvotes
            }));

          await writeFile('src/assets/hf_collections.json', JSON.stringify(collections, null, 2));
          console.log('Hugging Face collections data fetched and saved.');
          resolve();
        } catch (error) {
          console.error('Error parsing collections data:', error);
          reject(error);
        }
      });
    }).on('error', (err) => {
      console.error('Error fetching Hugging Face collections data:', err);
      reject(err);
    });
  });
};

fetchHfCollections().catch(error => {
  console.error('Failed to fetch Hugging Face collections:', error);
  process.exit(1);
}); 