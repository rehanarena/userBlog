import axios from "axios";
import { useEffect, useState } from "react";
import Post from "./Post";
import { PostProps } from "../interface/post";

const backendUrl =
import.meta.env.VITE_NODE_ENV === "PRODUCTION"
  ? import.meta.env.VITE_PRODUCTION_URL_BACKEND
  : import.meta.env.VITE_BACKEND_URL;

const Home: React.FC = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<PostProps[]>(`${backendUrl}/api/user/post`);
        setPosts(response.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} {...post} />
      ))}
    </div>
  );
};

export default Home;
