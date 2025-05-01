import axios from 'axios';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const CreatePost: React.FC = () => {
  const [title, setTitle]     = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles]     = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const backendUrl            = import.meta.env.VITE_BACKEND_URL as string;

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

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!files?.[0]) {
      alert('Please select a cover image');
      return;
    }

    const data = new FormData();
    data.append('title', title);
    data.append('summary', summary);
    data.append('content', content);
    data.append('file', files[0]);

    try {
        const response = await axios.post(
          `${backendUrl}/api/user/createPost`,
          data,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        console.log('Post created:', response.data.postDoc);
      
        setTitle('');
        setSummary('');
        setContent('');
        setFiles(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        console.error('Error creating post:', err);
      }
      
    }
  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Create New Post</h2>
      <form onSubmit={submitHandler} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={e => setSummary(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          onChange={e => setFiles(e.target.files)}
          ref={fileInputRef}
          className="block w-full text-gray-700"
        />

        {/* Tiptap editor */}
        <div className="border border-gray-300 rounded">
          <EditorContent
            editor={editor}
            className="prose p-4 min-h-[200px] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
