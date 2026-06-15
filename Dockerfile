FROM node:lts-alpine AS build
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package*.json pnpm-*.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:lts-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4000
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package*.json pnpm-*.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/build ./build

EXPOSE 4000
CMD ["pnpm", "start"]