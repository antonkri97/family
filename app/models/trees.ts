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
    return [];
  }

  const children = getChildren(persons);
  const trees: TreeNode[] = [];

  persons.forEach((person) => {
    if (person.fatherId === null) {
      trees.push(buildTree(person, children, entities));
    }
  });

  return trees;
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

export function buildTree(
  person: FullPersonValidated,
  children: Record<string, FullPersonValidated[]>,
  entities: Record<string, FullPersonValidated>
): TreeNode {
  const _children = children[person.id] ?? [];
  return {
    person: person,
    spouse: person.spouseId ? entities[person.spouseId] : null,
    father: person.fatherId ? entities[person.fatherId] : null,
    mother: person.motherId ? entities[person.motherId] : null,
    children: _children.map(({ id }) =>
      buildTree(entities[id], children, entities)
    ),
  };
}
