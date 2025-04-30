import './App.css'
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from './components/Navbar'
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';

function App() {

  return (
    <div>
      <ToastContainer />
    <Navbar />
     <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/login" element={<Login />} />
     <Route path="/register" element={<Register />} />
     </Routes>
    </div>
  )
}

export default App
