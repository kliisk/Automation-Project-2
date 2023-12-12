describe('Issue deletion', () => {
    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
    beforeEach(() => {
      cy.visit('/');
      cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click();
      });
    });

    it('Test Case 1: Issue Deletion', () => {
        // Find and click on trash icon
      getIssueDetailsModal().within(() => {
        cy.get('[data-testid="icon:trash"]').click()
      });

        // Confirm that the deletion confirmation window is displayed and delete issue
        cy.get('[data-testid="modal:confirm"]').should('contain','Are you sure you want to delete this issue?')
        cy.get('.dIxFno').contains('Delete issue').click()

        //Assert that modal window is closed and the issue is deleted and does not appear on the Kanban board
        cy.get('[data-testid="modal:confirm"]').should('not.exist');
        cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', '1').within(() => {
            cy.get('[data-testid="list-issue"]').contains('This is an issue of type: Task.').should('not.exist')
          });        
      });

    it('Test Case 2: Issue Deletion Cancellation', () => {
        // Find and click on trash icon
      getIssueDetailsModal().within(() => {
        cy.get('[data-testid="icon:trash"]').click()
      });

        // Confirm that the deletion confirmation window is displayed and cancel deletion 
        cy.get('[data-testid="modal:confirm"]').should('contain','Are you sure you want to delete this issue?')
        cy.get('.sc-kgoBCf').contains('Cancel').click()

        //Assert that modal window is closed and the issue is not deleted 
        cy.reload();
        cy.contains('This is an issue of type: Task.').should('exist');
        cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', '1').within(() => {
            cy.get('[data-testid="list-issue"]').contains('This is an issue of type: Task.').should('exist')
          }); 
      });      
  });
  
