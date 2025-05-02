import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext, User } from "../userContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const backendurl = import.meta.env.VITE_BACKEND_URL as string;
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    axios
      .get<User>(`${backendurl}/api/auth/profile`, { withCredentials: true })
      .then(({ data }) => {
        setUserInfo(data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, [backendurl, setUserInfo]);

  const logout = async () => {
    await axios.post(
      `${backendurl}/api/auth/logout`,
      {},                  
      { withCredentials: true }
    );
    setUserInfo(null);
  };
  

  const email = userInfo?.email;

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight hover:text-indigo-200 transition duration-300"
          >
            MyBlog
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            <svg
              className="h-6 w-6 text-white"
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-4">
            {email ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/create"
                  className="px-4 py-2 rounded-md bg-white text-indigo-600 font-medium hover:bg-indigo-100 transition duration-300"
                >
                  Create Post
                </Link>
                <Link
                  to="/mypost"
                  className="px-3 py-2 rounded-md hover:bg-indigo-500 transition duration-300"
                >
                  My Posts
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-md hover:bg-indigo-500 transition duration-300 flex items-center"
                >
                  <span>Logout</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md hover:bg-indigo-500 transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md bg-white text-indigo-600 font-medium hover:bg-indigo-100 transition duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-60 mt-3 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-2 pb-3 space-y-1 border-t border-indigo-400">
            {email ? (
              <>
                <Link
                  to="/create"
                  className="block px-4 py-2 rounded-md bg-indigo-500 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Create Post
                </Link>
                <Link
                  to="/mypost"
                  className="block px-4 py-2 rounded-md hover:bg-indigo-500"
                  onClick={() => setIsOpen(false)}
                >
                  My Posts
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-md hover:bg-indigo-500 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 rounded-md hover:bg-indigo-500"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 rounded-md bg-indigo-500 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;