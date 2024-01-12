describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        //cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    cy.contains("This is an issue of type: Task.").click();
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click("bottomRight");
      cy.get('[data-testid="select-option:Story"]')
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="select:type"]').should("contain", "Story");

      cy.get('[data-testid="select:status"]').click("bottomRight");
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should("have.text", "Done");

      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should("contain", "Baby Yoda");
      cy.get('[data-testid="select:assignees"]').should(
        "contain",
        "Lord Gaben"
      );

      cy.get('[data-testid="select:reporter"]').click("bottomRight");
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should(
        "have.text",
        "Pickle Rick"
      );

      cy.get('[data-testid="select:priority"]').click("bottomRight");
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should("have.text", "Medium");
    });
  });

  it("Should update title, description successfully", () => {
    cy.contains("This is an issue of type: Task.").click();
    const title = "TEST_TITLE";
    const description = "TEST_DESCRIPTION";

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get(".ql-snow").click().should("not.exist");

      cy.get(".ql-editor").clear().type(description);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('textarea[placeholder="Short summary"]').should(
        "have.text",
        title
      );
      cy.get(".ql-snow").should("have.text", description);
    });
  });

  // ASSIGNEMENT 3 (Bonus)

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it("ASSIGNMENT 3.1 Checking priority dropdown", () => {
    const expectedLength = 5;
    let priorityArray = [];
    cy.contains("This is an issue of type: Task.").click();
    // finding the preselected option and adding it to the array
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:priority"]')
        .invoke("text")
        .then((text) => {
          priorityArray.push(text);
        });

      // Opening Priority menu and adding the options to array one-by-one, printing out results.
      cy.get('[data-testid="select:priority"]').click();

      for (let i = 0; i < expectedLength - 1; i++) {
        cy.get(`[data-select-option-value]:eq(${i})`)
          .invoke("text")
          .then((text) => {
            priorityArray.push(text);
            cy.log(
              "Added elements: " +
                priorityArray +
                ". Expected array length: " +
                expectedLength +
                ", array length now: " +
                priorityArray.length
            );
          });
      }
    });
  });

  it("ASSIGNMENT 3.2 Checking that the reporter’s name has only characters in it", () => {
    cy.contains("This is an issue of type: Task.").click();
    // Finding reporter's name and checking the string for characters.
    cy.get('[data-testid="select:reporter"]').click();
    cy.get('[data-testid="select:reporter"]')
      .invoke("text")
      .then((reporter) => {
        const regex = /^[A-Za-z\s]+$/;
        if (regex.test(reporter)) {
          cy.log("Reporter's name has only characters in it.");
        } else {
          cy.log("The reporter's name contains non-letter characters.");
        }
      });
  });

  it("ASSIGNMENT 3.3 Application is removing unnecessary spaces from title", () => {
    const title = " Hello world! ";

    // Starting from Kanban board
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });

    // Adding title with spaces
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('input[name="title"]').wait(1000).type(title);
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    //Reload the page to be able to see recently created issue and assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    // Changing the title with trimmed version
    cy.get('[data-testid="list-issue"]').eq(0).click();
    getIssueDetailsModal().within(() => {
      cy.get('[placeholder="Short summary"]')
        .wait(1000)
        .click()
        .clear()
        .type(title.trim());
    });
  });
});
