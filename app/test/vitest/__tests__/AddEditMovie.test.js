import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { Notify } from 'quasar';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import AddEditMovie from '../../../src/components/AddEditMovie.vue';

vi.mock('utils/availableRegions', () => ({
  availableRegions: () =>
    Promise.resolve([
      {
        iso_3166_1: 'BR',
        native_name: 'Brazil',
      },
    ]),
}));

installQuasarPlugin({ plugins: { Notify } });

describe('AddEditMovie', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows the formatted current agenda date while editing a movie', async () => {
    const wrapper = mount(AddEditMovie, {
      props: {
        dialogAction: 'Edit',
        movieWatchDate: '2026-04-05',
        movieId: 42,
        movieTitle: 'Heat',
        selectedCountry: 'Brazil',
        movieProviders: [
          {
            results: {
              BR: {
                link: 'https://example.com/watch',
                flatrate: [{ provider_id: 8, provider_name: 'Example+' }],
              },
            },
          },
        ],
      },
      attachTo: document.body,
    });

    await flushPromises();
    await wrapper.vm.openMvDialog();
    await nextTick();

    expect(document.body.textContent).toContain('Current date in agenda: April 5, 2026');
  });

  it('preserves concise rich metadata when adding a movie to the agenda', async () => {
    localStorage.setItem('watchMovies', JSON.stringify([]));

    const wrapper = mount(AddEditMovie, {
      props: {
        dialogAction: 'Add',
        movieWatchDate: '2026-04-05',
        movieId: 42,
        movieTitle: 'Heat',
        selectedCountry: 'Brazil',
        newMovie: true,
        moviePosterPath: '/heat.jpg',
        movieOverview: 'A focused crime drama.',
        movieRuntime: 170,
        movieReleaseYear: 1995,
        movieProviders: [
          {
            results: {
              BR: {
                link: 'https://example.com/watch',
                flatrate: [
                  { provider_id: 8, provider_name: 'Example+', logo_path: '/example.png' },
                ],
              },
            },
          },
        ],
      },
      attachTo: document.body,
    });

    await flushPromises();
    await wrapper.vm.openMvDialog();
    await nextTick();

    wrapper.vm.countrySearch = { code: 'BR', name: 'Brazil' };
    wrapper.vm.addMovie();

    expect(JSON.parse(localStorage.getItem('watchMovies'))).toMatchObject([
      {
        movieID: 42,
        posterPath: '/heat.jpg',
        overview: 'A focused crime drama.',
        runtime: 170,
        releaseYear: 1995,
        streamingList: [{ provider_name: 'Example+', logo_path: '/example.png' }],
      },
    ]);
  });
});
