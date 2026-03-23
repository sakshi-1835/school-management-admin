import { Link } from "react-router-dom"

const Sidebar = () => {
  return (
    <div className="w-48 bg-white shadow-md p-4 space-y-3 ">
      <Link to="/dashboard" className="block p-2 bg-gray-200 rounded">Dashboard</Link>
      <Link to="/classes" className="block p-2 bg-gray-200 rounded">Classes</Link>
    </div>
  )
}

export default Sidebar
