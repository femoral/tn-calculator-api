FROM node:18-alpine AS base

RUN npm i -g pnpm

FROM base AS build

WORKDIR /app

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm prune --prod

FROM build AS release

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]