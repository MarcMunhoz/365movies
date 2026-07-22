const parseRgb = (value) => {
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  expect(match, `RGB color for ${value}`).to.not.equal(null);
  return match.slice(1, 4).map(Number);
};

const relativeLuminance = ([red, green, blue]) => {
  const [r, g, b] = [red, green, blue].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (foreground, background) => {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
};

const visitLight = (path) => {
  cy.visit(path, {
    onBeforeLoad(window) {
      window.localStorage.setItem('appThemePreference', JSON.stringify('light'));
    },
  });
};

const visitLightWithTrailerResult = () => {
  cy.visit('/', {
    onBeforeLoad(window) {
      window.localStorage.setItem('appThemePreference', JSON.stringify('light'));
      window.sessionStorage.setItem('lastMovieSearch', JSON.stringify({ query: 'thor', lucky: false }));
      window.sessionStorage.setItem(
        'lastMovieSearchSnapshot',
        JSON.stringify({
          query: 'thor',
          movies: [
            {
              id: 101,
              title: 'Thor',
              release_date: '2011-05-06',
              poster_path: null,
              overview: 'A mythic adventure with a trailer.',
              vote_average: 7,
              imdbId: 'tt0800369',
            },
          ],
          details: [
            {
              id: 101,
              runtime: 115,
              genres: [{ name: 'Adventure' }],
              production_countries: [{ iso_3166_1: 'US', name: 'United States' }],
            },
          ],
          credits: [
            {
              id: 101,
              crew: [{ job: 'Director', name: 'Kenneth Branagh' }],
              cast: [{ known_for_department: 'Acting', name: 'Chris Hemsworth' }],
            },
          ],
          providers: [{ id: 101, results: {} }],
          videos: [{ id: 101, results: [{ type: 'Trailer', key: 'sampleTrailer' }] }],
          releaseDates: [
            {
              id: 101,
              results: [{ iso_3166_1: 'US', release_dates: [{ certification: 'PG-13' }] }],
            },
          ],
          noMovie: false,
          savedAt: Date.now(),
        })
      );
    },
  });
};

const expectContrast = (textSelector, backgroundSelector) => {
  cy.get(textSelector).then(($text) => {
    cy.get(backgroundSelector).then(($background) => {
      const textColor = parseRgb(getComputedStyle($text[0]).color);
      const backgroundColor = parseRgb(getComputedStyle($background[0]).backgroundColor);

      expect(contrastRatio(textColor, backgroundColor)).to.be.greaterThan(4.5);
    });
  });
};

const expectWhiteText = (selector) => {
  cy.get(selector).then(($element) => {
    const textColor = parseRgb(getComputedStyle($element[0]).color);

    expect(textColor[0]).to.be.greaterThan(240);
    expect(textColor[1]).to.be.greaterThan(240);
    expect(textColor[2]).to.be.greaterThan(240);
  });
};

describe('light mode contrast', () => {
  it('keeps Home reminder banner readable', () => {
    visitLight('/');
    expectContrast('[data-cy="home-reminder-discovery"] p', '[data-cy="home-reminder-discovery"]');
    expectWhiteText('[data-cy="home-reminder-agenda"]');
  });

  it('keeps About hero text readable', () => {
    visitLight('/about');
    expectContrast('[data-cy="about-title"]', '[data-cy="about-hero"]');
  });

  it('keeps Agenda local storage notice readable', () => {
    visitLight('/agenda');
    expectContrast('[data-cy="agenda-local-notice"]', '[data-cy="agenda-local-notice"]');
  });

  it('keeps Challenge panel readable', () => {
    visitLight('/challenge');
    expectContrast('[data-cy="challenge-title"]', '[data-cy="challenge-365"]');
  });

  it('keeps Trailer modal surface aligned with light mode', () => {
    visitLightWithTrailerResult();
    cy.contains('button', 'Trailer').click();

    cy.dataCy('trailer-dialog-surface').then(($surface) => {
      const backgroundColor = parseRgb(getComputedStyle($surface[0]).backgroundColor);

      expect(backgroundColor[0]).to.be.greaterThan(240);
      expect(backgroundColor[1]).to.be.greaterThan(240);
      expect(backgroundColor[2]).to.be.greaterThan(240);
    });

    cy.get('.trailer-dialog-header').then(($header) => {
      cy.get('.trailer-dialog-close').then(($close) => {
        const headerRect = $header[0].getBoundingClientRect();
        const closeRect = $close[0].getBoundingClientRect();
        const headerCenter = headerRect.top + headerRect.height / 2;
        const closeCenter = closeRect.top + closeRect.height / 2;

        expect(closeRect.top).to.be.greaterThan(headerRect.top);
        expect(closeRect.bottom).to.be.lessThan(headerRect.bottom);
        expect(Math.abs(headerCenter - closeCenter)).to.be.lessThan(2);
      });
    });
  });
});
