---
title: 'Website redesign v2'
pubDate: '2024-12-27'
description: 'A redesign of my website with static search, themes, and more'
author: 'Erdal Toprak'
heroImage: '../../assets/blog/12/banner.png'
type: 'notes'
id: 12
---

![Banner](../../assets/blog/12/banner.png)

In 2021, I started this website with [Astro](https://astro.build/). It's an all-in-one web framework that ships with the less JS, is UI agnostic, and has a great developer experience.

Since the first version, my goal has been to make this website search-friendly, like a small wiki for the things I've learned and the things I'm passionate about.

## Release Notes

#### Homepage

I redesigned the homepage to be more modern and complete with the latest blog posts and projects. The layout maximizes the space for the content and the images.


| ![Old Homepage](../../assets/blog/12/homepage-old.png) |
|:--:|
| *Old Homepage* |

| ![New Homepage](../../assets/blog/12/homepage-new.png) |
|:--:|
| *New Homepage* |

#### Blog

I've been thinking for a long time about how to separate the blog posts depending on the type. For example, I have some posts that are more like notes, meaning they are more like thoughts, ideas, and reflections. On the other hand, I have some posts that are more like tutorials, meaning they are more like step-by-step guides. 

On this version, I've added the `type` field to the frontmatter of the blog posts. This reflects on the blog page where you can now filter the posts by type.

| ![Old Blog](../../assets/blog/12/blog-old.png) |
|:--:|
| *Old Blog* |

| ![New Blog](../../assets/blog/12/blog-new.png) |
|:--:|
| *New Blog* |

In the blog layout, I added the [Expressive Code](https://expressive-code.com) plugin to enhance the code blocks with syntax highlighting (and a lot more).

| ![Old Blog Layout](../../assets/blog/12/blog-layout-old.png) |
|:--:|
| *Old Blog Layout* |

| ![New Blog Layout](../../assets/blog/12/blog-layout-new.png) |
|:--:|
| *New Blog Layout* |

#### Theme

The default theme is the system theme. While coding for dark mode was straightforward, getting the light theme to look good and readable for longer content was challenging. However, I think I've found a good balance

| ![Dark Theme](../../assets/blog/12/homepage-new.png) | ![Light Theme](../../assets/blog/12/homepage-new-light.png) |
|:--:|:--:|
| *Dark Theme* | *Light Theme* |

#### Projects

One of the pages with the most improvements is the projects page. On build, I've added a script to fetch the projects from my GitHub repositories and display them on the page.

```js
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
```

I've also made the same scripts for HuggingFace collections, datasets and models. This allows me to keep the website static and mostly up to date while adding the latest projects automatically.

| ![Old Projects](../../assets/blog/12/projects-old.png) | ![New Projects](../../assets/blog/12/projects-new.png) |
|:--:|:--:|
| *Old Projects* | *New Projects* |


#### About

The about page is now more than a simple presentation of myself. I've added publications and appearances. There is also an extensive list of social links where you can find me. 

The best thing about this page is a little code trick: when visitors click on the city name, it checks their User-Agent and redirects them to either the Apple Maps app or website.

| ![Old About](../../assets/blog/12/about-old.png) | ![New About](../../assets/blog/12/about-new.png) |
|:--:|:--:|
| *Old About* | *New About* |


#### Search

While browsing [Astro Integrations](https://astro.build/integrations/), I stumbled upon [astro-collection-search](https://github.com/trebco/astro-collection-search), and it was exactly what I was looking for. This tool allows you to search through the [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/). The repository includes examples, and the integration is very easy to set up.

I've always loved the `cmd+k` shortcut to search through content on wikis like the [Tailwind CSS documentation](https://tailwindcss.com/docs/installation). This is the first time I've implemented it on my website, and I am very happy with the results.

There are many small UX improvements that make the search better. For example, the search input immediately gains focus, arrow keys can be used to navigate through the results, and the first result can be opened by pressing the enter key.

| ![Search Blank](../../assets/blog/12/search-blank.png) |
|:--:|
| *Search Initial State* |

The search textfield looks at blog post titles, content and sorts by relevance.

| ![Search Results](../../assets/blog/12/search-partial.png) |
|:--:|
| *Search Results* |

The last improvement in the search bar is the share button that appears on the initial state before the user starts typing. This allows the user to share the current search results with a link. This clever little feature is thanks to [`share()` method of the Navigator interface](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share).

Here is the code for the search component:

```js
// Share functionality
async function sharePage() {
  const shareData = {
    title: document.querySelector('meta[property="og:title"]')?.getAttribute('content') || document.title,
    url: window.location.href,
  };
  console.log(shareData);

  try {
    // First check if Web Share API is supported
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    // Fallback to clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(window.location.href);
      showNotification('URL copied to clipboard!');
      return;
    }

    // Last resort fallback using execCommand
    const textArea = document.createElement('textarea');
    textArea.value = window.location.href;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      showNotification('URL copied to clipboard!');
    } catch (err) {
      console.error('Fallback clipboard copy failed:', err);
      showNotification('Failed to copy URL. Please copy it manually.');
    } finally {
      textArea.remove();
    }
  } catch (err) {
    console.error('Error sharing:', err);
    showNotification('Failed to share page');
  }
}
```

And this is how it looks like in Safari

| ![Search](../../assets/blog/12/search-share.png) |
|:--:|
| *Search* |

## Conclusion

This is the first redesign of my website since 2021. I'm very happy with the results, the search is a great addition mainly for my own use to reference things quickly. If you want to see the code and try it out, you can find it on [GitHub](https://github.com/erdaltoprak/erdaltoprak.com).
