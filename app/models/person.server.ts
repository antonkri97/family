import { type Person, type User } from "@prisma/client";

import { prisma } from "~/db.server";
import { isMale } from "~/utils";

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
    include: { wife: true, husband: true, father: true },
  });

  return persons.map((person) => ({
    ...person,
    spouse: person.wife?.firstName ?? person.husband?.firstName,
  }));
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

export function deletePerson({
  id,
  userId,
}: Pick<Person, "id"> & { userId: User["id"] }) {
  return prisma.person.deleteMany({
    where: { id, userId },
  });
}
