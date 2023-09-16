import type { TreeNode } from "./trees";
import { buildTree, buildTrees, getChildren } from "./trees";
import type { Gender } from "@prisma/client";

type Params = Parameters<typeof buildTrees>;
type Persons = Params[0];
type Entities = Params[1];
type Person = Persons[number];

function getEntities(persons: Persons): Entities {
  return Object.fromEntries(persons.map((p) => [p.id, p]));
}

function generatePerson(
  data: Partial<
    Pick<Person, "spouseId" | "fatherId" | "motherId" | "firstName">
  > & {
    id: string;
    gender: Gender;
  }
): Person {
  return {
    bio: "some-bio",
    birthday: "01.01.01",
    firstName: "firstName",
    secondName: "secondName",
    thirdName: "thirdName",
    fatherId: null,
    motherId: null,
    spouseId: null,
    ...data,
  };
}

const p1 = generatePerson({ id: "1", gender: "MALE", spouseId: "2" });
const p2 = generatePerson({ id: "2", gender: "FEMALE", spouseId: "1" });
const p3 = generatePerson({
  id: "3",
  gender: "MALE",
  fatherId: "1",
  motherId: "2",
  spouseId: "4",
});
const p4 = generatePerson({ id: "4", gender: "FEMALE", spouseId: "4" });
const p5 = generatePerson({
  id: "5",
  gender: "MALE",
  fatherId: "3",
  motherId: "4",
});
const p6 = generatePerson({
  id: "6",
  gender: "MALE",
  fatherId: "3",
  motherId: "4",
  spouseId: "7",
});
const p7 = generatePerson({ id: "7", gender: "FEMALE", spouseId: "6" });
const p8 = generatePerson({
  id: "8",
  gender: "FEMALE",
  fatherId: "6",
  motherId: "7",
});

const persons: Persons = [p1, p2, p3, p4, p5, p6, p7, p8];

describe("buildTrees", () => {
  test("should return empty array", () => {
    expect(buildTrees([], {})).toStrictEqual([]);
  });
});

describe("buildTree", () => {
  const father = generatePerson({
    id: "1",
    gender: "MALE",
    spouseId: "2",
    firstName: "FIRST_FATHER",
  });
  const wife = generatePerson({
    id: "2",
    gender: "FEMALE",
    spouseId: "1",
    firstName: "FIRST_MOTHER",
  });
  const son = generatePerson({
    firstName: "FIRST_SON",
    id: "3",
    gender: "MALE",
    fatherId: "1",
    motherId: "2",
    spouseId: "4",
  });
  const secondGenWife = generatePerson({
    id: "4",
    spouseId: son.id,
    fatherId: null,
    motherId: null,
    gender: "FEMALE",
  });
  const thirdGenFather = generatePerson({
    id: "5",
    fatherId: son.id,
    motherId: secondGenWife.id,
    gender: "MALE",
  });
  const thirdGenWife = generatePerson({
    id: "6",
    fatherId: null,
    motherId: null,
    gender: "MALE",
  });
  const forthGenSon = generatePerson({
    id: "7",
    fatherId: thirdGenFather.id,
    motherId: thirdGenWife.id,
    gender: "MALE",
  });

  test("should build simple tree", () => {
    const children = getChildren([father, wife, son, secondGenWife]);
    const entities = getEntities([father, wife, son, secondGenWife]);

    const actualTree = buildTree(father, children, entities);
    const expectedTree: TreeNode = {
      person: father,
      father: null,
      mother: null,
      spouse: wife,
      children: [
        {
          person: son,
          father: father,
          mother: wife,
          spouse: secondGenWife,
          children: [],
        },
      ],
    };

    expect(actualTree).toStrictEqual(expectedTree);
  });

  test("should build two level nested tree", () => {
    const persons = [
      father,
      wife,
      son,
      secondGenWife,
      thirdGenFather,
      thirdGenWife,
      forthGenSon,
    ];
    const children = getChildren(persons);
    const entities = getEntities(persons);
    const actualTree = buildTree(father, children, entities);

    const expectedTree: TreeNode = {
      person: father,
      spouse: wife,
      father: null,
      mother: null,
      children: [
        {
          person: son,
          spouse: secondGenWife,
          father: father,
          mother: wife,
          children: [
            {
              person: thirdGenFather,
              spouse: null,
              father: son,
              mother: secondGenWife,
              children: [
                {
                  person: forthGenSon,
                  father: thirdGenFather,
                  mother: thirdGenWife,
                  spouse: null,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };

    expect(actualTree).toStrictEqual(expectedTree);
  });
});

describe("getChildren", () => {
  test("getChildren should generate map of children", () => {
    expect(getChildren(persons)).toStrictEqual({
      [p1.id]: [p3],
      [p3.id]: [p5, p6],
      [p6.id]: [p8],
    });
  });
});
