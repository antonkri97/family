import React from "react";
import { z, ZodError } from "zod";

const buttonSchema = z.object({
  type: z.literal("submit"),
  label: z.string(),
  variant: z
    .union([z.literal("primary"), z.literal("secondary"), z.literal("danger")])
    .optional(),
  className: z.string().optional(),
});

export type ButtonProps = z.infer<typeof buttonSchema>;

export const Button: React.FC<ButtonProps> = ({
  type,
  label,
  variant,
  className,
}) => {
  try {
    buttonSchema.parse({ type, label, variant, className }); // Validate the props

    let buttonClass =
      "rounded-md px-4 py-2 text-white focus:outline-none focus:ring";

    switch (variant) {
      case "primary":
        buttonClass +=
          " bg-indigo-500 hover:bg-indigo-600 focus:border-indigo-300";
        break;
      case "secondary":
        buttonClass += " bg-gray-500 hover:bg-gray-600 focus:border-gray-300";
        break;
      case "danger":
        buttonClass += " bg-red-500 hover:bg-red-600 focus:border-red-300";
        break;
      default:
        buttonClass +=
          " bg-indigo-500 hover:bg-indigo-600 focus:border-indigo-300";
        break;
    }

    if (className) {
      buttonClass += ` ${className}`;
    }

    return (
      <button type={type} className={buttonClass}>
        {label}
      </button>
    );
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle validation errors, e.g., log them or show to the user
      console.error(error.errors);
    } else {
      // Handle other types of errors
      console.error(error);
    }

    return null; // Return null if there are validation errors
  }
};
