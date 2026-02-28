# erdaltoprak.com

Personal website of [Erdal Toprak](https://erdaltoprak.com), built with [Astro](https://astro.build).

[![Build](https://img.shields.io/github/actions/workflow/status/erdaltoprak/erdaltoprak.com/ci-build-push.yml?label=Build&logo=github)](https://github.com/erdaltoprak/erdaltoprak.com/actions)
[![License](https://img.shields.io/github/license/erdaltoprak/erdaltoprak.com?color=informational)](LICENSE)

## Overview

This repository contains the application code for the site:

- Astro 5 static site with view transitions
- unified blog archive with articles and notes under `/blog`
- client-side full-text search powered by MiniSearch
- generated Open Graph images for blog posts
- RSS, sitemap, `llms.txt`, and internal link validation in the build
- Docker + Nginx setup for local production-like preview

## Stack

| Layer | Tools |
| --- | --- |
| Framework | Astro 5 + TypeScript |
| Styling | Tailwind CSS |
| Search | MiniSearch |
| Icons | `astro-icon` + Iconify sets |
| Code blocks | `astro-expressive-code` |
| Image generation | Sharp, Satori, Resvg |
| Runtime | Static files served by Nginx |

## Local Development

### Requirements

- Node.js 20+
- npm
- Docker and Docker Compose for the containerized preview
- Git submodules enabled

### Start in dev mode

```bash
git clone --recursive https://github.com/erdaltoprak/erdaltoprak.com.git
cd erdaltoprak.com
npm install
npm run dev
```

Astro dev server runs on `http://localhost:4321`.

### Start the local production build

```bash
docker compose up -d --build
```

The Nginx-served site is available on `http://localhost:8080`.

## Build

```bash
npm run build
```

The build does more than `astro build`. It also:

- generates OG images into `public/og/`
- generates `public/llms.txt`
- generates the search index in `public/$collection-search/`
- builds the static site into `dist/`
- validates internal links across generated HTML

Additional checks:

```bash
npm run check:astro
npm run check:links
```

## Content

The Markdown and MDX source content lives in the `src/content` git submodule.

To update it:

```bash
git submodule update --init --recursive --remote
```

## Repository Layout

```text
.
├── public/                # static assets, generated search index, generated llms.txt
├── src/
│   ├── components/        # reusable UI pieces
│   ├── layouts/           # page and post layouts
│   ├── pages/             # Astro routes
│   ├── scripts/           # build-time generators and checks
│   ├── utils/             # shared helpers
│   └── content/           # git submodule with blog content
├── nginx/                 # Nginx config for the runtime image
├── Dockerfile             # multi-stage build for static deployment
└── docker-compose.yml     # local production-style preview
```

## License

Released under the [MIT License](LICENSE).
