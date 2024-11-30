# Stage 1: Build Stage
FROM oven/bun:latest as build

WORKDIR /app
COPY bun.lockb package.json ./
RUN bun install
COPY . .
RUN bun run build

# Stage 2: Production Stage
FROM oven/bun:latest
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/bun.lockb ./bun.lockb
RUN bun install --production

EXPOSE 3000

# We are so back
CMD ["bun", "build/index.js"]
