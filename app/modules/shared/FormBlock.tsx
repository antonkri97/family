import React from "react";

interface FormBlockProps {
  title?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const FormBlock: React.FC<FormBlockProps> = ({
  title,
  children,
  disabled,
}) => {
  return (
    <div
      className={`mt-4 rounded-md border border-gray-200 bg-white p-6 shadow-md ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              disabled,
            } as React.HTMLAttributes<HTMLInputElement>)
          : child
      )}
    </div>
  );
};
