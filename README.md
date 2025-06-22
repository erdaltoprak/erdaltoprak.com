# erdaltoprak.com

> Personal website & knowledge hub of **Erdal Toprak** – built with [Astro](https://astro.build) & deployed on **Cloudflare Pages**.

[![Deploy](https://img.shields.io/github/actions/workflow/status/erdaltoprak/erdaltoprak.com/ga-cfp-deploy.yml?label=Deploy&logo=github)](https://github.com/erdaltoprak/erdaltoprak.com/actions) 
[![License](https://img.shields.io/github/license/erdaltoprak/erdaltoprak.com?color=informational)](LICENSE)

---

## ✨ Key Features

• **Dark/Light Mode** – respects system preference & manual toggle  
• **⌘K Search Overlay** – full-text search (powered by `astro-collection-search`) plus quick actions (share / theme)  
• **Articles & Notes** – content authored in Markdown/MDX, rendered via Astro Content Collections  
• **Dynamic OG Images** – generated at build-time with Satori + Sharp  
• **Static Project Showcase** – curated list in `public/projects.json`  
• **Syntax-Highlighted Code** – via `astro-expressive-code` (Material Darker & GitHub Light)  
• **Utterances Comments** – GitHub–powered discussions  
• **SEO Toolkit** – automatic sitemap & RSS feeds  
• **Zero-config CI/CD** – GitHub Actions → Cloudflare Pages, auto-triggered by content submodule commits

---

## 🔧 Tech Stack

| Layer | Tools |
|-------|-------|
| Framework | Astro 4 + TypeScript |
| Styling   | Tailwind CSS v3 |
| Icons     | `astro-icon` + Iconify sets |
| Search    | `astro-collection-search` |
| Code blocks | `astro-expressive-code` w/ line numbers |
| Images    | Sharp (optimisation) |
| Hosting   | Cloudflare Pages |

---

## 🚀 Quick Start

```bash
# 1. Clone + pull content submodule
$ git clone --recursive https://github.com/erdaltoprak/erdaltoprak.com.git
$ cd erdaltoprak.com

# 2. Install deps (Node 20+)
$ npm install

# 3. Start dev server
$ npm run dev
```

Visit <http://localhost:4321> – changes reload instantly.

### Building

```bash
# Generates OG images then builds static site into ./dist
npm run build
```

### Updating content

The Markdown/MDX sources live in the `src/content` submodule.

```bash
# Pull latest posts from the content repo
git submodule update --remote --merge
```

---

## 📁 Repository Layout

```
├─ src/
│  ├─ components/      # UI building blocks
│  ├─ layouts/         # Page templates
│  ├─ pages/           # Astro routes (Articles, Notes, Projects…)
│  ├─ scripts/         # build-time helpers (generate-og.ts)
│  └─ content/ ⇢ git submodule (Markdown/MDX)
├─ public/             # Static assets & pre-built JSON (projects, social links)
└─ .github/workflows/  # CI/CD pipelines
```

---

## 🛠️ Deployment Pipeline

1. **Push to `main`** → GitHub Action runs on Ubuntu, installs deps, runs `npm run build`.  
2. Artifacts are deployed to **Cloudflare Pages** with `wrangler-action`.  
3. Commits to the `blog-content` repository trigger a repository-dispatch event (`blog_update`) that rebuilds this site automatically.

---

## 🤝 Contributing

PRs & issues are welcome. Ensure commits pass lint & build steps (`npm run build`).

---

## 📄 License

This project is released under the [MIT License](LICENSE).
