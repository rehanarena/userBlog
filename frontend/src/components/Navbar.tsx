import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext, User} from "../userContext"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const backendurl = import.meta.env.VITE_BACKEND_URL as string;
  const {setUserInfo, userInfo} = useContext(UserContext)

  useEffect(() => {
    axios
      // tell TS what shape to expect
      .get<User>(`${backendurl}/api/auth/profile`, { withCredentials: true })
      // destructure data right away (no unused `response`)
      .then(({ data }) => {
        setUserInfo(data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, [backendurl, setUserInfo]);
  
  

  const logout = async ()=>{
    axios.post(`${backendurl}/api/auth/logout`,
      { withCredentials: true },
    )
    setUserInfo(null)
  }

  const email = userInfo?.email;

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <a
          href="/"
          className="text-2xl font-semibold text-gray-800 hover:text-indigo-600"
        >
          MyBlog
        </a>

        {/* Mobile menu button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <svg
            className="h-6 w-6 text-gray-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Navigation links */}
        <nav
          className={`md:flex md:items-center md:static absolute left-0 w-full md:w-auto bg-white md:bg-transparent transition-all duration-300 ease-in-out z-10 ${
            isOpen ? "top-16 opacity-100" : "top-[-400px] opacity-0"
          } md:top-auto md:opacity-100`}
        >
          {email && (
            <>
            <Link to='/create'>Create new post</Link>
            <br />
            <a onClick={logout}>Logout</a>
            </>
          )}
          {!email && (
            <>
            <Link
            to="/login"
            className="block px-4 py-2 mt-2 text-gray-700 rounded-md hover:bg-indigo-100 hover:text-indigo-700 md:mt-0"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block px-4 py-2 mt-2 text-gray-700 rounded-md hover:bg-indigo-100 hover:text-indigo-700 md:mt-0"
          >
            Register
          </Link>
            </>
          )}
          
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
