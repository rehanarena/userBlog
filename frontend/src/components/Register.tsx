import axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {

  const [name,setUsername] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate();

  const backendUrl =
  import.meta.env.VITE_NODE_ENV === 'PRODUCTION'
    ? import.meta.env.VITE_PRODUCTION_URL_BACKEND
    : import.meta.env.VITE_BACKEND_URL;


  const onSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/register`,
        { name,email, password }
      );
      if(data.success){
        toast.success('Registered Succesfully')
        navigate("/login")
        
      }else{
        toast.error(data.message)
      }
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      const errorMessage =
        error.response?.data?.error || "Registration failed. Try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm" onSubmit={onSubmitHandler}>
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={name}
             onChange={e=>setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
             onChange={e=>setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <button
          type="submit"
          className="mt-6 w-full py-2 rounded-2xl bg-green-500 text-white font-medium hover:bg-green-600 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
