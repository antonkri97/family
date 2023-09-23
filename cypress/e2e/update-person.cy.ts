describe("update person", () => {
  it("should allow to update person", () => {
    cy.login();
    cy.login().then((user) => {
      const email = (user as { email?: string }).email;

      cy.createPerson(email);
    });

    cy.get("@personId").then((data) => {
      const id = (data as { id?: string }).id;
      cy.visitAndCheck(`/main/person/${id}`);
    });
  });
});
