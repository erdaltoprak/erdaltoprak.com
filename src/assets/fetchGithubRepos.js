import { writeFile } from 'fs/promises';
import https from 'https';

const users = ['erdaltoprak', 'toprakai'];

const fetchUserRepos = (username) => {
  const url = `https://api.github.com/users/${username}/repos?per_page=500`;
  
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'node.js' } }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const repos = JSON.parse(data)
            .map(repo => {
              const repoData = {
                title: repo.name,
                description: repo.description || '',
                url: repo.html_url,
                demo: repo.homepage || '',
                post: '',
                lastModified: repo.updated_at,
                author: repo.owner.login
              };

              if (repo.topics && repo.topics.length > 0) {
                repoData.tags = repo.topics;
              }

              if (repo.license && repo.license.name) {
                repoData.license = repo.license.name;
              }

              return repoData;
            });
          resolve(repos);
        } catch (error) {
          console.error(`Error parsing repository data for ${username}:`, error);
          reject(error);
        }
      });
    }).on('error', (err) => {
      console.error(`Error fetching repository data for ${username}:`, err);
      reject(err);
    });
  });
};

const fetchRepos = async () => {
  try {
    // Fetch repositories for all users in parallel
    const allReposArrays = await Promise.all(users.map(fetchUserRepos));
    
    // Combine all repositories into a single array and sort by lastModified
    const allRepos = allReposArrays
      .flat()
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

    await writeFile('src/assets/github.json', JSON.stringify(allRepos, null, 2));
    console.log('Repository data fetched and saved.');
  } catch (error) {
    console.error('Error in fetchRepos:', error);
    throw error;
  }
};

// Execute the function
fetchRepos().catch(error => {
  console.error('Failed to fetch repositories:', error);
  process.exit(1);
});