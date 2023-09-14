import type { TreeNode } from "./trees";
import { buildTrees } from "./trees";
import type { Gender } from "@prisma/client";

type Params = Parameters<typeof buildTrees>;
type Persons = Params[0];
type Entities = Params[1];
type Person = Persons[number];

function generatePerson(
  data: Partial<Pick<Person, "spouseId" | "fatherId" | "motherId">> & {
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

const d1 = generatePerson({ id: "10", gender: "MALE", spouseId: "11" });
const d2 = generatePerson({ id: "11", gender: "FEMALE", spouseId: "10" });
const d3 = generatePerson({
  id: "12",
  gender: "MALE",
  fatherId: "10",
  motherId: "11",
  spouseId: "13",
});
const d4 = generatePerson({ id: "13", gender: "FEMALE", spouseId: "12" });
const d5 = generatePerson({
  id: "14",
  gender: "MALE",
  fatherId: "12",
  motherId: "13",
});
const d6 = generatePerson({
  id: "15",
  gender: "MALE",
  fatherId: "12",
  motherId: "13",
  spouseId: "16",
});
const d7 = generatePerson({ id: "16", gender: "FEMALE", spouseId: "15" });
const d8 = generatePerson({
  id: "17",
  gender: "FEMALE",
  fatherId: "15",
  motherId: "16",
});
const d9 = generatePerson({
  id: "18",
  gender: "MALE",
  fatherId: "15",
  motherId: "16",
  spouseId: "19",
});
const d10 = generatePerson({ id: "19", gender: "FEMALE", spouseId: "18" });

function generateEntities(persons: Persons): Entities {
  return Object.fromEntries(persons.map((p) => [p.id, p]));
}

const singleRootPersons: Persons = [p1, p2, p3, p4, p5, p6, p7, p8];
const singleRootEntities: Entities = generateEntities(singleRootPersons);

const singleRootTree: TreeNode[] = [
  {
    person: p1,
    father: null,
    mother: null,
    spouse: p2,
    children: [
      {
        person: p3,
        father: p1,
        mother: p2,
        spouse: p4,
        children: [
          {
            person: p5,
            father: p3,
            mother: p4,
            spouse: null,
            children: [],
          },
          {
            person: p6,
            father: p3,
            mother: p4,
            spouse: p7,
            children: [
              {
                person: p8,
                father: p6,
                mother: p7,
                spouse: null,
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

const manyRootsTree: TreeNode[] = [
  ...singleRootTree,
  {
    person: d1,
    father: null,
    mother: null,
    spouse: d2,
    children: [
      {
        person: d3,
        father: d1,
        mother: d2,
        spouse: d4,
        children: [
          {
            person: d5,
            father: d3,
            mother: d4,
            spouse: null,
            children: [],
          },
          {
            person: d6,
            father: d3,
            mother: d4,
            spouse: d7,
            children: [
              {
                person: d8,
                father: d6,
                mother: d7,
                spouse: null,
                children: [],
              },
              {
                person: d9,
                father: d6,
                mother: d7,
                spouse: d10,
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

const manyRootsPersons = [
  ...singleRootPersons,
  d1,
  d2,
  d3,
  d4,
  d5,
  d6,
  d7,
  d8,
  d9,
  d10,
];
const manyRootsEntities = generateEntities(manyRootsPersons);

test("should return empty array", () => {
  expect(buildTrees([], {})).toStrictEqual([]);
});

test("should build tree", () => {
  expect(buildTrees(singleRootPersons, singleRootEntities)).toStrictEqual(
    singleRootTree
  );
});

test("should build one-node tree", () => {
  const expectedTree: TreeNode = {
    person: p1,
    father: null,
    mother: null,
    spouse: null,
    children: [],
  };
  expect(buildTrees([p1], generateEntities([p1]))).toStrictEqual(expectedTree);
});

test("should build tree with invalid tree data", () => {
  const expectedTree: TreeNode = {
    person: p1,
    spouse: null,
    mother: null,
    father: null,
    children: [],
  };

  expect(
    buildTrees([p1, p6, p3], generateEntities([p1, p6, p3]))
  ).toStrictEqual(expectedTree);
});

test("should build tree with many roots", () => {
  expect(buildTrees(manyRootsPersons, manyRootsEntities)).toStrictEqual(
    manyRootsTree
  );
});
