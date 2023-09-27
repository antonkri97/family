import type { Person } from "@prisma/client";
import { Table } from "../shared";

export const PersonList = ({
  person,
}: {
  person: Pick<
    Person,
    "id" | "firstName" | "secondName" | "thirdName" | "birthday"
  >[];
}) => (
  <Table
    colDef={[
      { field: "firstName", header: "Имя" },
      { field: "secondName", header: "Фамилия" },
      { field: "thirdName", header: "Отчество" },
      { field: "birthday", header: "Дата рождения" },
    ]}
    data={person}
  />
);
