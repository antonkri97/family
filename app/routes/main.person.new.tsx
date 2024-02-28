import type { LoaderFunctionArgs, NodeOnDiskFile } from "@remix-run/node";
import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PersonPage } from "~/components/PersonPage";

import { createPerson } from "~/models/person.server";
import type { EntityLoaderReturnType } from "~/modules/shared/loaders";
import { entitiesLoader } from "~/modules/shared/loaders";
import { requireUserId } from "~/session.server";
import { unwrapFormData, validatePersonForm } from "~/validators/create-person";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const entities: EntityLoaderReturnType = await entitiesLoader(request);

  return json(entities);
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      file: ({ filename }) => filename,
      directory: "public",
    }),
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  try {
    const validated = validatePersonForm(unwrapFormData(formData));
    createPerson(validated, userId);
    return redirect("/main/person/list");
  } catch (error) {
    return json(null, { status: 400 });
  }
};

export default function NewPersonPage() {
  const payload = useLoaderData<typeof loader>();

  return <PersonPage payload={payload} />;
}
