interface RadioProps {
  refProp?: React.RefObject<HTMLInputElement>;
  name: string;
  dataTestId?: string | null;
  options: Array<{ value: string; label: string }>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked: "MALE" | "FEMALE" | undefined;
}

export const Radio: React.FC<RadioProps> = ({
  refProp,
  name,
  dataTestId,
  options,
  onChange,
  checked,
}) => {
  return (
    <fieldset>
      <div className="mb-4">
        {options.map((radio) => (
          <div key={radio.value}>
            <input
              data-test-id={dataTestId}
              ref={refProp}
              name={name}
              id={radio.value}
              className="rounded-md border p-2 focus:border-indigo-500 focus:outline-none"
              type="radio"
              onChange={onChange}
              value={radio.value}
              defaultChecked={radio.value === checked}
            />
            <label className="mb-2 ml-2  text-sm font-semibold text-gray-600">
              {radio.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};
