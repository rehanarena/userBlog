import './App.css'
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from './components/Navbar'
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CreatePost from './components/CreatePost';


function App() {

  return (
    <div>
      <ToastContainer />
    <Navbar />
     <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/login" element={<Login />} />
     <Route path="/register" element={<Register />} />
     <Route path="/create" element={<CreatePost />} />
     </Routes>
    </div>
  )
}

export default App
