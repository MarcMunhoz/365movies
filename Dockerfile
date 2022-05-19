FROM node:16-alpine

LABEL author="Marcelo Munhoz <me@marcelomunhoz.com>" \
  version="1.0.1" \
  date_created="2021-02-12" \
  deploy="2021-02-12"

ARG APP_PATH=/app

ENV PORT=3650

COPY ["package.json", "yarn.lock", "./"]

RUN yarn global add nuxt \
  && yarn \
  && rm -rf /var/cache/apk/* /tmp/* /var/tmp/* /usr/share/man

WORKDIR $APP_PATH

VOLUME $APP_PATH

ENTRYPOINT ["yarn", "dev"]