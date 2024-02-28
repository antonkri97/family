import React from "react";
import type { Option } from "~/modules/shared/Autocomplete";
import { Autocomplete } from "~/modules/shared/Autocomplete";

interface FindRelativesProps {
  label: string;
  options: Option[];
}

export const FindRelatives: React.FC<FindRelativesProps> = ({
  label,
  options,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <Autocomplete
        options={options}
        onSelect={(value) => console.log(value)}
        name="relative"
      />
    </div>
  );
};
