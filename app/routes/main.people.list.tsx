import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPeopleListItems } from "~/models/people.server";
import { PeopleList } from "~/modules/people";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const peopleList = await getPeopleListItems({ id: userId });

  if (!peopleList) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ peopleList });
};

export default function PeopleListPage() {
  const { peopleList } = useLoaderData<typeof loader>();

  return <PeopleList people={peopleList} />;
}
