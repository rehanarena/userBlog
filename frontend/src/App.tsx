import './App.css'
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from './components/Navbar'
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CreatePost from './components/CreatePost';
import PostPage from './components/PostPage';
import MyPost from './components/MyPost';


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
     <Route path="/mypost" element={<MyPost />} />
     <Route path="/post/:id" element={<PostPage />} />

     </Routes>
    </div>
  )
}

export default App
