describe('core navigation', () => {
  it('loads the application shell and navigates through primary pages', () => {
    cy.viewport(1440, 900);
    cy.visit('/');

    cy.contains('365 MOVIES').should('be.visible');
    cy.get('[placeholder="Type movie title... And press Enter"]').should('be.visible');

    cy.get('.q-drawer').trigger('mouseenter', { force: true });
    cy.dataCy('nav-about').click();
    cy.location('pathname').should('eq', '/about');
    cy.contains('h1', '365 Movies').should('be.visible');

    cy.dataCy('nav-agenda').click();
    cy.location('pathname').should('eq', '/agenda');
    cy.dataCy('agenda-page').should('be.visible');
  });
});
