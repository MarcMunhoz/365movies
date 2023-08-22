[![Netlify Status](https://api.netlify.com/api/v1/badges/580215fe-180b-48ac-ac58-3a410d8488b6/deploy-status)](https://app.netlify.com/sites/365movies/deploys)

# 365movies

\* Actual Version: 1.0.2

A simple app that searches for movies by title or any information passed in the search form.

Random searches are possible with the "I'm lucky" button".

## Release Notes

**VERSION-2.0.0**
- Nuxt replaced by [Quasar](https://quasar.dev)
- Agenda added
- Little layout changes

**VERSION-1.0.2**

- API changed to [OMDB API](https://www.omdbapi.com) because the previous one blocked access
- Random search removed for now. Maintenance required
- "Movie Not Found" now has a friendly image

**VERSION-1.0.1**

- API changed to [IMDB API](https://imdb-api.com) because the previous one no longer exists
- Search scripts improvements
- About page UX improvements
- Hack to Volar on VScode
- favicon added

**VERSION-1.0.0**

- Project started with [NuxtJS](https://nuxtjs.org)
- Movies API => https://imdb-internet-movie-database-unofficial.p.rapidapi.com

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
```

## Docker

Run it with Docker Compose.

```sh
$ docker-compose -f docker-compose_dev.yaml up -d
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
