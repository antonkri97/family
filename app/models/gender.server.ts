import { Gender } from "@prisma/client";
import { prisma } from "~/db.server";

export function getGenders() {
  return prisma.gender.findMany();
}
