import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getTrees } from "~/models/tree.server";
import { TreeList } from "~/modules/tree";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const trees = await getTrees(userId);

  if (!trees) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ trees });
};

export default function Trees() {
  const { trees } = useLoaderData<typeof loader>();

  return <TreeList trees={trees} />;
}
