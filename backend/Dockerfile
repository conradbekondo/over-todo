FROM oven/bun:canary-alpine

COPY package.json bun.lockb ./
RUN bun install --production

COPY . .