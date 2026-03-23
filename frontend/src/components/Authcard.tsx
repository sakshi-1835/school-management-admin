

const Authcard = ({ title, children }: any) => {
  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">{title}</h2>
        {children}
      </div>
    </div>
  )
}

export default Authcard
