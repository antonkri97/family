import { Gender, Prisma, type Person, type User } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getPerson({
  id,
  userId,
}: Pick<Person, "id"> & {
  userId: User["id"];
}) {
  return prisma.person.findFirst({
    where: { id, userId },
    include: { wife: true, husband: true },
  });
}

export async function getPersonListItems({ id }: Pick<User, "id">) {
  const ps = await prisma.person.findMany({
    where: { userId: id },
    include: { wife: true, husband: true },
  });

  return ps.map((person) => ({
    ...person,
    spouse: person.wife?.firstName ?? person.husband?.firstName,
  }));
}

export async function createPerson(
  person: Pick<
    Person,
    | "firstName"
    | "secondName"
    | "thirdName"
    | "birthday"
    | "gender"
    | "bio"
    | "spouseId"
  > & {
    userId: User["id"];
  }
) {
  const {
    firstName,
    secondName,
    thirdName,
    birthday,
    gender,
    bio,
    userId,
    spouseId,
  } = person;

  const newPerson = await prisma.person.create({
    data: {
      firstName,
      secondName,
      thirdName,
      birthday,
      bio,
      gender,
      ...(spouseId
        ? gender === Gender.MALE
          ? { wife: { connect: { id: spouseId } } }
          : { husband: { connect: { id: spouseId } } }
        : {}),
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  if (spouseId && newPerson) {
    prisma.person.update({
      where: { id: spouseId },
      data:
        gender === Gender.FEMALE
          ? { husband: { connect: { id: newPerson.id } } }
          : { wife: { connect: { id: newPerson.id } } },
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
