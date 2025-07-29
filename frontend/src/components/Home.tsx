import axios from "axios";
import { useEffect, useState } from "react";
import Post from "./Post";
import { PostProps } from "../interface/post";

const backendUrl =
  import.meta.env.VITE_NODE_ENV === 'PRODUCTION'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to Our
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Discover amazing stories, insights, and perspectives from our community of writers
          </p>
        </div>
      </div>

      {/* Posts Container */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-700 mb-4">No Posts Available</h2>
            <p className="text-slate-500 text-lg">
              Check back soon for fresh content and amazing stories!
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Latest Posts</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="space-y-8">
              {posts.map((post) => (
                <div key={post._id} className="transform transition-all duration-300 hover:scale-[1.01]">
                  <Post {...post} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom Section */}
      <div className="bg-slate-100 py-12 mt-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="flex justify-center items-center space-x-6 text-slate-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Fresh Content</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium">Quality Stories</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-sm font-medium">Regular Updates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;