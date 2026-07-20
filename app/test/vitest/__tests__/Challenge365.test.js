import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

installQuasarPlugin();

describe('Challenge365', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-03T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetModules();
  });

  it('calculates challenge totals, percentage, and streaks from watched movie logs', async () => {
    const { default: Challenge365 } = await import('../../../src/components/Challenge365.vue');

    const wrapper = mount(Challenge365, {
      props: {
        movieLogs: [
          { id: '1', title: 'Heat', watchedAt: '01-03-2026' },
          { id: '2', title: 'Thief', watchedAt: '02-03-2026' },
          { id: '3', title: 'Collateral', watchedAt: '02-03-2026' },
        ],
      },
    });

    const metricText = wrapper.text();

    expect(metricText).toContain('Total3 / 365');
    expect(metricText).toContain('Percentage0.8%');
    expect(metricText).toContain('Current streak2 days');
    expect(metricText).toContain('Longest streak2 days');
  });
});
