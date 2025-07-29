import axios, { AxiosResponse, AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostInfo } from "../interface/post";

const backendUrl =
  import.meta.env.VITE_NODE_ENV === "PRODUCTION"
    ? import.meta.env.VITE_PRODUCTION_URL_BACKEND
    : import.meta.env.VITE_BACKEND_URL;

const PostPage = () => {
  const [postInfo, setPostInfo] = useState<PostInfo | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios
        .get<PostInfo>(`${backendUrl}/api/user/post/${id}`)
        .then(({ data }: AxiosResponse<PostInfo>) => {
          let content = data.content;
          content = content
            .replace(
              /<h1>/g,
              '<h1 class="text-4xl font-bold text-slate-800 my-8 leading-tight border-l-4 border-blue-500 pl-6">'
            )
            .replace(
              /<h2>/g,
              '<h2 class="text-3xl font-semibold text-slate-700 my-6 leading-tight">'
            )
            .replace(/<p>/g, '<p class="text-lg text-slate-700 mb-6 leading-relaxed">')
            .replace(
              /<img\s+src="\/uploads\//g,
              `<img class="rounded-xl shadow-lg my-8 w-full object-cover" src="${backendUrl}/uploads/`
            );

          setPostInfo({ ...data, content });
        })
        .catch((error: AxiosError | unknown) => {
          console.error("Error fetching post:", error);
        });
    }
  }, [id]);

  if (!postInfo)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading your post...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section with Cover Image */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
        <img
          src={`${backendUrl}/${postInfo.cover.replace(/\\/g, "/")}`}
          alt="Post Cover"
          className="w-full h-full object-cover object-center"
        />
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              {postInfo.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {postInfo.author?.name?.charAt(0) || "?"}
                  </span>
                </div>
                <span className="font-medium">
                  {postInfo.author?.name || "Unknown Author"}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <time className="font-medium">
                  {new Date(postInfo.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Reading time estimate */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2 text-slate-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">
                  {Math.max(1, Math.ceil(postInfo.content.replace(/<[^>]*>/g, '').split(' ').length / 200))} min read
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Published</span>
              </div>
            </div>

            {/* Content */}
            <div
              className="prose prose-lg prose-slate max-w-none 
                         prose-headings:text-slate-800 
                         prose-p:text-slate-700 prose-p:leading-relaxed
                         prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                         prose-strong:text-slate-800 prose-strong:font-semibold
                         prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
                         prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
                         post-content"
              dangerouslySetInnerHTML={{ __html: postInfo.content }}
            />
          </div>
        </article>

        {/* Bottom spacing */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-slate-400">
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;