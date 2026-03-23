interface Props {
  students: any[];
  pagination: {
    page: number;
    totalPages: number;
  };
  onEdit: (student: any) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
}

const StudentsTable: React.FC<Props> = ({
  students,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
}) => {
  const { page, totalPages } = pagination;

  return (
    <div>
      <h2 className="font-bold mb-2">Students</h2>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Age</th>
            <th className="p-2 text-left">Class</th>
            <th className="p-2 text-left">Section</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.length > 0 ? (
            students.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.age}</td>
                <td className="p-2">{s.class_name}</td>
                <td className="p-2">{s.section_name}</td>

                <td className="p-2 space-x-2">
                  <button className="text-blue-500" onClick={() => onEdit(s)}>
                    Edit
                  </button>

                  <button
                    className="text-red-500"
                    onClick={() => onDelete(s.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentsTable;
