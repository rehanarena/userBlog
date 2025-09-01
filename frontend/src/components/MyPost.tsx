import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import type { AxiosResponse, AxiosError } from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Post {
  _id: string;
  title: string;
  summary: string;
  content: string;
  cover?: string;
  published?: boolean;
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
  const backendUrl =
    import.meta.env.VITE_NODE_ENV === "PRODUCTION"
      ? import.meta.env.VITE_PRODUCTION_URL_BACKEND
      : import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios
      .get<Post[]>(`${backendUrl}/api/user/myposts`, { withCredentials: true })
      .then(({ data }: AxiosResponse<Post[]>) => setPosts(data))
      .catch((err: AxiosError | unknown) => {
        console.error("Fetch posts error", err);
      });
  }, []);

  const handlePublish = (id: string) => {
    toast.info(
      <div>
        <p>Do you want to publish this post?</p>
        <div className="flex justify-center gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                const res = await axios.put(
                  `${backendUrl}/api/user/post/publish/${id}`,
                  {},
                  { withCredentials: true }
                );
                setPosts((prev) =>
                  prev.map((p) => (p._id === id ? res.data : p))
                );
                toast.dismiss();
                toast.success("Post published!");
              } catch (err) {
                console.error("Publish error", err);
                toast.dismiss();
                toast.error("Failed to publish post");
              }
            }}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const handleDeleteWithToast = (id: string) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this post?</p>
        <div className="flex justify-center gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await axios.delete(`${backendUrl}/api/user/post/${id}`, {
                  withCredentials: true,
                });
                setPosts((prev) => prev.filter((p) => p._id !== id));
                toast.dismiss();
                toast.success("Post deleted!");
              } catch (err) {
                console.error("Delete error", err);
                toast.error("Failed to delete post");
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
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
      const res = await axios.put<Post>(
        `${backendUrl}/api/user/post/${editPost._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPosts((prev) =>
        prev.map((p) => (p._id === res.data._id ? res.data : p))
      );
      setEditPost(null);
      setFile(null);
    } catch (err: unknown) {
      console.error("Update error", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            My Posts
          </h1>
          <p className="text-slate-600 text-lg">
            Manage and organize your published content
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No posts yet
            </h3>
            <p className="text-slate-500">
              Create your first post to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200"
              >
                {/* Cover Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
                  {post.cover ? (
                    <img
                      src={`${backendUrl}/${post.cover.replace(/\\/g, "/")}`}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-white/70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        post.published
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-orange-100 text-orange-800 border border-orange-200"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          post.published ? "bg-green-500" : "bg-orange-500"
                        }`}
                      ></div>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.summary}
                  </p>

                  {/* Meta Info */}
                  {post.createdAt && (
                    <div className="flex items-center text-xs text-slate-500 mb-6">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {!post.published && (
                      <button
                        onClick={() => openEditModal(post)}
                        className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteWithToast(post._id)}
                      className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>

                    {!post.published && (
                      <button
                        onClick={() => handlePublish(post._id)}
                        className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        Publish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editPost && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 px-8 py-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-800">
                    Edit Post
                  </h3>
                  <button
                    onClick={() => setEditPost(null)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <svg
                      className="w-6 h-6 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleUpdate} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Post Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800"
                    placeholder="Enter your post title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Summary
                  </label>
                  <input
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800"
                    placeholder="Brief summary of your post..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 resize-none"
                    placeholder="Write your post content here..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Cover Image
                    <span className="text-slate-500 font-normal ml-1">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setEditPost(null)}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Update Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
