import axios, { AxiosResponse, AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostInfo } from "../interface/post";

const backendurl = import.meta.env.VITE_BACKEND_URL as string;

const PostPage = () => {
  const [postInfo, setPostInfo] = useState<PostInfo | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios
        .get<PostInfo>(`${backendurl}/api/user/post/${id}`)
        .then(({ data }: AxiosResponse<PostInfo>) => {
          setPostInfo(data);
        })
        .catch((error: AxiosError | unknown) => {
          console.error("Error fetching post:", error);
        });
    }
  }, [id]);

  if (!postInfo)
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 bg-white rounded-lg shadow-md mt-8 post-page">
      {/* Cover Image */}
      <div className="w-full max-h-80 overflow-hidden mb-6 rounded-md">
        <img
          src={`${backendurl}/${postInfo.cover.replace(/\\/g, "/")}`}
          alt="Post Cover"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
        {postInfo.title}
      </h1>

      {/* Time and Author */}
      <time className="block text-center text-sm text-gray-500">
        {new Date(postInfo.createdAt).toLocaleString()}
      </time>
      <div className="text-center font-semibold text-gray-700 mb-6">
        {postInfo.author?.name || "Unknown"}
      </div>

      {/* Post Content */}
      <div
        className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      ></div>
    </div>
  );
};

export default PostPage;
