import type { People } from "@prisma/client";
import { Table } from "../shared";

export const PeopleList = ({
  people,
}: {
  people: (Pick<
    People,
    "id" | "firstName" | "secondName" | "thirdName" | "birthday"
  > & { spouse?: string })[];
}) => (
  <Table
    colDef={[
      { field: "firstName", header: "Имя" },
      { field: "secondName", header: "Фамилия" },
      { field: "thirdName", header: "Отчество" },
      { field: "birthday", header: "Дата рождения" },
      { field: "spouse", header: "Супруг(а)" },
    ]}
    data={people}
  />
);
