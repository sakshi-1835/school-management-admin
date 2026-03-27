const ClassModal = ({ visible, onClose, onSubmit, className, setClassName, schoolName, setSchoolName, schools, title }: any) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-80">
        <h2>{title}</h2>

        <input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Class Name" />

        <select value={schoolName} onChange={(e) => setSchoolName(e.target.value)}>
          <option value="">Select School</option>
          {schools.map((s: any) => (
            <option key={s.id} value={s.school_name}>{s.school_name}</option>
          ))}
        </select>

        <button onClick={onSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ClassModal;