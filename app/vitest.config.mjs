import { defineConfig, mergeConfig } from 'vitest/config';
import { quasarViteTestingConfig } from '@quasar/quasar-app-extension-testing-unit-vitest/config';

export default defineConfig(async () =>
  mergeConfig(await quasarViteTestingConfig(), {
    test: {
      environment: 'happy-dom',
      setupFiles: 'test/vitest/setup-file.js',
      include: [
        'src/**/*.vitest.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        'test/vitest/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      ],
    },
  }),
);
