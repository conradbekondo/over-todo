FROM oven/bun:canary-alpine

COPY package.json bun.lock ./
RUN bun install --production

COPY . .

ENV PORT=3000
ENV BETTER_AUTH_SECRET=some-secret
ENV BETTER_AUTH_URL=http://localhost:${PORT}
ENV DATABASE_URL=

EXPOSE ${PORT}/tcp
ENTRYPOINT ["bun", "run", "start"]