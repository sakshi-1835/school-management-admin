import { useEffect, useRef, useState } from "react";
import http from "../api/http";
import endPoints from "../api/endpoints";
import type { Student } from "../@types/type";

interface StudentOption {
  value: number;
  label: string;
  data: Student;
}

interface Props {
  onSelect: (student: Student) => void;
  onClear: () => void;
}

const SearchBar = ({ onSelect, onClear }: Props) => {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<StudentOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchStudents = async (value: string) => {
    if (!value.trim()) return;
    try {
      setLoading(true);

      const res: any = await http.get(
        `${endPoints.students.search}?q=${value}`,
      );

      const list: Student[] = res.data || [];

      const newOptions: StudentOption[] = list.map((s) => ({
        value: s.id,
        label: s.name,
        data: s,
      }));

      setOptions(newOptions);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setShowDropdown(true);

    if (!value) {
      setOptions([]);
      onClear();
      return;
    }

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      fetchStudents(value);
    }, 500);

    setDebounceTimeout(timeout);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      fetchStudents(search); 
    }
  };

  return (
    <div ref={wrapperRef} className="relative mb-4">
      <input
        type="text"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full border px-3 py-2 rounded"
        placeholder="Search student..."
      />

      {showDropdown && (
        <div className="absolute w-full bg-white border mt-1 rounded shadow z-10 max-h-60 overflow-y-auto">
          {loading ? (
            <p className="p-2 text-gray-500">Loading...</p>
          ) : options.length > 0 ? (
            options.map((opt) => (
              <div
                key={opt.value}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  onSelect(opt.data);
                  setSearch(opt.label);
                  setOptions([]);
                  setShowDropdown(false);
                }}
              >
                {opt.label}
              </div>
            ))
          ) : (
            <p className="p-2 text-gray-500">No results</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
