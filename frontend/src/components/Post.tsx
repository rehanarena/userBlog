import { format } from "date-fns";
import { PostProps } from "../interface/post";
import { Link } from "react-router-dom";

const backendUrl =
  import.meta.env.VITE_NODE_ENV === 'PRODUCTION'
    ? import.meta.env.VITE_PRODUCTION_URL_BACKEND
    : import.meta.env.VITE_BACKEND_URL;

const Post: React.FC<PostProps> = ({
  _id,
  title,
  summary,
  cover,
  author,
  createdAt,
}) => {
  const normalizedCover = cover?.replace(/\\/g, "/");

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden mb-8 max-w-3xl mx-auto border border-gray-100">
      <div className="relative">
        <Link to={`/post/${_id}`}>
          <img
            src={`${backendUrl}/${normalizedCover}`}
            alt="Post Cover"
            className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
            <span className="text-white font-medium m-4 px-3 py-1 bg-indigo-600 rounded-full text-sm">Read More</span>
          </div>
        </Link>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div>
            <p className="font-medium text-gray-800">
              {author?.name || "Unknown Author"}
            </p>
            <time className="text-xs text-gray-500">
              {format(new Date(createdAt), "MMM d, yyyy · h:mm a")}
            </time>
          </div>
        </div>
        
        <Link to={`/post/${_id}`} className="block group">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors duration-200">{title}</h2>
          <p className="text-gray-600 text-base leading-relaxed line-clamp-3">{summary}</p>
        </Link>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link 
            to={`/post/${_id}`} 
            className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-200"
          >
            Continue Reading
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Post;