# develop stage
FROM node:18-alpine as develop-stage

LABEL author="Marcelo Munhoz <me@marcelomunhoz.com>" \
  version="2.0.0" \
  date_created="2023-07-12"

WORKDIR /app

COPY ["./app/package.json", "./app/yarn.lock", "./"]

RUN apk add exa \
  && yarn global add @quasar/cli \
  && rm -rf /var/cache/apk/* /tmp/* /var/tmp/* /usr/share/man

COPY ./app .

# build stage
FROM develop-stage as build-stage

RUN yarn && yarn build \
  && rm -rf /var/cache/apk/* /tmp/* /var/tmp/* /usr/share/man

# production stage
FROM nginx:1.21-alpine as production-stage

COPY --from=build-stage /app/dist/spa /var/www

COPY ./nginx.conf /etc/nginx/

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
