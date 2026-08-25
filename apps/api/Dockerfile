FROM node:24-alpine AS workspace

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json

FROM workspace AS production-dependencies

RUN pnpm --filter @game-review/api... install --prod --frozen-lockfile --ignore-scripts

FROM workspace AS build

RUN pnpm install --frozen-lockfile

COPY tsconfig.base.json ./
COPY apps/api apps/api
COPY packages/contracts packages/contracts

RUN pnpm --filter @game-review/api build

FROM node:24-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /workspace

COPY --from=production-dependencies /workspace/node_modules node_modules
COPY --from=production-dependencies /workspace/apps/api/node_modules apps/api/node_modules
COPY apps/api/package.json apps/api/package.json
COPY packages/contracts packages/contracts
COPY --from=build /workspace/apps/api/dist apps/api/dist

# Image node:24-alpine sudah menyediakan user non-root `node`; aplikasi tidak menulis apa pun ke disk.
USER node

EXPOSE 3000

CMD ["node", "apps/api/dist/index.js"]
