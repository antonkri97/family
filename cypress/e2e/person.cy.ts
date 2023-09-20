import { faker } from "@faker-js/faker";
import { Gender } from "@prisma/client";

describe("person", () => {
  it("should allow to create new person", () => {
    cy.login();

    const personForm = {
      firstName: faker.internet.userName(),
      secondName: faker.internet.userName(),
      thirdName: faker.internet.userName(),
      birthday: faker.date.birthdate(),
      gender: Gender.MALE,
    };

    cy.visit("/main/person/new");

    cy.get("[data-test-id='first-name']").type(personForm.firstName, {
      force: true,
    });
    cy.get("[data-test-id='second-name']").type(personForm.secondName, {
      force: true,
    });
    cy.get("[data-test-id='third-name']").type(personForm.thirdName, {
      force: true,
    });
    cy.get("[data-test-id='birthday']").type(
      personForm.birthday.toDateString()
    );
    cy.get("[data-test-id='gender']").select(personForm.gender);

    cy.get("[data-test-id='create']").click();

    cy.url()
      .then((url) => ({ id: url.split("/").at(-1) }))
      .as("person");

    cy.cleanupPerson();
  });

  it("should allow to create person with relatives", () => {
    cy.login();
    cy.visit("/main/person/new");

    const father = {
      firstName: faker.internet.userName(),
      secondName: faker.internet.userName(),
      thirdName: faker.internet.userName(),
      birthday: faker.date.birthdate(),
      gender: Gender.MALE,
    };

    cy.get("[data-test-id='first-name']").type(father.firstName, {
      force: true,
    });
    cy.get("[data-test-id='second-name']").type(father.secondName, {
      force: true,
    });
    cy.get("[data-test-id='third-name']").type(father.thirdName, {
      force: true,
    });
    cy.get("[data-test-id='birthday']").type(father.birthday.toDateString());
    cy.get("[data-test-id='gender']").select(father.gender);

    cy.get("[data-test-id='create']").click();

    cy.url()
      .should("not.contain", "main/person/new")
      .then((url) => ({ id: url.split("/").at(-1) }))
      .as("fatherId");

    cy.get("[data-test-id='add-person']").click();

    cy.url().should("contain", "main/person/new");

    const mother = {
      firstName: faker.internet.userName(),
      secondName: faker.internet.userName(),
      thirdName: faker.internet.userName(),
      birthday: faker.date.birthdate(),
      gender: Gender.FEMALE,
    };

    cy.get("[data-test-id='first-name']").type(mother.firstName, {
      force: true,
    });
    cy.get("[data-test-id='second-name']").type(mother.secondName, {
      force: true,
    });
    cy.get("[data-test-id='third-name']").type(mother.thirdName, {
      force: true,
    });
    cy.get("[data-test-id='birthday']").type(mother.birthday.toDateString());
    cy.get("[data-test-id='gender']").select(mother.gender, { force: true });

    cy.get("@fatherId").then((data) => {
      const id = (data as { id?: string }).id;
      cy.get("[data-test-id='spouse']").select(id ?? "");
    });

    cy.get("[data-test-id='create']").click();

    cy.url()
      .should("not.contain", "main/person/new")
      .then((url) => ({ id: url.split("/").at(-1) }))
      .as("motherId");

    cy.get("[data-test-id='add-person']").click();

    cy.url().should("contain", "main/person/new");

    const son = {
      firstName: faker.internet.userName(),
      secondName: faker.internet.userName(),
      thirdName: faker.internet.userName(),
      birthday: faker.date.birthdate(),
      gender: Gender.MALE,
    };

    cy.get("[data-test-id='first-name']").type(son.firstName, {
      force: true,
    });
    cy.get("[data-test-id='second-name']").type(son.secondName, {
      force: true,
    });
    cy.get("[data-test-id='third-name']").type(son.thirdName, {
      force: true,
    });
    cy.get("[data-test-id='birthday']").type(son.birthday.toDateString());
    cy.get("[data-test-id='gender']").select(son.gender);

    cy.get("@fatherId").then((fatherData) =>
      cy.get("@motherId").then((motherData) => {
        const fatherId = (fatherData as { id?: string }).id;
        const motherId = (motherData as { id?: string }).id;

        cy.get("[data-test-id='father']").select(fatherId ?? "");
        cy.get("[data-test-id='mother']").select(motherId ?? "");
      })
    );

    cy.get("[data-test-id='create']").click();

    cy.url()
      .should("not.contain", "main/person/new")
      .then((url) => ({ id: url.split("/").at(-1) }))
      .as("sonId");

    cy.get("[data-test-id='name']").should(
      "have.text",
      `${son.secondName} ${son.firstName} ${son.thirdName}`
    );

    cy.get("[data-test-id='gender']")
      .invoke("attr", "data-test-value")
      .should("contain", son.gender);

    cy.get("@fatherId").then((fatherData) =>
      cy.get("@motherId").then((motherData) =>
        cy.get("@sonId").then((sonData) => {
          const fatherId = (fatherData as { id?: string }).id as string;
          const motherId = (motherData as { id?: string }).id as string;
          const sonId = (sonData as { id?: string }).id as string;

          cy.get("[data-test-id='mother']")
            .invoke("attr", "data-test-value")
            .should("contain", motherId);

          cy.get("[data-test-id='father']")
            .invoke("attr", "data-test-value")
            .should("contain", fatherId);

          cy.cleanupPersons({ ids: [fatherId, motherId, sonId] });
        })
      )
    );
  });
});
