import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getTrees } from "~/models/tree.server";
import type { TreeNode } from "~/models/trees";
import { requireUserId } from "~/session.server";
import { formatName } from "~/utils";
import type { SimplePersonValidated } from "~/validators/person";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const trees = await getTrees(userId);

  return json({ trees });
};

export default function Trees() {
  const { trees } = useLoaderData<typeof loader>();
  return (
    <div className="bg-gray-500">
      {trees.map((tree) => (
        <div className="flex flex-row gap-10" key={tree.uuid}>
          <Tree tree={tree}></Tree>
        </div>
      ))}
    </div>
  );
}

function Tree({ tree }: { tree: TreeNode }) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-row justify-center gap-5">
        {tree.person && <PersonCard person={tree.person} />}
        {tree.spouse && <PersonCard person={tree.spouse} />}
      </div>
      <div className="flex flex-row gap-4">
        {tree.children.map((children) => (
          <div key={children.uuid} className="mr-8">
            <Tree tree={children} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonCard({ person }: { person: SimplePersonValidated }) {
  return (
    <div className="flex h-40 w-10 border-2 border-gray-700 bg-white p-2">
      <div>{formatName(person)}</div>
    </div>
  );
}
