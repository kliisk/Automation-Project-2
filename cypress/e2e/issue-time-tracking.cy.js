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

  it("Adding time estimation", () => {
    // Adding estimation
    const firstEstimation = 10;
    const updatedEstimation = 20;

    getIssueDetailsModal().within(() => {
      cy.get('[placeholder="Number"]').click().clear().type(firstEstimation);
      cy.contains("div", firstEstimation + "h estimated").should("be.visible");
    });

    // Editing estimation
    getIssueDetailsModal().within(() => {
      cy.get('[placeholder="Number"]').click().clear().type(updatedEstimation);
      cy.contains(updatedEstimation + "h estimated").should("be.visible");
    });

    // Deleting estimation
    getIssueDetailsModal().within(() => {
      cy.get('[placeholder="Number"]').click().clear();
      cy.contains("h estimated").should("not.exist");
      cy.get('[data-testid="icon:close"]').eq(1).click();
    });
  });
  
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
      cy.contains("div", "No time logged").should("be.visible");
    });

    //
  });
});
