describe("Time tracking functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const getModalTrackingModal = () => cy.get('[data-testid="modal:tracking"]');
  const stopWatch = () =>
    cy.get('[data-testid="icon:stopwatch"]').should("be.visible").click();
  const addTimeSpent = (timeSpent) => {
    return cy
      .get('[placeholder="Number"]')
      .first()
      .click()
      .clear()
      .type(timeSpent);
  };
  const addTimeLeft = (timeLeft) => {
    return cy
      .get('[placeholder="Number"]')
      .last()
      .click()
      .clear()
      .type(timeLeft);
  };
  const clickDone = () => {
    cy.contains("button", "Done").click();
  };

  const estimationVisible = () => {
    getIssueDetailsModal().within(() => {
      cy.contains("div", timeSpent + "h logged").should("be.visible");
    });
  };
  let timeSpent = 5;
  let timeLeft = 9;

  it("Time tracking", () => {
    // Adding estimation
    stopWatch();
    getModalTrackingModal().within(() => {
      addTimeSpent(timeSpent);
      addTimeLeft(timeLeft);
      cy.contains("div", timeSpent + "h logged").should("be.visible");
      clickDone();
    });
    estimationVisible();

    // Editing estimation
    stopWatch();
    getModalTrackingModal().within(() => {
      addTimeSpent((timeSpent += 1));
      cy.contains("div", timeSpent + "h logged").should("be.visible");
      clickDone();
    });
    estimationVisible();

    // Deleting estimation
    stopWatch();
    getModalTrackingModal().within(() => {
      cy.get('[placeholder="Number"]').first().click().clear();
      cy.contains("div", "No time logged").should("be.visible").click();
      clickDone();
    });

    // Asserting that the estimation is added and visible.
    getIssueDetailsModal().within(() => {
      cy.contains("div", timeSpent + "h logged").should("be.visible");
      cy.contains("div", "No time logged").should("be.visible");
    });

    //
  });
});
