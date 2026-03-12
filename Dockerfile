# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG PUBLIC_TOPRAK_PROJECT_SLUG=""
ARG PUBLIC_TOPRAK_WRITE_KEY=""

ENV PUBLIC_TOPRAK_PROJECT_SLUG=$PUBLIC_TOPRAK_PROJECT_SLUG
ENV PUBLIC_TOPRAK_WRITE_KEY=$PUBLIC_TOPRAK_WRITE_KEY

RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html

# Keep the runtime Nginx config in the image so local and deployed behavior stay identical.
RUN cat <<'EOF' > /etc/nginx/conf.d/default.conf
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;
  error_page 404 /404.html;

  location = /404.html {
    internal;
  }

  location / {
    try_files $uri $uri/index.html $uri.html =404;
  }
}
EOF

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
