# develop stage
FROM node:22.22-bookworm-slim AS develop-stage

LABEL author="Marcelo Munhoz <me@marcelomunhoz.com>" \
  version="2.4.0" \
  date_created="2023-07-12"

WORKDIR /app

COPY ["./app/package.json", "./app/yarn.lock", "./"]

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    libasound2 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnss3 \
    libu2f-udev \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    libxss1 \
    xvfb \
  && yarn global add @quasar/cli \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/man

COPY ./app .

# build stage
FROM develop-stage AS build-stage

RUN yarn && yarn build \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/man

# production stage
FROM nginx:1.29-alpine AS production-stage

COPY --from=build-stage /app/dist/spa /var/www

COPY ./nginx.conf /etc/nginx/

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
