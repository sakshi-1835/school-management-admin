const ClassCard = ({ cls, selectedClassId, onSelect, onEdit, onDelete, openMenuId, setOpenMenuId }: any) => {
  return (
    <div
      className={`relative p-5 rounded-xl shadow-md transition 
        ${
          selectedClassId === cls.id
            ? "bg-blue-500 text-white"
            : "bg-white hover:bg-blue-50"
        }`}
    >
      {/* Click area */}
      <div onClick={() => onSelect(cls.id)} className="cursor-pointer">
        <h2 className="text-lg font-semibold text-center">
          {cls.class_name}
        </h2>
      </div>

      {/* 3 DOT MENU */}
      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenuId(openMenuId === cls.id ? null : cls.id);
          }}
          className="text-lg"
        >
          ⋮
        </button>

        {/* DROPDOWN */}
        {openMenuId === cls.id && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 mt-2 w-28 bg-white border rounded shadow"
          >
            <button
              onClick={() => {
                onEdit(cls);
                setOpenMenuId(null);
              }}
              className="block w-full px-3 py-2 text-left text-black hover:bg-gray-100"
            >
              Edit
            </button>

            <button
              onClick={() => {
                onDelete(cls.id);
                setOpenMenuId(null);
              }}
              className="block w-full px-3 py-2 text-left text-red-500 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassCard;