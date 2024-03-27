export const Textarea = ({
  label,
  name,
  dataTestId,
  defaultValue,
}: {
  label: string;
  name: string;
  dataTestId?: string | null;
  defaultValue?: string;
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-gray-600">
      {label}
    </label>
    <textarea
      defaultValue={defaultValue}
      data-test-id={dataTestId}
      name={name}
      rows={8}
      className="w-full rounded-md border p-2 focus:border-indigo-500 focus:outline-none"
    />
  </div>
);
