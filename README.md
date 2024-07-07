
# erdaltoprak.com

This website is built with [Astro](https://astro.build/). I've been inspired by the [astro tutorial](https://github.com/withastro/blog-tutorial-demo).

## Project Structure

```
project-root/
├── app/
│   ├── astro.config.mjs
│   ├── .node-version
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   │   ├── assets/
│   │   │   ├── blog/
│   │   │   ├── fav/
│   │   │   ├── other/
│   │   └── ...
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── ...
│   ├── tailwind.config.cjs
│   ├── tsconfig.json
│   ├── yarn.lock
├── docker-compose.yml
├── Dockerfile
├── .git/
├── .gitignore
└── README.md
```

Astro looks for `.astro` or `.md` files in the `app/src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `app/src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `app/public/` directory.

## Commands

All commands are run from the `app` directory, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `host:4321`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |

## Docker Setup

This project is set up to run in a Docker container for a consistent development environment.

### Dockerfile

The `Dockerfile` defines the Docker image and sets up the environment for the Astro project.

```Dockerfile
# Dockerfile
# Use the official Node.js 18.20.3 image.
FROM node:18.20.3

# Create and change to the app directory.
WORKDIR /app

# Install dependencies.
COPY app/package*.json ./
RUN npm install

# Copy the rest of the application.
COPY app/ .

# Expose the port the app runs on
EXPOSE 3000

# Start the project in development mode.
CMD ["npm", "run", "dev"]
```

### docker-compose.yml

The `docker-compose.yml` file defines the services, volumes, and ports for Docker Compose.

```yaml
version: '3.8'

services:
  astro-app:
    build: .
    ports:
      - "3000:4321"
    volumes:
      - ./app:/app
      - /app/node_modules
    environment:
      NODE_ENV: development
```

### Running the Application

1. **Build and start the Docker container**:

   ```sh
   docker compose up --build
   ```

2. **Access the application**:

   Open a browser and navigate to `http://IP:3000` to see your running Astro application.

### Cleaning Up

To stop and remove the Docker containers:

```sh
docker compose down
```

## Astro Documentation

Feel free to check [the documentation](https://docs.astro.build).

## License

[MIT License](https://github.com/erdaltoprak/erdaltoprak.com/blob/main/LICENSE)
