# Changelog

All notable changes to this project are documented in this file.

## Releases

### 2.0.0
- Nuxt replaced by [Quasar](https://quasar.dev).
- Agenda added.
- Little layout changes.

### 1.0.2
- API changed to [OMDB API](https://www.omdbapi.com) because the previous one blocked access.
- Random search removed temporarily for maintenance.
- "Movie Not Found" now has a friendly image.

### 1.0.1
- API changed to [IMDB API](https://imdb-api.com) because the previous one no longer exists.
- Search script improvements.
- About page UX improvements.
- Hack for Volar on VS Code.
- Favicon added.

### 1.0.0
- Project started with [NuxtJS](https://nuxtjs.org).
- Movies API: https://imdb-internet-movie-database-unofficial.p.rapidapi.com

## Commit History (through 2026-04-14)


### 2021
- 2021-12-02 - First commit
- 2021-12-02 - Uneeded
- 2021-12-05 - Small config changes: Light mode at start | Prettier print width
- 2021-12-05 - Deleting uneeded files
- 2021-12-05 - New wireframe added
- 2021-12-05 - Footer added
- 2021-12-06 - Navigation added
- 2021-12-06 - Axios added | API tests for omdbapi
- 2021-12-07 - JS => TS | Movie component created
- 2021-12-15 - API data
- 2021-12-16 - Hell's loop

### 2022
- 2022-01-12 - Project updated: No more axios | bootstrap added
- 2022-01-12 - New API aplied: IMDB Unofficial
- 2022-01-13 - Movie year and runtime added
- 2022-01-14 - [Enhancement] Search was separated into two endpoints
- 2022-01-14 - Code comments added
- 2022-01-14 - About page was created
- 2022-01-17 - About page is done. | Watched movies is hide for now
- 2022-01-17 - [bugfix] About page: URL object to string
- 2022-01-17 - Header removed: api-host
- 2022-01-17 - Header adde again: api-host
- 2022-01-18 - Force host & key api to string
- 2022-01-18 - api host included directly into code
- 2022-01-18 - 'Usequerystring' added to headers
- 2022-01-18 - F*k up rapidapi headers
- 2022-01-18 - F*k up rapidapi headers: Part 02
- 2022-01-18 - F*k up rapidapi headers: Part 03
- 2022-01-18 - HEADERS for netlify
- 2022-01-18 - F*k up rapidapi headers: Part 04
- 2022-01-18 - Content-Security-Policy
- 2022-01-18 - F*k up rapidapi headers: Part 05
- 2022-01-18 - Header for scripts-src added
- 2022-01-19 - [CVE FIXES] CVE-2021-3803 | CVE-2020-28469
- 2022-05-04 - New API added to direct search
- 2022-05-06 - [Refactor] API search enhancements
- 2022-05-06 - [Chore] API key changed
- 2022-05-18 - Fetch movie and movie info improvements
- 2022-05-18 - Hack to volar on VScode
- 2022-05-19 - Project version updated => 1.0.1
- 2022-05-19 - favicon updated
- 2022-05-19 - Referenced to 8cb2d19
- 2022-05-19 - UX improvements and code comments
- 2022-05-19 - UX improvements
- 2022-05-19 - Progress loader added
- 2022-05-19 - Netlify deploy status added to the README
- 2022-05-19 - Merge pull request #3 from MarcMunhoz/issue_2
- 2022-06-24 - Fixes CVE-2021-44906 and updates packages
- 2022-11-16 - fix: package.json & yarn.lock to reduce vulnerabilities
- 2022-11-16 - Merge pull request #6 from MarcMunhoz/snyk-fix-883ccb22c1308c1eb9bacaa39eee128c
- 2022-11-16 - Packages upgrade

### 2023
- 2023-01-16 - Fixes CVE-2022-38900 | CVE-2022-46175
- 2023-02-04 - Fixes CVE-2022-25927
- 2023-04-05 - Tests with the new API. '/components/MovieNew.vue'
- 2023-04-06 - OMDB api is applied
- 2023-04-06 - README updated
- 2023-04-06 - Merge pull request #12 from MarcMunhoz/issue_11
- 2023-07-04 - Fixes CVE-2022-25883
- 2023-07-06 - [Enhancements] Search returns a movie list | Lucky search fixed
- 2023-07-07 - SEO enhancements | Calendar added (store movie by day in future)
- 2023-07-10 - Migration to Nuxt Bridge
- 2023-08-19 - Rebuilding with Quasar
- 2023-08-19 - Merge pull request #16 from MarcMunhoz/rebuild_quasar
- 2023-08-19 - Little fixes to production
- 2023-08-22 - [New feature] 'Mark as watched' and 'Delete movie' buttons added to agenda
- 2023-08-22 - README fix
- 2023-09-04 - No caching to compose build
- 2023-09-04 - [New feature] Streaming list
- 2023-09-05 - [Page Agenda] Icons descriptions
- 2023-09-05 - Showing spinner to add movie due to possible slowness
- 2023-09-06 - [New feature] Select Country
- 2023-09-11 - Search by streaming services || Added a Local Storage for the countries list available in the Streaming DB
- 2023-09-15 - Apllying Composition API
- 2023-09-18 - [Composition API] Apllying Composition API - Part 02
- 2023-09-19 - [Movies compononent] Fixes Watch hook
- 2023-09-21 - Boot Axios removed couz it works with Options API only
- 2023-09-21 - AAxios instance in component directly || Fixing some consts naming conflicts
- 2023-10-09 - Edit movie watch date on Agenda
- 2023-10-10 - A way to prevent multiple events with identical dates
- 2023-10-10 - Fixes CVE-2023-44270
- 2023-10-10 - [Layout fix] Edit dialog
- 2023-10-10 - Merge pull request #20 from MarcMunhoz/fix_cves
- 2023-10-12 - [Bug fix] Page not found on page reload
- 2023-10-12 - [Bug fix] Page not found on page reload - V2
- 2023-10-12 - [Layout fix] Footer ajusted for mid screens
- 2023-10-25 - [ENHANCEMENT] Select 'streaming in...' by a select field

### 2025
- 2025-02-25 - Express added as middleware
- 2025-02-25 - Express setup
- 2025-02-27 - Netlifly functions
- 2025-02-27 - Quasar and Vite upgrade
- 2025-02-28 - Packages upgrade
- 2025-03-04 - Card Movie info
- 2025-03-04 - Twiiter info removed
- 2025-03-05 - Dockerfile text case syntax | [DevServer] Polling for WSL
- 2025-03-05 - Movies info: Spinner added, runtime fix
- 2025-03-06 - Composable for retrieving movies data
- 2025-03-06 - Movie Providers, initial setup
- 2025-03-07 - Acttions buttons
- 2025-03-07 - Getting movie trailer
- 2025-03-10 - Trailers Dialog is done
- 2025-03-11 - [UX enhancements] Spinner to wait for movie loading
- 2025-03-11 - Removing old code | 'Im lucky button' | Ordering movie list increasing
- 2025-03-11 - List View for Agenda. Needs some fixes
- 2025-03-13 - Update markWatch and delMovieAgenda to sync changes in both Calendar and Table views
- 2025-03-13 - [Page Agenda] Watch Date added to table | sort list
- 2025-03-13 - Update editMovieAgenda to sync changes in both Calendar and Table views
- 2025-03-14 - New component (AddMovie), needs fixes and renaming | Countries list from new api
- 2025-03-15 - Modal Add/Edit Movie | Getting watch providers for every movie and country
- 2025-03-17 - Agenda Dialog: Shows up only available countries for each movie
- 2025-03-17 - Agenda Dialog: Streaming list okay. Needs button add action
- 2025-04-15 - Add to calendar button
- 2025-04-15 - New Util: Date Today
- 2025-04-16 - Agenda/Add Movie enhancements
- 2025-04-16 - Add/Edit dialog: little changes
- 2025-04-17 - Static images moved to public folder
- 2025-04-17 - New folder aliases
- 2025-04-17 - Movies component refactory || Add/Edit component enchancements
- 2025-04-22 - Changes movie adding/editing workflow
- 2025-04-24 - Adjustments to movie action buttons || Adjustments to Agenda info
- 2025-04-24 - Agenda: Options API converted to Composition API

### 2026
- 2026-04-14 - refactor(router): Update page component route targets
- 2026-04-14 - chore(repo): Update local development configuration
- 2026-04-14 - fix(security): Upgrade runtime images and dependency locks
