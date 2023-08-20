export interface ColDef {
  header: string;
  field: string;
}

export const Table = ({
  colDef,
  data,
}: {
  colDef: ColDef[];
  data: ({ id: string | number } & Record<
    string,
    string | number | boolean | null
  >)[];
}) => (
  <table className="table-auto border-collapse border border-slate-400">
    <thead>
      <tr>
        {colDef.map((col) => (
          <th key={col.field} className="border border-slate-300">
            {col.header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row) => (
        <tr key={row.id}>
          {colDef.map((col) => (
            <td key={col.field} className="border border-slate-300">
              {row[col.field]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
