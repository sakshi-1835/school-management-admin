import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import http from "../api/http";
import endPoints from "../api/endpoints";

interface Props {
  student: any | null;
  onClose: () => void;
  onSubmit: (data: any, id?: number) => void;
}

const StudentFormModal: React.FC<Props> = ({ student, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [classes, setClasses] = useState<any[]>([]);

  const getClasses = async () => {
    try {
      const res = await http.get(endPoints.classes.getAll);
      setClasses(res.data);
    } catch (err) {
      console.error("Error fetching classes", err);
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  useEffect(() => {
    if (student) {
      reset({
        name: student.name,
        age: student.age,
        class_id: student.class_id,
      });
    } else {
      reset({
        name: "",
        age: "",
        class_id: "",
      });
    }
  }, [student, reset]);

  const submitHandler = (data: any) => {
    onSubmit(data, student?.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-80">
        <h3 className="font-bold mb-3">
          {student ? "Edit Student" : "Add Student"}
        </h3>

        <form onSubmit={handleSubmit(submitHandler)}>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full border p-2 mb-1 rounded"
            placeholder="Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mb-2">
              {errors.name.message as string}
            </p>
          )}

          <input
            type="number"
            {...register("age", {
              required: "Age is required",
              min: { value: 3, message: "Min age is 3" },
            })}
            className="w-full border p-2 mb-1 rounded"
            placeholder="Age"
          />
          {errors.age && (
            <p className="text-red-500 text-sm mb-2">
              {errors.age.message as string}
            </p>
          )}

          <select
            {...register("class_id")}
            className="w-full border p-2 mb-1 rounded"
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.class_name}
              </option>
            ))}
          </select>
          {errors.class_id && (
            <p className="text-red-500 text-sm mb-2">
              {errors.class_id.message as string}
            </p>
          )}

          <div className="flex justify-end space-x-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              {student ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;
