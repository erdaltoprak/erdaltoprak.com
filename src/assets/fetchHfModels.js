import { writeFile } from 'fs/promises';
import https from 'https';

const users = ['erdal', 'toprakai'];

const fetchUserModels = (username) => {
  const url = `https://huggingface.co/api/models?author=${username}&limit=100&full=true`;
  
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'node.js' } }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const models = JSON.parse(data)
            .map(model => ({
              id: model.id,
              author: model.author,
              title: model.id.split('/')[1],
              description: model.description || '',
              url: `https://huggingface.co/${model.id}`,
              lastModified: model.lastModified,
              model_type: model.config?.model_type || '',
              base_model: Array.isArray(model.tags) ? model.tags.filter(tag => tag.startsWith('base_model:')) : []
            }));
          resolve(models);
        } catch (error) {
          console.error(`Error parsing models data for ${username}:`, error);
          reject(error);
        }
      });
    }).on('error', (err) => {
      console.error(`Error fetching Hugging Face models data for ${username}:`, err);
      reject(err);
    });
  });
};

const fetchHfModels = async () => {
  try {
    // Fetch models for all users in parallel
    const allModelsArrays = await Promise.all(users.map(fetchUserModels));
    
    // Combine all models into a single array and sort by lastModified
    const allModels = allModelsArrays
      .flat()
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

    await writeFile('src/assets/hf_models.json', JSON.stringify(allModels, null, 2));
    console.log('Hugging Face models data fetched and saved.');
  } catch (error) {
    console.error('Error in fetchHfModels:', error);
    throw error;
  }
};

fetchHfModels().catch(error => {
  console.error('Failed to fetch Hugging Face models:', error);
  process.exit(1);
});