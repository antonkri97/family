import { type Person, type User } from "@prisma/client";

import { prisma } from "~/db.server";
import { isMale } from "~/utils";
import { simplePersonSchema } from "~/validators/person";
import type {
  SimplePersonValidated,
  UpdatePersonValidated,
} from "~/validators/person";

type CreatePerson = Pick<
  Person,
  | "firstName"
  | "secondName"
  | "thirdName"
  | "birthday"
  | "gender"
  | "bio"
  | "spouseId"
  | "motherId"
  | "fatherId"
>;

export async function getPerson({
  id,
  userId,
}: Pick<Person, "id"> & {
  userId: User["id"];
}) {
  return prisma.person.findFirst({
    where: { id, userId },
    include: { wife: true, husband: true, father: true, mother: true },
  });
}

export async function getPersonListItems({ id }: Pick<User, "id">) {
  const persons = await prisma.person.findMany({
    where: { userId: id },
  });

  const validated: SimplePersonValidated[] = [];

  for (const person of persons) {
    const parse = simplePersonSchema.safeParse(person);

    if (parse.success) {
      validated.push(parse.data);
    } else {
      console.error(`can't validate this person`, person, parse.error);
    }
  }

  return validated;
}

export type GetPersonsListItems = Awaited<
  ReturnType<typeof getPersonListItems>
>;

export async function createPerson(
  person: CreatePerson & {
    userId: User["id"];
  }
) {
  let data: Parameters<typeof prisma.person.create>[0]["data"];

  data = {
    firstName: person.firstName,
    secondName: person.secondName,
    thirdName: person.thirdName,
    birthday: person.birthday,
    bio: person.bio,
    gender: person.gender,
    user: {
      connect: {
        id: person.userId,
      },
    },
  };

  if (person.spouseId) {
    const spouse = isMale(person) ? "wife" : "husband";
    data[spouse] = {
      connect: {
        id: person.spouseId,
      },
    };
  }

  if (person.motherId) {
    data.mother = { connect: { id: person.motherId } };
  }

  if (person.fatherId) {
    data.father = { connect: { id: person.fatherId } };
  }

  const newPerson = await prisma.person.create({ data });

  if (person.spouseId && newPerson) {
    const spouse = isMale(person) ? "wife" : "husband";
    prisma.person.update({
      where: { id: person.spouseId },
      data: { [spouse]: { connect: { id: newPerson.id } } },
    });
  }

  return newPerson;
}

export async function updatePerson(
  personId: string,
  person: UpdatePersonValidated
) {
  const updatedPerson = await prisma.person.update({
    data: {
      firstName: person.firstName,
      secondName: person.secondName,
      thirdName: person.thirdName,
      gender: person.gender,
      ...(person.fatherId && { father: { connect: { id: person.fatherId } } }),
      ...(person.motherId && { mother: { connect: { id: person.motherId } } }),
      ...(person.spouseId && {
        [isMale(person) ? "wife" : "husband"]: {
          connect: {
            id: person.spouseId,
          },
        },
      }),
    },
    where: {
      id: personId,
    },
  });

  if (person.spouseId && updatedPerson) {
    prisma.person.update({
      where: { id: person.spouseId },
      data: {
        [isMale(person) ? "husband" : "wife"]: {
          connect: { id: updatedPerson.id },
        },
      },
    });
  }
}

export function deletePerson({
  id,
  userId,
}: Pick<Person, "id"> & { userId: User["id"] }) {
  return prisma.person.deleteMany({
    where: { id, userId },
  });
}
