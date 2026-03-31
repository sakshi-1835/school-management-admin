type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  sectionName: string;
  setSectionName: (val: string) => void;
  teachers: any[];
  selectedTeacherId: number | null;
  setSelectedTeacherId: (id: number) => void;
};

const EditSectionModal = ({
  visible,
  onClose,
  onSubmit,
  sectionName,
  setSectionName,
  teachers,
  selectedTeacherId,
  setSelectedTeacherId,
}: Props) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80">
        <h2 className="font-bold mb-3 text-lg">Edit Section</h2>

        <input
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
        />

        <select
          value={selectedTeacherId || ""}
          onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
          className="w-full border p-2 mb-3 rounded"
        >
          <option value="">Select Teacher</option>
          {teachers.map((t: any) => (
            <option key={t.id} value={t.id}>
              {t.name}
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

export default EditSectionModal;