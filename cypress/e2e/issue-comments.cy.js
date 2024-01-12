describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

    it('Should create a comment successfully', () => {
        const comment = 'TEST_COMMENT';

        getIssueDetailsModal().within(() => {
            cy.contains('Add a comment...')
                .click();

            cy.get('textarea[placeholder="Add a comment..."]').type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.contains('Add a comment...').should('exist');
            cy.get('[data-testid="issue-comment"]').should('contain', comment);
        });
    });

    it('Should edit a comment successfully', () => {
        const previousComment = 'An old silent pond...';
        const comment = 'TEST_COMMENT_EDITED';

        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="issue-comment"]')
                .first()
                .contains('Edit')
                .click()
                .should('not.exist');

            cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', previousComment)
                .clear()
                .type(comment);

            cy.contains('button', 'Save')
                .click()
                .should('not.exist');

            cy.get('[data-testid="issue-comment"]')
                .should('contain', 'Edit')
                .and('contain', comment);
        });
    });

    it('Should delete a comment successfully', () => {
        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .contains('Delete')
            .click();

        cy.get('[data-testid="modal:confirm"]')
            .contains('button', 'Delete comment')
            .click()
            .should('not.exist');

        getIssueDetailsModal()
            .find('[data-testid="issue-comment"]')
            .should('not.exist');
    });
    // SPRINT 2: Assignment 1

  it("Should create, edit and delete a comment successfully", () => {
    // CREATING COMMENT

    // creating variable for random comment and an extra variable to check the number of comments later (if one comment was added)
    const randomComment = faker.lorem.words({ min: 1, max: 10 });
    const commentCount = 1;

    // adding new (random) comment
    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...")
        //.should('be.visible')
        .click();
      cy.get('textarea[placeholder="Add a comment..."]').type(randomComment);

      // 'Cancel' and 'Save' buttons are both visible
      cy.contains("button", "Cancel");
      cy.contains("button", "Save").click().should("not.exist");

      // new comment was added and is visible in the list of comments
      cy.contains("Add a comment...").should("exist");
      cy.get('[data-testid="issue-comment"]').should("contain", randomComment);
      cy.get('[data-testid="issue-comment"]').should(
        "have.length",
        commentCount + 1
      );
    });

    // EDIT COMMENT

    // new variable for edited comment
    const editedComment = randomComment + " EDITED";

    // opening comment to edit and adding new text
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");

      cy.get('textarea[placeholder="Add a comment..."]')
        .should("contain", randomComment)
        .clear()
        .type(editedComment);

      // buttons 'Cancel' and 'Save' are both visible
      cy.contains("button", "Cancel");
      cy.contains("button", "Save").click().should("not.exist");

      // edited comment was added and is visible in the list of comments
      cy.get('[data-testid="issue-comment"]')
        .should("contain", "Edit")
        .and("contain", editedComment);
    });

    // DELETE COMMENT

    // Find correct comment and click the 'Delete button'
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .eq(0)
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    getIssueDetailsModal().find('[data-testid="issue-comment"]');
    //.should('not.exist');
  });
});
