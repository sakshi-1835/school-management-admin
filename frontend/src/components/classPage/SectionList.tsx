const SectionList = ({ sections, selectedSectionId, onSelect, onEdit }: any) => {
  return (
    <div className="flex flex-wrap gap-3">
      {sections.map((sec: any) => (
        <div
          key={sec.id}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition 
          ${
            selectedSectionId === sec.id
              ? "bg-blue-500 text-white"
              : "bg-blue-100 hover:bg-blue-200"
          }`}
        >
          <div onClick={() => onSelect(sec.id)}>
            Section {sec.section_name}
          </div>
          <button
            onClick={() => onEdit(sec.id)}
            className="ml-2 px-2 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded"
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
};

export default SectionList;