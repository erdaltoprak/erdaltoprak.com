# erdaltoprak.com

This website is built with [Astro](https://astro.build/). I've been inspired by [lancerossdev](https://github.com/lancerossdev/web) and the [astro tutorial](https://github.com/withastro/blog-tutorial-demo).


## Project Structure

```
/
├── public/
│   └── assets/
│       └── blog/
│       └── fav/
│       └── other/
├── src/
│   ├── components/
│   ├── layouts/
│   └── pages/
└── config.files
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:3000`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |

## Astro Documentation

Feel free to check [the documentation](https://docs.astro.build)

## License

[MIT License](https://github.com/erdaltoprak/erdaltoprak.com/blob/main/LICENSE)