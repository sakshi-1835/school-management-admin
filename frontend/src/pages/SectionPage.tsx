import Sidebar from "../components/Sidebar";

const SectionPage = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <h1 className="text-xl font-bold mb-4">Sections</h1>
        <div className="bg-white p-3 rounded shadow">Section A</div>
        <div className="bg-white p-3 rounded shadow mt-2">Section B</div>
      </div>
    </div>
  );
};

export default SectionPage;
