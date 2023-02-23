import { defineConfig } from 'astro/config';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
import compress from "astro-compress";

// https://astro.build/config

// https://astro.build/config
export default defineConfig({
  site: "https://erdaltoprak.com",
  base: "/",
  integrations: [
    tailwind(), 
    sitemap(), 
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }), 
    compress({
      css: true,
      html: true,
      js: true,
      img: false,
      svg: true,
      logger: 0,
    }),
  ]
});