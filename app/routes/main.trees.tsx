import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getTrees } from "~/models/tree.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const trees = await getTrees(userId);

  return json({ trees });
};

export default function Trees() {
  const { trees } = useLoaderData<typeof loader>();
  console.log(trees);

  return <h1>Деревья</h1>;
}
