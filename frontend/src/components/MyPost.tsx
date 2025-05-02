import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface Post {
  _id: string;
  title: string;
  summary: string;
  content: string;
  cover?: string;
  createdAt?: string;
  updatedAt?: string;
}

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editPost, setEditPost] = useState<Post | null>(null);

  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const backendurl = import.meta.env.VITE_BACKEND_URL as string;

  useEffect(() => {
    axios
      .get<Post[]>(`${backendurl}/api/user/myposts`, {
        withCredentials: true,
      })
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Fetch posts error", err));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${backendurl}/api/user/post/${id}`, {
        withCredentials: true,
      });
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const openEditModal = (post: Post) => {
    setEditPost(post);
    setTitle(post.title);
    setSummary(post.summary);
    setContent(post.content);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editPost) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("content", content);
    if (file) formData.append("file", file);

    try {
      const res = await axios.put<Post>(`${backendurl}/api/user/post/${editPost._id}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPosts((prev) =>
        prev.map((p) => (p._id === res.data._id ? res.data : p))
      );
      setEditPost(null);
      setFile(null);
    } catch (err) {
      console.error("Update error", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">My Posts</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold">{post.title}</h3>
            <p className="text-gray-600">{post.summary}</p>
            <div className="mt-3 space-x-2">
              <button
                onClick={() => openEditModal(post)}
                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post._id)}
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Edit Post</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Summary</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Cover Image (optional)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditPost(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
