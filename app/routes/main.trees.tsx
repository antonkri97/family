import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getTrees } from "~/models/tree.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const trees = await getTrees(userId);

  return json({ trees });
};

export default function Trees() {
  const { trees } = useLoaderData<typeof loader>();

  return <h1>Деревья</h1>;
}
