import '@cypress/code-coverage/support';

Cypress.Commands.add('dataCy', (value, options) => cy.get(`[data-cy="${value}"]`, options));

Cypress.on('uncaught:exception', (error) => {
  if (error.message.includes('ResizeObserver loop')) {
    return false;
  }

  return true;
});
