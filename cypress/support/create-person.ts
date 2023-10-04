// Use this to create a person by user email
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/create-person.ts username@example.com
// and that person will be created

import { faker } from "@faker-js/faker";
import { Gender, Prisma } from "@prisma/client";
import { installGlobals } from "@remix-run/node";

import { prisma } from "~/db.server";

installGlobals();

export async function createPerson(initialValue?: {
  email?: string;
  gender: Gender;
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
}) {
  if (!initialValue?.email) {
    throw new Error("email required");
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email: initialValue.email },
    });

    const sexType = initialValue?.gender === "MALE" ? "male" : "female";

    if (user?.id) {
      const personForm: Partial<
        Parameters<(typeof prisma)["person"]["create"]>[0]["data"]
      > = {
        firstName: faker.person.firstName(sexType),
        secondName: faker.person.lastName(sexType),
        thirdName: faker.person.middleName(sexType),
        birthday: faker.date.birthdate().toDateString(),
        gender: initialValue?.gender ?? Gender.MALE,
        ...(initialValue?.fatherId && {
          father: { connect: { id: initialValue.fatherId } },
        }),
        ...(initialValue?.motherId && {
          mother: { connect: { id: initialValue.motherId } },
        }),
        ...(initialValue?.spouseId && {
          [initialValue.gender === "MALE" ? "wife" : "husband"]: {
            connect: { id: initialValue.spouseId },
          },
        }),
      };

      const person = await prisma.person.create({
        data: {
          firstName: personForm.firstName ?? "",
          gender: personForm.gender ?? Gender.MALE,
          birthday: personForm.birthday,
          user: {
            connect: {
              id: user.id,
            },
          },
          ...personForm,
        },
      });

      if (initialValue?.spouseId && person) {
        prisma.person.update({
          where: { id: initialValue.spouseId },
          data: {
            [person.gender === "MALE" ? "wife" : "husband"]: {
              connect: { id: person.id },
            },
          },
        });
      }

      console.log(JSON.stringify(person));
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      console.log("User not found");
    } else {
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

const person = JSON.parse(process.argv[2]);

createPerson(person);
