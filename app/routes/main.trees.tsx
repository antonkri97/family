import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { type PropsWithChildren, type ReactNode } from "react";
import { getTrees } from "~/models/tree.server";
import type { TreeNode } from "~/models/trees";
import { requireUserId } from "~/session.server";
import { formatGender, formatName } from "~/utils";
import type { SimplePersonValidated } from "~/validators/person";
import { FaUser } from "react-icons/fa";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const trees = await getTrees(userId);

  return json({ trees });
};

export default function Trees() {
  const { trees } = useLoaderData<typeof loader>();

  const containerStyle = {
    width: "100%", // Set width to 100% of parent container
    height: "100%", // Set height to 100% of parent container
    overflow: "auto",
  };

  return (
    <div className="flex justify-center" style={containerStyle}>
      {trees.map((tree) => (
        <div className="flex space-x-4" key={tree.person.id}>
          <Tree tree={tree} />
        </div>
      ))}
    </div>
  );
}

const Tree = ({ tree }: { tree: TreeNode }) => {
  return (
    <div className="flex justify-center">
      <FamilyConnection
        leftPerson={<PersonCard person={tree.person} />}
        rightPerson={tree.spouse && <PersonCard person={tree.spouse} />}
      >
        {tree.children.map((child) => (
          <Tree key={child.person.id} tree={child} />
        ))}
      </FamilyConnection>
    </div>
  );
};

const FamilyConnection = ({
  leftPerson,
  rightPerson,
  children,
}: PropsWithChildren<{
  leftPerson: ReactNode;
  rightPerson: ReactNode;
}>) => {
  const isFamilyTree = (
    child: ReactNode
  ): child is React.ReactElement<{ children: ReactNode }> =>
    React.isValidElement(child) && child.type === Tree;

  return (
    <div className="relative">
      <div className="relative flex items-center justify-center">
        <div className="flex flex-col items-center">{leftPerson}</div>
        <div className="flex flex-col items-center">{rightPerson}</div>
      </div>
      {children && (
        <div className="relative mt-4 flex justify-center space-y-4">
          {React.Children.map(children, (child, index) => (
            <div key={index} className="ml-2">
              {isFamilyTree(child) ? (
                <div className="ml-2">{React.cloneElement(child)}</div>
              ) : (
                child
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PersonCard = ({
  person,
  children,
}: PropsWithChildren<{
  person: SimplePersonValidated;
}>) => {
  const { birthday } = person;
  return (
    <div className="h-54 w-54 m-2 min-w-0 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-r from-slate-800 to-slate-500 text-white shadow-lg">
      <div className="flex h-full flex-col justify-between">
        <div className="p-2">
          <div className="mb-2 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
              <FaUser size={24} color="#4A5568" />{" "}
              {/* Adjust size and color as needed */}
            </div>
          </div>
          <div className="mb-1 line-clamp-2 overflow-hidden overflow-ellipsis text-xl font-bold">
            {formatName(person)}
          </div>
          <div className="flex space-x-2">
            <div>
              <p className="text-sm">Birthday:</p>
              <p className="text-sm font-semibold">{birthday}</p>
            </div>
            <div>
              <p className="mb-1 text-sm">Gender:</p>
              <p className="text-sm font-semibold">{formatGender(person)}</p>
            </div>
          </div>
        </div>
        {children && <div className="space-y-2">{children}</div>}
      </div>
    </div>
  );
};
