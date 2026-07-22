import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import MainLayout from '../../../src/layouts/MainLayout.vue';

const push = vi.fn();
let isMobile = false;
let routeQuery = {};

vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useQuasar: () => ({
      screen: {
        get lt() {
          return {
            md: isMobile,
          };
        },
      },
    }),
  };
});

vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/',
    query: routeQuery,
    meta: {
      titleKey: 'navigation.search',
    },
  }),
  useRouter: () => ({
    push,
  }),
}));

vi.mock('../../../src/composables/useTranslations', () => ({
  useTranslations: () => ({
    t: (key) => (
      {
        'layout.tagline': '1 movie per day of year, or almost it',
        'navigation.search': 'Movie search',
        'navigation.agenda': 'Agenda',
        'navigation.challenge': 'Challenge',
        'navigation.about': 'About',
        'navigation.settings': 'Settings',
        'settings.search.placeholder': 'Type movie title... And press Enter',
        'settings.actions.lucky': "I'm lucky",
        'settings.actions.clearSearch': 'Clear search',
        'settings.search.invalid': 'Please type at least 3 letters.',
      }[key] || key
    ),
  }),
}));

const layoutStubs = {
  'q-layout': {
    template: '<div><slot /></div>',
  },
  'q-header': {
    template: '<header><slot /></header>',
  },
  'q-toolbar': {
    template: '<div><slot /></div>',
  },
  'q-toolbar-title': {
    template: '<div><slot /></div>',
  },
  'q-btn': {
    template: '<button type="button"><slot /></button>',
  },
  'q-form': {
    template: '<form><slot /></form>',
  },
  'q-input': {
    template: '<input />',
  },
  'q-icon': {
    template: '<span />',
  },
  'q-tooltip': {
    template: '<span><slot /></span>',
  },
  'q-drawer': {
    props: ['modelValue', 'mini'],
    template: '<aside class="q-drawer" :class="{ \'q-drawer--mini\': mini }"><slot /></aside>',
  },
  'q-list': {
    template: '<nav><slot /></nav>',
  },
  'q-item-label': {
    template: '<span><slot /></span>',
  },
  'q-item': {
    template: '<a><slot /></a>',
  },
  'q-item-section': {
    template: '<span><slot /></span>',
  },
  'q-page-container': {
    template: '<main><slot /></main>',
  },
  'router-view': {
    template: '<section />',
  },
};

const mountLayout = () =>
  mount(MainLayout, {
    global: {
      stubs: layoutStubs,
    },
  });

describe('MainLayout', () => {
  beforeEach(() => {
    isMobile = false;
    routeQuery = {};
    push.mockReset();
    sessionStorage.clear();
    document.documentElement.scrollTop = 0;
  });

  it('keeps the desktop drawer collapsed until hover', async () => {
    const wrapper = mountLayout();
    const drawer = wrapper.get('.q-drawer');

    expect(drawer.classes()).toContain('q-drawer--mini');

    await drawer.trigger('mouseenter');
    expect(drawer.classes()).not.toContain('q-drawer--mini');

    await drawer.trigger('mouseleave');
    expect(drawer.classes()).toContain('q-drawer--mini');
  });
});
