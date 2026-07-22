import { describe, expect, it } from 'vitest';

import routes from '../../../src/router/routes';

describe('router routes', () => {
  it('exposes the dedicated challenge route from the main layout', () => {
    const mainRoute = routes.find((route) => route.path === '/');

    expect(mainRoute.children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: '/challenge',
          name: 'Challenge',
        }),
      ]),
    );
  });
});
