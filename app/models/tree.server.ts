import type { Tree } from "@prisma/client";
import { prisma } from "~/db.server";
import { GetPersonsListItems, getPersonListItems } from "./person.server";

export async function createTree(data: Pick<Tree, "name" | "userId">) {
  return (await prisma.tree.create({ data })).id;
}

export async function getTrees(userId: string) {
  const persons = await getPersonListItems({ id: userId });

  const entitiesById: Map<string, (typeof persons)[number]> = new Map();

  persons.forEach((person) => {
    entitiesById.set(person.id, person);
  });

  const fathers = toRoot(persons);

  return fathers;
}

export function getTree({ id }: Pick<Tree, "id">) {
  return prisma.tree.findFirst({
    where: { id },
  });
}

function toRoot(
  persons: GetPersonsListItems
): Record<string, { wifes: string[]; children: string[] }> {
  const fathers: Record<
    string,
    { root: boolean; wifes: string[]; children: string[] }
  > = {};

  const entitiesById: Map<string, (typeof persons)[number]> = new Map();

  persons.forEach((person) => {
    entitiesById.set(person.id, person);
  });

  persons.forEach((person) => toRoot2(person));

  function toRoot2(p: GetPersonsListItems[number]) {
    const father = entitiesById.get(p?.fatherId ?? "");
    if (p.fatherId && father) {
      const { wifes, children } = fathers[p.fatherId] ?? {
        wifes: [],
        children: [],
      };

      p.motherId && wifes.push(p.motherId);
      children.push(p.id);

      fathers[p.fatherId] = { wifes, children, root: false };

      toRoot2(father);
    }

    if (!p.fatherId) {
    }

    return;
  }

  return fathers;
}
