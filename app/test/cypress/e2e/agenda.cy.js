describe('agenda page', () => {
  it('loads the agenda and displays its main controls', () => {
    cy.visit('/agenda');

    cy.dataCy('agenda-page').should('be.visible');
    cy.contains('h1', 'Agenda').should('be.visible');
    cy.dataCy('agenda-challenge-summary').should('be.visible').and('contain', '365 Movie Challenge');
    cy.dataCy('agenda-challenge-link').should('have.attr', 'href', '/challenge');
    cy.dataCy('challenge-365').should('not.exist');
    cy.dataCy('agenda-toggle-view').should('be.visible').and('contain', 'Calendar view');
    cy.dataCy('agenda-clear-calendar').should('be.visible').and('contain', 'Clear calendar');
    cy.dataCy('agenda-reminder-settings').should('be.visible');
    cy.contains('Legend').should('be.visible');
  });

  it('keeps primary agenda content before analytics and links to the full challenge', () => {
    cy.visit('/agenda');

    cy.dataCy('agenda-primary-content').should('be.visible');
    cy.dataCy('agenda-analytics-summary').should('be.visible');
    cy.dataCy('agenda-primary-content').then(($primaryContent) => {
      cy.dataCy('agenda-analytics-summary').then(($analytics) => {
        expect($primaryContent.index()).to.be.lessThan($analytics.index());
      });
    });

    cy.dataCy('agenda-challenge-link').click();
    cy.location('pathname').should('eq', '/challenge');
    cy.dataCy('challenge-365').should('be.visible');
  });

  it('supports reminder preference selection and calendar export mode', () => {
    cy.visit('/agenda');

    cy.dataCy('agenda-reminder-settings').within(() => {
      cy.dataCy('agenda-reminder-method').should('contain', 'None');
      cy.dataCy('agenda-reminder-email-summary').should('contain', 'No e-mail saved');
      cy.dataCy('agenda-edit-reminders').should('have.attr', 'href', '/settings');
      cy.dataCy('agenda-reminder-preference').should('not.exist');
      cy.dataCy('agenda-reminder-email').should('not.exist');
      cy.dataCy('agenda-save-reminders').should('not.exist');
      cy.dataCy('agenda-export-calendar').should('not.exist');
    });
  });

  it('shows the calendar export action when calendar reminders are saved', () => {
    cy.visit('/agenda');

    cy.window().then((window) => {
      window.localStorage.setItem('agendaReminderPreference', JSON.stringify('calendar'));
    });
    cy.reload();

    cy.dataCy('agenda-reminder-settings').within(() => {
      cy.dataCy('agenda-reminder-email-summary').should('be.visible');
      cy.dataCy('agenda-reminder-method').should('contain', 'Calendar');
      cy.dataCy('agenda-export-calendar').should('be.visible');
    });
  });
});
