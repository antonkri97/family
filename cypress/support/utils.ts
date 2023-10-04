import type { Person } from "@prisma/client";

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function formatName(
  person:
    | Partial<Pick<Person, "firstName" | "secondName" | "thirdName">>
    | null
    | undefined
): string {
  const { secondName, firstName, thirdName } = person ?? {
    firstName: "",
    secondName: "",
    thirdName: "",
  };

  return `${secondName} ${firstName} ${thirdName}`;
}
