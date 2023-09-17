import { getPersonListItems } from "./person.server";
import { getSchemas } from "~/validators/person";
import { buildTrees } from "./trees";

export async function getTrees(userId: string) {
  const personsRaw = await getPersonListItems({ id: userId });
  const schema = getSchemas({
    father: true,
    husband: true,
    mother: true,
    wife: true,
  });
  const validated = personsRaw.map((person) => schema.parse(person));

  const entities = Object.fromEntries(
    validated.map((person) => [person.id, person])
  );

  return buildTrees(validated, entities);
}
