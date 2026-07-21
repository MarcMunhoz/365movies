describe('agenda page', () => {
  it('loads the agenda and displays its main controls', () => {
    cy.visit('/agenda');

    cy.dataCy('agenda-page').should('be.visible');
    cy.contains('h1', 'Agenda').should('be.visible');
    cy.dataCy('challenge-365').should('be.visible');
    cy.dataCy('agenda-toggle-view').should('be.visible').and('contain', 'Calendar view');
    cy.dataCy('agenda-clear-calendar').should('be.visible').and('contain', 'Clear calendar');
    cy.dataCy('agenda-reminder-settings').should('be.visible');
    cy.contains('Legend').should('be.visible');
  });

  it('supports reminder preference selection and calendar export mode', () => {
    cy.visit('/agenda');

    cy.dataCy('agenda-reminder-settings').within(() => {
      cy.contains('None').click();
      cy.dataCy('agenda-export-calendar').should('not.exist');
      cy.dataCy('agenda-reminder-email').should('be.visible').and('be.disabled');
      cy.contains('E-mail').click();
      cy.dataCy('agenda-reminder-email').should('be.visible').and('not.be.disabled');
      cy.contains('Calendar').click();
      cy.dataCy('agenda-export-calendar').should('be.visible');
      cy.dataCy('agenda-reminder-email').should('be.visible').and('be.disabled');
      cy.contains('Both').click();
      cy.dataCy('agenda-reminder-email').should('be.visible').and('not.be.disabled');
    });
  });

  it('requires a valid e-mail before syncing e-mail reminders', () => {
    cy.intercept('POST', '/.netlify/functions/save-reminders', {
      statusCode: 200,
      body: { ok: true },
    }).as('saveReminders');

    cy.visit('/agenda');

    cy.dataCy('agenda-reminder-settings').within(() => {
      cy.contains('E-mail').click();
      cy.dataCy('agenda-reminder-email').type('invalid');
      cy.dataCy('agenda-save-reminders').click();
    });

    cy.contains('Enter a valid e-mail address').should('be.visible');

    cy.dataCy('agenda-reminder-email').clear().type('viewer@example.test');
    cy.dataCy('agenda-save-reminders').click();
    cy.wait('@saveReminders');

    cy.window().then((window) => {
      expect(JSON.parse(window.localStorage.getItem('agendaReminderPreference'))).to.equal('email');
      expect(JSON.parse(window.localStorage.getItem('agendaReminderEmail'))).to.equal('viewer@example.test');
      expect(JSON.parse(window.localStorage.getItem('agendaReminderInstallationId'))).to.be.a('string');
    });
  });
});
