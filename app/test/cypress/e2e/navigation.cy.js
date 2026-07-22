describe('core navigation', () => {
  it('collapses the desktop sidebar until hover', () => {
    cy.viewport(1440, 900);
    cy.visit('/');

    cy.get('.q-drawer').should('have.class', 'q-drawer--mini');
  });

  it('marks only the current sidebar route as active', () => {
    cy.viewport(1440, 900);
    cy.visit('/about');

    cy.get('.app-nav-link-active').should('have.length', 1);
    cy.dataCy('nav-about').should('have.class', 'app-nav-link-active');
    cy.dataCy('nav-movie-search').should('not.have.class', 'q-router-link--active');

    cy.visit('/challenge');
    cy.get('.app-nav-link-active').should('have.length', 1);
    cy.dataCy('nav-challenge').should('have.class', 'app-nav-link-active');
    cy.dataCy('nav-movie-search').should('not.have.class', 'q-router-link--active');
  });

  it('loads the application shell and navigates through primary pages', () => {
    cy.viewport(1440, 900);
    cy.visit('/');

    cy.contains('365 MOVIES').should('be.visible');
    cy.get('[placeholder="Type movie title... And press Enter"]').should('be.visible');
    cy.dataCy('home-reminder-discovery').should('be.visible').and('contain', 'agenda reminders');
    cy.get('[placeholder="Type movie title... And press Enter"]').should('be.visible');

    cy.dataCy('home-reminder-agenda').click();
    cy.location('pathname').should('eq', '/agenda');
    cy.dataCy('agenda-reminder-settings').should('be.visible');

    cy.visit('/');

    cy.get('.q-drawer').trigger('mouseenter', { force: true });
    cy.dataCy('nav-about').click();
    cy.location('pathname').should('eq', '/about');
    cy.contains('h1', '365 Movies').should('be.visible');

    cy.dataCy('nav-agenda').click();
    cy.location('pathname').should('eq', '/agenda');
    cy.dataCy('agenda-page').should('be.visible');

    cy.dataCy('nav-challenge').click();
    cy.location('pathname').should('eq', '/challenge');
    cy.dataCy('challenge-page').should('be.visible');
    cy.dataCy('challenge-365').should('be.visible');

    cy.dataCy('nav-settings').click();
    cy.location('pathname').should('eq', '/settings');
    cy.contains('h1', 'Settings').should('be.visible');
  });
});
