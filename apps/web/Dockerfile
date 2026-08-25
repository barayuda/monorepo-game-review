FROM node:24-alpine AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN pnpm --filter @game-review/web... install --frozen-lockfile

COPY tsconfig.base.json ./
COPY apps/web apps/web
COPY packages/contracts packages/contracts

RUN pnpm --filter @game-review/web build

FROM nginx:1.29-alpine AS runtime

# Entrypoint Nginx menjalankan envsubst pada template saat container start,
# sehingga port dan alamat upstream berasal dari environment alih-alih dibekukan
# ke dalam image. Filter dibatasi pada dua variabel ini agar variabel milik
# Nginx sendiri ($host, $uri, dan sejenisnya) tidak ikut tergantikan.
ENV NGINX_ENVSUBST_FILTER="^(PORT|API_UPSTREAM)\$"

# Default menjaga Docker Compose berjalan tanpa konfigurasi tambahan; platform
# hosting menimpanya lewat environment variable.
ENV PORT=80
ENV API_UPSTREAM=api:3000

COPY apps/web/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /workspace/apps/web/dist /usr/share/nginx/html

EXPOSE 80
