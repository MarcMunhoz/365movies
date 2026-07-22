describe('settings page', () => {
  it('supports theme preferences and keeps the interface in English', () => {
    cy.visit('/settings');
    cy.location('pathname').should('eq', '/settings');
    cy.contains('h1', 'Settings').should('be.visible');
    cy.get('main').contains('Accessibility').should('be.visible');
    cy.contains('Toolbar is initialized in English').should('be.visible');
    cy.contains('Portuguese').should('not.exist');

    cy.contains('Light').click();
    cy.document().its('documentElement.dataset.appTheme').should('eq', 'light');
    cy.window().then((window) => {
      expect(JSON.parse(window.localStorage.getItem('appThemePreference'))).to.equal('light');
    });
  });

  it('opens accessibility from the sidebar settings area', () => {
    cy.viewport(1440, 900);
    cy.visit('/settings');
    cy.get('.q-drawer').trigger('mouseenter', { force: true });
    cy.dataCy('nav-accessibility').click();
    cy.get('._access-menu').should('be.visible');
    cy.get('button[data-access-action="underlineLinks"]').should('not.exist');
    cy.get('button[data-access-action="disableAnimations"]').should('not.exist');
  });

  it('edits, cancels, and saves reminder settings without mutating saved state before save', () => {
    cy.intercept('POST', '/.netlify/functions/save-reminders', {
      statusCode: 200,
      body: { ok: true },
    }).as('saveReminders');

    cy.visit('/settings');

    cy.dataCy('settings-reminder-summary').should('contain', 'None').and('contain', 'No e-mail saved');
    cy.dataCy('settings-edit-reminders').click();
    cy.dataCy('settings-reminder-preference').contains('E-mail').click();
    cy.dataCy('settings-reminder-email').type('draft@example.test');
    cy.dataCy('settings-cancel-reminders').click();
    cy.dataCy('settings-reminder-summary').should('contain', 'None').and('contain', 'No e-mail saved');
    cy.window().then((window) => {
      expect(window.localStorage.getItem('agendaReminderPreference')).to.equal(null);
      expect(window.localStorage.getItem('agendaReminderEmail')).to.equal(null);
    });

    cy.dataCy('settings-edit-reminders').click();
    cy.dataCy('settings-reminder-preference').contains('E-mail').click();
    cy.dataCy('settings-reminder-email').type('invalid');
    cy.dataCy('settings-save-reminders').click();
    cy.contains('Enter a valid e-mail address').should('be.visible');

    cy.dataCy('settings-reminder-email').clear().type('viewer@example.test');
    cy.dataCy('settings-reminder-form').submit();
    cy.wait('@saveReminders');
    cy.dataCy('settings-reminder-summary').should('contain', 'E-mail').and('contain', 'viewer@example.test');
    cy.window().then((window) => {
      expect(JSON.parse(window.localStorage.getItem('agendaReminderPreference'))).to.equal('email');
      expect(JSON.parse(window.localStorage.getItem('agendaReminderEmail'))).to.equal('viewer@example.test');
      expect(JSON.parse(window.localStorage.getItem('agendaReminderInstallationId'))).to.be.a('string');
    });
  });
});
