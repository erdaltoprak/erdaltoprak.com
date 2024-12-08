import { writeFile } from 'fs/promises';
import https from 'https';

const users = ['erdal', 'ToprakAI'];

const fetchUserDatasets = (username) => {
  const url = `https://huggingface.co/api/datasets?author=${username}&limit=100&full=true`;
  
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'node.js' } }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const datasets = JSON.parse(data)
            .map(dataset => ({
              id: dataset.id,
              author: dataset.author,
              title: dataset.id.split('/')[1],
              url: `https://huggingface.co/datasets/${dataset.id}`,
              lastModified: dataset.lastModified
            }));
          resolve(datasets);
        } catch (error) {
          console.error(`Error parsing datasets data for ${username}:`, error);
          reject(error);
        }
      });
    }).on('error', (err) => {
      console.error(`Error fetching Hugging Face datasets data for ${username}:`, err);
      reject(err);
    });
  });
};

const fetchHfDatasets = async () => {
  try {
    // Fetch datasets for all users in parallel
    const allDatasetsArrays = await Promise.all(users.map(fetchUserDatasets));
    
    // Combine all datasets into a single array and sort by lastModified
    const allDatasets = allDatasetsArrays
      .flat()
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

    await writeFile('src/assets/hf_datasets.json', JSON.stringify(allDatasets, null, 2));
    console.log('Hugging Face datasets data fetched and saved.');
  } catch (error) {
    console.error('Error in fetchHfDatasets:', error);
    throw error;
  }
};

fetchHfDatasets().catch(error => {
  console.error('Failed to fetch Hugging Face datasets:', error);
  process.exit(1);
});