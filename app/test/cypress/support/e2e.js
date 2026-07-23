import './commands';
import '@cypress/code-coverage/support';

Cypress.on('uncaught:exception', (error) => {
  if (error.message.includes('ResizeObserver loop completed with undelivered notifications')) {
    return false;
  }

  return true;
});
