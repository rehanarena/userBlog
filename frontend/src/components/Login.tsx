import { FormEvent, useContext, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext, User } from "../userContext";

interface LoginResponse {
  success: boolean;
  userInfo: User;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const backendUrl =
  import.meta.env.VITE_NODE_ENV === 'PRODUCTION'
    ? import.meta.env.VITE_PRODUCTION_URL_BACKEND
    : import.meta.env.VITE_BACKEND_URL;

  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("Login must be used within UserContextProvider");
  }
  const { setUserInfo } = ctx;

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await axios.post<LoginResponse>(
        `${backendUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (data.success) {
        setUserInfo(data.userInfo);
        setRedirect(true);
      } else {
        toast.error("Wrong credentials");
      }
    }  catch (err: unknown) {
      let message = "An unexpected error occurred";
    
      if (axios.isAxiosError(err)) {
        message =
          (err.response?.data as { error?: string })?.error ??
          err.message ??
          message;
      } else if (err instanceof Error) {
        message = err.message;
      }
    
      toast.error(message);
    }
    
    
  };

  if (redirect) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={submitHandler}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-6 w-full py-2 rounded-2xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
