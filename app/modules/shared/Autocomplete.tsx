import type { ChangeEvent, KeyboardEvent } from "react";
import React, { useState, useEffect, useRef } from "react";

export interface Option {
  label: string;
  value: string;
}

interface AutocompleteProps {
  options: Option[];
  onSelect: (value: string) => void;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  onSelect,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Filter options when the input value changes
    const lowercasedValue = inputValue.toLowerCase();
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(lowercasedValue)
    );
    setFilteredOptions(filtered);
  }, [inputValue, options]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    openDropdown();
  };

  const handleSelect = (option: Option) => {
    setInputValue(option.label);
    onSelect(option.value);
    closeDropdown();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openDropdown();
    } else if (e.key === "Escape") {
      closeDropdown();
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const openDropdown = () => {
    setIsDropdownOpen(true);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleBlur = () => {
    // Delay closing the dropdown to allow time for a click on the dropdown options
    setTimeout(() => {
      closeDropdown();
    }, 200);
  };

  const handleOptionClick = (option: Option) => {
    handleSelect(option);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onClick={toggleDropdown}
        onBlur={handleBlur}
        placeholder="Search..."
        className="w-64 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        ref={inputRef}
      />

      {isDropdownOpen && (
        <ul className="absolute left-0 top-12 w-64 rounded-md border bg-white shadow-md">
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-2 text-gray-500">No suggestions found.</li>
          ) : (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
