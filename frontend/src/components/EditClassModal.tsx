type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  className: string;
  setClassName: (val: string) => void;
  schoolName: string;
  setSchoolName: (val: string) => void;
  schools: any[];
};

const EditClassModal = ({
  visible,
  onClose,
  onSubmit,
  className,
  setClassName,
  schoolName,
  setSchoolName,
  schools,
}: Props) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80">
        <h2 className="font-bold mb-3 text-lg">Edit Class</h2>

        <input
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />

        <select
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        >
          <option value="">Select School</option>
          {schools.map((s: any) => (
            <option key={s.id} value={s.school_name}>
              {s.school_name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditClassModal;
