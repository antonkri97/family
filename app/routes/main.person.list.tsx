import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPersonListItems } from "~/models/person.server";
import { PersonList } from "~/modules/person";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const peopleList = await getPersonListItems({ id: userId });

  if (!peopleList) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ peopleList });
};

export default function PersonListPage() {
  const { peopleList } = useLoaderData<typeof loader>();

  return <PersonList person={peopleList} />;
}
