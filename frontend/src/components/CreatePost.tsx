import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Navigate } from "react-router-dom";

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
      setFileName(e.target.files[0].name);
    } else {
      setFiles(null);
      setFileName("");
    }
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!files?.[0]) {
      alert("Please select a cover image");
      return;
    }

    setIsSubmitting(true);
    
    const data = new FormData();
    data.append("title", title);
    data.append("summary", summary);
    data.append("content", content);
    data.append("file", files[0]);

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/creatPost`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Response from server:", response);

      if (response.data.success) {
        setRedirect(true);
      }
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-3xl mx-auto my-8 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-6 px-8">
        <h2 className="text-2xl font-bold text-white">Create New Post</h2>
        <p className="text-purple-100 mt-1">Share your thoughts with the world</p>
      </div>
      
      <form onSubmit={submitHandler} className="p-8 space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter a captivating title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
            Summary
          </label>
          <input
            id="summary"
            type="text"
            placeholder="Brief summary of your post"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="cover" className="block text-sm font-medium text-gray-700">
            Cover Image
          </label>
          <div className="relative">
            <input
              id="cover"
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              required
            />
            <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg text-gray-500 cursor-pointer hover:bg-gray-50 transition">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{fileName || "Choose a cover image"}</span>
              </div>
              <span className="text-indigo-600 font-medium">Browse</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-300 flex items-center space-x-2">
              {editor && (
                <>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-indigo-600' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h10M6 6h10M6 18h10" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-indigo-600' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 4.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-1.293l-2.5 7H11.5a.5.5 0 010 1h-3a.5.5 0 010-1h1.293l2.5-7H10.5a.5.5 0 01-.5-.5z" clipRule="evenodd" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            <EditorContent
              editor={editor}
              className="prose max-w-none p-4 min-h-[250px] focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;