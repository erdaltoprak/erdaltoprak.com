// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { SITE_URL } from './src/consts';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import icon from "astro-icon";
import collectionSearch from 'astro-collection-search';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  devToolbar: {
      enabled: false
    },

  integrations: [
    tailwind(), 
    sitemap(),
    expressiveCode({
      // You can set configuration options here
      themes: ['material-theme-darker', 'github-light'],
      styleOverrides: {
        // You can also override styles
        borderRadius: '0.5rem',
        frames: {
        },
      },
      defaultProps: {
          // Enable word wrap by default
          wrap: true,
          // Disable wrapped line indentation for terminal languages
          overridesByLang: {
            'bash,ps,sh': { preserveIndent: false },
          },
        },
      plugins: [pluginLineNumbers()],
    }), 
    icon(),
    collectionSearch()
  ],
});