export const Textarea = ({ label, name }: { label: string; name: string }) => (
  <div>
    <label className="flex w-full flex-col gap-1">
      <span>{label}</span>
      <textarea
        name={name}
        rows={8}
        className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
      />
    </label>
  </div>
);
