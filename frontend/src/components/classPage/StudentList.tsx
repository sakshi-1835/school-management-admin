const StudentTable = ({ students }: any) => {
  return (
    <table className="w-full border rounded-lg overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">Age</th>
        </tr>
      </thead>

      <tbody>
        {students.map((stu: any) => (
          <tr key={stu.id} className="border-t">
            <td className="p-2">{stu.name}</td>
            <td className="p-2">{stu.age}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable;
