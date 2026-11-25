# Dependency security baseline

The baseline uses the original application lockfile at `7aae3cf` and the 67 open Dependabot alert records captured for issue #53. The Node 22 project Docker image ran `yarn audit --groups "dependencies devDependencies" --json --registry https://registry.npmjs.org` before any dependency updates.

Yarn returned severity bitmask 30 and reported 113 advisory path occurrences across 1,164 dependencies. The occurrences included 3 critical, 50 high, 47 moderate, and 13 low. Scope labels in the Dependabot table come from its dependency graph.

## Dependabot records

| Alert | Advisory | Severity | Dependency | Scope | Affected range | First patched version |
| --- | --- | --- | --- | --- | --- | --- |
| 157 | GHSA-r4gj-5m52-g5wh | high | axios | runtime | >= 1.17.0, < 1.20.0 | 1.20.0 |
| 158 | GHSA-c29m-xwm3-cm6r | high | axios | runtime | >= 1.16.1, < 1.20.0 | 1.20.0 |
| 159 | GHSA-x97p-jq2g-jp4f | high | axios | runtime | >= 1.15.1, < 1.20.0 | 1.20.0 |
| 160 | GHSA-m8m8-qj5v-23w3 | high | axios | runtime | >= 1.15.2, < 1.20.0 | 1.20.0 |
| 161 | GHSA-mghh-pgcx-3jjj | high | axios | runtime | >= 1.15.0, < 1.20.0 | 1.20.0 |
| 162 | GHSA-44g4-m2mj-wpvx | medium | axios | runtime | >= 1.15.0, < 1.20.0 | 1.20.0 |
| 163 | GHSA-542g-h47m-68v8 | high | axios | runtime | >= 1.13.0, < 1.20.0 | 1.20.0 |
| 164 | GHSA-3pq3-5fj3-cg6v | high | axios | runtime | >= 1.13.0, < 1.20.0 | 1.20.0 |
| 165 | GHSA-4hqw-qxg8-jxx2 | medium | axios | runtime | >= 1.12.0, < 1.20.0 | 1.20.0 |
| 166 | GHSA-xjh9-v7x6-24jw | high | @fastify/busboy | runtime | >= 3.1.0, < 3.2.1 | 3.2.1 |
| 167 | GHSA-j8rh-479h-cp32 | medium | axios | runtime | >= 1.0.0, < 1.20.0 | 1.20.0 |
| 168 | GHSA-pqg4-j6r4-53mv | critical | shell-quote | runtime | >= 1.8.4, < 1.11.0 | 1.11.0 |
| 169 | GHSA-86w9-cpqp-85rv | high | node-forge | development | <= 1.4.0 | none |
| 170 | GHSA-fh39-c73x-5pjv | high | @quasar/ssl-certificate | development | <= 2.0.0 | 2.1.0 |
| 171 | GHSA-r5mf-4r5x-q78f | high | @quasar/render-ssr-error | development | <= 2.2.3 | 2.2.4 |
| 173 | GHSA-q9mq-245r-4g93 | medium | @quasar/app-vite | development | >= 1.0.0, <= 3.2.0 | 3.3.0 |
| 175 | GHSA-5m6h-8g35-p3m7 | high | @quasar/app-vite | development | <= 3.2.0 | 3.3.0 |
| 177 | GHSA-fh39-c73x-5pjv | high | @quasar/app-vite | development | <= 3.2.0 | 3.3.0 |
| 179 | GHSA-r5mf-4r5x-q78f | high | @quasar/app-vite | development | <= 3.2.0 | 3.3.0 |
| 180 | GHSA-68fv-2mgg-jv7q | high | source-map-js | runtime | >= 1.0.0, < 1.2.2 | 1.2.2 |
| 183 | GHSA-8r9p-f939-6h3c | high | follow-redirects | runtime | >= 1.16.0, < 1.16.1 | 1.16.1 |
| 184 | GHSA-q3jh-wrc6-jgq8 | high | follow-redirects | runtime | >= 1.16.0, < 1.16.1 | 1.16.1 |
| 185 | GHSA-698v-4r3x-3vcv | medium | vite | development | >= 7.0.0, <= 7.3.6 | 7.3.7 |
| 186 | GHSA-587h-7wmj-h5pm | high | vite | development | >= 7.0.0, <= 7.3.6 | 7.3.7 |
| 187 | GHSA-r825-w8mm-5pxw | medium | vite | development | >= 7.0.0, <= 7.3.6 | 7.3.7 |
| 188 | GHSA-xp26-3454-mjgp | medium | @vitest/mocker | development | >= 4.1.11, < 4.1.12 | 4.1.12 |
| 189 | GHSA-9jrq-w75r-8gcw | low | vite | development | >= 7.0.0, <= 7.3.6 | 7.3.7 |
| 190 | GHSA-rq7h-c2jc-7f22 | medium | vite | development | >= 7.0.0, <= 7.3.6 | 7.3.7 |
| 191 | GHSA-qxg6-89mg-rqv8 | medium | @vitest/mocker | development | >= 2.1.0-beta.7, < 4.1.12 | 4.1.12 |
| 192 | GHSA-834v-8h66-3h79 | high | happy-dom | development | >= 17.0.0, <= 21.0.3 | 21.0.4 |
| 193 | GHSA-wjr9-j795-jxcr | medium | fast-uri | development | >= 3.1.3, < 3.1.9 | 3.1.9 |
| 194 | GHSA-333x-w4r6-6crp | low | fast-uri | development | >= 3.0.0, < 3.1.9 | 3.1.9 |
| 195 | GHSA-w74x-v6f9-j3xg | medium | fast-uri | development | >= 3.0.0, < 3.1.9 | 3.1.9 |
| 196 | GHSA-xhq7-xmqj-769h | low | fast-uri | development | >= 3.0.0, < 3.1.9 | 3.1.9 |
| 198 | GHSA-4vjg-vx72-qq4g | low | systeminformation | development | < 5.33.14 | 5.33.14 |
| 199 | GHSA-7648-jmwf-vw7j | medium | systeminformation | development | < 5.33.13 | 5.33.13 |
| 200 | GHSA-c8p4-j97h-3vg8 | high | happy-dom | development | <= 20.14.6 | 21.0.0 |
| 201 | GHSA-5fpq-26gf-qwcr | medium | happy-dom | development | <= 20.14.5 | 20.14.6 |
| 202 | GHSA-3f7j-7jwc-fxfj | high | systeminformation | development | < 5.33.16 | 5.33.16 |
| 203 | GHSA-h46v-rmh6-fq4f | medium | node-forge | development | <= 1.4.0 | 1.4.1 |
| 204 | GHSA-9wg5-mj3p-v49q | low | node-forge | development | <= 1.4.0 | 1.4.1 |
| 205 | GHSA-6qrw-m8cv-hcxf | high | node-forge | development | <= 1.4.0 | 1.4.1 |
| 206 | GHSA-j8rw-jp99-435v | medium | node-forge | development | <= 1.4.2 | 1.4.3 |
| 207 | GHSA-w4xr-hqv8-ch44 | medium | node-forge | development | <= 1.4.2 | 1.4.3 |
| 208 | GHSA-6889-vf6x-f3g5 | low | node-forge | development | <= 1.4.2 | 1.4.3 |
| 210 | GHSA-2vgq-wchc-25w7 | low | node-forge | development | <= 1.4.0 | 1.4.1 |
| 211 | GHSA-9fr6-4gfg-395g | medium | axios | runtime | >= 1.0.0, < 1.20.0 | 1.20.0 |
| 212 | GHSA-vh66-26gq-q6x8 | medium | axios | runtime | >= 1.7.0, < 1.20.0 | 1.20.0 |
| 213 | GHSA-x8mw-p69m-v3mx | high | @fastify/busboy | runtime | >= 1.0.0, < 3.2.1 | 3.2.1 |
| 214 | GHSA-gxm5-99cw-xjw9 | medium | @fastify/busboy | runtime | < 3.2.2 | 3.2.2 |
| 215 | GHSA-g2v6-rqmx-r4w6 | high | @vue/server-renderer | runtime | < 3.5.42 | 3.5.42 |
| 216 | GHSA-vc2v-76pw-4v95 | high | compression | development | < 1.8.2 | 1.8.2 |
| 217 | GHSA-jqcg-44mw-7w3h | critical | proxy-addr | runtime | >= 1.1.0, < 2.0.8 | 2.0.8 |
| 218 | GHSA-27r3-jxmh-p828 | high | body-parser | runtime | < 1.20.9 | 1.20.9 |
| 219 | GHSA-m5mm-p8h7-m29v | low | serialize-javascript | development | < 7.1.3 | 7.1.3 |
| 220 | GHSA-rj75-hqrm-r3gf | medium | postcss-selector-parser | development | < 6.1.5 | 6.1.5 |
| 221 | GHSA-6pq8-jhm2-2vcw | medium | qs | runtime | >= 6.7.0, <= 6.16.0 | 6.16.1 |
| 222 | GHSA-mrwp-f3q8-3g9p | high | follow-redirects | runtime | >= 1.16.0, <= 1.16.1 | 1.16.2 |
| 223 | GHSA-5x38-2vff-x55p | high | node-forge | development | <= 1.4.0 | 1.4.1 |
| 225 | GHSA-8hrf-8g6f-7xwp | high | node-forge | development | <= 1.4.0 | 1.4.1 |
| 226 | GHSA-jc66-7q78-782g | high | node-forge | development | <= 1.4.0 | 1.4.1 |
| 227 | GHSA-5cwg-6vw7-rj6p | medium | node-forge | development | <= 1.4.0 | 1.4.1 |
| 228 | GHSA-4487-j8r4-4g2f | low | node-forge | development | <= 1.4.0 | 1.4.1 |
| 231 | GHSA-525v-9gp9-w22h | medium | node-forge | development | <= 1.4.0 | 1.4.1 |
| 232 | GHSA-6wvx-3r32-xmcg | medium | node-forge | development | <= 1.4.0 | 1.4.1 |
| 233 | GHSA-4642-5mcj-2rqw | low | node-forge | development | <= 1.4.0 | 1.4.1 |
| 236 | GHSA-g3hv-75wg-m249 | medium | minimatch | development | >= 7.0.0, < 11.0.1 | 11.0.1 |

## Container audit paths

The audit reported 74 distinct advisories across the path occurrences. The table groups findings by advisory and package.

| Advisory | Package | Severity | Version | Affected range | Patch range | Reported paths |
| --- | --- | --- | --- | --- | --- | --- |
| GHSA-27r3-jxmh-p828 | body-parser | high | 1.20.6 | <1.20.9 | >=1.20.9 | `@quasar/app-vite>express>body-parser`<br>`express>body-parser` |
| GHSA-2vgq-wchc-25w7 | node-forge | low | 1.4.0 | <=1.4.0 | >=1.4.1 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-333x-w4r6-6crp | fast-uri | low | 3.1.8 | >=3.0.0 <3.1.9 | >=3.1.9 | `workbox-build>ajv>fast-uri` |
| GHSA-3f7j-7jwc-fxfj | systeminformation | high | 5.33.0 | <5.33.16 | >=5.33.16 | `cypress>systeminformation` |
| GHSA-3g3m-2fjr-6pw4 | glob | moderate | 10.5.0, 11.1.0, 13.0.6 | >=9.0.0 <=14.0.1 | >=14.0.2 | `@quasar/app-vite>archiver>archiver-utils>glob`<br>`@quasar/app-vite>archiver>zip-stream>archiver-utils>glob`<br>`@quasar/quasar-app-extension-testing-e2e-cypress>vite-plugin-istanbul>test-exclude>glob`<br>`@vue/test-utils>js-beautify>glob`<br>`workbox-build>glob` |
| GHSA-3pq3-5fj3-cg6v | axios | high | 1.18.1 | >=1.13.0 <1.20.0 | >=1.20.0 | `@quasar/quasar-app-extension-testing-e2e-cypress>start-server-and-test>wait-on>axios`<br>`axios` |
| GHSA-4487-j8r4-4g2f | node-forge | low | 1.4.0 | <=1.4.0 | >=1.4.1 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-44g4-m2mj-wpvx | axios | moderate | 1.18.1 | >=1.15.0 <1.20.0 | >=1.20.0 | `@quasar/quasar-app-extension-testing-e2e-cypress>start-server-and-test>wait-on>axios`<br>`axios` |
| GHSA-4528-x5fx-h6hg | joi | high | 18.2.9 | >=18.0.0 <18.3.1 | >=18.3.1 | `@quasar/quasar-app-extension-testing-e2e-cypress>start-server-and-test>wait-on>joi` |
| GHSA-4642-5mcj-2rqw | node-forge | low | 1.4.0 | <=1.4.0 | >=1.4.1 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-4hqw-qxg8-jxx2 | axios | moderate | 1.18.1 | >=1.12.0 <1.20.0 | >=1.20.0 | `@quasar/quasar-app-extension-testing-e2e-cypress>start-server-and-test>wait-on>axios`<br>`axios` |
| GHSA-4vjg-vx72-qq4g | systeminformation | low | 5.33.0 | <5.33.14 | >=5.33.14 | `cypress>systeminformation` |
| GHSA-525v-9gp9-w22h | node-forge | moderate | 1.4.0 | <=1.4.0 | >=1.4.1 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-542g-h47m-68v8 | axios | high | 1.18.1 | >=1.13.0 <1.20.0 | >=1.20.0 | `@quasar/quasar-app-extension-testing-e2e-cypress>start-server-and-test>wait-on>axios`<br>`axios` |
| GHSA-587h-7wmj-h5pm | vite | high | 7.3.6 | >=7.0.0 <=7.3.6 | >=7.3.7 | `@quasar/app-vite>vite`<br>`vite` |
| GHSA-5cwg-6vw7-rj6p | node-forge | moderate | 1.4.0 | <=1.4.0 | >=1.4.1 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-5fpq-26gf-qwcr | happy-dom | moderate | 20.11.0 | <=20.14.5 | >=20.14.6 | `@quasar/quasar-app-extension-testing-unit-vitest>happy-dom` |
| GHSA-5m6h-8g35-p3m7 | @quasar/app-vite | high | 2.4.0 | <=3.2.0 | >=3.3.0 | `@quasar/app-vite` |
| GHSA-5x38-2vff-x55p | node-forge | high | 1.4.0 | <=1.4.0 | >=1.4.1 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-6889-vf6x-f3g5 | node-forge | low | 1.4.0 | <=1.4.2 | >=1.4.3 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-68fv-2mgg-jv7q | source-map-js | high | 1.2.1 | >=1.0.0 <1.2.2 | >=1.2.2 | `postcss>source-map-js`<br>`vite>postcss>source-map-js`<br>`vue>@vue/compiler-dom>@vue/compiler-core>source-map-js`<br>`vue>@vue/compiler-sfc>@vue/compiler-dom>@vue/compiler-core>source-map-js`<br>`vue>@vue/compiler-sfc>@vue/compiler-ssr>@vue/compiler-dom>@vue/compiler-core>source-map-js` |
| GHSA-698v-4r3x-3vcv | vite | moderate | 7.3.6 | >=7.0.0 <=7.3.6 | >=7.3.7 | `@quasar/app-vite>vite`<br>`vite` |
| GHSA-6cv4-p8m7-4r25 | node-forge | moderate | 1.4.0 | >=0.1.2 <=1.4.2 | >=1.4.3 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-6pq8-jhm2-2vcw | qs | moderate | 6.16.0 | >=6.7.0 <=6.16.0 | >=6.16.1 | `@quasar/app-vite>express>body-parser>qs`<br>`express>body-parser>qs`<br>`express>qs` |
| GHSA-6qrw-m8cv-hcxf | node-forge | high | 1.4.0 | <=1.4.0 | >=1.4.1 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-6wvx-3r32-xmcg | node-forge | moderate | 1.4.0 | <=1.4.0 | >=1.4.1 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-7648-jmwf-vw7j | systeminformation | moderate | 5.33.0 | <5.33.13 | >=5.33.13 | `cypress>systeminformation` |
| GHSA-7wch-p9px-956x | node-forge | high | 1.4.0 | <=1.4.0 | >=1.4.1 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-834v-8h66-3h79 | happy-dom | high | 20.11.0 | >=17.0.0 <=21.0.3 | >=21.0.4 | `@quasar/quasar-app-extension-testing-unit-vitest>happy-dom` |
| GHSA-86w9-cpqp-85rv | node-forge | high | 1.4.0 | <=1.4.0 | <0.0.0 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-8hrf-8g6f-7xwp | node-forge | high | 1.4.0 | <=1.4.0 | >=1.4.1 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-8r9p-f939-6h3c | follow-redirects | high | 1.16.0 | >=1.16.0 <1.16.1 | >=1.16.1 | `@quasar/quasar-app-extension-testing-e2e-cypress>start-server-and-test>wait-on>axios>follow-redirects`<br>`axios>follow-redirects` |
| GHSA-9fr6-4gfg-395g | axios | moderate | 1.18.1 | >=1.0.0 <1.20.0 | >=1.20.0 | `@quasar/quasar-app-extension-testing-e2e-cypress>start-server-and-test>wait-on>axios`<br>`axios` |
| GHSA-9jrq-w75r-8gcw | vite | low | 7.3.6 | >=7.0.0 <=7.3.6 | >=7.3.7 | `@quasar/app-vite>vite`<br>`vite` |
| GHSA-9wg5-mj3p-v49q | node-forge | low | 1.4.0 | <=1.4.0 | >=1.4.1 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-c29m-xwm3-cm6r | axios | high | 1.18.1 | >=1.16.1 <1.20.0 | >=1.20.0 | `@quasar/quasar-app-extension-testing-e2e-cypress>start-server-and-test>wait-on>axios`<br>`axios` |
| GHSA-c8p4-j97h-3vg8 | happy-dom | high | 20.11.0 | <=20.14.6 | >=21.0.0 | `@quasar/quasar-app-extension-testing-unit-vitest>happy-dom` |
| GHSA-fh39-c73x-5pjv | @quasar/app-vite | high | 2.4.0 | <=3.2.0 | >=3.3.0 | `@quasar/app-vite` |
| GHSA-fh39-c73x-5pjv | @quasar/ssl-certificate | high | 1.0.0 | <=2.0.0 | >=2.1.0 | `@quasar/app-vite>@quasar/ssl-certificate` |
| GHSA-g2v6-rqmx-r4w6 | @vue/server-renderer | high | 3.5.40 | <3.5.42 | >=3.5.42 | `vue>@vue/server-renderer` |
| GHSA-g3hv-75wg-m249 | minimatch | moderate | 10.2.5, 10.2.6, 9.0.9 | >=7.0.0 <11.0.1 | >=11.0.1 | `@quasar/app-vite>archiver>archiver-utils>glob>minimatch`<br>`@quasar/app-vite>archiver>zip-stream>archiver-utils>glob>minimatch`<br>`@quasar/quasar-app-extension-testing-e2e-cypress>vite-plugin-istanbul>test-exclude>glob>minimatch`<br>`@quasar/quasar-app-extension-testing-e2e-cypress>vite-plugin-istanbul>test-exclude>minimatch`<br>`@vue/test-utils>js-beautify>editorconfig>minimatch`<br>`workbox-build>glob>minimatch` |
| GHSA-gxm5-99cw-xjw9 | @fastify/busboy | moderate | 3.2.0 | <3.2.2 | >=3.2.2 | `@netlify/blobs>@netlify/dev-utils>@whatwg-node/server>@whatwg-node/fetch>@whatwg-node/node-fetch>@fastify/busboy` |
| GHSA-h46v-rmh6-fq4f | node-forge | moderate | 1.4.0 | <=1.4.0 | >=1.4.1 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-h6cr-wjv9-3cpp | node-forge | low | 1.4.0 | <=1.4.0 | >=1.4.1 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-hqq3-7jhf-c5jx | node-forge | high | 1.4.0 | <=1.4.0 | >=1.4.1 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-j8rh-479h-cp32 | axios | moderate | 1.18.1 | >=1.0.0 <1.20.0 | >=1.20.0 | `@quasar/quasar-app-extension-testing-e2e-cypress>start-server-and-test>wait-on>axios`<br>`axios` |
| GHSA-j8rw-jp99-435v | node-forge | moderate | 1.4.0 | <=1.4.2 | >=1.4.3 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-jc66-7q78-782g | node-forge | high | 1.4.0 | <=1.4.0 | >=1.4.1 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-jqcg-44mw-7w3h | proxy-addr | critical | 2.0.7 | >=1.1.0 <2.0.8 | >=2.0.8 | `@quasar/app-vite>express>proxy-addr`<br>`express>proxy-addr` |
| GHSA-m5mm-p8h7-m29v | serialize-javascript | low | 7.0.7 | <7.1.3 | >=7.1.3 | `@quasar/app-vite>serialize-javascript`<br>`workbox-build>@rollup/plugin-terser>serialize-javascript` |
| GHSA-m8m8-qj5v-23w3 | axios | high | 1.18.1 | >=1.15.2 <1.20.0 | >=1.20.0 | `@quasar/quasar-app-extension-testing-e2e-cypress>start-server-and-test>wait-on>axios`<br>`axios` |
| GHSA-mghh-pgcx-3jjj | axios | high | 1.18.1 | >=1.15.0 <1.20.0 | >=1.20.0 | `@quasar/quasar-app-extension-testing-e2e-cypress>start-server-and-test>wait-on>axios`<br>`axios` |
| GHSA-mrwp-f3q8-3g9p | follow-redirects | high | 1.16.0 | >=1.16.0 <=1.16.1 | >=1.16.2 | `@quasar/quasar-app-extension-testing-e2e-cypress>start-server-and-test>wait-on>axios>follow-redirects`<br>`axios>follow-redirects` |
| GHSA-pqg4-j6r4-53mv | shell-quote | critical | 1.10.0 | >=1.8.4 <1.11.0 | >=1.11.0 | `concurrently>shell-quote` |
| GHSA-q3jh-wrc6-jgq8 | follow-redirects | high | 1.16.0 | >=1.16.0 <1.16.1 | >=1.16.1 | `@quasar/quasar-app-extension-testing-e2e-cypress>start-server-and-test>wait-on>axios>follow-redirects`<br>`axios>follow-redirects` |
| GHSA-q9mq-245r-4g93 | @quasar/app-vite | moderate | 2.4.0 | >=1.0.0 <=3.2.0 | >=3.3.0 | `@quasar/app-vite` |
| GHSA-qxg6-89mg-rqv8 | @vitest/mocker | moderate | 4.1.11 | >=2.1.0-beta.7 <4.1.12 | >=4.1.12 | `vitest>@vitest/mocker` |
| GHSA-r4gj-5m52-g5wh | axios | high | 1.18.1 | >=1.17.0 <1.20.0 | >=1.20.0 | `@quasar/quasar-app-extension-testing-e2e-cypress>start-server-and-test>wait-on>axios`<br>`axios` |
| GHSA-r5mf-4r5x-q78f | @quasar/app-vite | high | 2.4.0 | <=3.2.0 | >=3.3.0 | `@quasar/app-vite` |
| GHSA-r5mf-4r5x-q78f | @quasar/render-ssr-error | high | 1.0.4 | <=2.2.3 | >=2.2.4 | `@quasar/app-vite>@quasar/render-ssr-error` |
| GHSA-r825-w8mm-5pxw | vite | moderate | 7.3.6 | >=7.0.0 <=7.3.6 | >=7.3.7 | `@quasar/app-vite>vite`<br>`vite` |
| GHSA-rhr8-3pm8-cq29 | node-forge | high | 1.4.0 | <=1.4.0 | >=1.4.1 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-rj75-hqrm-r3gf | postcss-selector-parser | moderate | 6.1.4 | <6.1.5 | >=6.1.5 | `tailwindcss>postcss-nested>postcss-selector-parser`<br>`tailwindcss>postcss-selector-parser` |
| GHSA-rq7h-c2jc-7f22 | vite | moderate | 7.3.6 | >=7.0.0 <=7.3.6 | >=7.3.7 | `@quasar/app-vite>vite`<br>`vite` |
| GHSA-vc2v-76pw-4v95 | compression | high | 1.8.1 | <1.8.2 | >=1.8.2 | `@quasar/app-vite>compression` |
| GHSA-vh66-26gq-q6x8 | axios | moderate | 1.18.1 | >=1.7.0 <1.20.0 | >=1.20.0 | `@quasar/quasar-app-extension-testing-e2e-cypress>start-server-and-test>wait-on>axios`<br>`axios` |
| GHSA-w4xr-hqv8-ch44 | node-forge | moderate | 1.4.0 | <=1.4.2 | >=1.4.3 | `@quasar/app-vite>@quasar/ssl-certificate>selfsigned>node-forge` |
| GHSA-w74x-v6f9-j3xg | fast-uri | moderate | 3.1.8 | >=3.0.0 <3.1.9 | >=3.1.9 | `workbox-build>ajv>fast-uri` |
| GHSA-wjr9-j795-jxcr | fast-uri | moderate | 3.1.8 | >=3.1.3 <3.1.9 | >=3.1.9 | `workbox-build>ajv>fast-uri` |
| GHSA-x8mw-p69m-v3mx | @fastify/busboy | high | 3.2.0 | >=1.0.0 <3.2.1 | >=3.2.1 | `@netlify/blobs>@netlify/dev-utils>@whatwg-node/server>@whatwg-node/fetch>@whatwg-node/node-fetch>@fastify/busboy` |
| GHSA-x97p-jq2g-jp4f | axios | high | 1.18.1 | >=1.15.1 <1.20.0 | >=1.20.0 | `@quasar/quasar-app-extension-testing-e2e-cypress>start-server-and-test>wait-on>axios`<br>`axios` |
| GHSA-xhq7-xmqj-769h | fast-uri | low | 3.1.8 | >=3.0.0 <3.1.9 | >=3.1.9 | `workbox-build>ajv>fast-uri` |
| GHSA-xjh9-v7x6-24jw | @fastify/busboy | high | 3.2.0 | >=3.1.0 <3.2.1 | >=3.2.1 | `@netlify/blobs>@netlify/dev-utils>@whatwg-node/server>@whatwg-node/fetch>@whatwg-node/node-fetch>@fastify/busboy` |
| GHSA-xp26-3454-mjgp | @vitest/mocker | moderate | 4.1.11 | >=4.1.11 <4.1.12 | >=4.1.12 | `vitest>@vitest/mocker` |

Audit-only advisories in this baseline (7) are `GHSA-3g3m-2fjr-6pw4`, `GHSA-4528-x5fx-h6hg`, `GHSA-6cv4-p8m7-4r25`, `GHSA-7wch-p9px-956x`, `GHSA-h6cr-wjv9-3cpp`, `GHSA-hqq3-7jhf-c5jx`, `GHSA-rhr8-3pm8-cq29`.

## Group 2 dependency graph

Compared all 67 Dependabot records and 7 audit-only advisories with the resolved package versions in `app/yarn.lock` and `app/src-pwa/yarn.lock`. No resolved version satisfied a captured affected range. The root and PWA-mode container audits each returned zero findings across 851 and 345 dependencies, respectively.

Alert #169 has no listed patched release. Quasar CLI now uses `@quasar/ssl-certificate@2.1.0` and `selfsigned@5.5.0`. Neither lockfile resolves `node-forge`, so the affected path is absent from the updated graph.

| Package | Resolved versions |
| --- | --- |
| `@fastify/busboy` | 3.2.6 |
| `@quasar/app-vite` | 3.10.4 |
| `@quasar/render-ssr-error` | 2.2.6 |
| `@quasar/ssl-certificate` | 2.1.0 |
| `@vitest/mocker` | 4.1.12 |
| `@vue/server-renderer` | 3.5.46 |
| `axios` | 1.21.1 |
| `body-parser` | 1.20.9 |
| `compression` | Absent |
| `fast-uri` | 3.1.9 |
| `follow-redirects` | 1.16.3 |
| `glob` | 14.0.6 |
| `happy-dom` | 21.0.4 |
| `joi` | 18.3.2 |
| `minimatch` | 5.1.9, 11.0.9 |
| `node-forge` | Absent |
| `postcss-selector-parser` | 6.1.6 |
| `proxy-addr` | 2.0.8 |
| `qs` | 6.16.2 |
| `serialize-javascript` | 7.1.4 |
| `shell-quote` | 1.12.0 |
| `source-map-js` | 1.2.4 |
| `systeminformation` | 5.33.26 |
| `vite` | 8.3.8 |

The original Express path through Quasar CLI is absent and the application retains Express 4.22.3 with `proxy-addr@2.0.8`. Concurrently 10.0.7 selects `shell-quote@1.12.0`. The development startup check reached both servers and confirmed the backend's expected response without live TMDB credentials.

Quasar preparation and the production PWA build succeeded. The build produced an application entry point, manifest, and service worker. Vitest passed all 45 tests across 15 files, and Cypress passed all 18 E2E tests across four specs. Live Netlify verification and browser offline checks remain in Group 3.

The advisory checks describe the local updated graphs. GitHub has yet to scan those graphs on its default branch.

## Group 3 verification

- Verified both frozen Yarn installations in a clean copy of commit `d959bf2` inside the project's Node 22 Docker image. The application and PWA lockfiles remained byte-for-byte identical to the audited copies. The audit and advisory-range comparison above therefore apply to the verified installation.
- Built the production PWA from the frozen install and confirmed the presence of its entry point, manifest, and service worker.
- The full Vitest suite passed 45 tests across 15 files. Cypress passed all 18 tests across the four tracked E2E specs, covering navigation, agenda, challenge, preferences, and accessibility. The Vitest suite also exercised adding a planned movie, metadata persistence, and calendar export. The Cypress component runner has no matching tracked specs.
- Exercised the built PWA in a headless browser. The Agenda deep link rendered through the configured SPA fallback, the service worker registered and controlled the page, the precache existed, and the route reloaded with the browser offline. A separate browser fixture returned a movie and its details through the search flow.
- Ran the actual TMDB Netlify handler against an isolated HTTP upstream fixture. It forwarded the query and returned the expected movie payload and upstream 404. The reminder snapshot save and delete checks used mock Blobs bindings. The reminder dry run passed with the network disabled and an explicit assertion of zero outbound fetches.
- Live Netlify function deployment, managed Blobs bindings, and scheduled invocation remain unverified. The isolated redirect and handler checks exercised those application paths without a deployed preview. The pre-existing production Docker packaging mismatch noted in the design is outside this dependency verification.
- GitHub still reports 67 open Dependabot alerts on the unchanged default branch. The updated graphs are available on the remediation branch until the default branch is updated and rescanned.
