import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  TypedResponse,
} from "@remix-run/node";
import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { getPerson, updatePerson } from "~/models/person.server";
import type { EntityLoaderReturnType } from "~/modules/shared/loaders";
import { entitiesLoader } from "~/modules/shared/loaders";
import { getUserId } from "~/session.server";
import { useLoaderData } from "@remix-run/react";
import { PersonPage } from "~/components/PersonPage";
import { type SimplePersonValidated } from "~/validators/person";
import { unwrapFormData, validatePersonForm } from "~/validators/create-person";

export const loader = async ({
  params,
  request,
}: LoaderFunctionArgs): Promise<
  TypedResponse<{ person: SimplePersonValidated } & EntityLoaderReturnType>
> => {
  const userId = await getUserId(request);

  invariant(params.id, "Missing id param");
  invariant(userId, "Missing userId");

  const person = await getPerson({ id: params.id, userId });

  if (!person) {
    throw new Response("Not found", { status: 404 });
  }

  const entities: EntityLoaderReturnType = await entitiesLoader(request);

  return json({ ...entities, person });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.id, "Missing id param");

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

    updatePerson(params.id, validated);
  } catch (error) {
    return json(error, { status: 400 });
  }

  return redirect(`/main/person/list`);
};

export default function EditPerson() {
  const payload = useLoaderData<typeof loader>();
  return <PersonPage payload={payload} />;
}
