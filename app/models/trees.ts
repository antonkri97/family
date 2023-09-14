import type {
  FullPersonValidated,
  PersonId,
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
  entities: Record<PersonId, FullPersonValidated>
): TreeNode[] | null {
  if (!persons.length) {
    return null;
  }

  return null;
}
