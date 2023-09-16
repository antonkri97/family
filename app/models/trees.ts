import type {
  FullPersonValidated,
  SimplePersonValidated,
} from "~/validators/person";

export interface TreeNode {
  person: SimplePersonValidated;
  spouse: SimplePersonValidated | null;
  father: SimplePersonValidated | null;
  mother: SimplePersonValidated | null;
  children: TreeNode[];
}

export function buildTrees(
  persons: FullPersonValidated[],
  entities: Record<string, FullPersonValidated>
): TreeNode[] | null {
  if (!persons.length) {
    return null;
  }

  const children = getChildren(persons);

  return null;
}

export function getChildren(
  persons: FullPersonValidated[]
): Record<string, FullPersonValidated[]> {
  const children: Record<string, FullPersonValidated[]> = {};

  persons.forEach((person) => {
    if (person.fatherId) {
      const lookup = children[person.fatherId];

      children[person.fatherId] = lookup ? [...lookup, person] : [person];
    }
  });

  return children;
}
