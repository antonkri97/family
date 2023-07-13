import type { Tree } from "@prisma/client";
import { prisma } from "~/db.server";

export async function createTree(data: Pick<Tree, "name" | "userId">) {
  return (await prisma.tree.create({ data })).id;
}

export function getTrees(userId: string) {
  return prisma.tree.findMany({ where: { userId } });
}

export function getTree({ id }: Pick<Tree, "id">) {
  return prisma.tree.findFirst({
    where: { id },
  });
}
