export interface ColDef {
  header: string;
  field: string;
}

interface TableProps {
  colDef: ColDef[];
  data: ({ id: string | number } & Record<
    string,
    string | number | boolean | null
  >)[];
}

export const Table: React.FC<TableProps> = ({ colDef, data }) => {
  return (
    <div className="mt-4 overflow-hidden rounded-lg bg-white shadow-lg">
      <table className="w-full table-fixed">
        <thead>
          <tr>
            {colDef.map((col) => (
              <th
                key={col.field}
                className="border-b border-gray-200 px-4 py-2 text-left"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              className="hover:bg-gradient-to-r hover:from-slate-300 hover:to-slate-100"
              key={rowIndex}
            >
              {colDef.map((col) => (
                <td
                  key={col.field}
                  className="border-b border-gray-200 px-4 py-2"
                >
                  {row[col.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
