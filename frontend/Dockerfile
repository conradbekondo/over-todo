FROM oven/bun:canary-alpine AS build

RUN bun install -g @angular/cli

WORKDIR /app

COPY bun.lock .
COPY package.json .
COPY angular.json .

RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:latest AS stage

COPY --from=build /app/dist/ /usr/share/nginx/html/frontend/