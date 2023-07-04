import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getSecondName } from "~/models/second-name.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  invariant(params.secondNameId, "secondNameId not found");

  const secondName = await getSecondName({ id: params.secondNameId, userId });
  if (!secondName) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ secondName });
};

export default function SecondNameDetailsPage() {
  const { secondName } = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{secondName.secondName}</h3>
    </div>
  );
}
