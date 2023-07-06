FROM node:18-alpine
WORKDIR /app

COPY ./dist ./dist
COPY ./node_modules ./node_modules
COPY ./package.json ./package.json

CMD ["node", "dist/index.js"]