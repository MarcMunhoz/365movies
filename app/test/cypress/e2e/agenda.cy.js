describe('agenda page', () => {
  it('loads the agenda and displays its main controls', () => {
    cy.visit('/agenda');

    cy.dataCy('agenda-page').should('be.visible');
    cy.contains('h1', 'Agenda').should('be.visible');
    cy.dataCy('challenge-365').should('be.visible');
    cy.dataCy('agenda-toggle-view').should('be.visible').and('contain', 'Calendar view');
    cy.dataCy('agenda-clear-calendar').should('be.visible').and('contain', 'Clear calendar');
    cy.contains('Legend').should('be.visible');
  });
});
