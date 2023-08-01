import { Gender, Prisma, type People, type User } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getPeople({
  id,
  userId,
}: Pick<People, "id"> & {
  userId: User["id"];
}) {
  return prisma.people.findFirst({
    where: { id, userId },
    include: { wife: true, husband: true },
  });
}

export async function getPeopleListItems({ id }: Pick<User, "id">) {
  const ps = await prisma.people.findMany({
    where: { userId: id },
    include: { wife: true, husband: true },
  });

  return ps.map((people) => ({
    ...people,
    spouse: people.wife?.firstName ?? people.husband?.firstName,
  }));
}

export async function createPeople(
  people: Pick<
    People,
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
  } = people;

  const newPeople = await prisma.people.create({
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

  if (spouseId && newPeople) {
    prisma.people.update({
      where: { id: spouseId },
      data:
        gender === Gender.FEMALE
          ? { husband: { connect: { id: newPeople.id } } }
          : { wife: { connect: { id: newPeople.id } } },
    });
  }

  return newPeople;
}

export function deletePeople({
  id,
  userId,
}: Pick<People, "id"> & { userId: User["id"] }) {
  return prisma.people.deleteMany({
    where: { id, userId },
  });
}
