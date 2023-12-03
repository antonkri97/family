/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import { Form, Link } from "@remix-run/react";
import {
  FaUserFriends,
  FaTree,
  FaAddressBook,
  FaSignOutAlt,
} from "react-icons/fa";

interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const NavLink = ({ to, label, icon }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className="flex items-center p-4 text-gray-800 transition-all duration-300 hover:bg-indigo-200"
    >
      <div className="mr-2">{icon}</div>
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  );
};

const LogoutButton = () => (
  <Form action="/logout" method="post">
    <button
      className="flex  w-full items-center p-4 text-gray-800 transition-all duration-300 hover:bg-indigo-200"
      type="submit"
    >
      <div className="mr-2">
        <FaSignOutAlt size={20} />
      </div>
      <span className="text-sm font-semibold">Выйти</span>
    </button>
  </Form>
);

const links: NavLinkProps[] = [
  {
    to: "person/list",
    label: "Люди",
    icon: <FaUserFriends size={20} />,
  },
  {
    to: "person/new",
    label: "Добавить человека",
    icon: <FaAddressBook size={20} />,
  },
  {
    to: "trees",
    label: "Деревья",
    icon: <FaTree size={20} />,
  },
];

const NavLinks = () => {
  return (
    <div className="flex h-screen w-64 flex-col overflow-hidden rounded-lg bg-white shadow-lg">
      {links.map((link) => (
        <NavLink
          to={link.to}
          icon={link.icon}
          label={link.label}
          key={link.to}
        />
      ))}
      <LogoutButton />
    </div>
  );
};

export default NavLinks;
