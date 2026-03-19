FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
RUN npm run build

FROM alpine:latest

COPY --from=builder /app/dist /dist

CMD ["cp", "-r", "/dist/.", "/output/"]
