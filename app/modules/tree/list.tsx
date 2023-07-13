import type { Tree } from "@prisma/client";
import { Table } from "../shared";

export const TreeList = ({ trees }: { trees: Pick<Tree, "name" | "id">[] }) => (
  <Table colDef={[{ field: "name", header: "Дерево" }]} data={trees} />
);
