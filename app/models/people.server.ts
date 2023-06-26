import type { User, People } from "@prisma/client";

import { prisma } from "~/db.server";

export function getPeople({
  id,
  userId,
}: Pick<People, "id"> & {
  userId: User["id"];
}) {
  return prisma.people.findFirst({
    where: { id, userId },
  });
}

export function getPeopleListItems({ userId }: { userId: User["id"] }) {
  return prisma.people.findMany({
    where: { userId },
  });
}

export function createPeople({
  firstName,
  secondName,
  thirdName,
  birthday,
  gender,
  bio,
  userId,
}: Pick<
  People,
  "firstName" | "secondName" | "thirdName" | "birthday" | "gender" | "bio"
> & {
  userId: User["id"];
}) {
  return prisma.people.create({
    data: {
      firstName,
      secondName,
      thirdName,
      birthday,
      gender,
      bio,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteNote({
  id,
  userId,
}: Pick<People, "id"> & { userId: User["id"] }) {
  return prisma.people.deleteMany({
    where: { id, userId },
  });
}
