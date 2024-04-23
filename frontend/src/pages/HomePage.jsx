import { Link } from "react-router-dom";


export default function HomePage() {

  return (
    <div className="bg-gray-900 h-screen flex flex-col justify-center items-center text-white font-sans">
      <h1 className="text-5xl font-bold mb-4">Welcome to ChessLab</h1>
      <p className="text-lg mb-6 text-center max-w-lg">
        Enhance your chess skills and challenge opponents worldwide with ChessLab.
      </p>
      <div className="mb-8">
       
        <ul className="list-disc pl-6">
          <li>Play chess games in real-time</li>
          <li>Improve your strategies</li>
          <li>Learn chess tactics</li>
          <li>Challenge opponents of various skill levels</li>
        </ul>
      </div>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md transition duration-300"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md transition duration-300"
        >
          Register
        </Link>
      </div>
      <div className="text-sm mt-6">
        <p className="mb-1">Not sure where to start?</p>
        <p>
          Check out our{" "}
          <Link to="/guide" className="text-blue-400 underline hover:text-blue-300">
            beginner&lsquo;s guide
          </Link>{" "}
          to get started.
        </p>
      </div>
    </div>
  )
}
