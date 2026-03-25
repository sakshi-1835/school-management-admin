import { useEffect, useState } from "react";
import http from "../api/http";
import endPoints from "../api/endpoints";

interface ClassType {
  id: number;
  class_name: string;
}

interface SectionType {
  id: number;
  section_name: string;
}

interface Props {
  selectedClass: number | null;
  selectedSection: number | null;
  onClassChange: (value: number | null) => void;
  onSectionChange: (value: number | null) => void;
}

const FilterBar = ({
  selectedClass,
  selectedSection,
  onClassChange,
  onSectionChange,
}: Props) => {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [sections, setSections] = useState<SectionType[]>([]);

  // Get all classes
  const getClasses = async () => {
    try {
      const res: any = await http.get(endPoints.classes.getAll);
      setClasses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Get sections for selected class
  const getSections = async (classId: number | null) => {
    if (!classId) {
      setSections([]);
      return;
    }

    try {
      const res = await http.get(endPoints.sections.getAll, {
        params: { class_id: classId },
      });
      setSections(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  useEffect(() => {
    getSections(selectedClass);
  }, [selectedClass]);

  return (
    <div className="flex gap-4 mb-4">
      <select
        value={selectedClass?.toString() || ""}
        onChange={(e) => {
          onClassChange(Number(e.target.value) || null);
          onSectionChange(Number(e.target.value) || null);
        }}
        className="border p-2 rounded"
      >
        <option value="">Select Class</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id.toString()}>
            {c.class_name}
          </option>
        ))}
      </select>

      <select
        value={selectedSection?.toString() || ""}
        onChange={(e) => {
          onSectionChange(Number(e.target.value) || null);
        }}
        disabled={!selectedClass}
        className="border p-2 rounded"
      >
        <option value="">Select Section</option>
        {sections.map((s) => (
          <option key={s.id} value={s.id.toString()}>
            {s.section_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
