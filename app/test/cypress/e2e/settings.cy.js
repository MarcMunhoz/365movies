describe('settings page', () => {
  const openAccessibilityMenu = (visitOptions) => {
    cy.viewport(1440, 900);
    cy.visit('/settings', visitOptions);
    cy.get('._access-menu').should('exist');
    cy.get('.q-drawer').trigger('mouseenter', { force: true });
    cy.dataCy('nav-accessibility').click({ force: true });
    cy.get('._access-menu').should('be.visible');
  };

  const accessibilityAction = (action) => cy.get(`button[data-access-action="${action}"]`);

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

  it('applies the large cursor to app-owned navigation, button, input, and page surfaces', () => {
    openAccessibilityMenu();

    accessibilityAction('bigCursor').click();
    cy.document().its('documentElement').should('have.class', '_access_cursor');

    cy.dataCy('nav-settings').should('have.css', 'cursor').and('include', 'data:image/svg+xml');
    cy.contains('button', 'Light').should('have.css', 'cursor').and('include', 'data:image/svg+xml');
    cy.get('[placeholder="Type movie title... And press Enter"]').should('have.css', 'cursor').and('include', 'data:image/svg+xml');
    cy.get('main').should('have.css', 'cursor').and('include', 'data:image/svg+xml');
  });

  it('clears accessibility effects when reset is activated', () => {
    openAccessibilityMenu();

    accessibilityAction('bigCursor').click();
    accessibilityAction('increaseTextSpacing').click();
    accessibilityAction('increaseLineHeight').click();
    accessibilityAction('invertColors').click();
    accessibilityAction('grayHues').click();
    accessibilityAction('readingGuide').click();

    cy.document().its('documentElement').should('have.class', '_access_cursor');
    cy.get('#access_read_guide_bar').should('exist');
    accessibilityAction('bigCursor').should('have.class', 'active');

    cy.get('._menu-reset-btn').click();

    cy.document().its('documentElement').should('not.have.class', '_access_cursor');
    cy.get('#access_read_guide_bar').should('not.exist');
    cy.window().then((window) => {
      expect(window.localStorage.getItem('_accessState')).to.equal(null);
    });
    cy.get('html').should('have.css', 'filter', 'none');
    cy.get('[data-init-word-spacing], [data-init-letter-spacing], [data-init-line-height], [data-init-font-size]').should('not.exist');
    cy.get('button[data-access-action].active').should('not.exist');
  });

  it('preserves the saved theme preference after accessibility reset', () => {
    openAccessibilityMenu({
      onBeforeLoad(window) {
        window.localStorage.setItem('appThemePreference', JSON.stringify('light'));
      },
    });
    cy.document().its('documentElement.dataset.appTheme').should('eq', 'light');

    accessibilityAction('invertColors').click();
    accessibilityAction('bigCursor').click();
    cy.get('._menu-reset-btn').click();

    cy.document().its('documentElement.dataset.appTheme').should('eq', 'light');
    cy.document().its('documentElement.style.colorScheme').should('eq', 'light');
    cy.window().then((window) => {
      expect(JSON.parse(window.localStorage.getItem('appThemePreference'))).to.equal('light');
      expect(JSON.parse(window.localStorage.getItem('appLanguagePreference'))).to.equal('en');
    });
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
