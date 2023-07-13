import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getTree } from "~/models/tree.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.id, "tree id not found");

  const tree = await getTree({ id: params.id });
  if (!tree) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ tree });
};

export default function TreeDetailsPage() {
  const { tree } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{tree.name}</h3>
    </div>
  );
}
